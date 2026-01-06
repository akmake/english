import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Word from '../../models/Word.js'; // שים לב לנתיב היחסי
import Day from '../../models/Day.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const DAY_NUMBER = 1;
const DAY_TITLE = "יסודות אקדמיים ומחקר (Academic Foundations)";

// --- פונקציית עזר ליצירת מבנה המשפט ---
// הופכת מחרוזת פשוטה למבנה שהמערכת שלך מכירה
const createSentence = (en, he) => {
  return [{ en: en, he: he }]; 
};

const wordsData = [
  // --- חלק 1: 15 מילים רגילות (אנגלית גבוהה) ---
  {
    term: "Ambiguous",
    translation: "דו-משמעי / מעורפל",
    level: "advanced",
    sentenceParts: createSentence(
      "The instructions provided by the manager were so ambiguous that the team didn't know how to proceed with the project.",
      "ההוראות שניתנו על ידי המנהל היו כה מעורפלות שהצוות לא ידע כיצד להמשיך בפרויקט."
    )
  },
  {
    term: "Reluctant",
    translation: "מסויג / לא שש לבצע",
    level: "advanced",
    sentenceParts: createSentence(
      "Despite the obvious benefits of the new medication, many patients were reluctant to try it due to fear of side effects.",
      "למרות היתרונות הברורים של התרופה החדשה, מטופלים רבים היו מסויגים מלנסות אותה בשל פחד מתופעות לוואי."
    )
  },
  {
    term: "Inevitable",
    translation: "בלתי נמנע",
    level: "advanced",
    sentenceParts: createSentence(
      "With the rapid advancement of technology, the shift towards renewable energy sources is considered inevitable by most experts.",
      "עם ההתקדמות המהירה של הטכנולוגיה, המעבר למקורות אנרגיה מתחדשת נחשב בלתי נמנע על ידי רוב המומחים."
    )
  },
  {
    term: "Substantial",
    translation: "ניכר / משמעותי",
    level: "advanced",
    sentenceParts: createSentence(
      "The company reported a substantial increase in profits this quarter compared to the same period last year.",
      "החברה דיווחה על עלייה משמעותית ברווחים ברבעון זה בהשוואה לאותה תקופה אשתקד."
    )
  },
  {
    term: "Perceive",
    translation: "לתפוס / להבחין",
    level: "advanced",
    sentenceParts: createSentence(
      "How customers perceive the brand is often more important than the actual quality of the product itself.",
      "האופן שבו לקוחות תופסים את המותג הוא לעיתים קרובות חשוב יותר מהאיכות בפועל של המוצר עצמו."
    )
  },
  {
    term: "Distinction",
    translation: "הבחנה / ייחוד",
    level: "advanced",
    sentenceParts: createSentence(
      "It is important to make a clear distinction between short-term goals and long-term strategic objectives.",
      "חשוב לעשות הבחנה ברורה בין מטרות לטווח קצר לבין יעדים אסטרטגיים לטווח ארוך."
    )
  },
  {
    term: "Integrity",
    translation: "יושרה / שלמות",
    level: "advanced",
    sentenceParts: createSentence(
      "The candidate was chosen for the position primarily because of his reputation for honesty and professional integrity.",
      "המועמד נבחר לתפקיד בעיקר בגלל המוניטין שלו ליושר ויושרה מקצועית."
    )
  },
  {
    term: "Accumulate",
    translation: "לצבור",
    level: "advanced",
    sentenceParts: createSentence(
      "Over the years, he managed to accumulate a vast amount of knowledge regarding ancient civilizations and their cultures.",
      "במהלך השנים, הוא הצליח לצבור כמות עצומה של ידע בנוגע לתרבויות עתיקות ומנהגיהן."
    )
  },
  {
    term: "Persist",
    translation: "להתמיד / להימשך",
    level: "advanced",
    sentenceParts: createSentence(
      "If the symptoms persist for more than three days, it is highly recommended to consult a physician immediately.",
      "אם התסמינים נמשכים יותר משלושה ימים, מומלץ מאוד להתייעץ עם רופא באופן מיידי."
    )
  },
  {
    term: "Negligible",
    translation: "זניח",
    level: "advanced",
    sentenceParts: createSentence(
      "The difference in price between the two models is negligible, so you should choose the one with better features.",
      "ההבדל במחיר בין שני הדגמים הוא זניח, לכן כדאי לך לבחור את זה עם התכונות הטובות יותר."
    )
  },
  {
    term: "Consist",
    translation: "להיות מורכב מ...",
    level: "advanced",
    sentenceParts: createSentence(
      "The committee consists of ten members, each representing a different department within the large organization.",
      "הוועדה מורכבת מעשרה חברים, שכל אחד מהם מייצג מחלקה שונה בתוך הארגון הגדול."
    )
  },
  {
    term: "Examine",
    translation: "לבחון / לבדוק",
    level: "advanced",
    sentenceParts: createSentence(
      "The auditors arrived to examine the financial records and ensure that all transactions were compliant with the law.",
      "המבקרים הגיעו לבחון את הרשומות הפיננסיות ולוודא שכל העסקאות תאמו לחוק."
    )
  },
  {
    term: "Regulate",
    translation: "לווסת / להסדיר",
    level: "advanced",
    sentenceParts: createSentence(
      "The government plans to introduce new laws to regulate the use of artificial intelligence in public sectors.",
      "הממשלה מתכננת להציג חוקים חדשים כדי להסדיר את השימוש בבינה מלאכותית במגזרים ציבוריים."
    )
  },
  {
    term: "Appropriate",
    translation: "הולם / מתאים",
    level: "advanced",
    sentenceParts: createSentence(
      "Wearing shorts and flip-flops is not considered appropriate attire for a formal business meeting.",
      "לבישת מכנסיים קצרים וכפכפים אינה נחשבת ללבוש הולם לפגישה עסקית רשמית."
    )
  },
  {
    term: "Establish",
    translation: "לייסד / לבסס",
    level: "advanced",
    sentenceParts: createSentence(
      "The scientists are trying to establish a link between the diet of the participants and their overall health.",
      "המדענים מנסים לבסס קשר בין התזונה של המשתתפים לבין הבריאות הכללית שלהם."
    )
  },

  // --- חלק 2: 15 מילים אקדמיות (לאמירנ"ט) ---
  {
    term: "Hypothesis",
    translation: "השערה",
    level: "academic",
    sentenceParts: createSentence(
      "The researchers formulated a hypothesis suggesting that adequate sleep significantly improves cognitive performance in students.",
      "החוקרים ניסחו השערה הגורסת כי שינה מספקת משפרת באופן משמעותי את הביצועים הקוגניטיביים אצל סטודנטים."
    )
  },
  {
    term: "Methodology",
    translation: "מתודולוגיה / שיטת מחקר",
    level: "academic",
    sentenceParts: createSentence(
      "The study was criticized because its methodology was flawed and did not account for external variables.",
      "המחקר ספג ביקורת מכיוון שהמתודולוגיה שלו הייתה פגומה ולא לקחה בחשבון משתנים חיצוניים."
    )
  },
  {
    term: "Correlation",
    translation: "מתאם / קורלציה",
    level: "academic",
    sentenceParts: createSentence(
      "There is a strong positive correlation between high levels of education and higher income expectancy later in life.",
      "קיים מתאם חיובי חזק בין רמות השכלה גבוהות לבין צפי הכנסה גבוה יותר בשלב מאוחר יותר בחיים."
    )
  },
  {
    term: "Empirical",
    translation: "אמפירי (מבוסס ניסוי)",
    level: "academic",
    sentenceParts: createSentence(
      "Unlike philosophical theories, scientific laws are based on empirical evidence gathered through rigorous observation and experimentation.",
      "בשונה תיאוריות פילוסופיות, חוקים מדעיים מבוססים על ראיות אמפיריות שנאספו באמצעות תצפית וניסוי קפדניים."
    )
  },
  {
    term: "Qualitative",
    translation: "איכותני",
    level: "academic",
    sentenceParts: createSentence(
      "Qualitative research focuses on understanding concepts, thoughts, or experiences rather than collecting numerical data.",
      "מחקר איכותני מתמקד בהבנת מושגים, מחשבות או חוויות במקום באיסוף נתונים מספריים."
    )
  },
  {
    term: "Quantitative",
    translation: "כמותני",
    level: "academic",
    sentenceParts: createSentence(
      "The quantitative analysis of the survey results revealed that eighty percent of the population supports the new policy.",
      "הניתוח הכמותני של תוצאות הסקר חשף כי שמונים אחוזים מהאוכלוסייה תומכים במדיניות החדשה."
    )
  },
  {
    term: "Implication",
    translation: "השלכה / משמעות",
    level: "academic",
    sentenceParts: createSentence(
      "The environmental implications of building a new factory in this area could be devastating for the local wildlife.",
      "ההשלכות הסביבתיות של בניית מפעל חדש באזור זה עלולות להיות הרסניות עבור חיות הבר המקומיות."
    )
  },
  {
    term: "Phenomenon",
    translation: "תופעה",
    level: "academic",
    sentenceParts: createSentence(
      "Global warming is a complex phenomenon that is caused by both natural processes and human activities.",
      "התחממות גלובלית היא תופעה מורכבת הנגרמת הן על ידי תהליכים טבעיים והן על ידי פעילויות אנושיות."
    )
  },
  {
    term: "Theoretical",
    translation: "תיאורטי",
    level: "academic",
    sentenceParts: createSentence(
      "While the solution works in a theoretical model, it has yet to be proven effective in real-world scenarios.",
      "בעוד שהפתרון עובד במודל תיאורטי, הוא טרם הוכח כיעיל בתרחישים של העולם האמיתי."
    )
  },
  {
    term: "Variable",
    translation: "משתנה",
    level: "academic",
    sentenceParts: createSentence(
      "In this experiment, temperature is the independent variable that we manipulate to observe changes in the reaction speed.",
      "בניסוי זה, הטמפרטורה היא המשתנה הבלתי תלוי עליו אנו מבצעים מניפולציה כדי לצפות בשינויים במהירות התגובה."
    )
  },
  {
    term: "Abstract",
    translation: "מופשט / תקציר מאמר",
    level: "academic",
    sentenceParts: createSentence(
      "Mathematics often deals with abstract concepts that are difficult to visualize without practical examples.",
      "מתמטיקה עוסקת לעיתים קרובות במושגים מופשטים שקשה לדמיין ללא דוגמאות מעשיות."
    )
  },
  {
    term: "Valid",
    translation: "תקף",
    level: "academic",
    sentenceParts: createSentence(
      "The argument is logically valid, but it relies on premises that are factually incorrect.",
      "הטיעון הוא תקף מבחינה לוגית, אך הוא מסתמך על הנחות יסוד שהן שגויות מבחינה עובדתית."
    )
  },
  {
    term: "Derive",
    translation: "לגזור / להפיק",
    level: "academic",
    sentenceParts: createSentence(
      "Many modern English words derive from Latin and Greek roots, which is why understanding them helps with vocabulary.",
      "מילים רבות באנגלית מודרנית נגזרות משורשים לטיניים ויווניים, וזו הסיבה שהבנתם עוזרת באוצר המילים."
    )
  },
  {
    term: "Comprehensive",
    translation: "כולל / מקיף",
    level: "academic",
    sentenceParts: createSentence(
      "The professor provided a comprehensive review of the literature, covering all major studies published in the last decade.",
      "הפרופסור סיפק סקירה מקיפה של הספרות, המכסה את כל המחקרים המרכזיים שפורסמו בעשור האחרון."
    )
  },
  {
    term: "Fundamental",
    translation: "בסיסי / יסודי",
    level: "academic",
    sentenceParts: createSentence(
      "Freedom of speech is considered a fundamental right in any democratic society and must be protected.",
      "חופש הדיבור נחשב לזכות יסודית בכל חברה דמוקרטית וחייבים להגן עליה."
    )
  }
];

