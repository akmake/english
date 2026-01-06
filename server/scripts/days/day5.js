import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Word from '../../models/Word.js';
import Day from '../../models/Day.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const DAY_NUMBER = 5;
const DAY_TITLE = "טכנולוגיה וחדשנות (Technology & Innovation)";

const createSentence = (en, he) => [{ en, he }];

const wordsData = [
  // --- 15 מילים רגילות (אנגלית גבוהה) ---
  {
    term: "Mechanism",
    translation: "מנגנון",
    level: "advanced",
    sentenceParts: createSentence(
      "The locking mechanism of the safe is extremely complex, designed to prevent unauthorized access by thieves.",
      "מנגנון הנעילה של הכספת מורכב ביותר, ומתוכנן למנוע גישה לא מורשית על ידי גנבים."
    )
  },
  {
    term: "Artificial",
    translation: "מלאכותי",
    level: "advanced",
    sentenceParts: createSentence(
      "Artificial sweeteners are often used in diet drinks as a substitute for sugar to reduce calorie intake.",
      "ממתיקים מלאכותיים משמשים לעיתים קרובות במשקאות דיאטטיים כתחליף לסוכר כדי להפחית את צריכת הקלוריות."
    )
  },
  {
    term: "Virtual",
    translation: "וירטואלי / מדומה",
    level: "advanced",
    sentenceParts: createSentence(
      "Virtual reality technology allows users to experience computer-generated environments as if they were real.",
      "טכנולוגיית מציאות מדומה מאפשרת למשתמשים לחוות סביבות שנוצרו במחשב כאילו היו אמיתיות."
    )
  },
  {
    term: "Component",
    translation: "רכיב",
    level: "advanced",
    sentenceParts: createSentence(
      "The microprocessor is the most critical component of any computer, acting as its brain.",
      "המיקרו-מעבד הוא הרכיב הקריטי ביותר בכל מחשב, ומשמש כמוח שלו."
    )
  },
  {
    term: "Monitor",
    translation: "להשגיח / לנטר (וגם צג)",
    level: "advanced",
    sentenceParts: createSentence(
      "Doctors use advanced equipment to monitor the patient's heart rate and blood pressure around the clock.",
      "רופאים משתמשים בציוד מתקדמים כדי לנטר את קצב הלב ולחץ הדם של המטופל מסביב לשעון."
    )
  },
  {
    term: "Precise",
    translation: "מדויק",
    level: "advanced",
    sentenceParts: createSentence(
      "In brain surgery, the surgeon must be incredibly precise, as even the smallest mistake could be fatal.",
      "בניתוח מוח, המנתח חייב להיות מדויק להפליא, שכן אפילו הטעות הקטנה ביותר עלולה להיות קטלנית."
    )
  },
  {
    term: "Remote",
    translation: "מרוחק",
    level: "advanced",
    sentenceParts: createSentence(
      "Working from a remote location has become possible thanks to high-speed internet and collaboration tools.",
      "עבודה ממיקום מרוחק הפכה לאפשרית הודות לאינטרנט מהיר וכלי שיתוף פעולה."
    )
  },
  {
    term: "Capacity",
    translation: "קיבולת / יכולת",
    level: "advanced",
    sentenceParts: createSentence(
      "The new stadium has a seating capacity of fifty thousand, making it the largest in the country.",
      "לאצטדיון החדש יש קיבולת מושבים של חמישים אלף, מה שהופך אותו לגדול ביותר במדינה."
    )
  },
  {
    term: "Generate",
    translation: "לייצר / להפיק",
    level: "advanced",
    sentenceParts: createSentence(
      "Solar panels are designed to generate electricity by converting sunlight into usable energy.",
      "פאנלים סולאריים נועדו להפיק חשמל על ידי המרת אור השמש לאנרגיה שמישה."
    )
  },
  {
    term: "Transform",
    translation: "לשנות צורה / להפוך",
    level: "advanced",
    sentenceParts: createSentence(
      "The invention of the smartphone helped transform the way people communicate and access information.",
      "המצאת הסמארטפון עזרה לשנות את הדרך שבה אנשים מתקשרים וניגשים למידע."
    )
  },
  {
    term: "Technique",
    translation: "טכניקה / שיטה",
    level: "advanced",
    sentenceParts: createSentence(
      "The artist developed a unique painting technique that involves layering different textures of oil paint.",
      "האמן פיתח טכניקת ציור ייחודית הכוללת ריבוד מרקמים שונים של צבע שמן."
    )
  },
  {
    term: "Interface",
    translation: "ממשק",
    level: "advanced",
    sentenceParts: createSentence(
      "A user-friendly interface is essential for ensuring that people can easily navigate the software without confusion.",
      "ממשק ידידותי למשתמש חיוני להבטחה שאנשים יוכלו לנווט בתוכנה בקלות וללא בלבול."
    )
  },
  {
    term: "Automatic",
    translation: "אוטומטי",
    level: "advanced",
    sentenceParts: createSentence(
      "The car features an automatic braking system that activates when it detects an obstacle on the road.",
      "המכונית כוללת מערכת בלימה אוטומטית שמופעלת כאשר היא מזהה מכשול על הכביש."
    )
  },
  {
    term: "Modify",
    translation: "לשנות / להתאים",
    level: "advanced",
    sentenceParts: createSentence(
      "We need to modify the original design to ensure it meets the new safety regulations.",
      "אנחנו צריכים לשנות את העיצוב המקורי כדי להבטיח שהוא עומד בתקנות הבטיחות החדשות."
    )
  },
  {
    term: "Advanced",
    translation: "מתקדם",
    level: "advanced",
    sentenceParts: createSentence(
      "This course is intended for advanced students who already have a strong foundation in physics.",
      "קורס זה מיועד לסטודנטים מתקדמים שכבר יש להם יסודות חזקים בפיזיקה."
    )
  },

  // --- 15 מילים אקדמיות (אמירנ"ט) ---
  {
    term: "Algorithm",
    translation: "אלגוריתם",
    level: "academic",
    sentenceParts: createSentence(
      "Search engines use a complex algorithm to determine which websites appear at the top of the results page.",
      "מנועי חיפוש משתמשים באלגוריתם מורכב כדי לקבוע אילו אתרים יופיעו בראש דף התוצאות."
    )
  },
  {
    term: "Automation",
    translation: "אוטומציה",
    level: "academic",
    sentenceParts: createSentence(
      "The factory introduced automation to the assembly line, significantly increasing production speed and reducing costs.",
      "המפעל הכניס אוטומציה לקו ההרכבה, מה שהגדיל משמעותית את מהירות הייצור והפחית עלויות."
    )
  },
  {
    term: "Encryption",
    translation: "הצפנה",
    level: "academic",
    sentenceParts: createSentence(
      "Banks use military-grade encryption to protect their customers' financial data from cyber criminals.",
      "בנקים משתמשים בהצפנה ברמה צבאית כדי להגן על הנתונים הפיננסיים של לקוחותיהם מפני פושעי סייבר."
    )
  },
  {
    term: "Implementation",
    translation: "יישום / הטמעה",
    level: "academic",
    sentenceParts: createSentence(
      "The successful implementation of the new policy requires the cooperation of all department managers.",
      "היישום המוצלח של המדיניות החדשה דורש את שיתוף הפעולה של כל מנהלי המחלקות."
    )
  },
  {
    term: "Integration",
    translation: "אינטגרציה / שילוב",
    level: "academic",
    sentenceParts: createSentence(
      "The integration of artificial intelligence into healthcare systems has improved diagnostic accuracy.",
      "השילוב (אינטגרציה) של בינה מלאכותית במערכות בריאות שיפר את דיוק האבחון."
    )
  },
  {
    term: "Simulation",
    translation: "סימולציה / הדמיה",
    level: "academic",
    sentenceParts: createSentence(
      "Pilots undergo rigorous training using a flight simulation to prepare for emergency situations.",
      "טייסים עוברים הכשרה קפדנית באמצעות סימולציית טיסה כדי להתכונן למצבי חירום."
    )
  },
  {
    term: "Protocol",
    translation: "פרוטוקול / נוהל",
    level: "academic",
    sentenceParts: createSentence(
      "Strict safety protocols must be followed in the laboratory to prevent exposure to hazardous chemicals.",
      "יש לפעול לפי פרוטוקולי בטיחות מחמירים במעבדה כדי למנוע חשיפה לכימיקלים מסוכנים."
    )
  },
  {
    term: "Verification",
    translation: "אימות",
    level: "academic",
    sentenceParts: createSentence(
      "Biometric verification, such as fingerprint scanning, provides a high level of security for accessing sensitive areas.",
      "אימות ביומטרי, כמו סריקת טביעת אצבע, מספק רמה גבוהה של אבטחה לגישה לאזורים רגישים."
    )
  },
  {
    term: "Optimization",
    translation: "אופטימיזציה / ייעול",
    level: "academic",
    sentenceParts: createSentence(
      "Search engine optimization (SEO) is the process of improving a website's visibility on the internet.",
      "אופטימיזציה למנועי חיפוש (SEO) היא התהליך של שיפור הנראות של אתר אינטרנט באינטרנט."
    )
  },
  {
    term: "Autonomous",
    translation: "אוטונומי / עצמאי",
    level: "academic",
    sentenceParts: createSentence(
      "Autonomous vehicles use sensors and software to navigate roads without human intervention.",
      "רכבים אוטונומיים משתמשים בחיישנים ובתוכנה כדי לנווט בכבישים ללא התערבות אנושית."
    )
  },
  {
    term: "Configuration",
    translation: "תצורה / קונפיגורציה",
    level: "academic",
    sentenceParts: createSentence(
      "The network configuration needs to be updated to support the increased traffic from remote users.",
      "תצורת הרשת צריכה להתעדכן כדי לתמוך בתעבורה המוגברת ממשתמשים מרוחקים."
    )
  },
  {
    term: "Cybernetics",
    translation: "קיברנטיקה",
    level: "academic",
    sentenceParts: createSentence(
      "Cybernetics is the study of communication and control systems in living organisms and machines.",
      "קיברנטיקה היא חקר מערכות התקשורת והבקרה באורגניזמים חיים ובמכונות."
    )
  },
  {
    term: "Binary",
    translation: "בינארי (בסיס 2)",
    level: "academic",
    sentenceParts: createSentence(
      "Computers process information using a binary code consisting of sequences of ones and zeros.",
      "מחשבים מעבדים מידע באמצעות קוד בינארי המורכב מרצפים של אחדות ואפסים."
    )
  },
  {
    term: "Innovative",
    translation: "חדשני (חזרה לחיזוק)",
    level: "academic",
    sentenceParts: createSentence(
      "Innovative solutions are often required to solve problems that traditional methods cannot handle.",
      "פתרונות חדשניים נדרשים לעיתים קרובות כדי לפתור בעיות ששיטות מסורתיות אינן יכולות להתמודד איתן."
    )
  },
  {
    term: "Parameter",
    translation: "פרמטר / משתנה קבוע",
    level: "academic",
    sentenceParts: createSentence(
      "We need to define the parameters of the project clearly before we start allocating the budget.",
      "אנחנו צריכים להגדיר את הפרמטרים של הפרויקט בבירור לפני שנתחיל להקצות את התקציב."
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