// server/scripts/seedQuestions.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';
import path from 'path';
import { fileURLToPath } from 'url';

// תיקון נתיבים כדי למצוא את .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const questions = [
  {
    type: 'sentence_completion',
    difficulty: 2,
    content: "Although the rain was heavy, the match _____ as planned.",
    answers: [
      { text: "continued", isCorrect: true },
      { text: "canceled", isCorrect: false },
      { text: "delayed", isCorrect: false },
      { text: "stopped", isCorrect: false }
    ],
    explanation: "המילה Although מצביעה על ניגוד. למרות הגשם, המשחק המשיך."
  },
  {
    type: 'sentence_completion',
    difficulty: 3,
    content: "The CEO's speech was ambiguous; consequently, the employees were left _____ about the company's future.",
    answers: [
      { text: "confident", isCorrect: false },
      { text: "uncertain", isCorrect: true },
      { text: "optimistic", isCorrect: false },
      { text: "indifferent", isCorrect: false }
    ],
    explanation: "ambiguous = דו משמעי/מעורפל. לכן העובדים נותרו 'לא בטוחים' (uncertain)."
  },
  {
    type: 'restatement',
    difficulty: 3,
    content: "Whatever his shortcomings, John is a diligent worker.",
    answers: [
      { text: "John is lazy despite his talents.", isCorrect: false },
      { text: "John's faults do not prevent him from working hard.", isCorrect: true },
      { text: "John has many faults and hates working.", isCorrect: false },
      { text: "John is diligent only when he wants to be.", isCorrect: false }
    ],
    explanation: "shortcomings = חסרונות, diligent = חרוץ. המשפט אומר שלמרות חסרונותיו, הוא עובד חרוץ."
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 Connected to DB');
    
    await Question.deleteMany({}); // ניקוי שאלות ישנות
    await Question.insertMany(questions);
    
    console.log('✅ Questions seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();