import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { toast } from 'react-hot-toast';

export default function FlashcardGame({ words = [], onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  if (!words || words.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-xl border border-slate-200 shadow-sm mt-8">
        <h3 className="text-xl font-bold mb-2">אין מילים לחזרה כרגע! 🎉</h3>
        <p className="text-gray-500 mb-6">כל הכבוד, סיימת את כל החזרות להיום.</p>
        <Button onClick={onComplete}>חזור לתפריט</Button>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  const handleResult = async (success) => {
    try {
      await api.post('/learn/submit-result', { 
        wordId: currentWord._id, 
        success 
      });

      if (currentIndex < words.length - 1) {
        setIsFlipped(false);
        // השהייה קצרה לפני המעבר כדי שהאנימציה תהיה חלקה
        setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
      } else {
        toast.success("סיימת את האימון!");
        onComplete();
      }
    } catch (err) {
      console.error(err);
      toast.error("שגיאה בשמירת התוצאה");
    }
  };

  return (
    <div className="max-w-md mx-auto perspective-1000 mt-8">
      <div className="mb-4 flex justify-between text-sm text-gray-500 font-bold px-1">
        <span>מילה {currentIndex + 1} מתוך {words.length}</span>
        <span>רמה {currentWord.box || 1}</span>
      </div>

      <div 
        className="relative h-72 w-full cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: "1000px" }}
      >
        <motion.div
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, animationDirection: "normal" }}
          className="w-full h-full relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* צד קדמי - אנגלית */}
          <div className="absolute inset-0 bg-white border-2 border-indigo-100 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: "hidden" }}>
            <h2 className="text-4xl font-extrabold text-slate-800 mb-2">{currentWord.term}</h2>
            <p className="text-slate-400 text-sm mt-4">הקש כדי להפוך</p>
          </div>

          {/* צד אחורי - עברית והגדרה */}
          <div className="absolute inset-0 bg-indigo-50 border-2 border-indigo-200 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
            <h2 className="text-3xl font-bold text-indigo-700 mb-3">{currentWord.translation}</h2>
            <p className="text-slate-700 text-center text-lg leading-relaxed dir-ltr">{currentWord.definition}</p>
            {currentWord.exampleSentence && (
               <p className="mt-6 text-sm text-slate-500 italic bg-white/50 px-2 py-1 rounded">"{currentWord.exampleSentence}"</p>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isFlipped && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 mt-8 justify-center"
          >
            <Button 
              onClick={(e) => { e.stopPropagation(); handleResult(false); }}
              variant="destructive"
              className="w-32 h-14 text-lg rounded-xl shadow-lg"
            >
              <X className="mr-2" /> לא ידעתי
            </Button>
            <Button 
              onClick={(e) => { e.stopPropagation(); handleResult(true); }}
              className="w-32 h-14 text-lg bg-green-600 hover:bg-green-700 rounded-xl shadow-lg"
            >
              <Check className="mr-2" /> ידעתי!
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}