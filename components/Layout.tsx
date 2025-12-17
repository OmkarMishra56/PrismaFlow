
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const CoolLogo = () => (
  <div className="relative w-12 h-12 flex items-center justify-center group">
    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full group-hover:bg-indigo-500/40 transition-all duration-700"></div>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="url(#logoGrad)" />
      <path d="M50 10 L50 50 L85 30 Z" fill="white" fillOpacity="0.4" />
      <path d="M50 50 L85 70 L50 90 Z" fill="black" fillOpacity="0.1" />
      <circle cx="50" cy="50" r="12" fill="white" fillOpacity="0.95" />
    </svg>
  </div>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      {/* Fixed Navbar */}
      <header className="glass-panel h-24 flex items-center justify-between px-6 md:px-10 fixed top-0 left-0 w-full z-50 shadow-sm border-b transition-all duration-300">
        <div className="flex items-center gap-4 md:gap-6">
          <CoolLogo />
          <div className="flex flex-col">
            <h1 className="font-black text-2xl md:text-3xl tracking-tighter text-slate-900 dark:text-white transition-colors">
              Prisma<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
            </h1>
            <p className="hidden md:block text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 dark:text-slate-500 leading-none mt-1">Intelligence Platform</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-10">
          <button 
            onClick={toggleTheme}
            className="group relative p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-fluent-elevated border border-slate-100 dark:border-slate-700 hover:ring-8 hover:ring-indigo-500/5 active:scale-90 transition-all duration-500"
            aria-label="Toggle Theme"
          >
            <div className="relative z-10">
              {theme === 'light' ? (
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
          </button>

          {isAuthenticated && (
            <div className="flex items-center gap-4 md:gap-6 border-l border-slate-100 dark:border-slate-800 pl-4 md:pl-6 h-10">
              <div className="hidden md:block text-right">
                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                <p className="text-sm font-black text-slate-900 dark:text-slate-200 transition-colors">{user?.username}</p>
              </div>
              <button 
                onClick={logout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 md:px-7 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs transition-all font-black shadow-xl shadow-indigo-500/20 active:scale-95 border-b-4 border-indigo-800 hover:border-indigo-900 tracking-widest uppercase"
              >
                Exit
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Spacing for fixed header: pt-24 (h-24) + additional padding */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 pt-32 pb-20 md:pt-40 md:pb-32">
        {children}
      </main>

      <footer className="py-20 text-center transition-colors">
        <div className="flex flex-col items-center gap-6">
          <div className="opacity-20 hover:opacity-100 transition-opacity duration-700 cursor-help scale-75">
            <CoolLogo />
          </div>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.5em]">
            &copy; {new Date().getFullYear()} PrismaFlow Neural Systems
          </p>
          <div className="flex gap-1">
            <div className="h-1 w-1 bg-indigo-500 rounded-full animate-pulse"></div>
            <div className="h-1 w-6 bg-indigo-500/20 rounded-full"></div>
            <div className="h-1 w-1 bg-indigo-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
