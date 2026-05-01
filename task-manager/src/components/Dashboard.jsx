import { FolderKanban, Clock, CheckCircle2, AlertCircle, UserCircle2, Calendar, ChevronRight } from 'lucide-react';
import { StatCard } from './StatCard.jsx';
import { StatusBadge } from './StatusBadge.jsx';

export function Dashboard({ tasks, projects, userProfile, onProjectClick }) {
  const myTasks = tasks.filter((t) => t.assignedTo === userProfile.id);
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
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <UserCircle2 size={20} className="text-blue-500" />
            My Recent Tasks
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
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                      <FolderKanban size={14} />
                      {projects.find((p) => p.id === task.projectId)?.name || 'Unknown Project'}
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

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <FolderKanban size={20} className="text-purple-500" />
            Active Projects
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
                  className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-blue-300 transition-colors group"
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
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
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
