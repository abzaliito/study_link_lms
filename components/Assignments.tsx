
import React, { useState, useEffect } from 'react';
import { UserRole, Assignment, User } from '../types';
import { storage } from '../services/storageService';
import HomeworkBuilder from './HomeworkBuilder';
import HomeworkPlayer from './HomeworkPlayer';

interface AssignmentsProps {
  user: User;
}

const Assignments: React.FC<AssignmentsProps> = ({ user }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [viewState, setViewState] = useState<'list' | 'create' | 'play'>('list');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  
  // New state to pass existing answers to the player for review
  const [reviewAnswers, setReviewAnswers] = useState<Record<string, any>>({});
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Load assignments when component mounts or viewState changes to 'list'
  useEffect(() => {
    if (viewState === 'list') {
      refreshAssignments();
    }
  }, [viewState, user]);

  const refreshAssignments = () => {
    // This now uses the updated storage logic which filters by group for students
    const data = storage.getAssignments(user);
    
    // Merge status from Gradebook for students
    if (user.role === UserRole.STUDENT) {
      const grades = storage.getGrades();
      const updatedData = data.map(assignment => {
        const grade = grades.find(g => g.assignmentId === assignment.id && g.studentId === user.id);
        if (grade) {
          return { ...assignment, status: 'GRADED' as const, grade: grade.score };
        }
        return assignment;
      });
      setAssignments(updatedData);
    } else {
      setAssignments(data);
    }
  };

  const handleCreateSave = (newAssignment: Assignment) => {
    storage.addAssignment(newAssignment);
    setViewState('list');
    refreshAssignments();
  };

  const handleStartAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    
    // TEACHER: Always Preview (Review Mode)
    if (user.role === UserRole.TEACHER || user.role === UserRole.ADMIN) {
        setReviewAnswers({}); // No answers to show
        setIsReviewMode(true); // Read only
        setViewState('play');
        return;
    }

    // STUDENT: Check if this assignment is already completed to trigger Review Mode
    if (assignment.status === 'GRADED') {
       const gradeRecord = storage.getGradeForAssignment(user.id, assignment.id);
       if (gradeRecord && gradeRecord.answers) {
          setReviewAnswers(gradeRecord.answers);
          setIsReviewMode(true);
       } else {
          setReviewAnswers({});
          setIsReviewMode(false); // Should not happen if logic is tight, but fallback
       }
    } else {
       setReviewAnswers({});
       setIsReviewMode(false);
    }

    setViewState('play');
  };

  const handleSubmitAssignment = (assignmentId: string, score: number, maxScore: number, answers: Record<string, any>) => {
    // Teachers cannot submit
    if (user.role !== UserRole.STUDENT) return;

    if (user.id) {
        storage.submitAssignment(assignmentId, user.id, score, maxScore, answers);
    }
    // We do NOT set viewState to list here anymore, because the Player now stays open in Review Mode.
    // The Player's "Close" button will trigger setViewState('list').
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'SUBMITTED': return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400';
      case 'GRADED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  if (viewState === 'create') {
    return <HomeworkBuilder onCancel={() => setViewState('list')} onSave={handleCreateSave} />;
  }

  // Render Player for both Students (Play/Review) and Teachers (Preview)
  if (viewState === 'play' && selectedAssignment) {
    return (
      <HomeworkPlayer 
        assignment={selectedAssignment} 
        studentId={user.id} 
        onClose={() => { setViewState('list'); refreshAssignments(); }} 
        onSubmit={handleSubmitAssignment}
        initialAnswers={reviewAnswers}
        isReviewMode={isReviewMode}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold dark:text-slate-100">
             {user.role === UserRole.STUDENT ? 'My Assignments' : 'Manage Assignments'}
          </h2>
          <p className="text-gray-500 dark:text-slate-400">
             {user.role === UserRole.STUDENT 
                ? 'Tasks assigned to your group.' 
                : 'Create and track coursework for your groups.'}
          </p>
        </div>
        {(user.role === UserRole.TEACHER || user.role === UserRole.ADMIN) && (
          <button 
            onClick={() => setViewState('create')}
            className="bg-sky-400 dark:bg-sky-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-sky-600 transition-colors shadow-lg shadow-sky-200 dark:shadow-none flex items-center gap-2"
          >
            <span>✨</span> Create with AI
          </button>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
           <p className="text-gray-400 dark:text-slate-500">No assignments found for your group.</p>
        </div>
      ) : (
        <div className="grid gap-4">
            {assignments.map((asgn) => (
            <div key={asgn.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
                <div className="flex-1">
                <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(asgn.status)}`}>
                    {asgn.status}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-slate-500">Due {asgn.dueDate}</span>
                    {asgn.type === 'interactive' && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider dark:bg-purple-900/30 dark:text-purple-400">Interactive</span>
                    )}
                </div>
                <h4 className="text-lg font-bold mt-2 dark:text-slate-200">{asgn.title}</h4>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-1">{asgn.description}</p>
                </div>
                <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold dark:text-slate-200">
                        {asgn.grade !== undefined ? `${asgn.grade}/${asgn.points}` : `${asgn.points} pts`}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-slate-500">{asgn.courseId}</p>
                </div>
                
                {user.role === UserRole.STUDENT ? (
                    <button 
                        onClick={() => handleStartAssignment(asgn)}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-xl border font-medium transition-all ${
                            asgn.status === 'GRADED'
                            ? 'border-green-200 text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                            : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 hover:border-sky-100'
                        }`}
                    >
                        {asgn.status === 'PENDING' ? 'Start Assignment' : 'View Results'}
                    </button>
                ) : (
                    <button 
                        onClick={() => handleStartAssignment(asgn)}
                        className="flex-1 md:flex-none px-6 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 font-medium hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-all"
                    >
                        Preview
                    </button>
                )}
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Assignments;
