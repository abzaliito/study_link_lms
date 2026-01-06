
import React, { useState, useRef, useEffect } from 'react';
import { generateTutorResponse } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', parts: string }[]>([
    { role: 'model', parts: "Hello! I'm your Study Link AI Tutor. How can I help you improve your English today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', parts: userMsg }]);
    setIsLoading(true);

    const tutorResponse = await generateTutorResponse(userMsg, messages);
    setMessages(prev => [...prev, { role: 'model', parts: tutorResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
      <div className="bg-sky-400 dark:bg-sky-700 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            🤖
          </div>
          <div>
            <h3 className="font-bold">AI Language Tutor</h3>
            <p className="text-xs text-sky-100 dark:text-sky-200 opacity-80">Powered by Gemini 3 Flash</p>
          </div>
        </div>
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Active</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-slate-950/50 transition-colors">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed transition-all ${
              m.role === 'user' 
                ? 'bg-sky-400 dark:bg-sky-500 text-white rounded-tr-none' 
                : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-700 dark:text-slate-200 shadow-sm rounded-tl-none'
            }`}>
              {m.parts}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-300 dark:bg-sky-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-sky-300 dark:bg-sky-500 animate-bounce delay-100"></span>
              <span className="w-2 h-2 rounded-full bg-sky-300 dark:bg-sky-500 animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your question about English..."
            className="w-full pl-4 pr-12 py-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-sky-500 text-sm dark:text-slate-100 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-sky-400 dark:bg-sky-500 text-white rounded-xl flex items-center justify-center hover:bg-sky-500 dark:hover:bg-sky-600 transition-colors disabled:bg-gray-300 dark:disabled:bg-slate-700"
          >
            ✈️
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 dark:text-slate-500 mt-3 uppercase tracking-widest">
          Tip: Ask me to explain the difference between 'Since' and 'For'
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
