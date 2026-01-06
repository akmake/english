import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import { BookOpen, PlayCircle, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const { data } = await api.get('/learn/days');
        setDays(data);
      } catch (err) {
        console.error("Error fetching days:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDays();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8 dir-rtl font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
           <h1 className="text-4xl font-black text-slate-800 mb-2">מסלול הלמידה שלך</h1>
           <p className="text-slate-500 text-lg">בחר כרטיסייה והתחל ללמוד. כל המאגר פתוח עבורך.</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {days.map((day) => (
            <div 
              key={day._id}
              // --- התיקון החשוב: שימוש בסימן שאלה כדי למנוע 404 ---
              onClick={() => navigate(`/daily?day=${day.dayNumber}`)}
              className="group cursor-pointer bg-white rounded-[2rem] p-8 shadow-sm border-2 border-transparent hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <BookOpen size={28} />
                </div>
                <div className="text-slate-300 font-black text-4xl opacity-20 italic">
                  {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-3">יום {day.dayNumber}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                {day.title || 'לחץ כאן כדי ללמוד את אוצר המילים והביטויים של כרטיסייה זו.'}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-indigo-600 font-bold">
                  <span className="ml-2">כנס לתרגול</span>
                  <PlayCircle size={20} className="group-hover:translate-x-[-5px] transition-transform" />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                   30 מילים
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}