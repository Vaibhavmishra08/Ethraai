import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Modal } from './Modal.jsx';
import { Badge } from './Badge.jsx';

export function ProjectDetails({ project, tasks, users, userProfile, onCreateTask, onUpdateTaskStatus }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });

  const columns = ['To Do', 'In Progress', 'Done'];

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.assignedTo) return;

    onCreateTask({
      projectId: project.id,
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      dueDate: newTask.dueDate,
    });

    setIsModalOpen(false);
    setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
            <p className="text-slate-500 max-w-2xl">{project.description}</p>
          </div>
          {userProfile.role === 'Admin' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Plus size={18} /> Add Task
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);

          return (
            <div key={status} className="min-w-[300px] flex-1 bg-slate-100/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[70vh]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  {status === 'To Do' && <div className="w-2 h-2 rounded-full bg-slate-400" />}
                  {status === 'In Progress' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  {status === 'Done' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                  {status}
                </h3>
                <Badge>{columnTasks.length}</Badge>
              </div>

              <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                {columnTasks.map((task) => {
                  const assignedUser = users.find((u) => u.id === task.assignedTo);
                  const isAssignedToMe = task.assignedTo === userProfile.id;
                  const canEditStatus = userProfile.role === 'Admin' || isAssignedToMe;

                  return (
                    <div key={task.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                      <h4 className="font-medium mb-1">{task.title}</h4>
                      {task.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{task.description}</p>
                      )}

                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300"
                            title={assignedUser?.name}
                          >
                            {assignedUser?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          {task.dueDate && (
                            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Calendar size={10} /> {task.dueDate}
                            </div>
                          )}
                        </div>

                        {canEditStatus && (
                          <select
                            value={task.status}
                            onChange={(e) => onUpdateTaskStatus(task.id, e.target.value)}
                            className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none focus:border-blue-400"
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                          </select>
                        )}
                      </div>
                    </div>
                  );
                })}
                {columnTasks.length === 0 && (
                  <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-center text-sm text-slate-400">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows="2"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 outline-none resize-none"
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Assign To *</label>
              <select
                required
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 outline-none bg-white dark:bg-slate-800"
              >
                <option value="">Select Member</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring-2 outline-none"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium mt-4 transition-colors">
            Assign Task
          </button>
        </form>
      </Modal>
    </div>
  );
}