const seedDay = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI חסר");
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`🔌 מתחיל הזנת יום ${DAY_NUMBER}: ${DAY_TITLE}`);

    // מחיקת היום והמילים הקשורות אליו כדי למנוע כפילויות בהרצה חוזרת
    const existingDay = await Day.findOne({ dayNumber: DAY_NUMBER });
    if (existingDay) {
      await Day.deleteOne({ _id: existingDay._id });
      console.log(`🗑️ יום ${DAY_NUMBER} הישן נמחק.`);
    }

    // מחיקת מילים שקיימות כבר כדי לעדכן אותן (אופציונלי, כאן אנחנו דורסים ליתר ביטחון)
    const terms = wordsData.map(w => w.term);
    await Word.deleteMany({ term: { $in: terms } });

    // יצירת המילים החדשות
    const createdWords = await Word.insertMany(wordsData);
    const wordIds = createdWords.map(w => w._id);

    // יצירת היום
    await Day.create({
      dayNumber: DAY_NUMBER,
      title: DAY_TITLE,
      words: wordIds
    });

    console.log(`✅ יום ${DAY_NUMBER} נוצר בהצלחה עם ${createdWords.length} מילים ומשפטים מלאים!`);
    await mongoose.disconnect();
  } catch (err) {
    console.error(`❌ שגיאה ביום ${DAY_NUMBER}:`, err);
    process.exit(1);
  }
};

seedDay();