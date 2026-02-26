import express from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import Day from '../models/Day.js';
import Word from '../models/Word.js';
import User from '../models/User.js';
import Question from '../models/Question.js';
import { getAdaptiveTestPool } from '../controllers/examController.js'; 

const router = express.Router();

// --- 1. קבלת רשימת כל הימים (עבור לוח הבקרה) ---
router.get('/days', requireAuth, async (req, res) => {
  try {
    // מחזיר את כל הימים כדי שנוכל להציג אותם בכרטיסיות
    const days = await Day.find().sort({ dayNumber: 1 });
    res.json(days);
  } catch (error) {
    console.error("Fetch Days Error:", error);
    res.status(500).json({ error: 'שגיאה בטעינת רשימת הימים' });
  }
});

// --- 2. קבלת יום ספציפי (כשנכנסים לכרטיסייה) ---
router.get('/days/:dayNumber', requireAuth, async (req, res) => {
  try {
    const dayNum = parseInt(req.params.dayNumber);
    // טוען את המילים של אותו יום (ה-30 מילים)
    const dayData = await Day.findOne({ dayNumber: dayNum }).populate('words');

    if (!dayData) {
      return res.status(404).json({ message: 'יום לא נמצא' });
    }

    res.json(dayData);
  } catch (error) {
    console.error("Fetch Day Error:", error);
    res.status(500).json({ error: 'שגיאה בטעינת היום' });
  }
});

// --- 3. משיכת מילים לחזרות (למילים של המערכת - Leitner System) ---
router.get('/review-session', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('vocabulary.learning.word');

    if (!user.vocabulary.learning || user.vocabulary.learning.length === 0) {
        const day1 = await Day.findOne({ dayNumber: 1 }).populate('words');
        if (day1 && day1.words.length > 0) {
            const starterWords = day1.words.slice(0, 5);
            return res.json(starterWords.map(w => ({
                ...w.toObject(),
                box: 1,
                learningId: w._id
            })));
        }
        return res.json([]); 
    }

    const now = new Date();
    const dueWords = user.vocabulary.learning.filter(item => {
      return item.word && (!item.nextReview || new Date(item.nextReview) <= now);
    });

    res.json(dueWords.map(item => ({
      ...item.word.toObject(),
      box: item.box,
      learningId: item._id
    })));
  } catch (error) {
    console.error("Review Fetch Error:", error);
    res.status(500).json({ error: 'שגיאה בטעינת חזרות' });
  }
});

// --- 4. סימולציה ומבחנים ---
router.get('/simulation/adaptive', requireAuth, getAdaptiveTestPool);

// --- 5. עדכון מילים של המערכת (Leitner) ---
router.post('/submit-result', requireAuth, async (req, res) => {
  try {
    const { wordId, success } = req.body;
    const user = await User.findById(req.user._id);

    let learningItem = user.vocabulary.learning.find(item => 
      item.word.toString() === wordId
    );

    if (!learningItem) {
        user.vocabulary.learning.push({
            word: wordId,
            box: 1,
            nextReview: new Date()
        });
        learningItem = user.vocabulary.learning[user.vocabulary.learning.length - 1];
    }

    if (success) {
      learningItem.box = Math.min(learningItem.box + 1, 5);
    } else {
      learningItem.box = 1;
    }

    const intervals = [0, 10, 1440, 4320, 10080, 43200]; 
    const minutesToAdd = intervals[learningItem.box] || 10;
    learningItem.nextReview = new Date(Date.now() + minutesToAdd * 60000);

    if (learningItem.box === 5) {
        const alreadyKnown = user.vocabulary.known.some(id => id.toString() === wordId);
        if (!alreadyKnown) {
            user.vocabulary.known.push(wordId);
        }
    }

    await user.save();
    res.json({ message: "התקדמות נשמרה", nextReview: learningItem.nextReview });
  } catch (error) {
    console.error("Submit Error:", error);
    res.status(500).json({ error: 'שגיאה בשמירת התקדמות' });
  }
});

