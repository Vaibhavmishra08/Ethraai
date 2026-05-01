import { useState } from 'react';
import { Plus, FolderKanban } from 'lucide-react';
import { Modal } from './Modal.jsx';

export function ProjectsList({ projects, tasks, userProfile, onProjectClick, onCreateProject }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    onCreateProject(newProject);
    setIsModalOpen(false);
    setNewProject({ name: '', description: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-semibold">Manage Projects</h2>
          <p className="text-slate-500 text-sm mt-1">Select a project to view or manage tasks.</p>
        </div>
        {userProfile.role === 'Admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const completed = projectTasks.filter((t) => t.status === 'Done').length;
          const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;

          return (
            <div
              key={project.id}
              onClick={() => onProjectClick(project.id)}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group flex flex-col"
            >
              <h3 className="text-lg font-semibold group-hover:text-blue-600 mb-2">{project.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-2">
                {project.description || 'No description provided.'}
              </p>

              <div>
                <div className="flex justify-between text-xs mb-2 font-medium">
                  <span className="text-slate-500">Progress</span>
                  <span className={progress === 100 ? 'text-emerald-500' : 'text-blue-600'}>
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
                  <span>{projectTasks.length} Total Tasks</span>
                  <span>{completed} Completed</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
          <FolderKanban size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">No Projects Found</h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">Get started by creating your first project.</p>
          {userProfile.role === 'Admin' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Create Project
            </button>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows="3"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 outline-none resize-none"
            ></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium mt-4">
            Create Project
          </button>
        </form>
      </Modal>
    </div>
  );
}
