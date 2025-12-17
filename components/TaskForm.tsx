
import React, { useState } from 'react';
import { Priority } from '../types';

interface TaskFormProps {
  onSubmit: (title: string, description: string, priority: Priority, dueDate: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;
    onSubmit(title, description, priority, dueDate);
    setTitle('');
    setDescription('');
    setPriority(Priority.MEDIUM);
    setDueDate('');
  };

  return (
    <div className="acrylic rounded-[24px] p-8 mb-12 shadow-fluent-elevated border-white dark:border-slate-800 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/40">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Deployment Console</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Microsoft Prisma Flow V3</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Objective Name</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3.5 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 transition-all font-semibold text-slate-900 dark:text-white"
              placeholder="e.g. System Audit"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Execution Date</label>
            <input 
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3.5 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 transition-all font-semibold text-slate-900 dark:text-white"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Strategic Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3.5 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-slate-900 dark:text-white h-24"
            placeholder="Define operational parameters..."
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
          <div className="flex-1 w-full">
            <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {Object.values(Priority).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${priority === p ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <button 
            type="submit"
            className="w-full md:w-auto px-10 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
          >
            INITIALIZE
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
