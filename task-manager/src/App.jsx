import { useEffect, useState } from 'react';
import { LayoutDashboard, FolderKanban, CheckCircle2, ChevronRight, LogOut } from 'lucide-react';
import { SetupProfile } from './components/SetupProfile.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { ProjectsList } from './components/ProjectsList.jsx';
import { ProjectDetails } from './components/ProjectDetails.jsx';
import { NavItem } from './components/NavItem.jsx';
import { Badge } from './components/Badge.jsx';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeProjectId, setActiveProjectId] = useState(null);

  const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  };

  const loadData = async () => {
    try {
      const [projectsData, tasksData] = await Promise.all([
        apiRequest('/projects'),
        // Tasks will be loaded per project
      ]);
      setProjects(projectsData);
      setTasks([]); // Reset tasks, load when needed
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const loadTasksForProject = async (projectId) => {
    try {
      const tasksData = await apiRequest(`/projects/${projectId}/tasks`);
      setTasks(tasksData);
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token and set user
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
        loadData();
      } catch (err) {
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    localStorage.setItem('authToken', response.token);
    setUser(response.user);
    await loadData();
  };

  const handleRegister = async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    localStorage.setItem('authToken', response.token);
    setUser(response.user);
    await loadData();
  };

  const handleResetPassword = async (resetData) => {
    await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setProjects([]);
    setTasks([]);
    setCurrentView('dashboard');
    setActiveProjectId(null);
  };

  const handleCreateProject = async (projectData) => {
    const newProject = await apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
    setProjects(prev => [newProject, ...prev]);
  };

  const handleCreateTask = async (taskData) => {
    const newTask = await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    setTasks(prev => [newTask, ...prev]);
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    const updatedTask = await apiRequest(`/tasks/${taskId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
  };

  const handleProjectClick = (id) => {
    setActiveProjectId(id);
    setCurrentView('project-details');
    loadTasksForProject(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <SetupProfile
        onLogin={handleLogin}
        onRegister={handleRegister}
        onResetPassword={handleResetPassword}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans">
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <CheckCircle2 size={24} />
          </div>
          <h1 className="text-xl font-bold">TaskSync</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            icon={<LayoutDashboard />}
            label="Dashboard"
            active={currentView === 'dashboard'}
            onClick={() => { setCurrentView('dashboard'); setActiveProjectId(null); }}
          />
          <NavItem
            icon={<FolderKanban />}
            label="Projects"
            active={currentView === 'projects' || currentView === 'project-details'}
            onClick={() => { setCurrentView('projects'); setActiveProjectId(null); }}
          />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {currentView === 'dashboard' && 'My Dashboard'}
            {currentView === 'projects' && 'All Projects'}
            {currentView === 'project-details' && (
              <>
                <button
                  onClick={() => setCurrentView('projects')}
                  className="text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Projects
                </button>
                <ChevronRight size={20} className="text-slate-400" />
                {projects.find((p) => p.id === activeProjectId)?.name}
              </>
            )}
          </h2>
          <Badge color={user.role === 'Admin' ? 'purple' : 'blue'}>
            {user.role} Access
          </Badge>
        </header>

        <div className="p-8">
          {currentView === 'dashboard' && (
            <Dashboard
              tasks={tasks}
              projects={projects}
              userProfile={user}
              onProjectClick={handleProjectClick}
            />
          )}
          {currentView === 'projects' && (
            <ProjectsList
              projects={projects}
              tasks={tasks}
              userProfile={user}
              onProjectClick={handleProjectClick}
              onCreateProject={handleCreateProject}
            />
          )}
          {currentView === 'project-details' && activeProjectId && (
            <ProjectDetails
              project={projects.find((p) => p.id === activeProjectId)}
              tasks={tasks.filter((t) => t.project_id === activeProjectId)}
              users={users}
              userProfile={user}
              onCreateTask={handleCreateTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          )}
        </div>
      </main>
    </div>
  );
}