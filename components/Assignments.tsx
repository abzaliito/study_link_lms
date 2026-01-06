
import React, { useState, useEffect } from 'react';
import { UserRole, Assignment, User } from '../types';
import { storage } from '../services/storageService';
import { MOCK_ASSIGNMENTS } from '../constants';

interface AssignmentsProps {
  user: User;
}

const Assignments: React.FC<AssignmentsProps> = ({ user }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    const saved = storage.getAssignments();
    if (saved.length === 0) {
      storage.saveAssignments(MOCK_ASSIGNMENTS);
      setAssignments(MOCK_ASSIGNMENTS);
    } else {
      setAssignments(saved);
    }
  }, []);

  const handleAddAssignment = () => {
    const newAssignment: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      description: newDesc,
      dueDate: newDate,
      courseId: 'ENG-GENERAL',
      status: 'PENDING',
      points: 100
    };
    const updated = [...assignments, newAssignment];
    setAssignments(updated);
    storage.saveAssignments(updated);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewDate('');
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'SUBMITTED': return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400';
      case 'GRADED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold dark:text-slate-100">Assignments</h2>
          <p className="text-gray-500 dark:text-slate-400">Keep track of your coursework and deadlines.</p>
        </div>
        {user.role === UserRole.TEACHER && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-sky-400 dark:bg-sky-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-sky-600 transition-colors shadow-lg shadow-sky-200 dark:shadow-none"
          >
            + Create New
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {assignments.map((asgn) => (
          <div key={asgn.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(asgn.status)}`}>
                  {asgn.status}
                </span>
                <span className="text-xs text-gray-400 dark:text-slate-500">Due {asgn.dueDate}</span>
              </div>
              <h4 className="text-lg font-bold mt-2 dark:text-slate-200">{asgn.title}</h4>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-1">{asgn.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold dark:text-slate-200">{asgn.points} pts</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">{asgn.courseId}</p>
              </div>
              <button className="flex-1 md:flex-none px-6 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 font-medium hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-100 dark:hover:border-sky-900 transition-all">
                {user.role === UserRole.STUDENT ? (asgn.status === 'PENDING' ? 'Submit Work' : 'View Submission') : 'Review'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-slate-800 transition-colors">
            <h3 className="text-xl font-bold mb-6 dark:text-slate-100">Create Assignment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors" 
                  placeholder="e.g. Weekly Grammar Review"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Description</label>
                <textarea 
                   value={newDesc} 
                   onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent h-24 transition-colors" 
                  placeholder="Details about the assignment..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Due Date</label>
                <input 
                  type="date" 
                  value={newDate} 
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors" 
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddAssignment}
                  className="flex-1 py-3 rounded-xl bg-sky-400 text-white font-bold hover:bg-sky-500 transition-colors shadow-lg shadow-sky-100 dark:shadow-none"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
