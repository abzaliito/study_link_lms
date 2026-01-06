
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Library from './components/Library';
import Assignments from './components/Assignments';
import Gradebook from './components/Gradebook';
import AIAssistant from './components/AIAssistant';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Simple role-based login simulation
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden transition-colors">
       
        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 md:p-14 relative z-10 animate-in fade-in zoom-in duration-500 border dark:border-slate-800 transition-colors">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black mb-2">
              <span class="text-indigo-600 dark:text-indigo-400">Study</span> <span className="text-sky-400">Link</span>
            </h1>
            <p className="text-gray-400 dark:text-slate-500 font-medium">Master the world's language with us.</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Choose your portal</h3>
            
            <button 
              onClick={() => setUser({ id: 's1', name: 'Abzal', email: 'abzal@example.com', role: UserRole.STUDENT, level: 'B2' })}
              className="w-full bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-400 p-6 rounded-3xl transition-all group flex items-center gap-4 border border-sky-100 dark:border-slate-700 shadow-sm hover:shadow-md"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">🎓</span>
              <div className="text-left">
                <p className="font-bold text-lg">Student Portal</p>
                <p className="text-xs opacity-70">Access lessons, grades & AI tutor</p>
              </div>
            </button>

            <button 
              onClick={() => setUser({ id: 't1', name: 'Miss Alyona', email: 'alyona@example.com', role: UserRole.TEACHER })}
              className="w-full bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-400 p-6 rounded-3xl transition-all group flex items-center gap-4 border border-emerald-100 dark:border-slate-700 shadow-sm hover:shadow-md"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">👩‍🏫</span>
              <div className="text-left">
                <p className="font-bold text-lg">Teacher Portal</p>
                <p className="text-xs opacity-70">Manage assignments & review students</p>
              </div>
            </button>

            <button 
              onClick={() => setUser({ id: 'a1', name: 'James Curator', email: 'james@example.com', role: UserRole.ADMIN })}
              className="w-full bg-amber-50 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-700 dark:text-amber-400 p-6 rounded-3xl transition-all group flex items-center gap-4 border border-amber-100 dark:border-slate-700 shadow-sm hover:shadow-md"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">🛡️</span>
              <div className="text-left">
                <p className="font-bold text-lg">Curator Portal</p>
                <p className="text-xs opacity-70">System admin & center management</p>
              </div>
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-gray-400 dark:text-slate-500">Need help? <a href="#" className="text-sky-400 font-bold hover:underline">Contact Support</a></p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'library': return <Library />;
      case 'assignments': return <Assignments user={user} />;
      case 'grades': return <Gradebook user={user} />;
      case 'tutor': return <AIAssistant />;
      case 'profile': return <Profile user={user} />;
      case 'admin': return <AdminPanel />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <Layout 
      user={user} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      logout={() => setUser(null)}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
