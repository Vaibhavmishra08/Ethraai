import { useEffect, useState } from 'react';
import { LayoutDashboard, FolderKanban, CheckCircle2, ChevronRight, LogOut } from 'lucide-react';
import { SetupProfile } from './components/SetupProfile.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { ProjectsList } from './components/ProjectsList.jsx';
import { ProjectDetails } from './components/ProjectDetails.jsx';
import { NavItem } from './components/NavItem.jsx';
import { Badge } from './components/Badge.jsx';

const STORAGE_KEY = 'task-manager-local-db';
const SESSION_KEY = 'task-manager-current-user';

const defaultDatabase = {
  users: [
    {
      id: 'admin',
      name: 'Admin User',
      email: 'admin@task.local',
      password: 'admin123',
      role: 'Admin',
      createdAt: Date.now(),
    },
    {
      id: 'member',
      name: 'Team Member',
      email: 'member@task.local',
      password: 'member123',
      role: 'Member',
      createdAt: Date.now(),
    },
  ],
  projects: [],
  tasks: [],
};

const loadDatabase = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDatabase));
      return defaultDatabase;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid data stored');
    }

    return parsed;
  } catch (err) {
    console.error('Failed to load local database:', err);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDatabase));
    return defaultDatabase;
  }
};

const saveDatabase = (database) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  } catch (err) {
    console.error('Failed to save local database:', err);
  }
};

const getSessionId = () => localStorage.getItem(SESSION_KEY);
const saveSessionId = (id) => localStorage.setItem(SESSION_KEY, id);
const clearSession = () => localStorage.removeItem(SESSION_KEY);

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

export default function App() {
  const [database, setDatabase] = useState(loadDatabase);
  const [currentUser, setCurrentUser] = useState(() => {
    const sessionId = getSessionId();
    if (!sessionId) return null;

    const stored = loadDatabase();
    return stored.users.find((user) => user.id === sessionId) || null;
  });
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeProjectId, setActiveProjectId] = useState(null);

  useEffect(() => {
    saveDatabase(database);
  }, [database]);

  const handleLogin = ({ email, password }) => {
    const user = database.users.find((userItem) => userItem.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('No account found with that email.');
    }
    if (user.password !== password) {
      throw new Error('Email or password is incorrect.');
    }

    saveSessionId(user.id);
    setCurrentUser(user);
    setCurrentView('dashboard');
    setActiveProjectId(null);
  };

  const handleRegister = ({ name, email, password }) => {
    const normalizedEmail = email.toLowerCase();
    if (database.users.some((userItem) => userItem.email.toLowerCase() === normalizedEmail)) {
      throw new Error('That email is already registered.');
    }

    const newUser = {
      id: generateId(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'Member',
      createdAt: Date.now(),
    };

    setDatabase((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
    }));

    saveSessionId(newUser.id);
    setCurrentUser(newUser);
    setCurrentView('dashboard');
    setActiveProjectId(null);
  };

  const handleResetPassword = ({ email, password }) => {
    const normalizedEmail = email.toLowerCase();
    if (!database.users.some((userItem) => userItem.email.toLowerCase() === normalizedEmail)) {
      throw new Error('No account found with that email.');
    }

    setDatabase((prev) => ({
      ...prev,
      users: prev.users.map((userItem) =>
        userItem.email.toLowerCase() === normalizedEmail ? { ...userItem, password } : userItem
      ),
    }));
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
  };

  const handleCreateProject = ({ name, description }) => {
    const newProject = {
      id: generateId(),
      name: name.trim(),
      description: description.trim(),
      createdBy: currentUser?.id ?? 'unknown',
      createdAt: Date.now(),
    };

    setDatabase((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const handleCreateTask = ({ projectId, title, description, assignedTo, dueDate }) => {
    const newTask = {
      id: generateId(),
      projectId,
      title: title.trim(),
      description: description.trim(),
      assignedTo,
      status: 'To Do',
      dueDate,
      createdBy: currentUser?.id ?? 'unknown',
      createdAt: Date.now(),
    };

    setDatabase((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  };

  const handleUpdateTaskStatus = (taskId, status) => {
    setDatabase((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
    }));
  };

  const users = database.users;
  const projects = database.projects;
  const tasks = database.tasks;

  if (!currentUser) {
    return <SetupProfile onLogin={handleLogin} onRegister={handleRegister} onResetPassword={handleResetPassword} />;
  }

  const activeProject = projects.find((project) => project.id === activeProjectId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans">
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">TaskSync</h1>
            <p className="text-xs text-slate-200/70">Local task manager</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            icon={<LayoutDashboard />}
            label="Dashboard"
            active={currentView === 'dashboard'}
            onClick={() => {
              setCurrentView('dashboard');
              setActiveProjectId(null);
            }}
          />
          <NavItem
            icon={<FolderKanban />}
            label="Projects"
            active={currentView === 'projects' || currentView === 'project-details'}
            onClick={() => {
              setCurrentView('projects');
              setActiveProjectId(null);
            }}
          />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 sticky top-0 z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {currentView === 'dashboard' && 'My Dashboard'}
                {currentView === 'projects' && 'All Projects'}
                {currentView === 'project-details' && activeProject && activeProject.name}
              </h2>
            </div>
            <Badge color={currentUser.role === 'Admin' ? 'purple' : 'blue'}>
              {currentUser.role} Access
            </Badge>
          </div>
          {currentView === 'project-details' && activeProject && (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <button
                onClick={() => {
                  setCurrentView('projects');
                  setActiveProjectId(null);
                }}
                className="hover:text-blue-600 transition-colors"
              >
                Projects
              </button>
              <ChevronRight size={18} />
              <span>{activeProject.name}</span>
            </div>
          )}
        </header>

        <div className="p-8">
          {currentView === 'dashboard' && (
            <Dashboard
              tasks={tasks}
              projects={projects}
              userProfile={currentUser}
              onProjectClick={(id) => {
                setActiveProjectId(id);
                setCurrentView('project-details');
              }}
            />
          )}
          {currentView === 'projects' && (
            <ProjectsList
              projects={projects}
              tasks={tasks}
              userProfile={currentUser}
              onProjectClick={(id) => {
                setActiveProjectId(id);
                setCurrentView('project-details');
              }}
              onCreateProject={handleCreateProject}
            />
          )}
          {currentView === 'project-details' && activeProject && (
            <ProjectDetails
              project={activeProject}
              tasks={tasks.filter((task) => task.projectId === activeProject.id)}
              users={users}
              userProfile={currentUser}
              onCreateTask={handleCreateTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          )}
        </div>
      </main>
    </div>
  );
}
