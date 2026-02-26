import React, { useState, useEffect } from 'react';
import { RefreshCw, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button'; // וודא שהנתיב תואם לפרויקט שלך
import confetti from 'canvas-confetti';

// מאגר מילים לדוגמה (בהמשך נביא את זה מהשרת שלך)
const WORD_PAIRS = [
  { id: 1, english: 'Ambiguous', hebrew: 'דו משמעי' },
  { id: 2, english: 'Reluctant', hebrew: 'הססן' },
  { id: 3, english: 'Inevitable', hebrew: 'בלתי נמנע' },
  { id: 4, english: 'To Comprehend', hebrew: 'להבין' },
  { id: 5, english: 'Obsolete', hebrew: 'מיושן' },
  { id: 6, english: 'Sustainable', hebrew: 'בר קיימא' },
];

export default function WordMatchGame({ onBack }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // אתחול המשחק
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // יצירת חפיסת קלפים כפולה וערבוב
    const deck = [...WORD_PAIRS, ...WORD_PAIRS].map((item, index) => ({
      uniqueId: index, // מזהה ייחודי לכרטיס בלוח
      pairId: item.id, // מזהה של הצמד (כדי לדעת אם יש התאמה)
      content: index < WORD_PAIRS.length ? item.english : item.hebrew, // חצי אנגלית, חצי עברית
      lang: index < WORD_PAIRS.length ? 'en' : 'he'
    }));
    
    // ערבוב פישר-ייטס
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsWon(false);
    setIsProcessing(false);
  };

  const handleCardClick = (uniqueId) => {
    // מניעת לחיצה אם: המשחק נגמר, כבר לחוץ, כבר מותאם, או המחשב בודק כרגע
    if (isProcessing || flipped.includes(uniqueId) || matched.includes(uniqueId) || isWon) return;

    const newFlipped = [...flipped, uniqueId];
    setFlipped(newFlipped);

    // אם נבחרו שני קלפים
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setIsProcessing(true);
      
      const card1 = cards.find(c => c.uniqueId === newFlipped[0]);
      const card2 = cards.find(c => c.uniqueId === newFlipped[1]);

      if (card1.pairId === card2.pairId) {
        // התאמה מוצלחת!
        setMatched(prev => [...prev, newFlipped[0], newFlipped[1]]);
        setFlipped([]);
        setIsProcessing(false);

        // בדיקת ניצחון
        if (matched.length + 2 === cards.length) {
          handleWin();
        }
      } else {
        // אין התאמה - הופך חזרה אחרי שנייה
        setTimeout(() => {
          setFlipped([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  const handleWin = () => {
    setIsWon(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* כותרת עליונה */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
           חזרה <ArrowRight size={16} />
        </Button>
        <div className="text-xl font-bold text-slate-700">
          מהלכים: {moves}
        </div>
        <Button onClick={initializeGame} variant="outline" size="sm" className="gap-2">
          <RefreshCw size={16} /> ערבב מחדש
        </Button>
      </div>

      {/* מסך ניצחון */}
      {isWon && (
        <div className="mb-8 p-6 bg-green-100 border border-green-300 rounded-xl text-center animate-in zoom-in duration-300">
          <Trophy className="mx-auto text-yellow-500 w-16 h-16 mb-2" />
          <h2 className="text-2xl font-bold text-green-800">כל הכבוד! סיימת את המשחק!</h2>
          <p className="text-green-700">השלמת את האתגר ב-{moves} מהלכים.</p>
          <Button onClick={initializeGame} className="mt-4 bg-green-600 hover:bg-green-700 text-white">
            שחק שוב
          </Button>
        </div>
      )}

      {/* לוח המשחק */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.uniqueId);
          const isMatched = matched.includes(card.uniqueId);

          return (
            <div
              key={card.uniqueId}
              onClick={() => handleCardClick(card.uniqueId)}
              className={`
                aspect-[4/3] rounded-xl cursor-pointer perspective-1000 transition-all duration-300 transform
                flex items-center justify-center text-lg font-bold shadow-sm select-none
                ${isMatched 
                  ? 'bg-green-500 text-white scale-95 opacity-80 cursor-default' 
                  : isFlipped 
                    ? 'bg-indigo-600 text-white rotate-y-180' 
                    : 'bg-white hover:bg-slate-100 border-2 border-slate-200 text-slate-400'}
              `}
            >
              {(isFlipped || isMatched) ? (
                <span className={card.lang === 'en' ? 'font-sans' : 'font-assistant'}>
                  {card.content}
                </span>
              ) : (
                <span className="text-3xl text-slate-200">?</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}