import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Word from '../../models/Word.js';
import Day from '../../models/Day.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const DAY_NUMBER = 3;
const DAY_TITLE = "מדע וסביבה (Science & Environment)";

const createSentence = (en, he) => [{ en, he }];

const wordsData = [
  // --- 15 מילים רגילות (אנגלית גבוהה) ---
  {
    term: "Environment",
    translation: "סביבה",
    level: "advanced",
    sentenceParts: createSentence(
      "We must take immediate action to protect the environment from the harmful effects of industrial pollution.",
      "עלינו לנקוט בפעולה מיידית כדי להגן על הסביבה מההשפעות המזיקות של זיהום תעשייתי."
    )
  },
  {
    term: "Gravity",
    translation: "כוח משיכה / חומרה (של מצב)",
    level: "advanced",
    sentenceParts: createSentence(
      "The astronauts experienced zero gravity while floating inside the international space station.",
      "האסטרונאוטים חוו כוח משיכה אפס בזמן שריחפו בתוך תחנת החלל הבינלאומית."
    )
  },
  {
    term: "Evolution",
    translation: "אבולוציה / התפתחות",
    level: "advanced",
    sentenceParts: createSentence(
      "Darwin's theory of evolution explains how species adapt to their surroundings over millions of years.",
      "תורת האבולוציה של דארווין מסבירה כיצד מינים מסתגלים לסביבתם במשך מיליוני שנים."
    )
  },
  {
    term: "Absorb",
    translation: "לספוג",
    level: "advanced",
    sentenceParts: createSentence(
      "Plants use their roots to absorb water and essential nutrients from the soil to grow healthy.",
      "צמחים משתמשים בשורשים שלהם כדי לספוג מים וחומרים מזינים חיוניים מהאדמה כדי לגדול בריאים."
    )
  },
  {
    term: "Launch",
    translation: "לשגר / להשיק",
    level: "advanced",
    sentenceParts: createSentence(
      "The space agency plans to launch a new satellite next month to monitor global weather patterns.",
      "סוכנות החלל מתכננת לשגר לוויין חדש בחודש הבא כדי לעקוב אחר דפוסי מזג אוויר עולמיים."
    )
  },
  {
    term: "Predict",
    translation: "לחזות",
    level: "advanced",
    sentenceParts: createSentence(
      "Meteorologists use advanced computer models to predict the path of the hurricane with greater accuracy.",
      "מטאורולוגים משתמשים במודלים ממוחשבים מתקדמים כדי לחזות את מסלול ההוריקן בדיוק רב יותר."
    )
  },
  {
    term: "Endangered",
    translation: "בסכנת הכחדה",
    level: "advanced",
    sentenceParts: createSentence(
      "The black rhino is considered an endangered species due to excessive poaching for its horn.",
      "הקרנף השחור נחשב למין בסכנת הכחדה עקב ציד בלתי חוקי מוגזם עבור הקרן שלו."
    )
  },
  {
    term: "Contaminate",
    translation: "לזהם (נוזל/חומר)",
    level: "advanced",
    sentenceParts: createSentence(
      "Leaking chemicals from the factory could contaminate the local water supply, posing a health risk to residents.",
      "כימיקלים דולפים מהמפעל עלולים לזהם את אספקת המים המקומית, ולהוות סיכון בריאותי לתושבים."
    )
  },
  {
    term: "Toxic",
    translation: "רעיל",
    level: "advanced",
    sentenceParts: createSentence(
      "Many household cleaning products contain toxic ingredients that should be kept out of reach of children.",
      "מוצרי ניקוי ביתיים רבים מכילים רכיבים רעילים שיש לשמור הרחק מהישג ידם של ילדים."
    )
  },
  {
    term: "Preserve",
    translation: "לשמר",
    level: "advanced",
    sentenceParts: createSentence(
      "It is our moral duty to preserve the rainforests, as they are the lungs of our planet.",
      "זוהי חובתנו המוסרית לשמר את יערות הגשם, שכן הם הריאות של הפלנטה שלנו."
    )
  },
  {
    term: "Fossil",
    translation: "מאובן",
    level: "advanced",
    sentenceParts: createSentence(
      "The discovery of a dinosaur fossil in the desert provided scientists with new insights into the prehistoric era.",
      "גילוי מאובן של דינוזאור במדבר סיפק למדענים תובנות חדשות לגבי התקופה הפרהיסטורית."
    )
  },
  {
    term: "Renewable",
    translation: "מתחדש",
    level: "advanced",
    sentenceParts: createSentence(
      "Solar and wind power are examples of renewable energy sources that do not deplete the earth's resources.",
      "אנרגיה סולארית ורוח הן דוגמאות למקורות אנרגיה מתחדשת שאינם מכלים את משאבי כדור הארץ."
    )
  },
  {
    term: "Atmosphere",
    translation: "אטמוספירה / אווירה",
    level: "advanced",
    sentenceParts: createSentence(
      "The earth's atmosphere protects us from harmful solar radiation and keeps the planet warm enough for life.",
      "האטמוספירה של כדור הארץ מגנה עלינו מפני קרינה סולארית מזיקה ושומרת על הפלנטה חמה מספיק לחיים."
    )
  },
  {
    term: "Experiment",
    translation: "ניסוי",
    level: "advanced",
    sentenceParts: createSentence(
      "The scientist conducted an experiment to test whether the new drug was effective against the virus.",
      "המדען ערך ניסוי כדי לבדוק אם התרופה החדשה יעילה נגד הנגיף."
    )
  },
  {
    term: "Adapt",
    translation: "להסתגל",
    level: "advanced",
    sentenceParts: createSentence(
      "Animals that live in the arctic must adapt to extreme cold temperatures in order to survive.",
      "בעלי חיים החיים באזור הארקטי חייבים להסתגל לטמפרטורות קור קיצוניות כדי לשרוד."
    )
  },

  // --- 15 מילים אקדמיות (אמירנ"ט) ---
  {
    term: "Ecosystem",
    translation: "מערכת אקולוגית",
    level: "academic",
    sentenceParts: createSentence(
      "The introduction of a new predator can disrupt the delicate balance of the entire ecosystem.",
      "הכנסת טורף חדש יכולה לשבש את האיזון העדין של המערכת האקולוגית כולה."
    )
  },
  {
    term: "Biodiversity",
    translation: "מגוון ביולוגי",
    level: "academic",
    sentenceParts: createSentence(
      "The Amazon rainforest is known for its incredible biodiversity, hosting millions of different species of plants and animals.",
      "יער הגשם של האמזונס ידוע במגוון הביולוגי המדהים שלו, ומארח מיליוני מינים שונים של צמחים ובעלי חיים."
    )
  },
  {
    term: "Emission",
    translation: "פליטה (של גז/חום)",
    level: "academic",
    sentenceParts: createSentence(
      "Reducing carbon dioxide emissions is a critical step in the fight against global warming.",
      "הפחתת פליטות הפחמן הדו-חמצני היא צעד קריטי במאבק נגד ההתחממות הגלובלית."
    )
  },
  {
    term: "Equilibrium",
    translation: "שיווי משקל / איזון",
    level: "academic",
    sentenceParts: createSentence(
      "In chemistry, equilibrium occurs when the rate of the forward reaction equals the rate of the reverse reaction.",
      "בכימיה, שיווי משקל מתרחש כאשר קצב התגובה הקדימה שווה לקצב התגובה ההפוכה."
    )
  },
  {
    term: "Kinetic",
    translation: "קינטי (של תנועה)",
    level: "academic",
    sentenceParts: createSentence(
      "Potential energy is stored energy, while kinetic energy is the energy of an object in motion.",
      "אנרגיה פוטנציאלית היא אנרגיה אגורה, בעוד שאנרגיה קינטית היא האנרגיה של עצם בתנועה."
    )
  },
  {
    term: "Organism",
    translation: "אורגניזם / יצור חי",
    level: "academic",
    sentenceParts: createSentence(
      "A virus is a microscopic organism that can only replicate inside the living cells of a host.",
      "וירוס הוא אורגניזם מיקרוסקופי שיכול להשתכפל רק בתוך תאים חיים של מארח."
    )
  },
  {
    term: "Molecule",
    translation: "מולקולה",
    level: "academic",
    sentenceParts: createSentence(
      "Water is composed of molecules containing two hydrogen atoms and one oxygen atom.",
      "מים מורכבים ממולקולות המכילות שני אטומי מימן ואטום חמצן אחד."
    )
  },
  {
    term: "Genetic",
    translation: "גנטי / תורשתי",
    level: "academic",
    sentenceParts: createSentence(
      "Certain diseases are genetic, meaning they are passed down from parents to their children through DNA.",
      "מחלות מסוימות הן גנטיות, כלומר הן מועברות מהורים לילדיהם באמצעות ה-DNA."
    )
  },
  {
    term: "Photosynthesis",
    translation: "פוטוסינתזה / הטמעה",
    level: "academic",
    sentenceParts: createSentence(
      "Photosynthesis is the process by which green plants use sunlight to synthesize nutrients from carbon dioxide and water.",
      "פוטוסינתזה היא התהליך שבו צמחים ירוקים משתמשים באור השמש כדי לסנתז חומרים מזינים מפחמן דו-חמצני ומים."
    )
  },
  {
    term: "Sustainable",
    translation: "בר-קיימא",
    level: "academic",
    sentenceParts: createSentence(
      "We need to develop sustainable agricultural practices that do not deplete the soil or harm the environment.",
      "אנחנו צריכים לפתח שיטות חקלאיות בנות-קיימא שאינן מכלות את האדמה או פוגעות בסביבה."
    )
  },
  {
    term: "Radiation",
    translation: "קרינה",
    level: "academic",
    sentenceParts: createSentence(
      "Exposure to high levels of nuclear radiation can cause severe health problems and damage to DNA.",
      "חשיפה לרמות גבוהות של קרינה גרעינית יכולה לגרום לבעיות בריאות חמורות ונזק ל-DNA."
    )
  },
  {
    term: "Velocity",
    translation: "מהירות (עם כיוון)",
    level: "academic",
    sentenceParts: createSentence(
      "In physics, velocity refers to the speed of an object in a specific direction.",
      "בפיזיקה, מהירות (Velocity) מתייחסת למהירות של עצם בכיוון מסוים."
    )
  },
  {
    term: "Synthetic",
    translation: "סינתטי / מלאכותי",
    level: "academic",
    sentenceParts: createSentence(
      "Nylon is a synthetic material that was developed as an alternative to natural silk.",
      "ניילון הוא חומר סינתטי שפותח כחלופה למשי טבעי."
    )
  },
  {
    term: "Mutation",
    translation: "מוטציה",
    level: "academic",
    sentenceParts: createSentence(
      "A random genetic mutation can sometimes give an organism an advantage in survival, driving evolution.",
      "מוטציה גנטית אקראית יכולה לפעמים להעניק לאורגניזם יתרון בהישרדות, מה שמניע את האבולוציה."
    )
  },
  {
    term: "Precipitation",
    translation: "משקעים (גשם, שלג)",
    level: "academic",
    sentenceParts: createSentence(
      "The forecast predicts heavy precipitation in the northern region, including both rain and snow.",
      "התחזית צופה משקעים כבדים באזור הצפון, כולל גשם ושלג."
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