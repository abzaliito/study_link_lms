
import React from 'react';
import { User, UserRole } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const stats = [
    { label: 'Completed Courses', value: '12', icon: '🎓', color: 'bg-blue-400' },
    { label: 'Avg. Grade', value: '92%', icon: '📈', color: 'bg-green-500' },
    { label: 'Words Learned', value: '1.2k', icon: '📝', color: 'bg-purple-500' },
    { label: 'Days Streak', value: '15', icon: '🔥', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 transition-colors">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Here's what's happening in your language journey today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-xl ${stat.color} bg-opacity-10 flex items-center justify-center text-2xl mb-4`}>
              {stat.icon}
            </div>
            <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold mt-1 dark:text-slate-100">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-bold mb-6 dark:text-slate-100">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  {i === 0 ? '📝' : i === 1 ? '✅' : '💬'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-slate-200">
                    {i === 0 ? 'Submitted Assignment: Passive Voice Essay' : 
                     i === 1 ? 'Graded: Phrasal Verbs Quiz (95/100)' : 
                     'New message from Tutor Alex'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{i + 1} hour ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-sky-400 dark:bg-sky-700 p-8 rounded-2xl shadow-sm text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Today's Daily Challenge</h3>
            <p className="text-sky-100 text-sm opacity-90">Explain the difference between "Affect" and "Effect" in a 1-minute audio recording.</p>
          </div>
          <button className="mt-8 w-full bg-white text-sky-400 font-bold py-3 rounded-xl hover:bg-sky-50 transition-colors">
            Start Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
