
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [isChallengeModalOpen, setChallengeModalOpen] = useState(false);
  const [challengeState, setChallengeState] = useState<'idle' | 'recording' | 'submitted'>('idle');

  const stats = [
    { label: 'Completed Courses', value: '12', icon: '🎓', color: 'bg-blue-400' },
    { label: 'Avg. Grade', value: '92%', icon: '📈', color: 'bg-green-500' },
    { label: 'Words Learned', value: '1.2k', icon: '📝', color: 'bg-purple-500' },
    // Removed Streak as requested
  ];

  const handleStartChallenge = () => {
    setChallengeModalOpen(true);
    setChallengeState('idle');
  };

  const handleRecordToggle = () => {
    if (challengeState === 'idle') {
      setChallengeState('recording');
    } else {
      setChallengeState('recording'); // Just simulated, would normally stop here
      setTimeout(() => {
        setChallengeState('submitted');
      }, 1000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 transition-colors">Welcome back, {user.name.split(' ')[0]}!</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Here's what's happening in your language journey today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <button 
            onClick={handleStartChallenge}
            className="mt-8 w-full bg-white text-sky-400 font-bold py-3 rounded-xl hover:bg-sky-50 transition-colors"
          >
            Start Challenge
          </button>
        </div>
      </div>

      {/* Challenge Modal */}
      {isChallengeModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-slate-800 transition-colors">
            <h3 className="text-xl font-bold mb-4 dark:text-slate-100">Daily Challenge</h3>
            <p className="text-gray-600 dark:text-slate-400 mb-8">Record yourself explaining "Affect" vs "Effect".</p>
            
            <div className="flex flex-col items-center justify-center py-6 gap-4">
              {challengeState === 'submitted' ? (
                 <div className="flex flex-col items-center animate-in fade-in zoom-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                       <span className="text-4xl">🎉</span>
                    </div>
                    <p className="font-bold text-green-600 dark:text-green-400">Challenge Completed!</p>
                    <p className="text-sm text-gray-400">+50 XP Earned</p>
                 </div>
              ) : (
                <>
                  <button 
                    onClick={handleRecordToggle}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      challengeState === 'recording' 
                      ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                      : 'bg-sky-400 hover:bg-sky-500 shadow-lg shadow-sky-400/50'
                    }`}
                  >
                    <span className="text-3xl text-white">
                      {challengeState === 'recording' ? '⏹' : '🎙'}
                    </span>
                  </button>
                  <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    {challengeState === 'recording' ? 'Recording... Tap to stop' : 'Tap to record'}
                  </p>
                </>
              )}
            </div>

            <button 
              onClick={() => setChallengeModalOpen(false)}
              className="mt-6 w-full py-3 rounded-xl font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              {challengeState === 'submitted' ? 'Close' : 'Cancel'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
