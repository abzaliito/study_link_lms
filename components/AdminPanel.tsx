
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { storage } from '../services/storageService';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    phoneNumber: '',
    password: '',
    role: UserRole.STUDENT,
    level: 'A1',
    email: ''
  });

  useEffect(() => {
    setUsers(storage.getUsers());
  }, []);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.phoneNumber || !newUser.password) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const userToAdd: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: newUser.name,
        phoneNumber: newUser.phoneNumber,
        password: newUser.password,
        role: newUser.role as UserRole,
        level: newUser.level || 'N/A',
        email: newUser.email || `${newUser.name?.toLowerCase().replace(/\s/g, '')}@studylink.com`
      };

      const updatedUsers = storage.addUser(userToAdd);
      setUsers(updatedUsers);
      setIsModalOpen(false);
      setNewUser({ name: '', phoneNumber: '', password: '', role: UserRole.STUDENT, level: 'A1', email: '' });
    } catch (e: any) {
      alert(e.message);
    }
  };

  const studentCount = users.filter(u => u.role === UserRole.STUDENT).length;
  const staffCount = users.filter(u => u.role === UserRole.ADMIN || u.role === UserRole.TEACHER).length;

  return (
    <div className="space-y-8 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
          <p className="text-xs text-gray-400 dark:text-slate-500 uppercase font-bold tracking-widest">Total Students</p>
          <p className="text-4xl font-black text-sky-400 dark:text-sky-400 mt-2">{studentCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
          <p className="text-xs text-gray-400 dark:text-slate-500 uppercase font-bold tracking-widest">Staff Members</p>
          <p className="text-4xl font-black text-purple-500 dark:text-purple-400 mt-2">{staffCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
          <p className="text-xs text-gray-400 dark:text-slate-500 uppercase font-bold tracking-widest">Total Users</p>
          <p className="text-4xl font-black text-gray-800 dark:text-gray-200 mt-2">{users.length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center transition-colors">
          <h3 className="font-bold dark:text-slate-100">User Management</h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-white bg-sky-400 hover:bg-sky-500 px-4 py-2 rounded-xl transition-colors shadow-lg shadow-sky-100 dark:shadow-none"
          >
            + Add New User
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 dark:text-slate-500 text-xs uppercase tracking-widest bg-gray-50 dark:bg-slate-950 transition-colors">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm dark:text-slate-200">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400 font-mono">{u.phoneNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">
                     <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                        u.role === UserRole.TEACHER ? 'bg-emerald-100 text-emerald-700' :
                        'bg-sky-100 text-sky-700'
                     }`}>
                        {u.role}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{u.level || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sky-400 dark:text-sky-400 hover:underline text-xs font-bold transition-all">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-slate-800 transition-colors">
            <h3 className="text-xl font-bold mb-6 dark:text-slate-100">Add New User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Phone Number (Login)</label>
                <input 
                  type="text" 
                  value={newUser.phoneNumber}
                  onChange={e => setNewUser({...newUser, phoneNumber: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Password</label>
                <input 
                  type="text" 
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Role</label>
                    <select 
                       value={newUser.role}
                       onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                    >
                       <option value={UserRole.STUDENT}>Student</option>
                       <option value={UserRole.ADMIN}>Manager/Admin</option>
                       <option value={UserRole.TEACHER}>Teacher</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Level</label>
                    <select 
                       value={newUser.level}
                       onChange={e => setNewUser({...newUser, level: e.target.value})}
                       className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                       disabled={newUser.role !== UserRole.STUDENT}
                    >
                       <option value="A1">A1 Beginner</option>
                       <option value="A2">A2 Elementary</option>
                       <option value="B1">B1 Intermediate</option>
                       <option value="B2">B2 Upper Int.</option>
                       <option value="C1">C1 Advanced</option>
                    </select>
                 </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddUser}
                  className="flex-1 py-3 rounded-xl bg-sky-400 text-white font-bold hover:bg-sky-500 transition-colors shadow-lg shadow-sky-100 dark:shadow-none"
                >
                  Save User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
