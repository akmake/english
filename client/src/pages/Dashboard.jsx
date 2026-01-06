// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Lock, BookOpen } from 'lucide-react';

export default function Dashboard() {
  // ניצור מערך של 30 ימים באופן אוטומטי
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="max-w-5xl mx-auto p-6 dir-rtl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">מסע ה-30 יום לאמירנט</h1>
        <p className="text-slate-500 text-lg">בחר יום כדי להתחיל ללמוד מילים חדשות</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {days.map((day) => {
          const isUnlocked = day === 1; // כרגע רק יום 1 פתוח

          return isUnlocked ? (
            <Link 
              key={day} 
              to="/daily" 
              className="group relative bg-white border-2 border-indigo-100 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <span className="font-bold text-slate-700 text-lg">יום {day}</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">פתוח</span>
            </Link>
          ) : (
            <div 
              key={day} 
              className="relative bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 opacity-60 cursor-not-allowed"
            >
              <div className="bg-slate-200 p-3 rounded-full text-slate-400">
                <Lock size={24} />
              </div>
              <span className="font-bold text-slate-400 text-lg">יום {day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}