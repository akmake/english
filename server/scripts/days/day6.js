import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Word from '../../models/Word.js';
import Day from '../../models/Day.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const DAY_NUMBER = 6;
const DAY_TITLE = "חינוך ולמידה (Education & Learning)";

const createSentence = (en, he) => [{ en, he }];

const wordsData = [
  // --- 15 מילים רגילות (גבוהות) ---
  {
    term: "Knowledge",
    translation: "ידע",
    level: "advanced",
    sentenceParts: createSentence(
      "The acquisition of knowledge is a lifelong process that does not end when one leaves school.",
      "רכישת הידע היא תהליך לכל החיים שאינו מסתיים כאשר אדם עוזב את בית הספר."
    )
  },
  {
    term: "Instruction",
    translation: "הוראה / הנחיה",
    level: "advanced",
    sentenceParts: createSentence(
      "Clear instruction is essential for students to understand complex mathematical concepts properly.",
      "הוראה ברורה חיונית כדי שתלמידים יבינו מושגים מתמטיים מורכבים כראוי."
    )
  },
  {
    term: "Qualification",
    translation: "כישור / הסמכה",
    level: "advanced",
    sentenceParts: createSentence(
      "A PhD is the highest academic qualification one can achieve in most fields of study.",
      "דוקטורט הוא ההסמכה האקדמית הגבוהה ביותר שניתן להשיג ברוב תחומי הלימוד."
    )
  },
  {
    term: "Scholar",
    translation: "מלומד",
    level: "advanced",
    sentenceParts: createSentence(
      "The visiting scholar gave a fascinating lecture on the history of ancient Rome.",
      "המלומד האורח נתן הרצאה מרתקת על ההיסטוריה של רומא העתיקה."
    )
  },
  {
    term: "Discipline",
    translation: "משמעת (וגם תחום דעת)",
    level: "advanced",
    sentenceParts: createSentence(
      "Self-discipline is often more important than intelligence when it comes to achieving academic success.",
      "משמעת עצמית חשובה לעיתים קרובות יותר מאינטליגנציה כשמדובר בהשגת הצלחה אקדמית."
    )
  },
  {
    term: "Literacy",
    translation: "אוריינות (ידיעת קרוא וכתוב)",
    level: "advanced",
    sentenceParts: createSentence(
      "Improving literacy rates in developing countries is a primary goal of many international aid organizations.",
      "שיפור שיעורי האוריינות במדינות מתפתחות הוא יעד עיקרי של ארגוני סיוע בינלאומיים רבים."
    )
  },
  {
    term: "Assignment",
    translation: "מטלה",
    level: "advanced",
    sentenceParts: createSentence(
      "The professor gave the students a difficult assignment that required extensive research in the library.",
      "הפרופסור נתן לסטודנטים מטלה קשה שדרשה מחקר מקיף בספרייה."
    )
  },
  {
    term: "Faculty",
    translation: "סגל (אקדמי) / פקולטה",
    level: "advanced",
    sentenceParts: createSentence(
      "The university faculty meets once a month to discuss changes to the curriculum and student policies.",
      "סגל האוניברסיטה נפגש אחת לחודש כדי לדון בשינויים בתוכנית הלימודים ובמדיניות הסטודנטים."
    )
  },
  {
    term: "Intellectual",
    translation: "אינטלקטואלי / שכלי",
    level: "advanced",
    sentenceParts: createSentence(
      "Chess is a game that requires significant intellectual effort and strategic planning.",
      "שחמט הוא משחק הדורש מאמץ אינטלקטואלי משמעותי ותכנון אסטרטגי."
    )
  },
  {
    term: "Tuition",
    translation: "שכר לימוד",
    level: "advanced",
    sentenceParts: createSentence(
      "Many students have to take out loans to pay for the high tuition fees at prestigious universities.",
      "סטודנטים רבים נאלצים לקחת הלוואות כדי לשלם את שכר הלימוד הגבוה באוניברסיטאות יוקרתיות."
    )
  },
  {
    term: "Graduate",
    translation: "בוגר (תואר)",
    level: "advanced",
    sentenceParts: createSentence(
      "After he graduates from law school, he plans to work for a firm that specializes in human rights.",
      "אחרי שיסיים (יהיה בוגר) את בית הספר למשפטים, הוא מתכנן לעבוד במשרד שמתמחה זכויות אדם."
    )
  },
  {
    term: "Talent",
    translation: "כישרון",
    level: "advanced",
    sentenceParts: createSentence(
      "While natural talent is helpful, hard work and practice are usually the keys to mastering an instrument.",
      "בעוד שכישרון טבעי הוא מועיל, עבודה קשה ותרגול הם בדרך כלל המפתחות לשליטה בכלי נגינה."
    )
  },
  {
    term: "Guidance",
    translation: "הכוונה / ייעוץ",
    level: "advanced",
    sentenceParts: createSentence(
      "Students often seek the guidance of a counselor when choosing which career path to pursue.",
      "סטודנטים לעיתים קרובות מחפשים את ההכוונה של יועץ בבואם לבחור באיזה מסלול קריירה ללכת."
    )
  },
  {
    term: "Requirement",
    translation: "דרישה",
    level: "advanced",
    sentenceParts: createSentence(
      "Fluency in English is a mandatory requirement for admission to most international business programs.",
      "שטף באנגלית הוא דרישת חובה לקבלה לרוב התוכניות לעסקים בינלאומיים."
    )
  },
  {
    term: "Potential",
    translation: "פוטנציאל",
    level: "advanced",
    sentenceParts: createSentence(
      "Teachers play a crucial role in helping students realize their full potential and achieve their goals.",
      "מורים ממלאים תפקיד מכריע בעזרה לתלמידים לממש את מלוא הפוטנציאל שלהם ולהשיג את מטרותיהם."
    )
  },

  // --- 15 מילים אקדמיות (אמירנ"ט) ---
  {
    term: "Pedagogy",
    translation: "פדגוגיה (תורת ההוראה)",
    level: "academic",
    sentenceParts: createSentence(
      "Modern pedagogy emphasizes critical thinking and active participation over rote memorization.",
      "פדגוגיה מודרנית מדגישה חשיבה ביקורתית והשתתפות פעילה על פני שינון בעל פה."
    )
  },
  {
    term: "Curriculum",
    translation: "תוכנית לימודים",
    level: "academic",
    sentenceParts: createSentence(
      "The school board decided to revise the history curriculum to include more diverse perspectives.",
      "מועצת בית הספר החליטה לעדכן את תוכנית הלימודים בהיסטוריה כדי לכלול נקודות מבט מגוונות יותר."
    )
  },
  {
    term: "Cognition",
    translation: "קוגניציה / הכרה",
    level: "academic",
    sentenceParts: createSentence(
      "Cognition refers to the mental processes involved in gaining knowledge and comprehension.",
      "קוגניציה מתייחסת לתהליכים המנטליים המעורבים ברכישת ידע והבנה."
    )
  },
  {
    term: "Assessment",
    translation: "הערכה / אומדן",
    level: "academic",
    sentenceParts: createSentence(
      "Continuous assessment allows teachers to track student progress throughout the semester rather than just at the end.",
      "הערכה מתמשכת מאפשרת למורים לעקוב אחר התקדמות התלמידים לאורך הסמסטר ולא רק בסופו."
    )
  },
  {
    term: "Dissertation",
    translation: "עבודת דוקטורט / תזה",
    level: "academic",
    sentenceParts: createSentence(
      "Writing a dissertation is a lengthy process that requires original research and rigorous analysis.",
      "כתיבת עבודת דוקטורט (דיסרטציה) היא תהליך ארוך הדורש מחקר מקורי וניתוח קפדני."
    )
  },
  {
    term: "Acquisition",
    translation: "רכישה (של שפה/ידע)",
    level: "academic",
    sentenceParts: createSentence(
      "Language acquisition is generally easier for young children than it is for adults due to brain plasticity.",
      "רכישת שפה היא בדרך כלל קלה יותר לילדים צעירים מאשר למבוגרים בשל הגמישות המוחית."
    )
  },
  {
    term: "Proficiency",
    translation: "מיומנות / שליטה",
    level: "academic",
    sentenceParts: createSentence(
      "To pass the exam, the student must demonstrate a high level of proficiency in both written and spoken French.",
      "כדי לעבור את המבחן, התלמיד חייב להפגין רמה גבוהה של מיומנות בצרפתית כתובה ומדוברת כאחד."
    )
  },
  {
    term: "Scholarship",
    translation: "מלגה (וגם מחקר אקדמי)",
    level: "academic",
    sentenceParts: createSentence(
      "She received a full scholarship that covered her tuition and living expenses for four years.",
      "היא קיבלה מלגה מלאה שכיסתה את שכר הלימוד והוצאות המחיה שלה למשך ארבע שנים."
    )
  },
  {
    term: "Vocational",
    translation: "מקצועי (הכשרה)",
    level: "academic",
    sentenceParts: createSentence(
      "Vocational schools offer training in practical skills such as carpentry, plumbing, and electronics.",
      "בתי ספר מקצועיים מציעים הכשרה במיומנויות מעשיות כמו נגרות, אינסטלציה ואלקטרוניקה."
    )
  },
  {
    term: "Didactic",
    translation: "דידקטי / לימודי",
    level: "academic",
    sentenceParts: createSentence(
      "The novel has a didactic purpose, aiming to teach readers about the dangers of totalitarianism.",
      "לרומן יש מטרה דידקטית, השואפת ללמד את הקוראים על הסכנות של טוטליטריזם."
    )
  },
  {
    term: "Prerequisite",
    translation: "דרישת קדם",
    level: "academic",
    sentenceParts: createSentence(
      "Introduction to Biology is a prerequisite for taking advanced genetics courses.",
      "מבוא לביולוגיה הוא דרישת קדם ללקיחת קורסים מתקדמים בגנטיקה."
    )
  },
  {
    term: "Syllabus",
    translation: "סילבוס / תוכנית הקורס",
    level: "academic",
    sentenceParts: createSentence(
      "The syllabus outlines the topics to be covered, the reading list, and the grading criteria for the course.",
      "הסילבוס מפרט את הנושאים שיילמדו, רשימת הקריאה והקריטריונים למתן ציונים בקורס."
    )
  },
  {
    term: "Retention",
    translation: "שימור (זיכרון/תלמידים)",
    level: "academic",
    sentenceParts: createSentence(
      "Active learning strategies have been shown to improve the long-term retention of information.",
      "אסטרטגיות למידה פעילה הוכחו כמשפרות את השימור לטווח ארוך של מידע."
    )
  },
  {
    term: "Enrichment",
    translation: "העשרה",
    level: "academic",
    sentenceParts: createSentence(
      "The school offers an enrichment program for gifted students who need more challenging material.",
      "בית הספר מציע תוכנית העשרה לתלמידים מחוננים שזקוקים לחומר מאתגר יותר."
    )
  },
  {
    term: "Evaluation",
    translation: "הערכה (שיפוט)",
    level: "academic",
    sentenceParts: createSentence(
      "The peer evaluation process allows students to give and receive constructive feedback on their work.",
      "תהליך הערכת עמיתים מאפשר לסטודנטים לתת ולקבל משוב בונה על עבודתם."
    )
  }
];

const seedDay = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI חסר");
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`🔌 מתחיל הזנת יום ${DAY_NUMBER}: ${DAY_TITLE}`);
    const existingDay = await Day.findOne({ dayNumber: DAY_NUMBER });
    if (existingDay) await Day.deleteOne({ _id: existingDay._id });
    const terms = wordsData.map(w => w.term);
    await Word.deleteMany({ term: { $in: terms } });
    const createdWords = await Word.insertMany(wordsData);
    await Day.create({ dayNumber: DAY_NUMBER, title: DAY_TITLE, words: createdWords.map(w => w._id) });
    console.log(`✅ יום ${DAY_NUMBER} הושלם.`);
    await mongoose.disconnect();
  } catch (err) {
    console.error(`❌ שגיאה ביום ${DAY_NUMBER}:`, err);
    process.exit(1);
  }
};
seedDay();