
import React, { useState, useEffect } from 'react';
import { storage } from '../services/storageService';
import { GradeRecord, User, UserRole } from '../types';

interface GradebookProps {
  user: User;
}

const Gradebook: React.FC<GradebookProps> = ({ user }) => {
  const [grades, setGrades] = useState<GradeRecord[]>([]);

  useEffect(() => {
    const allGrades = storage.getGrades();
    
    // Seed data only if absolutely empty (for demo purposes)
    if (allGrades.length === 0 && user.role === UserRole.STUDENT) {
      const initial: GradeRecord[] = [
        { id: 'g1', studentId: user.id, studentName: user.name, assignmentId: 'a3', assignmentTitle: 'Present Perfect vs Past Simple', score: 85, maxScore: 100, date: '2024-05-15' },
        { id: 'g2', studentId: user.id, studentName: user.name, assignmentId: 'a4', assignmentTitle: 'Unit 1 Vocab Test', score: 48, maxScore: 50, date: '2024-05-20' }
      ];
      storage.saveGrades(initial);
      setGrades(initial);
    } else {
      // FILTER based on Role
      if (user.role === UserRole.STUDENT) {
        setGrades(allGrades.filter(g => g.studentId === user.id));
      } else {
        // Teachers see all grades
        setGrades(allGrades);
      }
    }
  }, [user]);

  // Calculate Stats
  const totalPossible = grades.reduce((acc, g) => acc + g.maxScore, 0);
  const totalEarned = grades.reduce((acc, g) => acc + g.score, 0);
  const percentage = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;
  
  // Calculate Average (better for Teachers viewing multiple students)
  const averageScore = grades.length > 0 ? Math.round(totalEarned / grades.length) : 0; // Simplified avg points

  return (
    <div className="space-y-8 transition-colors">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-8">
          <div className="w-24 h-24 rounded-full border-8 border-sky-400 dark:border-sky-500 flex items-center justify-center relative">
             <span className="text-2xl font-bold dark:text-slate-100">{percentage}%</span>
          </div>
          <div>
            <h3 className="text-lg font-bold dark:text-slate-100">
                {user.role === UserRole.STUDENT ? 'Overall Grade' : 'Class Average'}
            </h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm">Based on {grades.length} submissions</p>
            {user.role === UserRole.STUDENT && (
                <div className="flex gap-4 mt-2">
                <span className="text-xs bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 px-2 py-1 rounded-full font-bold">GPA: 3.8</span>
                <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-bold">In Top 10%</span>
                </div>
            )}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="bg-sky-400 dark:bg-sky-500 p-6 rounded-3xl text-white">
            <p className="text-sm opacity-80">Total Points Earned</p>
            <p className="text-3xl font-bold mt-1">{totalEarned}</p>
          </div>
          <div className="bg-emerald-500 dark:bg-emerald-600 p-6 rounded-3xl text-white">
            <p className="text-sm opacity-80">Assignments Completed</p>
            <p className="text-3xl font-bold mt-1">{grades.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-50 dark:border-slate-800">
          <h3 className="font-bold dark:text-slate-100">
             {user.role === UserRole.STUDENT ? 'Detailed Grade History' : 'Student Submissions'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 dark:text-slate-500 text-xs uppercase tracking-widest bg-gray-50 dark:bg-slate-950 transition-colors">
                <th className="px-6 py-4">Assignment</th>
                {user.role !== UserRole.STUDENT && <th className="px-6 py-4">Student</th>}
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {grades.map(grade => (
                <tr key={grade.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-semibold text-sm text-gray-900 dark:text-slate-200">{grade.assignmentTitle}</p>
                  </td>
                  {user.role !== UserRole.STUDENT && (
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center text-[10px] font-bold text-sky-600">
                               {grade.studentName.charAt(0)}
                           </div>
                           <span className="text-sm text-gray-700 dark:text-slate-300">{grade.studentName}</span>
                        </div>
                      </td>
                  )}
                  <td className="px-6 py-5 text-sm text-gray-500 dark:text-slate-500">{grade.date}</td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-gray-900 dark:text-slate-200">{grade.score}</span>
                    <span className="text-xs text-gray-400 dark:text-slate-500"> / {grade.maxScore}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      grade.score / grade.maxScore >= 0.8 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                    }`}>
                      {grade.score / grade.maxScore >= 0.8 ? 'Excellent' : 'Good'}
                    </span>
                  </td>
                </tr>
              ))}
              {grades.length === 0 && (
                <tr>
                  <td colSpan={user.role === UserRole.STUDENT ? 4 : 5} className="px-6 py-12 text-center text-gray-400 dark:text-slate-500 italic">
                    No grades recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Gradebook;
