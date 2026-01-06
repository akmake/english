import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Word from '../models/Word.js';
import Story from '../models/Story.js';
import Question from '../models/Question.js';

// הגדרת נתיבים כדי למצוא את קובץ .env בתיקיית האב
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const initialWords = [
  { term: "ambiguous", translation: "דו משמעי / מעורפל", definition: "Open to more than one interpretation.", level: "advanced" },
  { term: "diligent", translation: "חרוץ / שקדן", definition: "Having or showing care and conscientiousness in one's work.", level: "advanced" },
  { term: "inevitable", translation: "בלתי נמנע", definition: "Certain to happen; unavoidable.", level: "intermediate" },
  { term: "reluctant", translation: "הססני / לא רצון", definition: "Unwilling and hesitant; disinclined.", level: "intermediate" },
  { term: "prominent", translation: "בולט / חשוב", definition: "Important; famous.", level: "intermediate" }
];

const initialStory = {
  title: "The Diligent Student",
  content: "Dan was a diligent student who studied every day. Although the material was sometimes ambiguous, he made sure to ask questions until he understood. His success was inevitable because of his hard work. However, he was initially reluctant to take the advanced course. Eventually, he became a prominent figure in his class.",
  glossary: [
    { word: "diligent", translation: "חרוץ" },
    { word: "ambiguous", translation: "מעורפל" },
    { word: "inevitable", translation: "בלתי נמנע" },
    { word: "reluctant", translation: "הססני" },
    { word: "prominent", translation: "בולט" }
  ],
  level: "intermediate"
};

const initialQuestions = [
  {
    type: 'sentence_completion',
    difficulty: 2,
    content: "The instructions were so _____ that no one knew what to do.",
    answers: [
      { text: "clear", isCorrect: false },
      { text: "ambiguous", isCorrect: true },
      { text: "short", isCorrect: false },
      { text: "easy", isCorrect: false }
    ],
    explanation: "המילה שחסרה צריכה להסביר למה אף אחד לא ידע מה לעשות. ambiguous (מעורפל) מתאימה."
  },
  {
    type: 'restatement',
    difficulty: 3,
    content: "He was reluctant to accept the offer.",
    answers: [
      { text: "He accepted the offer immediately.", isCorrect: false },
      { text: "He did not want to accept the offer.", isCorrect: true },
      { text: "He was happy to accept the offer.", isCorrect: false },
      { text: "He accepted the offer without thinking.", isCorrect: false }
    ],
    explanation: "Reluctant אומר 'לא רוצה' או 'הססני'. לכן התשובה היא שהוא לא רצה לקבל את ההצעה."
  }
];

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing in .env file");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 Connected to DB');

    console.log('📚 Seeding Words...');
    const savedWords = [];
    for (const w of initialWords) {
      const doc = await Word.findOneAndUpdate({ term: w.term }, w, { upsert: true, new: true });
      savedWords.push(doc._id);
    }

    console.log('📖 Seeding Story...');
    await Story.deleteMany({}); 
    await Story.create({
      ...initialStory,
      targetWords: savedWords 
    });

    console.log('❓ Seeding Questions...');
    await Question.deleteMany({});
    await Question.insertMany(initialQuestions);

    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();