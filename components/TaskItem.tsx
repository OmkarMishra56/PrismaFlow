
import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { geminiService } from '../services/geminiService';
import { api } from '../services/api';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onUpdate }) => {
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [loadingSubtasks, setLoadingSubtasks] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  
  // Animation States
  const [isExiting, setIsExiting] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const priorityStyles = {
    [Priority.LOW]: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    [Priority.MEDIUM]: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
    [Priority.HIGH]: 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
  }[task.priority];

  const handleDecompose = async () => {
    if (subtasks.length > 0) {
      setSubtasks([]);
      return;
    }
    setLoadingSubtasks(true);
    try {
      const generated = await geminiService.suggestSubtasks(task);
      setSubtasks(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubtasks(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await api.tasks.update(task.id, { title: editTitle, description: editDesc });
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = (completed: boolean) => {
    if (completed) {
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 600);
    }
    onToggle(task.id, completed);
  };

  const handleDeleteTrigger = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDelete(task.id);
    }, 400);
  };

  return (
    <div 
      className={`group relative overflow-hidden transition-all duration-500 rounded-[20px] 
        ${isExiting ? 'animate-collapse-out' : 'animate-pop-in'}
        ${task.completed ? 'opacity-60 scale-[0.98]' : 'hover:-translate-y-1 hover:shadow-fluent-deep dark:hover:shadow-fluent-dark'}
        acrylic p-6 border mb-4
      `}
    >
      {/* Success Ripple Effect */}
      {showRipple && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 animate-success-ripple"></div>
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        {/* Fluent Checkbox */}
        <div className="relative pt-1">
          <button
            onClick={() => handleToggle(!task.completed)}
            className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center
              ${task.completed 
                ? 'bg-blue-600 border-blue-600' 
                : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 bg-transparent'
              }`}
          >
            {task.completed && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex-1">
          {isEditing ? (
            <input 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/20 border-b-2 border-blue-500 outline-none text-lg font-bold text-slate-900 dark:text-white mb-2"
              autoFocus
            />
          ) : (
            <div className={`text-lg font-bold tracking-tight transition-all duration-300 strikethrough-container ${task.completed ? 'completed text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
              {task.title}
              <span className="strikethrough-line"></span>
            </div>
          )}
          
          {isEditing ? (
            <textarea 
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full mt-2 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm outline-none"
            />
          ) : (
            <p className={`text-sm mt-1 transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-slate-500 dark:text-slate-400'}`}>
              {task.description || "Deploying strategic operational details..."}
            </p>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-600 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          <button onClick={handleDeleteTrigger} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="flex gap-2 mb-4 animate-pop-in">
          <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20">SAVE</button>
          <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-300">CANCEL</button>
        </div>
      )}

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex gap-2">
          <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-md border ${priorityStyles}`}>
            {task.priority}
          </span>
          <button 
            onClick={handleDecompose}
            className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 hover:underline flex items-center gap-1"
          >
            {loadingSubtasks ? 'Analyzing...' : 'Sub-tasks'}
          </button>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase">
          {new Date(task.dueDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
        </div>
      </div>

      {subtasks.length > 0 && (
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-blue-50 dark:border-slate-800 animate-pop-in">
          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1 h-3 bg-blue-500 rounded-full"></span>
            Azure Core Breakdown
          </p>
          <ul className="space-y-1.5">
            {subtasks.map((st, i) => (
              <li key={i} className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                {st}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
