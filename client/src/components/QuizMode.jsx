// src/components/QuizMode.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function QuizMode({ words, onBackToStudy }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // כדי להראות אם צדק או טעה רגעית

  // פונקציה שמערבבת מערך (Fisher-Yates Shuffle)
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    // 1. ניקח רק מילים שסומנו כ"ידועות"
    const learnedWords = words.filter(w => w.isKnown);

    if (learnedWords.length === 0) return;

    // 2. נבנה לכל מילה שאלה
    const generatedQuestions = learnedWords.map(targetWord => {
      // נבחר 3 מסיחים (תשובות לא נכונות) מתוך שאר המילים במאגר (לא רק מאלו שנלמדו, כדי להקשות)
      const otherWords = words.filter(w => w.id !== targetWord.id);
      const shuffledOthers = shuffleArray([...otherWords]);
      const wrongAnswers = shuffledOthers.slice(0, 3).map(w => w.hebrew);
      
      // נערבב את התשובה הנכונה עם השגויות
      const allOptions = shuffleArray([targetWord.hebrew, ...wrongAnswers]);

      return {
        word: targetWord.english,
        correctAnswer: targetWord.hebrew,
        options: allOptions
      };
    });

    // 3. נערבב את סדר השאלות
    setQuestions(shuffleArray(generatedQuestions));
  }, [words]);

  const handleAnswerClick = (option) => {
    if (selectedAnswer) return; // מניעת לחיצה כפולה

    setSelectedAnswer(option);
    const isCorrect = option === questions[currentIndex].correctAnswer;

    if (isCorrect) {
      setScore(s => s + 1);
    }

    // המתנה קצרה ומעבר לשאלה הבאה
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(curr => curr + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000); // מחכים שנייה כדי שהמשתמש יראה אם צדק
  };

  // אם אין מילים שנלמדו
  const learnedCount = words.filter(w => w.isKnown).length;
  if (learnedCount === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-700 mb-2">עוד לא למדת מילים!</h3>
        <p className="text-slate-500 mb-4">סמן מילים כ"למדתי" במצב הלמידה כדי להתחיל מבחן.</p>
        <button onClick={onBackToStudy} className="text-indigo-600 font-bold hover:underline">
          חזור ללמידה
        </button>
      </div>
    );
  }

  // מסך סיכום
  if (showResult) {
    return (
      <div className="text-center p-10 bg-white rounded-xl border border-slate-200 shadow-sm animate-in fade-in zoom-in duration-300">
        <div className="mb-4 flex justify-center">
            {score === questions.length ? 
                <CheckCircle2 size={64} className="text-green-500" /> : 
                <RefreshCw size={64} className="text-indigo-500" />
            }
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">המבחן הסתיים!</h2>
        <p className="text-xl text-slate-600 mb-6">
          ענית נכון על <span className="font-bold text-indigo-600">{score}</span> מתוך <span className="font-bold text-indigo-600">{questions.length}</span>
        </p>
        <button 
          onClick={onBackToStudy}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
        >
          חזור ללמידה
        </button>
      </div>
    );
  }

  // מסך שאלה פעיל
  if (questions.length === 0) return <div>טוען מבחן...</div>;

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-xl mx-auto">
      {/* סרגל התקדמות */}
      <div className="mb-6 flex justify-between text-slate-500 text-sm font-bold">
        <span>שאלה {currentIndex + 1} מתוך {questions.length}</span>
        <span>ניקוד: {score}</span>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center">
        <h3 className="text-sm text-slate-400 font-bold uppercase mb-2">תרגם את המילה:</h3>
        <h2 className="text-4xl font-bold text-slate-800 mb-8">{currentQ.word}</h2>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            // חישוב צבע הכפתור אחרי לחיצה
            let btnClass = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200";
            
            if (selectedAnswer) {
              if (option === currentQ.correctAnswer) {
                btnClass = "bg-green-100 border-green-500 text-green-800"; // תשובה נכונה תמיד ירוקה
              } else if (option === selectedAnswer && option !== currentQ.correctAnswer) {
                btnClass = "bg-red-100 border-red-500 text-red-800"; // אם בחרת טעות - אדום
              } else {
                btnClass = "opacity-50"; // כל השאר דהויים
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswerClick(option)}
                disabled={!!selectedAnswer}
                className={`w-full p-4 rounded-xl border-2 text-lg font-medium transition-all duration-200 ${btnClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
      
      <button onClick={onBackToStudy} className="mt-8 flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 mx-auto">
        <ArrowLeft size={20} /> חזרה ללמידה (יפסיק את המבחן)
      </button>
    </div>
  );
}