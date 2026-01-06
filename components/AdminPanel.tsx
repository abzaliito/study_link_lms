
import React from 'react';

const AdminPanel: React.FC = () => {
  const users = [
    { id: 1, name: 'Alice Smith', role: 'Student', level: 'B1', status: 'Active' },
    { id: 2, name: 'Bob Johnson', role: 'Teacher', level: 'N/A', status: 'On Leave' },
    { id: 3, name: 'Charlie Brown', role: 'Student', level: 'C1', status: 'Active' },
    { id: 4, name: 'Diana Prince', role: 'Teacher', level: 'N/A', status: 'Active' },
  ];

  return (
    <div className="space-y-8 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
          <p className="text-xs text-gray-400 dark:text-slate-500 uppercase font-bold tracking-widest">Total Students</p>
          <p className="text-4xl font-black text-sky-400 dark:text-sky-400 mt-2">1,284</p>
          <p className="text-xs text-green-500 dark:text-green-400 mt-1">↑ 12% from last month</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
          <p className="text-xs text-gray-400 dark:text-slate-500 uppercase font-bold tracking-widest">Faculty Members</p>
          <p className="text-4xl font-black text-sky-400 dark:text-sky-400 mt-2">42</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Full-time staff</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
          <p className="text-xs text-gray-400 dark:text-slate-500 uppercase font-bold tracking-widest">Pending Invoices</p>
          <p className="text-4xl font-black text-red-500 dark:text-red-400 mt-2">08</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Requires attention</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center transition-colors">
          <h3 className="font-bold dark:text-slate-100">User Management</h3>
          <button className="text-xs font-bold text-sky-400 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 px-3 py-1.5 rounded-lg transition-colors">
            Add New User
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 dark:text-slate-500 text-xs uppercase tracking-widest bg-gray-50 dark:bg-slate-950 transition-colors">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm dark:text-slate-200">{u.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{u.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{u.level}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                      u.status === 'Active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-500'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sky-400 dark:text-sky-400 hover:underline text-xs font-bold transition-all">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
