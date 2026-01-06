// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 bg-slate-50">
      
      <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
        ברוכים הבאים ל-<span className="text-indigo-600">Amirnet</span>
      </h1>
      
      <p className="text-xl text-slate-600 mb-10 max-w-2xl">
        המערכת ללימוד אוצר מילים באנגלית. 30 ימים של למידה ומבחנים בדרך להצלחה.
      </p>

      {/* --- זה הכפתור שחסר לך! --- */}
      <Link 
        to="/dashboard" 
        className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-xl hover:bg-indigo-700 hover:scale-105 transition-all"
      >
        <BookOpen size={24} />
        התחל את המסע (לוח ימים)
      </Link>

    </div>
  );
}