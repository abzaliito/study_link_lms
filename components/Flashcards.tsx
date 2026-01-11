
import React, { useState } from 'react';
import { User } from '../types';

interface FlashcardsProps {
  user: User;
}

const Flashcards: React.FC<FlashcardsProps> = ({ user }) => {
  // Using an index-based flip state tracker
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // Mock data that could eventually come from an API based on user.level
  const words = [
    { 
      id: 1, 
      word: 'Ubiquitous', 
      translation: 'Вездесущий', 
      pronunciation: '/juːˈbɪkwɪtəs/',
      example: 'Smartphones have become ubiquitous in modern society.',
      image: 'https://picsum.photos/seed/tech/400/300' 
    },
    { 
      id: 2, 
      word: 'Serendipity', 
      translation: 'Интуитивная прозорливость', 
      pronunciation: '/ˌsɛrənˈdɪpɪti/',
      example: 'It was pure serendipity that we met at the coffee shop.',
      image: 'https://picsum.photos/seed/happy/400/300' 
    },
    { 
      id: 3, 
      word: 'Ephemeral', 
      translation: 'Мимолетный', 
      pronunciation: '/ɪˈfɛmərəl/',
      example: 'Fashions are ephemeral, changing with every season.',
      image: 'https://picsum.photos/seed/time/400/300' 
    },
    { 
      id: 4, 
      word: 'Resilient', 
      translation: 'Устойчивый', 
      pronunciation: '/rɪˈzɪlɪənt/',
      example: 'The local economy is remarkably resilient.',
      image: 'https://picsum.photos/seed/strong/400/300' 
    },
    { 
      id: 5, 
      word: 'Meticulous', 
      translation: 'Тщательный', 
      pronunciation: '/mɪˈtɪkjʊləs/',
      example: 'He described the scene in meticulous detail.',
      image: 'https://picsum.photos/seed/work/400/300' 
    },
    { 
      id: 6, 
      word: 'Eloquent', 
      translation: 'Красноречивый', 
      pronunciation: '/ˈɛləkwənt/',
      example: 'She made an eloquent appeal for action.',
      image: 'https://picsum.photos/seed/speak/400/300' 
    }
  ];

  const toggleFlip = (id: number) => {
    setFlippedCards(prev => 
      prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold dark:text-slate-100">Vocabulary Flashcards</h2>
        <p className="text-gray-500 dark:text-slate-400">
          Level {user.level || 'B2'}: Master these words to advance to the next level.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {words.map((card) => (
          <div 
            key={card.id} 
            className="group h-80 w-full [perspective:1000px] cursor-pointer"
            onClick={() => toggleFlip(card.id)}
          >
            <div className={`relative h-full w-full rounded-2xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] ${flippedCards.includes(card.id) ? '[transform:rotateY(180deg)]' : ''}`}>
              
              {/* Front of Card */}
              <div className="absolute inset-0 h-full w-full rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 [backface-visibility:hidden] overflow-hidden flex flex-col">
                <div className="h-48 overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 flex items-end p-4">
                      <span className="text-white font-bold text-2xl tracking-wide">{card.word}</span>
                   </div>
                   <img 
                    src={card.image} 
                    alt={card.word} 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                   />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Tap to see meaning</p>
                  <p className="text-xs text-sky-400 font-mono border border-sky-100 dark:border-sky-900 px-2 py-1 rounded-md">{card.pronunciation}</p>
                </div>
              </div>

              {/* Back of Card */}
              <div className="absolute inset-0 h-full w-full rounded-2xl bg-sky-50 dark:bg-slate-800 border-2 border-sky-200 dark:border-sky-900 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center p-6 text-center">
                <p className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-2">Translation</p>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-6">{card.translation}</h3>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl w-full">
                  <p className="text-xs text-gray-400 dark:text-slate-500 mb-1 italic">Example:</p>
                  <p className="text-sm text-gray-700 dark:text-slate-300">"{card.example}"</p>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center pt-8">
        <button className="px-8 py-3 bg-sky-400 text-white rounded-xl font-bold hover:bg-sky-500 transition-colors shadow-lg shadow-sky-200 dark:shadow-none">
            Load More Words
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
