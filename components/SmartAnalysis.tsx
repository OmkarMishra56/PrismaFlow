
import React, { useState } from 'react';
import { Task } from '../types';
import { geminiService } from '../services/geminiService';

interface SmartAnalysisProps {
  tasks: Task[];
}

const SmartAnalysis: React.FC<SmartAnalysisProps> = ({ tasks }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await geminiService.analyzeTasks(tasks);
      setAnalysis(result);
    } catch (error) {
      setAnalysis("Prisma intelligence service is currently unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prisma-card p-6 border-t-[6px] border-t-indigo-600 bg-indigo-50/20 dark:bg-indigo-900/10 dark:border-slate-800">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-white leading-tight">Neural Engine</h2>
            <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-widest mt-0.5">Cognitive Analysis</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {analysis ? (
          <div className="p-5 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 rounded-2xl text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm">
            <p className="font-medium">{analysis}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 italic px-2">
            Unlock strategic insights and workflow optimization based on your current workload.
          </p>
        )}
        
        <button 
          onClick={handleAnalyze}
          disabled={loading || tasks.length === 0}
          className="w-full bg-slate-900 dark:bg-slate-100 hover:bg-black dark:hover:bg-white text-white dark:text-black font-extrabold py-4 px-6 rounded-2xl text-sm transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {loading ? 'SYNTHESIZING...' : 'EXECUTE NEURAL SCAN'}
        </button>
      </div>
    </div>
  );
};

export default SmartAnalysis;
