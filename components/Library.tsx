
import React, { useState } from 'react';
import { MOCK_BOOKS } from '../constants';

const Library: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Grammar', 'Business', 'Listening', 'Writing'];

  const filteredBooks = filter === 'All' 
    ? MOCK_BOOKS 
    : MOCK_BOOKS.filter(b => b.category === filter);

  return (
    <div className="space-y-8 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-slate-100">Resource Library</h2>
          <p className="text-gray-500 dark:text-slate-400">Download and read high-quality English learning materials.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                filter === cat 
                  ? 'bg-sky-400 text-white' 
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl transition-all group">
            <div className="aspect-[3/4] overflow-hidden relative">
              <img 
                src={book.cover} 
                alt={book.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-[10px] font-bold rounded text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                  {book.category}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-900 dark:text-slate-100 group-hover:text-sky-400 dark:group-hover:text-sky-400 transition-colors line-clamp-1">{book.title}</h3>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">By {book.author}</p>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-3 line-clamp-2 h-10">{book.description}</p>
              <button className="mt-4 w-full py-2 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl font-medium text-sm hover:bg-sky-400 hover:text-white dark:hover:bg-sky-500 transition-all flex items-center justify-center gap-2">
                <span>📖</span> Read Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
