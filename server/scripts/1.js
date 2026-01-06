// server/scripts/seedDay1Full.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Word from '../models/Word.js';
import Day from '../models/Day.js';

// --- הגדרות חיבור ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const day1Data = [
  // =======================================================
  // חלק א': 15 מילים אקדמיות (Academic)
  // =======================================================
  {
    term: "Ambiguous",
    translation: "דו-משמעי / מעורפל",
    level: "academic",
    sentenceParts: [
      { en: "The", he: "ה" },
      { en: "instructions", he: "הוראות" },
      { en: "were", he: "היו" },
      { en: "somewhat", he: "די" },
      { en: "ambiguous", he: "מעורפלות" }
    ]
  },
  {
    term: "Consistent",
    translation: "עקבי",
    level: "academic",
    sentenceParts: [
      { en: "His", he: "שלו" },
      { en: "results", he: "תוצאות" },
      { en: "were", he: "היו" },
      { en: "consistent", he: "עקביות" },
      { en: "with", he: "עם" },
      { en: "the", he: "ה" },
      { en: "theory", he: "תיאוריה" }
    ]
  },
  {
    term: "Distinction",
    translation: "הבחנה / הבדל",
    level: "academic",
    sentenceParts: [
      { en: "There", he: "יש" },
      { en: "is", he: "הוא" },
      { en: "a", he: "אחד" },
      { en: "clear", he: "ברור" },
      { en: "distinction", he: "הבדל" },
      { en: "between", he: "בין" },
      { en: "them", he: "הם" }
    ]
  },
  {
    term: "Exclude",
    translation: "לשלול / להוציא מן הכלל",
    level: "academic",
    sentenceParts: [
      { en: "We", he: "אנחנו" },
      { en: "decided", he: "החלטנו" },
      { en: "to", he: "ל" },
      { en: "exclude", he: "להוציא" },
      { en: "the", he: "ה" },
      { en: "outliers", he: "חריגים" }
    ]
  },
  {
    term: "Framework",
    translation: "מסגרת / שלד (רעיוני)",
    level: "academic",
    sentenceParts: [
      { en: "This", he: "זה" },
      { en: "plan", he: "תוכנית" },
      { en: "provides", he: "מספקת" },
      { en: "a", he: "אחד" },
      { en: "framework", he: "מסגרת" },
      { en: "for", he: "עבור" },
      { en: "action", he: "פעולה" }
    ]
  },
  {
    term: "Illustrate",
    translation: "להמחיש / לאייר",
    level: "academic",
    sentenceParts: [
      { en: "This", he: "זו" },
      { en: "example", he: "דוגמה" },
      { en: "will", he: "תעשה" },
      { en: "illustrate", he: "תמחיש" },
      { en: "the", he: "ה" },
      { en: "point", he: "נקודה" }
    ]
  },
  {
    term: "Initial",
    translation: "ראשוני / התחלתי",
    level: "academic",
    sentenceParts: [
      { en: "My", he: "שלי" },
      { en: "initial", he: "ראשונית" },
      { en: "reaction", he: "תגובה" },
      { en: "was", he: "הייתה" },
      { en: "surprise", he: "הפתעה" }
    ]
  },
  {
    term: "Methodology",
    translation: "מתודולוגיה / שיטת מחקר",
    level: "academic",
    sentenceParts: [
      { en: "The", he: "ה" },
      { en: "methodology", he: "שיטת המחקר" },
      { en: "used", he: "שומשה" },
      { en: "was", he: "הייתה" },
      { en: "complex", he: "מורכבת" }
    ]
  },
  {
    term: "Significant",
    translation: "משמעותי / מובהק",
    level: "academic",
    sentenceParts: [
      { en: "This", he: "זה" },
      { en: "is", he: "הוא" },
      { en: "a", he: "אחד" },
      { en: "significant", he: "משמעותי" },
      { en: "change", he: "שינוי" }
    ]
  },
  {
    term: "Specific",
    translation: "ספציפי / מסוים",
    level: "academic",
    sentenceParts: [
      { en: "Please", he: "בבקשה" },
      { en: "be", he: "היה" },
      { en: "more", he: "יותר" },
      { en: "specific", he: "ספציפי" },
      { en: "about", he: "לגבי" },
      { en: "it", he: "זה" }
    ]
  },
  {
    term: "Subsequent",
    translation: "עוקב / שבא לאחר מכן",
    level: "academic",
    sentenceParts: [
      { en: "The", he: "ה" },
      { en: "subsequent", he: "הבאים" },
      { en: "events", he: "אירועים" },
      { en: "were", he: "היו" },
      { en: "unexpected", he: "בלתי צפויים" }
    ]
  },
  {
    term: "Theoretical",
    translation: "תיאורטי / עיוני",
    level: "academic",
    sentenceParts: [
      { en: "The", he: "ה" },
      { en: "problem", he: "בעיה" },
      { en: "is", he: "היא" },
      { en: "purely", he: "טהור" },
      { en: "theoretical", he: "תיאורטית" }
    ]
  },
  {
    term: "Valid",
    translation: "תקף / הגיוני",
    level: "academic",
    sentenceParts: [
      { en: "That", he: "זה" },
      { en: "is", he: "הוא" },
      { en: "a", he: "אחד" },
      { en: "valid", he: "תקף" },
      { en: "argument", he: "טיעון" }
    ]
  },
  {
    term: "Yield",
    translation: "להניב / להפיק (גם: להיכנע)",
    level: "academic",
    sentenceParts: [
      { en: "The", he: "ה" },
      { en: "study", he: "מחקר" },
      { en: "yielded", he: "הניב" },
      { en: "new", he: "חדשים" },
      { en: "facts", he: "עובדות" }
    ]
  },
  {
    term: "Adequate",
    translation: "הולם / מספק",
    level: "academic",
    sentenceParts: [
      { en: "The", he: "ה" },
      { en: "supply", he: "אספקה" },
      { en: "was", he: "היה" },
      { en: "not", he: "לא" },
      { en: "adequate", he: "מספקת" }
    ]
  },

  // =======================================================
  // חלק ב': 15 מילים כלליות (Advanced/Intermediate)
  // =======================================================
  {
    term: "Accomplish",
    translation: "להשיג / להשלים בהצלחה",
    level: "advanced",
    sentenceParts: [
      { en: "We", he: "אנחנו" },
      { en: "can", he: "יכולים" },
      { en: "accomplish", he: "להשיג" },
      { en: "our", he: "שלנו" },
      { en: "goals", he: "מטרות" }
    ]
  },
  {
    term: "Benefit",
    translation: "תועלת / להפיק תועלת",
    level: "advanced",
    sentenceParts: [
      { en: "The", he: "ה" },
      { en: "benefits", he: "תועלות" },
      { en: "outweigh", he: "עולות על" },
      { en: "the", he: "ה" },
      { en: "costs", he: "עלויות" }
    ]
  },
  {
    term: "Challenge",
    translation: "אתגר / לקרוא תיגר",
    level: "advanced",
    sentenceParts: [
      { en: "She", he: "היא" },
      { en: "accepted", he: "קיבלה" },
      { en: "the", he: "ה" },
      { en: "challenge", he: "אתגר" },
      { en: "bravely", he: "באומץ" }
    ]
  },
  {
    term: "Demand",
    translation: "ביקוש / דרישה",
    level: "advanced",
    sentenceParts: [
      { en: "The", he: "ה" },
      { en: "demand", he: "ביקוש" },
      { en: "for", he: "עבור" },
      { en: "oil", he: "נפט" },
      { en: "is", he: "הוא" },
      { en: "high", he: "גבוה" }
    ]
  },
  {
    term: "Efficient",
    translation: "יעיל",
    level: "advanced",
    sentenceParts: [
      { en: "He", he: "הוא" },
      { en: "is", he: "הינו" },
      { en: "an", he: "אחד" },
      { en: "efficient", he: "יעיל" },
      { en: "worker", he: "עובד" }
    ]
  },
  {
    term: "Frequent",
    translation: "תדיר / תכוף",
    level: "advanced",
    sentenceParts: [
      { en: "They", he: "הם" },
      { en: "make", he: "עושים" },
      { en: "frequent", he: "תכופים" },
      { en: "trips", he: "טיולים" },
      { en: "abroad", he: "לחוץ לארץ" }
    ]
  },
  {
    term: "Gradual",
    translation: "הדרגתי",
    level: "advanced",
    sentenceParts: [
      { en: "The", he: "ה" },
      { en: "change", he: "שינוי" },
      { en: "was", he: "היה" },
      { en: "slow", he: "איטי" },
      { en: "and", he: "ו" },
      { en: "gradual", he: "הדרגתי" }
    ]
  },
  {
    term: "Hazard",
    translation: "סכנה / סיכון",
    level: "advanced",
    sentenceParts: [
      { en: "Smoking", he: "עישון" },
      { en: "is", he: "הוא" },
      { en: "a", he: "אחת" },
      { en: "health", he: "בריאות" },
      { en: "hazard", he: "סכנה" }
    ]
  },
  {
    term: "Impact",
    translation: "השפעה / רושם",
    level: "advanced",
    sentenceParts: [
      { en: "His", he: "שלו" },
      { en: "speech", he: "נאום" },
      { en: "had", he: "היה לזה" },
      { en: "an", he: "אחת" },
      { en: "impact", he: "השפעה" }
    ]
  },
  {
    term: "Justify",
    translation: "להצדיק",
    level: "advanced",
    sentenceParts: [
      { en: "You", he: "אתה" },
      { en: "cannot", he: "לא יכול" },
      { en: "justify", he: "להצדיק" },
      { en: "such", he: "כזאת" },
      { en: "behavior", he: "התנהגות" }
    ]
  },
  {
    term: "Lack",
    translation: "מחסור / חוסר",
    level: "advanced",
    sentenceParts: [
      { en: "A", he: "אחד" },
      { en: "lack", he: "חוסר" },
      { en: "of", he: "של" },
      { en: "sleep", he: "שינה" },
      { en: "causes", he: "גורם ל" },
      { en: "stress", he: "לחץ" }
    ]
  },
  {
    term: "Maintain",
    translation: "לתחזק / לשמור על",
    level: "advanced",
    sentenceParts: [
      { en: "It", he: "זה" },
      { en: "is", he: "הוא" },
      { en: "hard", he: "קשה" },
      { en: "to", he: "ל" },
      { en: "maintain", he: "לשמור על" },
      { en: "balance", he: "איזון" }
    ]
  },
  {
    term: "Neglect",
    translation: "להזניח",
    level: "advanced",
    sentenceParts: [
      { en: "Do", he: "תעשה" },
      { en: "not", he: "אל" },
      { en: "neglect", he: "תזניח" },
      { en: "your", he: "שלך" },
      { en: "studies", he: "לימודים" }
    ]
  },
  {
    term: "Obvious",
    translation: "ברור מאליו",
    level: "advanced",
    sentenceParts: [
      { en: "The", he: "ה" },
      { en: "answer", he: "תשובה" },
      { en: "seems", he: "נראית" },
      { en: "quite", he: "די" },
      { en: "obvious", he: "ברורה" }
    ]
  },
  {
    term: "Permanent",
    translation: "קבוע / תמידי",
    level: "advanced",
    sentenceParts: [
      { en: "The", he: "ה" },
      { en: "damage", he: "נזק" },
      { en: "might", he: "עלול" },
      { en: "be", he: "להיות" },
      { en: "permanent", he: "קבוע" }
    ]
  }
];

