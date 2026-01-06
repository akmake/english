import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// מודלים
import Question from '../models/Question.js';
import ReadingPassage from '../models/ReadingPassage.js';

// ייבוא הנתונים מהקבצים שיצרנו
import { sc_level1, sc_level2, sc_level3 } from './data/scData.js';
import { rest_level1, rest_level2, rest_level3 } from './data/restData.js';
import { 
    passage1, q1Data, 
    passage2, q2Data, 
    passage3, q3Data 
} from './data/readingData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// פונקציית ערבוב
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const seedFull = async () => {
    try {
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing in .env");
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Connected to DB. Starting MASSIVE AMIRNET SEED...');

        // 1. ניקוי מסד נתונים
        await Question.deleteMany({});
        await ReadingPassage.deleteMany({});
        console.log('🧹 Cleaned old data.');

        // פונקציית עזר להכנסת שאלות רגילות
        const insertQuestions = async (type, level, data) => {
            for (const item of data) {
                await Question.create({
                    type,
                    difficulty: level,
                    content: item.c,
                    answers: shuffle([
                        { text: item.a, isCorrect: true },
                        ...item.w.map(txt => ({ text: txt, isCorrect: false }))
                    ])
                });
            }
            console.log(`✅ Inserted ${data.length} questions: ${type} (Level ${level})`);
        };

        // 2. הזנת השלמת משפטים (SC)
        await insertQuestions('sentence_completion', 1, sc_level1);
        await insertQuestions('sentence_completion', 2, sc_level2);
        await insertQuestions('sentence_completion', 3, sc_level3);

        // 3. הזנת ניסוח מחדש (Restatement)
        await insertQuestions('restatement', 1, rest_level1);
        await insertQuestions('restatement', 2, rest_level2);
        await insertQuestions('restatement', 3, rest_level3);

        // 4. הזנת הבנת הנקרא (Reading Comprehension)
        console.log('📚 Creating Reading Passages...');

        // פונקציה שמייצרת את הקטע + השאלות שלו (ומשכפלת שאלות אם צריך לנפח)
        const createPassageAndQs = async (pData, qData, multiplier = 3) => {
            const passage = await ReadingPassage.create(pData);
            
            // אנחנו משכפלים את השאלות 3 פעמים כדי להגיע ל-15 שאלות (טכני)
            // בפועל יהיו לך 5 שאלות ייחודיות שחוזרות על עצמן במאגר
            for (let i = 0; i < multiplier; i++) {
                for (const q of qData) {
                    await Question.create({ 
                        type: 'reading_comprehension', 
                        difficulty: pData.difficulty, 
                        relatedPassage: passage._id, 
                        content: q.q, 
                        answers: shuffle([
                            { text: q.a, isCorrect: true }, 
                            ...q.w.map(txt => ({ text: txt, isCorrect: false }))
                        ]) 
                    });
                }
            }
            console.log(`✅ Created Passage: "${pData.title}" with ${qData.length * multiplier} questions.`);
        };

        await createPassageAndQs(passage1, q1Data);
        await createPassageAndQs(passage2, q2Data);
        await createPassageAndQs(passage3, q3Data);

        console.log('🏁 MISSION ACCOMPLISHED: All 135 Questions Loaded Successfully!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

seedFull();