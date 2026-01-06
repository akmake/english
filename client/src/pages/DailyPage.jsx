// client/src/pages/DailyPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import WordCard from '@/components/WordCard';
import QuizMode from '@/components/QuizMode';
import api from '@/utils/api';

export default function DailyPage() {
  const [searchParams] = useSearchParams();
  const dayParam = searchParams.get('day') || 1; 
  
  const [dayData, setDayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('study'); // 'study' or 'quiz'
  
  // --- ניהול האינדקס הנוכחי (איזו מילה מציגים) ---
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- שליפת הנתונים מהשרת ---
  useEffect(() => {
    const fetchDayContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data } = await api.get(`/learn/days/${dayParam}`);
        
        const formattedWords = data.words.map(w => ({
          id: w._id,
          english: w.term,
          hebrew: w.translation,
          type: w.level === 'academic' ? 'academic' : 'regular',
          sentence: w.sentenceParts,
          isKnown: false
        }));

        setDayData({
          day: data.dayNumber,
          title: data.title,
          words: formattedWords
        });
        // איפוס לאינדקס 0 בטעינה חדשה
        setCurrentIndex(0);

      } catch (err) {
        console.error("Failed to load day data:", err);
        setError("לא הצלחנו לטעון את התוכן ליום זה. וודא שהרצת את סקריפט הטעינה.");
      } finally {
        setLoading(false);
      }
    };

    fetchDayContent();
  }, [dayParam]);

  // --- פונקציות ניווט ---
  const handleNext = useCallback(() => {
    if (!dayData) return;
    if (currentIndex < dayData.words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, dayData]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // האזנה למקלדת (חצים)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (mode !== 'study') return;
      if (e.key === 'ArrowLeft') handleNext(); // בעברית חץ שמאל זה קדימה
      if (e.key === 'ArrowRight') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, mode]);


  // סימון מילה כ"נלמדה"
  const toggleWordKnown = (id) => {
    if (!dayData) return;
    const newWords = dayData.words.map(word => 
      word.id === id ? { ...word, isKnown: !word.isKnown } : word
    );
    setDayData({ ...dayData, words: newWords });
    
    // אופציונלי: מעבר אוטומטי למילה הבאה כשמסמנים "למדתי"
    // if (!dayData.words[currentIndex].isKnown) {
    //    setTimeout(handleNext, 500); 
    // }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-slate-500">
        <Loader2 size={48} className="animate-spin mb-4 text-indigo-600" />
        <p className="text-xl">טוען את יום {dayParam}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 mt-10 bg-red-50 rounded-xl border border-red-200 text-red-700 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-2">שגיאה</h3>
        <p>{error}</p>
        <Link to="/dashboard" className="mt-4 inline-block text-indigo-600 font-bold hover:underline">
            חזרה ללוח הימים
        </Link>
      </div>
    );
  }

  if (!dayData) return null;

  const knownCount = dayData.words.filter(w => w.isKnown).length;
  const progressPercentage = Math.round((knownCount / dayData.words.length) * 100);
  const currentWord = dayData.words[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 dir-rtl font-sans min-h-screen flex flex-col">
      
      {/* כפתור חזרה */}
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium self-start">
        <ArrowRight size={20} />
        חזרה ללוח הימים
      </Link>

      <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">יום {dayData.day}: {dayData.title}</h1>
            <p className="text-slate-500">מילה {currentIndex + 1} מתוך {dayData.words.length}</p>
          </div>
          <div className="text-left bg-indigo-50 px-4 py-2 rounded-lg">
            <span className="text-2xl font-bold text-indigo-600 block text-center">{progressPercentage}%</span>
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">הושלמו</span>
          </div>
        </div>
        
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex gap-2 mt-6">
          <button 
            onClick={() => setMode('study')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'study' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            📚 מצב למידה
          </button>
          <button 
             onClick={() => setMode('quiz')}
             className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'quiz' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            📝 מבחן ידע
          </button>
        </div>
      </header>

      {/* אזור התוכן המרכזי */}
      <main className="flex-1 flex flex-col items-center">
        {mode === 'study' ? (
          <div className="w-full max-w-xl">
            {/* כרטיס המילה הבודד */}
            <div className="mb-6 transform transition-all duration-300 hover:scale-[1.01]">
              <WordCard 
                key={currentWord.id} 
                wordData={currentWord} 
                onToggleKnown={toggleWordKnown} 
              />
            </div>

            {/* כפתורי ניווט */}
            <div className="flex items-center justify-between gap-4 mt-4">
              <button 
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-4 rounded-xl font-bold shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={24} /> הקודם
              </button>
              
              <span className="text-lg font-bold text-slate-400">
                {currentIndex + 1} / {dayData.words.length}
              </span>

              <button 
                onClick={handleNext}
                disabled={currentIndex === dayData.words.length - 1}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                הבא <ChevronLeft size={24} />
              </button>
            </div>
            
            <p className="text-center text-slate-400 text-sm mt-4">
              טיפ: ניתן להשתמש בחצים במקלדת למעבר בין מילים
            </p>
          </div>
        ) : (
          <div className="w-full">
            <QuizMode 
              words={dayData.words} 
              onBackToStudy={() => setMode('study')} 
            />
          </div>
        )}
      </main>

    </div>
  );
}