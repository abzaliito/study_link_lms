
import React, { useState, useEffect } from 'react';
import { UserRole, User } from '../types';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  logout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, children, activeTab, setActiveTab, logout }) => {
  // Default to light theme (false) if no preference is saved
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Emojis removed from display logic below, kept in object if needed later or just removed entirely from UI render
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', roles: [UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN] },
    { id: 'flashcards', label: 'Flashcards', roles: [UserRole.STUDENT] },
    { id: 'assignments', label: 'Assignments', roles: [UserRole.STUDENT, UserRole.TEACHER] },
    { id: 'library', label: 'Library', roles: [UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN] },
    { id: 'grades', label: 'Grades', roles: [UserRole.STUDENT, UserRole.TEACHER] },
    { id: 'tutor', label: 'AI Tutor', roles: [UserRole.STUDENT] },
    { id: 'admin', label: 'Management', roles: [UserRole.ADMIN] },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsSidebarOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <img 
          src="/logo/studylinklogo.png" 
          alt="Study Link" 
          className="w-full max-w-[180px] h-auto object-contain"
        />
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.filter(item => item.roles.includes(user.role)).map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            {/* Icon removed as requested */}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100 dark:border-slate-800">
        <div 
          onClick={() => handleTabClick('profile')}
          className="flex items-center gap-3 px-2 py-3 mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors group"
        >
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=38bdf8&color=fff`} 
            alt="avatar" 
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-slate-700 group-hover:border-sky-400 transition-colors"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{user.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-colors">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 z-50 transform transition-transform duration-300 md:hidden flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 md:px-12 transition-colors">
          <div className="flex items-center gap-4">
            {/* Burger Menu Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">
              {menuItems.find(i => i.id === activeTab)?.label || (activeTab === 'profile' ? 'Profile' : 'Dashboard')}
            </h2>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:scale-110 transition-transform"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <span className="hidden sm:inline-block text-xs font-medium px-3 py-1 bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 rounded-full">
              Level: {user.level || 'Staff'}
            </span>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-12 bg-gray-100 dark:bg-slate-950 transition-colors">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;
