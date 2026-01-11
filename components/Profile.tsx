
import React from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 transition-colors">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-sky-400 dark:bg-sky-800"></div>
        <div className="relative mt-12 flex flex-col md:flex-row items-center gap-8">
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=38bdf8&color=fff&size=200`} 
            alt="profile" 
            className="w-40 h-40 rounded-3xl border-4 border-white dark:border-slate-800 shadow-xl object-cover"
          />
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">{user.name}</h2>
            <p className="text-sky-400 dark:text-sky-400 font-medium uppercase tracking-widest text-xs mt-1">{user.role}</p>
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
              <div className="px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 transition-colors">
                <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-bold">Email</p>
                <p className="text-sm font-medium dark:text-slate-200">{user.email}</p>
              </div>
              <div className="px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 transition-colors">
                <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-bold">Join Date</p>
                <p className="text-sm font-medium dark:text-slate-200">January 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-xl font-bold mb-6 dark:text-slate-100">Learning Goals</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl transition-colors">
              <span className="font-medium text-gray-700 dark:text-slate-300">Vocabulary Expansion</span>
              <span className="text-sky-600 dark:text-sky-400 font-bold">75%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl transition-colors">
              <span className="font-medium text-gray-700 dark:text-slate-300">Pronunciation Accuracy</span>
              <span className="text-sky-600 dark:text-sky-400 font-bold">60%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl transition-colors">
              <span className="font-medium text-gray-700 dark:text-slate-300">Grammar Proficiency</span>
              <span className="text-sky-600 dark:text-sky-400 font-bold">90%</span>
            </div>
          </div>
          <button className="w-full mt-6 py-3 text-sky-400 dark:text-sky-400 font-bold border border-sky-100 dark:border-sky-900/50 rounded-2xl hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all">
            Update Goals
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-xl font-bold mb-6 dark:text-slate-100">Account Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between group">
               <span className="text-sm font-medium text-gray-700 dark:text-slate-300 group-hover:text-sky-400 dark:group-hover:text-sky-400 transition-colors">Email Notifications</span>
               <div className="w-12 h-6 bg-sky-400 dark:bg-sky-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
               </div>
            </div>
            <div className="flex items-center justify-between group">
               <span className="text-sm font-medium text-gray-700 dark:text-slate-300 group-hover:text-sky-400 dark:group-hover:text-sky-400 transition-colors">Public Profile</span>
               <div className="w-12 h-6 bg-gray-200 dark:bg-slate-700 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
               </div>
            </div>
            <div className="flex items-center justify-between group">
               <span className="text-sm font-medium text-gray-700 dark:text-slate-300 group-hover:text-sky-400 dark:group-hover:text-sky-400 transition-colors">Daily Reminder</span>
               <div className="w-12 h-6 bg-sky-400 dark:bg-sky-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
               </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-50 dark:border-slate-800 transition-colors">
            <button className="text-red-500 text-sm font-bold hover:underline">Deactivate Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
