import Question from '../models/Question.js';
import ReadingPassage from '../models/ReadingPassage.js';

// פונקציה שמביאה את כל המאגר מסודר לפי רמות
export const getAdaptiveTestPool = async (req, res) => {
  try {
    console.log("Fetching Adaptive Exam Pool...");

    // 1. הכנת המבנה הריק
    const pool = {
      sentence_completion: { 1: [], 2: [], 3: [] },
      restatement: { 1: [], 2: [], 3: [] },
      reading_comprehension: { 1: [], 2: [], 3: [] }
    };

    // 2. שליפת כל השאלות שאינן הבנת הנקרא (SC + Restatement)
    const standardQuestions = await Question.find({ 
      type: { $ne: 'reading_comprehension' } 
    }).lean();

    // מיון למגירות הנכונות
    standardQuestions.forEach(q => {
      if (pool[q.type] && pool[q.type][q.difficulty]) {
        pool[q.type][q.difficulty].push(q);
      }
    });

    // 3. טיפול מיוחד בהבנת הנקרא (אנחנו צריכים אובייקט של טקסט + השאלות שלו)
    const passages = await ReadingPassage.find().lean();
    
    // לכל קטע קריאה, נמצא את השאלות שלו
    for (const passage of passages) {
        const questions = await Question.find({ relatedPassage: passage._id }).lean();
        
        // יצירת אובייקט מאוחד
        const passageBlock = {
            passage: passage,
            questions: questions
        };

        // דחיפה לרמה המתאימה
        if (pool.reading_comprehension[passage.difficulty]) {
            pool.reading_comprehension[passage.difficulty].push(passageBlock);
        }
    }

    // 4. בדיקת תקינות (אופציונלי - לוג לשרת)
    console.log(`Pool Ready: SC=${standardQuestions.length}, Reading Passages=${passages.length}`);

    // 5. שליחה לקליינט
    res.json({
        success: true,
        examId: `adaptive-${Date.now()}`,
        pool: pool,
        config: {
            // הגדרות למבחן (כמה שאלות להציג למשתמש מתוך המאגר)
            sentence_completion_count: 11, // מספר השאלות שיוצגו בפועל
            restatement_count: 8,
            reading_passages_count: 2 // שני טקסטים
        }
    });

  } catch (error) {
    console.error("Error generating exam pool:", error);
    res.status(500).json({ message: "שגיאה בטעינת מאגר המבחן" });
  }
};