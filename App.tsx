
import React, { useState } from 'react';
import { User, UserRole } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Library from './components/Library';
import Assignments from './components/Assignments';
import Gradebook from './components/Gradebook';
import AIAssistant from './components/AIAssistant';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import Flashcards from './components/Flashcards';
import { storage } from './services/storageService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Login State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const users = storage.getUsers();
    const foundUser = users.find(u => u.phoneNumber === phoneNumber && u.password === password);

    if (foundUser) {
      setUser(foundUser);
      setActiveTab('dashboard');
    } else {
      setLoginError('Invalid phone number or password');
    }
  };

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden transition-colors">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200 dark:bg-sky-900/10 rounded-full -mr-20 -mt-20 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-300 dark:bg-sky-950/10 rounded-full -ml-20 -mb-20 opacity-30 blur-3xl"></div>
        
        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 md:p-14 relative z-10 animate-in fade-in zoom-in duration-500 border dark:border-slate-800 transition-colors">
          <div className="text-center mb-8 flex flex-col items-center">
             <img 
               src="/logo/studylinklogo.png" 
               alt="Study Link" 
               className="w-full max-w-[220px] h-auto object-contain mb-4"
             />
            <p className="text-gray-400 dark:text-slate-500 font-medium">Welcome back! Please log in.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Phone Number</label>
              <input 
                type="text" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                placeholder="Enter phone number"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                placeholder="Enter password"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-500 text-sm font-medium text-center">{loginError}</p>
            )}

            <button 
              type="submit"
              className="w-full bg-sky-400 hover:bg-sky-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-200 dark:shadow-none transition-all hover:scale-[1.02]"
            >
              Log In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400 dark:text-slate-500">
              Forgot password? <a href="#" className="text-sky-400 font-bold hover:underline">Contact Admin</a>
            </p>
            <p className="text-[10px] text-gray-300 mt-4">
              Default Admin: 0000 / admin <br/> Default Student: 1234 / 123
            </p>
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
      case 'flashcards': return <Flashcards user={user} />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <Layout 
      user={user} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      logout={() => {
        setUser(null);
        setPhoneNumber('');
        setPassword('');
        setActiveTab('dashboard');
      }}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
