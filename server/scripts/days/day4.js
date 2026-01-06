import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Word from '../../models/Word.js';
import Day from '../../models/Day.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const DAY_NUMBER = 4;
const DAY_TITLE = "חברה, תרבות וסוציולוגיה (Society & Culture)";

const createSentence = (en, he) => [{ en, he }];

const wordsData = [
  // --- 15 מילים רגילות (גבוהות) ---
  {
    term: "Community",
    translation: "קהילה",
    level: "advanced",
    sentenceParts: createSentence(
      "The local community came together to support the family who lost their home in the fire.",
      "הקהילה המקומית התכנסה כדי לתמוך במשפחה שאיבדה את ביתה בשריפה."
    )
  },
  {
    term: "Diversity",
    translation: "גיוון",
    level: "advanced",
    sentenceParts: createSentence(
      "New York City is famous for its cultural diversity, with residents from almost every country in the world.",
      "העיר ניו יורק מפורסמת בגיוון התרבותי שלה, עם תושבים כמעט מכל מדינה בעולם."
    )
  },
  {
    term: "Tradition",
    translation: "מסורת",
    level: "advanced",
    sentenceParts: createSentence(
      "It is a long-standing tradition in their family to gather for a big meal every Sunday afternoon.",
      "זוהי מסורת ארוכת שנים במשפחתם להתכנס לארוחה גדולה בכל יום ראשון אחר הצהריים."
    )
  },
  {
    term: "Citizen",
    translation: "אזרח",
    level: "advanced",
    sentenceParts: createSentence(
      "Every citizen has the right to vote and influence the political future of their country.",
      "לכל אזרח יש את הזכות להצביע ולהשפיע על העתיד הפוליטי של מדינתו."
    )
  },
  {
    term: "Poverty",
    translation: "עוני",
    level: "advanced",
    sentenceParts: createSentence(
      "The government announced a new initiative aimed at reducing poverty and improving living conditions in rural areas.",
      "הממשלה הכריזה על יוזמה חדשה שמטרתה להפחית את העוני ולשפר את תנאי המחיה באזורים כפריים."
    )
  },
  {
    term: "Discriminate",
    translation: "להפלות",
    level: "advanced",
    sentenceParts: createSentence(
      "It is illegal to discriminate against employees based on their race, gender, or religious beliefs.",
      "זה לא חוקי להפלות עובדים על בסיס גזעם, מינם או אמונותיהם הדתיות."
    )
  },
  {
    term: "Welfare",
    translation: "רווחה",
    level: "advanced",
    sentenceParts: createSentence(
      "Social welfare programs are designed to provide assistance to those who are unemployed or unable to work.",
      "תוכניות רווחה חברתית נועדו לספק סיוע לאלה שהם מובטלים או שאינם מסוגלים לעבוד."
    )
  },
  {
    term: "Status",
    translation: "מעמד / סטטוס",
    level: "advanced",
    sentenceParts: createSentence(
      "In many societies, owning luxury cars and expensive jewelry is seen as a symbol of high social status.",
      "בחברות רבות, בעלות על מכוניות יוקרה ותכשיטים יקרים נתפסת כסמל למעמד חברתי גבוה."
    )
  },
  {
    term: "Norm",
    translation: "נורמה",
    level: "advanced",
    sentenceParts: createSentence(
      "Working from home has become the new norm for many employees since the global pandemic began.",
      "עבודה מהבית הפכה לנורמה החדשה עבור עובדים רבים מאז שהחלה המגפה העולמית."
    )
  },
  {
    term: "Urban",
    translation: "עירוני",
    level: "advanced",
    sentenceParts: createSentence(
      "Urban planning involves designing cities that are efficient, sustainable, and pleasant for residents to live in.",
      "תכנון עירוני כרוך בעיצוב ערים שהן יעילות, בנות-קיימא ונעימות למגורים עבור התושבים."
    )
  },
  {
    term: "Rural",
    translation: "כפרי",
    level: "advanced",
    sentenceParts: createSentence(
      "Many people are moving from busy cities to rural areas in search of a quieter and more peaceful lifestyle.",
      "אנשים רבים עוברים מערים עמוסות לאזורים כפריים בחיפוש אחר אורח חיים שקט ורגוע יותר."
    )
  },
  {
    term: "Immigrant",
    translation: "מהגר",
    level: "advanced",
    sentenceParts: createSentence(
      "As an immigrant, he faced many challenges adapting to the new culture and learning the language.",
      "כמהגר, הוא התמודד עם אתגרים רבים בהסתגלות לתרבות החדשה ובלימוד השפה."
    )
  },
  {
    term: "Heritage",
    translation: "מורשת",
    level: "advanced",
    sentenceParts: createSentence(
      "UNESCO World Heritage sites are protected because of their cultural, historical, or scientific significance.",
      "אתרי מורשת עולמית של אונסק\"ו מוגנים בשל חשיבותם התרבותית, ההיסטורית או המדעית."
    )
  },
  {
    term: "Reform",
    translation: "רפורמה / תיקון",
    level: "advanced",
    sentenceParts: createSentence(
      "The education minister proposed a major reform to update the curriculum and improve teacher training.",
      "שר החינוך הציע רפורמה משמעותית כדי לעדכן את תוכנית הלימודים ולשפר את הכשרת המורים."
    )
  },
  {
    term: "Conflict",
    translation: "סכסוך / קונפליקט",
    level: "advanced",
    sentenceParts: createSentence(
      "Diplomats are working hard to resolve the conflict between the two nations through peaceful dialogue.",
      "דיפלומטים עובדים קשה כדי לפתור את הסכסוך בין שתי האומות באמצעות דיאלוג לשלום."
    )
  },

  // --- 15 מילים אקדמיות (אמירנ"ט) ---
  {
    term: "Demographic",
    translation: "דמוגרפי (קשור לאוכלוסייה)",
    level: "academic",
    sentenceParts: createSentence(
      "The demographic shift towards an aging population presents significant challenges for the healthcare system.",
      "השינוי הדמוגרפי לעבר אוכלוסייה מתבגרת מציב אתגרים משמעותיים בפני מערכת הבריאות."
    )
  },
  {
    term: "Socioeconomic",
    translation: "סוציו-אקונומי (חברתי-כלכלי)",
    level: "academic",
    sentenceParts: createSentence(
      "There is a clear link between socioeconomic status and access to quality education and healthcare.",
      "יש קשר ברור בין סטטוס סוציו-אקונומי לבין גישה לחינוך איכותי ושירותי בריאות."
    )
  },
  {
    term: "Segregation",
    translation: "הפרדה / סגרגציה",
    level: "academic",
    sentenceParts: createSentence(
      "The civil rights movement fought to end racial segregation in public schools and other facilities.",
      "התנועה לזכויות האזרח נאבקה כדי לסיים את ההפרדה הגזעית בבתי ספר ציבוריים ובמתקנים אחרים."
    )
  },
  {
    term: "Assimilation",
    translation: "התבוללות / הטמעה",
    level: "academic",
    sentenceParts: createSentence(
      "Cultural assimilation occurs when a minority group gradually adopts the customs and attitudes of the dominant culture.",
      "התבוללות תרבותית מתרחשת כאשר קבוצת מיעוט מאמצת בהדרגה את המנהגים והעמדות של התרבות השלטת."
    )
  },
  {
    term: "Hierarchy",
    translation: "היררכיה / מדרג",
    level: "academic",
    sentenceParts: createSentence(
      "Maslow's hierarchy of needs suggests that basic physiological needs must be met before individuals can pursue self-fulfillment.",
      "מדרג הצרכים של מאסלו מציע כי צרכים פיזיולוגיים בסיסיים חייבים להתמלא לפני שאנשים יכולים לשאוף להגשמה עצמית."
    )
  },
  {
    term: "Stereotype",
    translation: "סטריאוטיפ / דעה קדומה",
    level: "academic",
    sentenceParts: createSentence(
      "It is important to challenge the negative stereotype that all teenagers are rebellious and irresponsible.",
      "חשוב לאתגר את הסטריאוטיפ השלילי שכל בני הנוער הם מרדנים וחסרי אחריות."
    )
  },
  {
    term: "Globalization",
    translation: "גלובליזציה",
    level: "academic",
    sentenceParts: createSentence(
      "Globalization has connected economies around the world, making it easier to trade goods and share information.",
      "הגלובליזציה חיברה כלכלות ברחבי העולם, מה שמקל על סחר בסחורות ושיתוף מידע."
    )
  },
  {
    term: "Ethics",
    translation: "אתיקה / מוסר",
    level: "academic",
    sentenceParts: createSentence(
      "Medical ethics dictate that a doctor must always prioritize the well-being and autonomy of the patient.",
      "האתיקה הרפואית מכתיבה שרופא חייב תמיד לתעדף את רווחתו ואת האוטונומיה של המטופל."
    )
  },
  {
    term: "Paradigm",
    translation: "פרדיגמה / תבנית חשיבה",
    level: "academic",
    sentenceParts: createSentence(
      "The discovery of quantum mechanics represented a shift in the scientific paradigm regarding how we understand the universe.",
      "גילוי מכניקת הקוונטים ייצג שינוי בפרדיגמה המדעית לגבי האופן שבו אנו מבינים את היקום."
    )
  },
  {
    term: "Indigenous",
    translation: "ילידי / מקומי",
    level: "academic",
    sentenceParts: createSentence(
      "The indigenous people of the region have a deep spiritual connection to the land and its natural resources.",
      "האנשים הילידים של האזור בעלי קשר רוחני עמוק לאדמה ולמשאבי הטבע שלה."
    )
  },
  {
    term: "Disparity",
    translation: "פער / אי-שוויון",
    level: "academic",
    sentenceParts: createSentence(
      "The economic report highlighted the growing disparity between the wealthy elite and the working class.",
      "הדוח הכלכלי הדגיש את הפער הגדל בין האליטה העשירה לבין מעמד הפועלים."
    )
  },
  {
    term: "Prejudice",
    translation: "דעה קדומה",
    level: "academic",
    sentenceParts: createSentence(
      "Education plays a vital role in reducing prejudice and fostering understanding between different cultural groups.",
      "חינוך משחק תפקיד חיוני בהפחתת דעות קדומות וטיפוח הבנה בין קבוצות תרבותיות שונות."
    )
  },
  {
    term: "Humanitarian",
    translation: "הומניטרי",
    level: "academic",
    sentenceParts: createSentence(
      "Several international organizations sent humanitarian aid to the war-torn region to help the refugees.",
      "מספר ארגונים בינלאומיים שלחו סיוע הומניטרי לאזור מוכה המלחמה כדי לעזור לפליטים."
    )
  },
  {
    term: "Consensus",
    translation: "קונצנזוס / הסכמה כללית",
    level: "academic",
    sentenceParts: createSentence(
      "Although there were differing opinions, the committee eventually reached a consensus on the new policy.",
      "למרות שהיו דעות חלוקות, הוועדה הגיעה לבסוף לקונצנזוס לגבי המדיניות החדשה."
    )
  },
  {
    term: "Ideology",
    translation: "אידיאולוגיה",
    level: "academic",
    sentenceParts: createSentence(
      "Political parties are often defined by their underlying ideology regarding the role of government in society.",
      "מפלגות פוליטיות מוגדרות לעיתים קרובות על ידי האידיאולוגיה הבסיסית שלהן לגבי תפקיד הממשלה בחברה."
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