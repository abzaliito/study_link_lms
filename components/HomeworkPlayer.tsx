
import React, { useState, useEffect } from 'react';
import { Assignment, Exercise } from '../types';

interface HomeworkPlayerProps {
  assignment: Assignment;
  studentId: string;
  initialAnswers?: Record<string, any>; // Optional: answers if reviewing
  isReviewMode?: boolean; // Optional: read-only mode
  onClose: () => void;
  onSubmit: (assignmentId: string, score: number, maxScore: number, answers: Record<string, any>) => void;
}

const HomeworkPlayer: React.FC<HomeworkPlayerProps> = ({ 
  assignment, 
  onClose, 
  onSubmit, 
  initialAnswers = {}, 
  isReviewMode = false 
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'attempt' | 'review'>(isReviewMode ? 'review' : 'attempt');
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    // If opening in review mode, calculate score initially to display
    if (isReviewMode) {
      setFinalScore(calculateScore());
    }
  }, []);

  const handleInputChange = (exerciseId: string, value: any, blankIndex?: number) => {
    if (viewMode === 'review') return; // Read only

    if (blankIndex !== undefined) {
      const current = (answers[exerciseId] as string[]) || [];
      const updated = [...current];
      updated[blankIndex] = value;
      setAnswers(prev => ({ ...prev, [exerciseId]: updated }));
    } else {
      setAnswers(prev => ({ ...prev, [exerciseId]: value }));
    }
  };

  const calculateScore = () => {
    if (!assignment.exercises) return 0;
    let totalScore = 0;
    
    assignment.exercises.forEach(ex => {
      const studentAnswer = answers[ex.id];
      if (!studentAnswer) return;

      if (ex.type === 'multiple_choice') {
        if (studentAnswer === ex.content.correctAnswer) {
          totalScore += ex.points;
        }
      } else if (ex.type === 'fill_blank') {
        const correctAnswers = ex.content.correctAnswer as string[];
        if (Array.isArray(studentAnswer)) {
          let blankPoints = 0;
          correctAnswers.forEach((ans, idx) => {
             if (studentAnswer[idx]?.toLowerCase().trim() === ans.toLowerCase().trim()) {
               blankPoints += (ex.points / correctAnswers.length);
             }
          });
          totalScore += Math.floor(blankPoints);
        }
      }
    });
    return totalScore;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const score = calculateScore();
    const maxScore = assignment.points;

    // Simulate network delay
    setTimeout(() => {
      onSubmit(assignment.id, score, maxScore, answers);
      setFinalScore(score);
      setViewMode('review'); // Switch to review mode to show results
      setIsSubmitting(false);
    }, 1000);
  };

  // Helper to check if an answer is correct for UI styling
  const checkAnswerStatus = (ex: Exercise): 'correct' | 'incorrect' | 'partial' | 'unanswered' => {
    const ans = answers[ex.id];
    if (!ans) return 'unanswered';

    if (ex.type === 'multiple_choice') {
      return ans === ex.content.correctAnswer ? 'correct' : 'incorrect';
    } 
    
    if (ex.type === 'fill_blank') {
       // Simplify fill_blank status for the main container
       const correctAnswers = ex.content.correctAnswer as string[];
       if (!Array.isArray(ans)) return 'incorrect';
       
       let correctCount = 0;
       correctAnswers.forEach((c, i) => {
         if (ans[i]?.toLowerCase().trim() === c.toLowerCase().trim()) correctCount++;
       });
       
       if (correctCount === correctAnswers.length) return 'correct';
       if (correctCount > 0) return 'partial';
       return 'incorrect';
    }

    return 'incorrect';
  };

  if (!assignment.exercises) return <div>Error: No content.</div>;

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-950 z-50 flex flex-col animate-in slide-in-from-bottom-10 transition-colors">
      {/* Header */}
      <div className={`h-24 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-6 md:px-12 ${viewMode === 'review' ? 'bg-sky-50 dark:bg-sky-900/20' : 'bg-white dark:bg-slate-900'}`}>
        <div>
           <h2 className="text-xl font-bold dark:text-white">{assignment.title}</h2>
           {viewMode === 'attempt' ? (
             <p className="text-sm text-gray-400">{assignment.exercises.length} Questions • {assignment.points} Points</p>
           ) : (
             <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-black text-sky-500">{finalScore}</span>
                <span className="text-sm text-gray-400 font-medium self-end mb-1">/ {assignment.points} Points</span>
                <span className="ml-4 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wide">Graded</span>
             </div>
           )}
        </div>
        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 font-bold text-gray-600 dark:text-slate-300 transition-colors">
          {viewMode === 'review' ? 'Close Results' : 'Exit'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-gray-50 dark:bg-slate-950">
        <div className="max-w-3xl mx-auto space-y-8">
          {assignment.exercises.map((ex, idx) => {
            const status = viewMode === 'review' ? checkAnswerStatus(ex) : null;
            
            return (
              <div key={ex.id} className={`bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border transition-all ${
                status === 'correct' ? 'border-green-200 dark:border-green-900 ring-1 ring-green-100 dark:ring-green-900/30' :
                status === 'incorrect' ? 'border-red-200 dark:border-red-900 ring-1 ring-red-100 dark:ring-red-900/30' :
                'border-gray-100 dark:border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      status === 'correct' ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' :
                      status === 'incorrect' ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' :
                      'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
                    }`}>
                      {status === 'correct' ? '✓' : status === 'incorrect' ? '✕' : idx + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{ex.type.replace('_', ' ')}</span>
                  </div>
                  {viewMode === 'review' && (
                    <span className={`text-xs font-bold ${
                      status === 'correct' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {status === 'correct' ? `+${ex.points} pts` : `0/${ex.points} pts`}
                    </span>
                  )}
                </div>

                {ex.type === 'multiple_choice' && (
                  <div>
                    <h3 className="text-lg font-bold mb-6 dark:text-slate-100">{ex.content.question}</h3>
                    <div className="space-y-3">
                      {ex.content.options?.map(opt => {
                        const isSelected = answers[ex.id] === opt;
                        const isCorrect = opt === ex.content.correctAnswer;
                        
                        let itemClass = "border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800";
                        if (viewMode === 'attempt') {
                           if (isSelected) itemClass = "border-sky-400 bg-sky-50 dark:bg-sky-900/20 ring-1 ring-sky-400";
                        } else {
                           if (isCorrect) itemClass = "border-green-400 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-400";
                           else if (isSelected && !isCorrect) itemClass = "border-red-400 bg-red-50 dark:bg-red-900/20 ring-1 ring-red-400";
                        }

                        return (
                          <label key={opt} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${itemClass}`}>
                            <input 
                              type="radio" 
                              name={ex.id} 
                              value={opt}
                              disabled={viewMode === 'review'}
                              checked={isSelected}
                              onChange={() => handleInputChange(ex.id, opt)}
                              className="w-5 h-5 text-sky-400 focus:ring-sky-400"
                            />
                            <span className="font-medium text-gray-700 dark:text-slate-200">{opt}</span>
                            {viewMode === 'review' && isCorrect && <span className="ml-auto text-green-500 font-bold text-xs uppercase">Correct Answer</span>}
                            {viewMode === 'review' && isSelected && !isCorrect && <span className="ml-auto text-red-500 font-bold text-xs uppercase">Your Answer</span>}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {ex.type === 'fill_blank' && (
                  <div>
                    <p className="mb-4 text-gray-500 dark:text-slate-400">{ex.instruction}</p>
                    <div className="text-lg leading-loose dark:text-slate-200">
                      {ex.content.textWithBlanks?.split(/(\{\d+\})/).map((part, i) => {
                        if (part.match(/\{\d+\}/)) {
                          const index = parseInt(part.replace(/[{}]/g, '')) - 1;
                          const userVal = (answers[ex.id] as string[])?.[index] || '';
                          const correctVal = (ex.content.correctAnswer as string[])[index];
                          const isCorrect = userVal.toLowerCase().trim() === correctVal.toLowerCase().trim();

                          return (
                            <span key={i} className="inline-flex flex-col mx-2 relative top-3">
                               <input
                                  type="text"
                                  disabled={viewMode === 'review'}
                                  className={`px-3 py-1 border-b-2 bg-transparent focus:outline-none min-w-[100px] text-center font-bold rounded-t transition-colors ${
                                     viewMode === 'review'
                                       ? isCorrect 
                                          ? 'border-green-400 text-green-600 bg-green-50 dark:bg-green-900/20'
                                          : 'border-red-400 text-red-600 bg-red-50 dark:bg-red-900/20'
                                       : 'border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-slate-800 focus:border-sky-500 text-sky-700 dark:text-sky-400'
                                  }`}
                                  placeholder="?"
                                  value={userVal}
                                  onChange={(e) => handleInputChange(ex.id, e.target.value, index)}
                                />
                                {viewMode === 'review' && !isCorrect && (
                                   <span className="text-[10px] text-green-500 font-bold mt-1 text-center bg-green-100 dark:bg-green-900/30 px-1 rounded">
                                      {correctVal}
                                   </span>
                                )}
                            </span>
                          );
                        }
                        return <span key={i}>{part}</span>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {viewMode === 'attempt' && (
            <div className="pt-8 pb-20">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-sky-400 dark:bg-sky-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-sky-200 dark:shadow-none hover:bg-sky-500 dark:hover:bg-sky-600 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? 'Submitting...' : 'Submit & Check Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeworkPlayer;
