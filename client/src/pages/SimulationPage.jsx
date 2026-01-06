import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import { Button } from '@/components/ui/Button'; 
import { Loader2, Clock, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { toast } from 'react-hot-toast';

// --- קומפוננטת עזר: טיימר ---
const ExamTimer = ({ onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 דקות

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`flex items-center gap-2 text-xl font-mono font-bold ${timeLeft < 180 ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
      <Clock size={24} />
      {formatTime(timeLeft)}
    </div>
  );
};

// --- הדף הראשי ---
export default function SimulationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data Pool
  const [examPool, setExamPool] = useState(null);
  const [config, setConfig] = useState(null);

  // State משחק
  const [gameState, setGameState] = useState('intro'); // intro, playing, finished
  const [currentSection, setCurrentSection] = useState('sentence_completion'); // sentence_completion, restatement, reading_comprehension
  
  // משתנים אדפטיביים
  const [currentLevel, setCurrentLevel] = useState(2); // מתחילים מבינוני
  const [questionsAnsweredInSection, setQuestionsAnsweredInSection] = useState(0);
  const [history, setHistory] = useState([]); // שומר את כל התשובות לחישוב ציון בסוף
  
  // השאלה הנוכחית להצגה
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentPassage, setCurrentPassage] = useState(null); // רק להבנת הנקרא

  // טעינת המאגר מהשרת
  useEffect(() => {
    const fetchAdaptivePool = async () => {
      try {
        const { data } = await api.get('/learn/simulation/adaptive');
        setExamPool(data.pool);
        setConfig(data.config);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("לא הצלחנו לטעון את המאגר. וודא שהשרת רץ והרצת את ה-Seed.");
        setLoading(false);
      }
    };
    fetchAdaptivePool();
  }, []);

  // --- המנוע האדפטיבי: בחירת השאלה הבאה ---
  const pickNextQuestion = (section, level) => {
    if (!examPool) return;

    // הגנה על גבולות הרמה (1-3)
    let safeLevel = level;
    if (safeLevel < 1) safeLevel = 1;
    if (safeLevel > 3) safeLevel = 3;

    // לוגיקה שונה להבנת הנקרא (בוחרים קטע שלם, לא שאלה בודדת)
    if (section === 'reading_comprehension') {
        // אם אנחנו כבר בתוך קטע קריאה ויש עוד שאלות בקטע הזה - נמשיך איתן
        // אבל כאן נניח שאנחנו בוחרים קטע חדש
        const passagesAtLevel = examPool.reading_comprehension[safeLevel];
        
        // בוחרים קטע רנדומלי שעדיין לא עשינו (בפשטות כאן ניקח רנדומלי)
        const randomBlock = passagesAtLevel[Math.floor(Math.random() * passagesAtLevel.length)];
        
        if (!randomBlock) {
             // אם נגמרו הקטעים ברמה הזו, ננסה רמה אחרת (fallback)
             return pickNextQuestion(section, safeLevel === 3 ? 2 : 3);
        }
        
        setCurrentPassage(randomBlock.passage);
        // נתחיל מהשאלה הראשונה בקטע
        setCurrentQuestion({ 
            ...randomBlock.questions[0], 
            _allQuestionsInPassage: randomBlock.questions, // שומרים את שאר השאלות בצד
            _qIndexInPassage: 0 
        });
    } 
    else {
        // חלקים רגילים (SC, Restatement)
        const poolAtLevel = examPool[section][safeLevel];
        // סינון שאלות שכבר ענינו עליהן (לפי ההיסטוריה)
        const usedIds = new Set(history.map(h => h.questionId));
        const available = poolAtLevel.filter(q => !usedIds.has(q._id));

        if (available.length === 0) {
            // אם נגמרו השאלות ברמה הזו (נדיר עם 45 שאלות), נחפש ברמה אחרת
             const fallbackPool = examPool[section][safeLevel === 2 ? 1 : 2];
             const fallbackQ = fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
             setCurrentQuestion(fallbackQ);
        } else {
            const randomQ = available[Math.floor(Math.random() * available.length)];
            setCurrentQuestion(randomQ);
        }
    }
    
    setCurrentLevel(safeLevel);
  };

  // --- התחלת המבחן ---
  const startExam = () => {
    setGameState('playing');
    // מתחילים: חלק ראשון, רמה 2
    pickNextQuestion('sentence_completion', 2);
  };

  // --- טיפול בתשובה ---
  const handleAnswer = (answerIndex) => {
    const isCorrect = currentQuestion.answers[answerIndex].isCorrect;
    
    // 1. שמירת ההיסטוריה
    const newHistory = [...history, {
        questionId: currentQuestion._id,
        section: currentSection,
        level: currentLevel,
        isCorrect
    }];
    setHistory(newHistory);

    // 2. חישוב הרמה הבאה (לוגיקה אדפטיבית)
    let nextLevel = currentLevel;
    if (currentSection !== 'reading_comprehension') {
        // בשאלות בודדות: צדקת? עלית. טעית? ירדת.
        if (isCorrect) nextLevel++;
        else nextLevel--;
    } 
    // הערה: בהבנת הנקרא הרמה נקבעת פר קטע, לא פר שאלה, אז לא משנים באמצע קטע

    // 3. בדיקה אם עוברים שאלה או חלק
    const answeredInThisSection = questionsAnsweredInSection + 1;
    setQuestionsAnsweredInSection(answeredInThisSection);

    // --- לוגיקת מעבר בין חלקים ---
    
    // א. האם סיימנו Sentence Completion?
    if (currentSection === 'sentence_completion') {
        if (answeredInThisSection >= config.sentence_completion_count) {
            // עוברים ל-Restatement
            toast.success("סיימת את פרק השלמת משפטים!");
            setCurrentSection('restatement');
            setQuestionsAnsweredInSection(0);
            // מתחילים את החלק הבא ברמה שנגזרת מהביצועים האחרונים (אבל בגבולות הסביר)
            pickNextQuestion('restatement', nextLevel > 3 ? 3 : (nextLevel < 1 ? 1 : nextLevel));
        } else {
            // ממשיכים באותו חלק
            pickNextQuestion('sentence_completion', nextLevel);
        }
    }
    // ב. האם סיימנו Restatement?
    else if (currentSection === 'restatement') {
        if (answeredInThisSection >= config.restatement_count) {
            // עוברים ל-Reading Comprehension
            toast.success("סיימת את פרק ניסוח מחדש!");
            setCurrentSection('reading_comprehension');
            setQuestionsAnsweredInSection(0);
            
            // חישוב ממוצע הצלחות כדי לקבוע רמת טקסט ראשונה
            const correctCount = newHistory.filter(h => h.isCorrect).length;
            const avgLevel = correctCount > (newHistory.length / 2) ? 3 : 2; // פשטני לצורך הדוגמה
            pickNextQuestion('reading_comprehension', avgLevel);
        } else {
            pickNextQuestion('restatement', nextLevel);
        }
    }
    // ג. טיפול בהבנת הנקרא
    else if (currentSection === 'reading_comprehension') {
        // האם יש עוד שאלות בקטע הנוכחי?
        const qIndex = currentQuestion._qIndexInPassage;
        const allQs = currentQuestion._allQuestionsInPassage;
        
        if (qIndex < allQs.length - 1) {
            // הצגת השאלה הבאה מאותו קטע
            setCurrentQuestion({
                ...allQs[qIndex + 1],
                _allQuestionsInPassage: allQs,
                _qIndexInPassage: qIndex + 1
            });
        } else {
            // נגמר הקטע. האם צריך עוד קטע?
            // (אנחנו סופרים כאן "בלוקים" של טקסטים, לא שאלות בודדות ב-answeredInThisSection)
            // לצורך הדוגמה: נניח שעושים 2 קטעים
            const passagesDone = Math.floor(answeredInThisSection / 5); // הערכה גסה
            
            if (answeredInThisSection >= (config.reading_passages_count * 5)) { // 2 טקסטים * 5 שאלות
                finishExam();
            } else {
                toast("טקסט הבא...", { icon: '📖' });
                // בחירת טקסט חדש (אולי ברמה אחרת אם המשתמש הלך מצוין)
                pickNextQuestion('reading_comprehension', isCorrect ? 3 : 2); 
            }
        }
    }
  };

  const finishExam = () => {
    setGameState('finished');
  };

  // --- UI ---

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      <div className="text-slate-600 font-medium">טוען את המנוע האדפטיבי...</div>
    </div>
  );

  if (error) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-4">
      <AlertCircle className="w-16 h-16 text-red-500" />
      <div className="text-red-600 font-bold text-xl">{error}</div>
      <Button onClick={() => navigate('/dashboard')}>חזור</Button>
    </div>
  );

  // מסך פתיחה
  if (gameState === 'intro') {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 dir-rtl">
              <div className="bg-white max-w-2xl w-full p-10 rounded-3xl shadow-xl text-center">
                  <h1 className="text-4xl font-black text-slate-800 mb-4">סימולציית אמירנ"ט מלאה</h1>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                      זהו מבחן אדפטיבי. המערכת תזהה את הרמה שלך בזמן אמת. <br/>
                      אם תצדק - השאלות יהפכו קשות יותר. אם תטעה - הן יהיו קלות יותר.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-10 text-right">
                      <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                          <div className="font-bold text-indigo-900">השלמת משפטים</div>
                          <div className="text-sm text-indigo-700">כ-11 שאלות</div>
                      </div>
                      <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                          <div className="font-bold text-indigo-900">ניסוח מחדש</div>
                          <div className="text-sm text-indigo-700">כ-8 שאלות</div>
                      </div>
                      <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                          <div className="font-bold text-indigo-900">הבנת הנקרא</div>
                          <div className="text-sm text-indigo-700">2 קטעים</div>
                      </div>
                  </div>

                  <Button size="xl" onClick={startExam} className="w-full text-xl py-8 shadow-indigo-200 shadow-lg hover:shadow-xl transition-all">
                      <Play className="ml-2 w-6 h-6" />
                      התחל מבחן
                  </Button>
              </div>
          </div>
      )
  }

  // מסך סיום
  if (gameState === 'finished') {
      // חישוב ציון מהיר
      const correct = history.filter(h => h.isCorrect).length;
      const total = history.length;
      const rawScore = Math.round((correct / total) * 100) + 50; // נוסחה בסיסית

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center dir-rtl">
            <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full">
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-slate-800 mb-2">המבחן הושלם!</h2>
                <div className="text-8xl font-black text-indigo-600 my-8">{rawScore}</div>
                <p className="text-slate-500 mb-8">ציון אמירנט מוערך (טווח 50-150)</p>
                <div className="flex justify-between text-sm text-slate-400 font-mono bg-slate-100 p-4 rounded-xl mb-8">
                    <span>תשובות נכונות: {correct}</span>
                    <span>סך שאלות: {total}</span>
                </div>
                <Button onClick={() => navigate('/dashboard')} className="w-full">חזור ללוח הבקרה</Button>
            </div>
        </div>
      );
  }

  // --- מסך משחק פעיל ---
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0 dir-rtl shadow-sm z-10">
        <div className="flex items-center gap-4">
             <span className="font-bold text-lg text-slate-800">Amirnet Adaptive</span>
             <span className="bg-slate-100 px-3 py-1 rounded text-xs font-bold text-slate-500">
                 {currentSection === 'sentence_completion' && 'השלמת משפטים'}
                 {currentSection === 'restatement' && 'ניסוח מחדש'}
                 {currentSection === 'reading_comprehension' && 'הבנת הנקרא'}
             </span>
        </div>
        <div className="flex items-center gap-6">
            <div className="hidden md:block text-xs font-mono text-slate-300">Level: {currentLevel}</div>
            <ExamTimer onTimeUp={finishExam} />
            <Button variant="ghost" size="sm" onClick={() => {if(confirm('לצאת?')) navigate('/dashboard')}}>יציאה</Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
         {currentSection === 'reading_comprehension' ? (
             // --- תצוגת הבנת הנקרא (Split View) ---
             <div className="flex w-full h-full">
                 {/* צד שמאל: שאלות (LTR) */}
                 <div className="w-1/2 bg-slate-50 border-r border-slate-200 flex flex-col dir-ltr">
                     <div className="flex-1 overflow-y-auto p-8">
                        {currentQuestion && (
                            <QuestionCard 
                                question={currentQuestion} 
                                onAnswer={handleAnswer} 
                            />
                        )}
                     </div>
                 </div>
                 {/* צד ימין: טקסט (LTR אבל מיקום ימני) */}
                 <div className="w-1/2 bg-white overflow-y-auto p-10 border-l-4 border-indigo-500 dir-ltr shadow-inner">
                     <h2 className="text-2xl font-bold text-slate-800 mb-6 font-serif">{currentPassage?.title}</h2>
                     <div className="prose prose-lg text-slate-700 leading-loose font-serif whitespace-pre-line">
                         {currentPassage?.content}
                     </div>
                 </div>
             </div>
         ) : (
             // --- תצוגה רגילה (Centered) ---
             <div className="w-full h-full overflow-y-auto p-4 md:p-10 flex items-center justify-center dir-ltr">
                 <div className="max-w-3xl w-full">
                    {currentQuestion && (
                        <QuestionCard 
                            question={currentQuestion} 
                            onAnswer={handleAnswer} 
                        />
                    )}
                 </div>
             </div>
         )}
      </main>
    </div>
  );
}

// --- קומפוננטת כרטיס שאלה ---
function QuestionCard({ question, onAnswer }) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-6">
                <h3 className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed mb-8">
                    {question.type === 'sentence_completion' ? (
                        question.content.split('_____').map((part, i, arr) => (
                            <React.Fragment key={i}>
                            {part}
                            {i < arr.length - 1 && (
                                <span className="inline-block w-20 border-b-2 border-indigo-400 mx-2 relative top-1"></span>
                            )}
                            </React.Fragment>
                        ))
                    ) : (
                        question.content
                    )}
                </h3>
            </div>

            <div className="grid gap-3">
                {question.answers.map((ans, idx) => (
                    <button
                        key={idx}
                        onClick={() => onAnswer(idx)}
                        className="group flex items-center gap-4 p-5 rounded-xl border-2 border-slate-200 bg-white hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-200 text-left"
                    >
                        <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-sm font-bold text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-colors">
                            {idx + 1}
                        </div>
                        <span className="text-lg text-slate-600 group-hover:text-indigo-900 font-medium">
                            {ans.text}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}