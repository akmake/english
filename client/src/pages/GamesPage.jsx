import React, { useState } from 'react';
import { Gamepad2, Brain, Puzzle } from 'lucide-react';
import WordMatchGame from '../components/games/WordMatchGame';

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState(null);

  // רשימת המשחקים (קל להוסיף לפה עוד בהמשך)
  const games = [
    {
      id: 'match',
      title: 'Word Match',
      description: 'מצא את הזוגות: התאם בין המילה באנגלית לתרגום שלה.',
      icon: <Puzzle className="w-8 h-8 text-indigo-500" />,
      color: 'bg-indigo-50'
    },
    // מקום למשחקים עתידיים כמו:
    // { id: 'scramble', title: 'סדר את המשפט', ... }
    // { id: 'hangman', title: 'איש תלוי', ... }
  ];

  if (activeGame === 'match') {
    return <WordMatchGame onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Gamepad2 className="w-10 h-10 text-indigo-600" />
          אזור המשחקים
        </h1>
        <p className="text-slate-500 mt-2">בחר משחק כדי לשפר את האנגלית שלך בכיף.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div 
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className={`${game.color} border border-slate-200 p-6 rounded-2xl cursor-pointer transition-all hover:shadow-xl hover:scale-105 active:scale-95 group`}
          >
            <div className="mb-4 bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">
              {game.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{game.title}</h3>
            <p className="text-slate-600">{game.description}</p>
          </div>
        ))}

        {/* כרטיס "בקרוב" שיראה שיש עוד למה לחכות */}
        <div className="border border-dashed border-slate-300 p-6 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
          <Brain className="w-10 h-10 mb-2 opacity-50" />
          <span className="font-semibold">משחקים נוספים בקרוב...</span>
        </div>
      </div>
    </div>
  );
}