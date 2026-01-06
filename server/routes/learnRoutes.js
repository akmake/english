import express from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import Day from '../models/Day.js';
import Word from '../models/Word.js';
import User from '../models/User.js';
import Question from '../models/Question.js';

// 👇 התיקון: מייבאים רק את הפונקציה האדפטיבית החדשה!
import { getAdaptiveTestPool } from '../controllers/examController.js'; 

const router = express.Router();

// --- 1. קבלת יום לימוד ספציפי ---
router.get('/days/:dayNumber', requireAuth, async (req, res) => {
  try {
    const dayNum = parseInt(req.params.dayNumber);
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

// --- 2. משיכת מילים לתרגול (חזרות SRS) ---
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

// --- נתיבי סימולציה ---

// 👇 התיקון: רק הנתיב החדש קיים כאן
router.get('/simulation/adaptive', requireAuth, getAdaptiveTestPool);


// --- 3. עדכון תוצאות תרגול (Leitner System) ---
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
router.get('/days', requireAuth, async (req, res) => {
  try {
    // שולף את כל הימים וממיין אותם לפי מספר היום
    const days = await Day.find().sort({ dayNumber: 1 });
    res.json(days);
  } catch (error) {
    console.error("Fetch Days Error:", error);
    res.status(500).json({ error: 'שגיאה בטעינת רשימת הימים' });
  }
});


export default router;