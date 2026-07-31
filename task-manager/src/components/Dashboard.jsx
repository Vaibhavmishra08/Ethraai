import { FolderKanban, Clock, CheckCircle2, AlertCircle, UserCircle2, Calendar, ChevronRight } from 'lucide-react';
import { StatCard } from './StatCard.jsx';
import { StatusBadge } from './StatusBadge.jsx';

export function Dashboard({ tasks, projects, userProfile, onProjectClick }) {
  const isAdmin = userProfile?.role === 'Admin';
  const myTasks = isAdmin ? tasks : tasks.filter((t) => t.assignedTo === userProfile.id);
  const pendingTasks = myTasks.filter((t) => t.status !== 'Done');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueTasks = myTasks.filter((t) => {
    if (t.status === 'Done' || !t.dueDate) return false;
    const due = new Date(t.dueDate);
    return due < today;
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Clock className="text-blue-600" />}
          label="Pending Tasks"
          value={pendingTasks.length}
          subtext={`${myTasks.length} total assigned`}
          color="blue"
        />
        <StatCard
          icon={<CheckCircle2 className="text-emerald-600" />}
          label="Completed Tasks"
          value={myTasks.filter((t) => t.status === 'Done').length}
          color="emerald"
        />
        <StatCard
          icon={<AlertCircle className="text-red-600" />}
          label="Overdue Tasks"
          value={overdueTasks.length}
          subtext="Requires immediate attention"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className={`glass-card rounded-2xl p-6 animate-fade-in transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isAdmin ? 'hover:shadow-purple-500/10' : 'hover:shadow-blue-500/10'}`}>
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <UserCircle2 size={20} className={`${isAdmin ? 'text-purple-500' : 'text-blue-500'} drop-shadow-md`} />
            {isAdmin ? 'System-Wide Tasks' : 'My Recent Tasks'}
          </h3>
          {myTasks.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <p>No tasks assigned to you yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl glass border border-slate-200/50 dark:border-slate-800/50 transition-colors hover:bg-white/40 dark:hover:bg-slate-800/40 cursor-pointer"
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                      <FolderKanban size={14} />
                      {projects.find((p) => p.id === task.projectId)?.name || 'Unknown Project'}
                      {isAdmin && <span className="ml-2 px-1.5 py-0.5 rounded-md bg-slate-200/50 dark:bg-slate-800 text-[10px]">User: {task.assignedTo}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={task.status} />
                    {task.dueDate && (
                      <span
                        className={`text-xs flex items-center gap-1 ${
                          new Date(task.dueDate) < today && task.status !== 'Done' ? 'text-red-500 font-medium' : 'text-slate-500'
                        }`}
                      >
                        <Calendar size={12} /> {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`glass-card rounded-2xl p-6 animate-fade-in transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 delay-75 ${isAdmin ? 'hover:shadow-indigo-500/10' : 'hover:shadow-purple-500/10'}`}>
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <FolderKanban size={20} className={`${isAdmin ? 'text-indigo-500' : 'text-purple-500'} drop-shadow-md`} />
            {isAdmin ? 'All Active Projects (Management)' : 'Active Projects'}
          </h3>
          <div className="space-y-4">
            {projects.slice(0, 5).map((project) => {
              const projectTasks = tasks.filter((t) => t.projectId === project.id);
              const completed = projectTasks.filter((t) => t.status === 'Done').length;
              const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;

              return (
                <div
                  key={project.id}
                  onClick={() => onProjectClick(project.id)}
                  className="p-4 rounded-xl glass border border-slate-200/50 dark:border-slate-800/50 cursor-pointer hover:border-purple-300/50 dark:hover:border-purple-700/50 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium group-hover:text-blue-600 transition-colors">{project.name}</h4>
                    <ChevronRight size={18} className="text-slate-400 group-hover:text-blue-500" />
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1 text-slate-500">
                      <span>Progress</span>
                      <span>{progress}% ({completed}/{projectTasks.length})</span>
                    </div>
                    <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
            {projects.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                <p>No projects created yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
