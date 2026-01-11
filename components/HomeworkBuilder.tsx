
import React, { useState, useEffect } from 'react';
import { Assignment, Exercise, Group } from '../types';
import { generateExercisesFromContent } from '../services/geminiService';
import { storage } from '../services/storageService';

interface HomeworkBuilderProps {
  onCancel: () => void;
  onSave: (assignment: Assignment) => void;
}

const HomeworkBuilder: React.FC<HomeworkBuilderProps> = ({ onCancel, onSave }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    setGroups(storage.getGroups());
    if (storage.getGroups().length > 0) {
      setGroupId(storage.getGroups()[0].id);
    }
  }, []);

  const handleGenerate = async () => {
    if (!sourceText) return;
    setLoading(true);
    try {
      const generated = await generateExercisesFromContent(sourceText);
      // Add IDs to generated exercises
      const withIds = generated.map((ex: any) => ({
        ...ex,
        id: Math.random().toString(36).substr(2, 9)
      }));
      setExercises(withIds);
      setStep(2);
    } catch (e) {
      alert("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSave = () => {
    const newAssignment: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      dueDate,
      courseId: 'ENG-AI-GEN',
      status: 'PENDING',
      points: exercises.reduce((acc, curr) => acc + curr.points, 0),
      type: 'interactive',
      groupId,
      exercises
    };
    onSave(newAssignment);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-xl transition-colors">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-slate-100">
          {step === 1 ? '1. Content & Generation' : '2. Review & Publish'}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Assignment Title</label>
              <input 
                value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border dark:border-slate-700 bg-gray-50 dark:bg-slate-800 dark:text-white"
                placeholder="e.g. Present Perfect Practice"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Assign to Group</label>
              <select 
                value={groupId} onChange={e => setGroupId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border dark:border-slate-700 bg-gray-50 dark:bg-slate-800 dark:text-white"
              >
                {groups.map(g => <option key={g.id} value={g.id}>{g.name} ({g.level})</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Description</label>
            <input 
              value={description} onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border dark:border-slate-700 bg-gray-50 dark:bg-slate-800 dark:text-white"
              placeholder="Instructions for students..."
            />
          </div>

          <div className="bg-sky-50 dark:bg-sky-900/20 p-6 rounded-2xl border border-sky-100 dark:border-sky-800">
            <label className="block text-sm font-bold text-sky-700 dark:text-sky-300 mb-2">
              ✨ AI Content Generator
            </label>
            <textarea 
              value={sourceText} onChange={e => setSourceText(e.target.value)}
              className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white mb-4"
              placeholder="Paste a paragraph from a book, an article, or a story here. The AI will create exercises from it."
            />
            <button 
              onClick={handleGenerate}
              disabled={loading || !sourceText}
              className="w-full py-3 bg-sky-400 text-white font-bold rounded-xl hover:bg-sky-500 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-xl">⟳</span> Generating Exercises...
                </>
              ) : (
                <>Generate Interactive Exercises ⚡</>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
            {exercises.map((ex, idx) => (
              <div key={ex.id} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-gray-400">Question {idx + 1} • {ex.type}</span>
                  <span className="text-xs font-bold text-sky-500">{ex.points} pts</span>
                </div>
                {ex.type === 'multiple_choice' ? (
                  <div>
                    <p className="font-bold mb-2 dark:text-white">{ex.content.question}</p>
                    <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-slate-300">
                      {ex.content.options?.map(opt => (
                        <li key={opt} className={opt === ex.content.correctAnswer ? 'text-green-500 font-bold' : ''}>
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold mb-2 dark:text-white">{ex.instruction}</p>
                    <p className="text-sm bg-white dark:bg-slate-900 p-2 rounded border dark:border-slate-700 font-mono">
                      {ex.content.textWithBlanks}
                    </p>
                    <p className="text-xs text-green-500 mt-2">Answers: {Array.isArray(ex.content.correctAnswer) ? ex.content.correctAnswer.join(', ') : ex.content.correctAnswer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-slate-800">
            <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Due Date</label>
                <input 
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white"
                />
            </div>
            <div className="flex gap-3 items-end">
                <button 
                onClick={() => setStep(1)}
                className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                Back
                </button>
                <button 
                onClick={handleFinalSave}
                className="flex-1 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
                >
                Publish Assignment
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeworkBuilder;