// --- הפונקציה הראשית ---
const seedDay1 = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI חסר בקובץ .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 מחובר ל-MongoDB. מתחיל יצירת יום 1 מלא...');

    // 1. הסרת יום 1 הישן (אם קיים) כדי למנוע כפילויות
    // נמחק את המסמך של Day 1
    await Day.findOneAndDelete({ dayNumber: 1 });
    
    // אופציונלי: אם אתה רוצה למחוק את המילים עצמן כדי ליצור אותן מחדש נקי
    // (זהירות: זה ימחק מילים שמשויכות לימים אחרים אם השתמשת בהן שם)
    // לצורך יום 1 נקי, נמחק את המילים שמופיעות ברשימה שלנו מה-DB
    const terms = day1Data.map(d => d.term);
    await Word.deleteMany({ term: { $in: terms } });

    console.log('🧹 ניקוי נתונים ישנים הושלם.');

    // 2. יצירת המילים ושמירת ה-IDs שלהן
    const wordIds = [];
    
    for (const item of day1Data) {
      // יצירת המילה (או עדכון אם קיימת בטעות)
      const word = await Word.findOneAndUpdate(
        { term: item.term },
        item,
        { upsert: true, new: true }
      );
      wordIds.push(word._id);
      process.stdout.write('+'); // חיווי ויזואלי לכל מילה שנוצרה
    }
    console.log('\n✅ 30 מילים נוצרו בהצלחה.');

    // 3. יצירת יום 1 המלא
    await Day.create({
      dayNumber: 1,
      title: "יסודות ומבוא אקדמי",
      words: wordIds
    });

    console.log('🎉 יום 1 נוצר בהצלחה עם 30 מילים מלאות!');
    console.log('סיימנו. אתה יכול להריץ את השרת ולהיכנס ליום 1.');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ שגיאה ביצירת הנתונים:', error);
    process.exit(1);
  }
};

seedDay1();