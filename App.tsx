
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import SmartAnalysis from './components/SmartAnalysis';
import AIAssistant from './components/AIAssistant';
import { api } from './services/api';
import { Task, Priority } from './types';

const CoolLogoLarge = () => (
  <div className="relative w-24 h-24 mx-auto mb-8">
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="logoGradLg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="url(#logoGradLg)" />
      <path d="M50 10 L50 50 L85 30 Z" fill="white" fillOpacity="0.2" />
      <path d="M50 50 L85 70 L50 90 Z" fill="black" fillOpacity="0.1" />
      <path d="M15 30 L50 50 L15 70 Z" fill="white" fillOpacity="0.1" />
      <circle cx="50" cy="50" r="15" fill="white" fillOpacity="0.95" />
      <circle cx="50" cy="50" r="6" fill="#4f46e5" />
    </svg>
  </div>
);

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    const data = await api.tasks.getAll();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (title: string, description: string, priority: Priority, dueDate: string) => {
    await api.tasks.create(title, description, priority, dueDate);
    fetchTasks();
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    await api.tasks.update(id, { completed });
    fetchTasks();
  };

  const handleDeleteTask = async (id: string) => {
    await api.tasks.delete(id);
    fetchTasks();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-24">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 animate-pulse">Initializing Interface...</p>
    </div>
  );

  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <TaskForm onSubmit={handleCreateTask} />
          
          <div className="space-y-12">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                  Operational Core
                  <span className="bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg shadow-indigo-500/20">{incompleteTasks.length}</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {incompleteTasks.length > 0 ? (
                  incompleteTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={handleToggleTask} 
                      onDelete={handleDeleteTask}
                      onUpdate={fetchTasks}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-white/40 dark:bg-slate-900/40">
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-widest">Pipeline Stagnant. Awaiting Directives.</p>
                  </div>
                )}
              </div>
            </section>

            {completedTasks.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-slate-300 dark:text-slate-700 flex items-center gap-4 mb-8">
                  History Log
                  <span className="bg-slate-300 dark:bg-slate-700 text-white text-[10px] font-black px-3 py-1.5 rounded-xl">{completedTasks.length}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {completedTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={handleToggleTask} 
                      onDelete={handleDeleteTask}
                      onUpdate={fetchTasks}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="space-y-12">
          <SmartAnalysis tasks={tasks} />
          
          <div className="prisma-card p-10 dark:bg-slate-900 dark:border-slate-800 shadow-2xl">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">Real-time Metrics</h3>
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Current Workload</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white leading-none mt-1">{incompleteTasks.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Efficiency Index</p>
                  <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 leading-none mt-1">
                    {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
                  </p>
                </div>
              </div>
              <div className="relative w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden shadow-inner">
                <div 
                  className="absolute left-0 top-0 bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out shadow-lg" 
                  style={{ width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AIAssistant tasks={tasks} />
    </div>
  );
};

const AuthScreen: React.FC = () => {
  const { login, register, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      if (isLogin) {
        await login(email);
      } else {
        await register(username, email);
      }
    } catch (err) {
      // Error handled by context
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="prisma-card p-12 w-full max-w-lg animate-in slide-in-from-bottom-12 duration-1000 dark:bg-slate-900 dark:border-slate-800 shadow-3xl">
        <div className="text-center mb-12">
          <CoolLogoLarge />
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{isLogin ? 'Access Portal' : 'Initialize Profile'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 font-medium">Synchronize with PrismaFlow Intelligence</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center justify-between">
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{error}</p>
            <button onClick={clearError} className="text-rose-400 hover:text-rose-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Identifier</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 text-base font-medium bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-2xl transition-all"
                placeholder="Alias"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Neural ID (Email)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 text-base font-medium bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-2xl transition-all"
              placeholder="name@nexus.com"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={localLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-black py-5 rounded-2xl text-base transition-all shadow-2xl shadow-indigo-500/30 active:scale-[0.98] mt-4 uppercase tracking-[0.2em] flex items-center justify-center gap-3"
          >
            {localLoading && <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>}
            {isLogin ? 'Authorize Session' : 'Create Profile'}
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); clearError(); }}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-black uppercase tracking-widest transition-colors"
          >
            {isLogin ? "Request New Credential" : "Return to Access Portal"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const AppContent: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
