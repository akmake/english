import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function QuizGame({ questions = [], onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions || questions.length === 0) return <div className="text-center p-8">אין שאלות זמינות כרגע.</div>;

  const currentQ = questions[currentIndex];

  const handleSelect = (index) => {
    if (isSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setIsSubmitted(true);
    
    if (currentQ.answers[selectedAnswer].isCorrect) {
      setScore(s => s + 1);
      toast.success("תשובה נכונה!", { duration: 1500 });
    } else {
      toast.error("טעות!", { duration: 1500 });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(p => p + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      onComplete(score, questions.length);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100 mt-6">
      {/* כותרת השאלה */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <span className="text-sm font-bold text-slate-500">שאלה {currentIndex + 1} מתוך {questions.length}</span>
        <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {currentQ.type === 'sentence_completion' ? 'השלמת משפטים' : 
           currentQ.type === 'restatement' ? 'ניסוח מחדש' : 'הבנת הנקרא'}
        </span>
      </div>

      {/* תוכן השאלה */}
      <h3 className="text-xl font-medium text-slate-900 mb-8 dir-ltr text-left leading-relaxed font-sans">
        {currentQ.content}
      </h3>

      {/* תשובות */}
      <div className="space-y-3 mb-8 dir-ltr">
        {currentQ.answers.map((ans, idx) => {
          let btnClass = "w-full justify-start text-left text-lg p-4 h-auto border-2 transition-all duration-200 whitespace-normal";
          
          if (isSubmitted) {
            if (ans.isCorrect) {
                btnClass += " bg-green-50 border-green-500 text-green-900"; 
            } else if (selectedAnswer === idx) {
                btnClass += " bg-red-50 border-red-500 text-red-900";
            } else {
                btnClass += " opacity-50 border-slate-100";
            }
          } else if (selectedAnswer === idx) {
            btnClass += " border-indigo-500 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500 shadow-sm";
          } else {
            btnClass += " border-slate-200 hover:border-indigo-200 hover:bg-slate-50";
          }

          return (
            <Button 
              key={idx} 
              variant="ghost" 
              className={btnClass}
              onClick={() => handleSelect(idx)}
            >
              <span className="font-bold mr-3 ml-1 w-6 shrink-0">{idx + 1}.</span> 
              <span className="flex-1">{ans.text}</span>
              {isSubmitted && ans.isCorrect && <CheckCircle className="ml-2 text-green-600 h-6 w-6 shrink-0" />}
              {isSubmitted && !ans.isCorrect && selectedAnswer === idx && <XCircle className="ml-2 text-red-600 h-6 w-6 shrink-0" />}
            </Button>
          );
        })}
      </div>

      {/* הסבר */}
      {isSubmitted && (
        <div className="animate-in fade-in slide-in-from-top-2 mb-6 bg-slate-50 p-4 rounded-lg text-sm text-slate-700 border border-slate-200">
          <strong className="block mb-1 text-slate-900">הסבר:</strong> 
          {currentQ.explanation || "אין הסבר זמין לשאלה זו."}
        </div>
      )}

      {/* כפתור פעולה */}
      <div className="flex justify-end pt-4 border-t">
        {!isSubmitted ? (
          <Button onClick={handleSubmit} disabled={selectedAnswer === null} size="lg" className="w-full md:w-auto">
            בדוק תשובה
          </Button>
        ) : (
          <Button onClick={handleNext} size="lg" className="bg-slate-900 w-full md:w-auto hover:bg-slate-800">
            {currentIndex === questions.length - 1 ? "סיים מבחן" : "לשאלה הבאה"} 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}