// ============================================================================
//  SECTION: PERSONAL VAULT & DEEP DRILL (החלק החדש למאגר האישי והחפירה)
// ============================================================================

// א. הוספת מילה למאגר האישי
router.post('/add-personal-word', requireAuth, async (req, res) => {
  try {
    const { english, hebrew } = req.body;
    
    if (!english || !hebrew) {
      return res.status(400).json({ error: 'חובה לספק אנגלית ועברית' });
    }

    const user = await User.findById(req.user._id);

    // בדיקה אם המילה כבר קיימת כדי למנוע כפילויות
    const exists = user.personalVocabulary.find(
      w => w.english.toLowerCase() === english.toLowerCase()
    );

    if (exists) {
      return res.status(400).json({ error: 'המילה כבר קיימת במאגר שלך' });
    }

    // הוספה למערך עם רמת שליטה 0
    user.personalVocabulary.push({ english, hebrew });
    await user.save();

    res.json({ message: 'נוסף בהצלחה', word: user.personalVocabulary[user.personalVocabulary.length - 1] });
  } catch (error) {
    console.error("Add Personal Word Error:", error);
    res.status(500).json({ error: 'שגיאה בהוספת מילה' });
  }
});

// ב. שליפת מילים ל"חפירה" (Deep Drill)
// שולף מילים שהמשתמש עדיין לא הגיע ל-100% שליטה בהן, ושהזמן שלהן הגיע
router.get('/personal-drill', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const now = new Date();

    // סינון: מילים שרמת השליטה בהן נמוכה מ-100 וזמן החזרה שלהן הגיע
    // (בתוך סשן חפירה, זמן החזרה יהיה מיידי עד שהמילה תושלם)
    const drillWords = user.personalVocabulary.filter(w => 
      w.masteryLevel < 100 && new Date(w.nextReview) <= now
    );

    res.json(drillWords);
  } catch (error) {
    console.error("Drill Fetch Error:", error);
    res.status(500).json({ error: 'שגיאה בטעינת מילים לחפירה' });
  }
});

// ג. עדכון התקדמות בחפירה (Update Drill Progress)
router.post('/update-personal-progress', requireAuth, async (req, res) => {
  try {
    const { wordId, success } = req.body;
    const user = await User.findById(req.user._id);

    // מציאת המילה בתוך המערך בעזרת ה-ID שלה
    const wordItem = user.personalVocabulary.id(wordId);

    if (!wordItem) {
      return res.status(404).json({ error: 'מילה לא נמצאה' });
    }

    if (success) {
      // הצלחה: מעלים את רמת השליטה (נניח שיש 4 שלבים, אז כל שלב 25 נקודות)
      wordItem.masteryLevel = Math.min(wordItem.masteryLevel + 25, 100);
      
      if (wordItem.masteryLevel >= 100) {
        // אם סיים את החפירה להיום -> דוחים למחר
        wordItem.nextReview = new Date(Date.now() + 24 * 60 * 60 * 1000);
      } else {
        // אם עדיין לא סיים את כל המשחקים -> נשאר זמין מיידית להמשך הסשן
        wordItem.nextReview = new Date();
      }
    } else {
      // כישלון: המילה "נופלת" בחזרה להתחלה. החפירה לא נגמרת עד שיודעים מושלם!
      wordItem.masteryLevel = 0;
      wordItem.nextReview = new Date(); // זמין מיידית לניסיון חוזר
    }

    await user.save();
    res.json({ 
      message: success ? 'כל הכבוד' : 'לא נורא, נסה שוב', 
      mastery: wordItem.masteryLevel,
      nextReview: wordItem.nextReview
    });

  } catch (error) {
    console.error("Update Drill Error:", error);
    res.status(500).json({ error: 'שגיאה בעדכון התקדמות' });
  }
});

export default router;