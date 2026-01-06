// src/components/WordCard.jsx
import React from 'react';
import { Volume2, CheckCircle2, Circle } from 'lucide-react';
import MagicSentence from "./MagicReader";

export default function WordCard({ wordData, onToggleKnown }) {
  
  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(wordData.english);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`p-5 rounded-xl border transition-all duration-300 ${wordData.isKnown ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 shadow-sm'}`}>
      
      {/* כותרת הכרטיס: המילה והסוג שלה */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${wordData.type === 'academic' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
            {wordData.type === 'academic' ? 'אקדמי' : 'רגיל'}
          </span>
          <h3 className="text-2xl font-bold text-slate-800 mt-2">{wordData.english}</h3>
          <p className="text-slate-500 text-lg">{wordData.hebrew}</p>
        </div>

        {/* כפתור שמע */}
        <button onClick={playAudio} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors">
          <Volume2 size={24} />
        </button>
      </div>

      {/* המשפט הקסום */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
        <MagicSentence sentenceParts={wordData.sentence} />
      </div>

      {/* כפתור סימון "למדתי" */}
      <button 
        onClick={() => onToggleKnown(wordData.id)}
        className="flex items-center gap-2 w-full justify-center p-2 rounded-lg border transition-all hover:bg-slate-50"
      >
        {wordData.isKnown ? (
          <>
            <CheckCircle2 className="text-green-600" />
            <span className="text-green-700 font-bold">למדתי!</span>
          </>
        ) : (
          <>
            <Circle className="text-slate-400" />
            <span className="text-slate-500">סימון שנלמד</span>
          </>
        )}
      </button>
    </div>
  );
}