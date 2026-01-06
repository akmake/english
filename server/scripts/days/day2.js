import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Word from '../../models/Word.js';
import Day from '../../models/Day.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const DAY_NUMBER = 2;
const DAY_TITLE = "עסקים, קריירה וכלכלה (Business & Economics)";

const createSentence = (en, he) => [{ en, he }];

const wordsData = [
  // --- 15 מילים "רגילות" (גבוהות) ---
  {
    term: "Lucrative",
    translation: "רווחי / משתלם",
    level: "advanced",
    sentenceParts: createSentence(
      "The real estate market in the city center has become incredibly lucrative for investors who bought property a decade ago.",
      "שוק הנדל\"ן במרכז העיר הפך לרווחי להפליא עבור משקיעים שרכשו נכסים לפני עשור."
    )
  },
  {
    term: "Negotiation",
    translation: "משא ומתן",
    level: "advanced",
    sentenceParts: createSentence(
      "After weeks of intense negotiation, the two companies finally reached an agreement regarding the terms of the merger.",
      "לאחר שבועות של משא ומתן אינטנסיבי, שתי החברות הגיעו סוף סוף להסכם בנוגע לתנאי המיזוג."
    )
  },
  {
    term: "Deadline",
    translation: "מועד אחרון / דד-ליין",
    level: "advanced",
    sentenceParts: createSentence(
      "The project manager emphasized that missing the final deadline would result in severe financial penalties for the firm.",
      "מנהל הפרויקט הדגיש כי החמצת המועד האחרון הסופי תגרום לקנסות כספיים חמורים עבור החברה."
    )
  },
  {
    term: "Collaborate",
    translation: "לשתף פעולה",
    level: "advanced",
    sentenceParts: createSentence(
      "In order to solve complex global problems like climate change, nations must collaborate rather than compete with one another.",
      "על מנת לפתור בעיות גלובליות מורכבות כמו שינויי אקלים, אומות חייבות לשתף פעולה במקום להתחרות זו בזו."
    )
  },
  {
    term: "Entrepreneur",
    translation: "יזם",
    level: "advanced",
    sentenceParts: createSentence(
      "Being a successful entrepreneur requires not only a brilliant idea but also the resilience to overcome repeated failures.",
      "להיות יזם מצליח דורש לא רק רעיון מבריק אלא גם את החוסן להתגבר על כישלונות חוזרים ונשנים."
    )
  },
  {
    term: "Innovative",
    translation: "חדשני",
    level: "advanced",
    sentenceParts: createSentence(
      "The company is known for its innovative approach to design, constantly pushing the boundaries of what is technologically possible.",
      "החברה ידועה בגישה החדשנית שלה לעיצוב, כשהיא דוחפת ללא הרף את הגבולות של מה שאפשרי טכנולוגית."
    )
  },
  {
    term: "Expand",
    translation: "להרחיב / להתרחב",
    level: "advanced",
    sentenceParts: createSentence(
      "The retail chain plans to expand its operations into international markets, starting with branches in Europe and Asia.",
      "רשת הקמעונאות מתכננת להרחיב את פעילותה לשווקים בינלאומיים, החל מסניפים באירופה ובאסיה."
    )
  },
  {
    term: "Consume",
    translation: "לצרוך / לכלות",
    level: "advanced",
    sentenceParts: createSentence(
      "Modern society tends to consume natural resources at a rate that is far from sustainable for future generations.",
      "החברה המודרנית נוטה לצרוך משאבי טבע בקצב שהוא רחוק מלהיות בר-קיימא עבור הדורות הבאים."
    )
  },
  {
    term: "Efficient",
    translation: "יעיל",
    level: "advanced",
    sentenceParts: createSentence(
      "The new software algorithm is far more efficient than the old one, processing data in half the time.",
      "אלגוריתם התוכנה החדש יעיל הרבה יותר מהישן, ומעבד נתונים במחצית הזמן."
    )
  },
  {
    term: "Objective",
    translation: "מטרה / אובייקטיבי",
    level: "advanced",
    sentenceParts: createSentence(
      "Our primary objective is to increase customer satisfaction while maintaining high standards of quality control.",
      "המטרה העיקרית שלנו היא להגדיל את שביעות רצון הלקוחות תוך שמירה על סטנדרטים גבוהים של בקרת איכות."
    )
  },
  {
    term: "Asset",
    translation: "נכס",
    level: "advanced",
    sentenceParts: createSentence(
      "Her ability to speak four languages fluently is a valuable asset to our international sales department.",
      "היכולת שלה לדבר ארבע שפות באופן שוטף היא נכס יקר ערך למחלקת המכירות הבינלאומית שלנו."
    )
  },
  {
    term: "Liability",
    translation: "התחייבות / מעמסה (משפטי/כספי)",
    level: "advanced",
    sentenceParts: createSentence(
      "The company refused to accept liability for the damages caused by the defective product, leading to a lawsuit.",
      "החברה סירבה לקבל אחריות (חבות) על הנזקים שנגרמו על ידי המוצר הפגום, מה שהוביל לתביעה משפטית."
    )
  },
  {
    term: "Promote",
    translation: "לקדם",
    level: "advanced",
    sentenceParts: createSentence(
      "The government launched a campaign to promote healthy eating habits among young children in schools.",
      "הממשלה השיקה קמפיין לקידום הרגלי אכילה בריאים בקרב ילדים צעירים בבתי הספר."
    )
  },
  {
    term: "Recruit",
    translation: "לגייס (עובדים/חיילים)",
    level: "advanced",
    sentenceParts: createSentence(
      "We are looking to recruit talented engineers who are passionate about developing renewable energy solutions.",
      "אנו מחפשים לגייס מהנדסים מוכשרים שיש להם תשוקה לפיתוח פתרונות אנרגיה מתחדשת."
    )
  },
  {
    term: "Merger",
    translation: "מיזוג (בין חברות)",
    level: "advanced",
    sentenceParts: createSentence(
      "The merger between the two banking giants is expected to create the largest financial institution in the region.",
      "המיזוג בין שני ענקי הבנקאות צפוי ליצור את המוסד הפיננסי הגדול ביותר באזור."
    )
  },

  // --- 15 מילים אקדמיות (אמירנ"ט) ---
  {
    term: "Fiscal",
    translation: "פיסקלי (קשור לתקציב המדינה)",
    level: "academic",
    sentenceParts: createSentence(
      "The government's fiscal policy involves adjusting tax rates and public spending to influence the nation's economy.",
      "המדיניות הפיסקלית של הממשלה כרוכה בהתאמת שיעורי המס וההוצאה הציבורית כדי להשפיע על כלכלת המדינה."
    )
  },
  {
    term: "Monetary",
    translation: "מוניטרי (כספי)",
    level: "academic",
    sentenceParts: createSentence(
      "The central bank decided to tighten monetary policy by raising interest rates to combat rising inflation.",
      "הבנק המרכזי החליט להדק את המדיניות המוניטרית על ידי העלאת הריבית כדי להילחם באינפלציה הגואה."
    )
  },
  {
    term: "Subsidy",
    translation: "סבסוד / תמיכה כספית",
    level: "academic",
    sentenceParts: createSentence(
      "Farmers receive a government subsidy to help them cope with the fluctuating prices of crops in the global market.",
      "חקלאים מקבלים סבסוד ממשלתי כדי לעזור להם להתמודד עם המחירים המשתנים של יבולים בשוק העולמי."
    )
  },
  {
    term: "Revenue",
    translation: "הכנסה (של חברה/מדינה)",
    level: "academic",
    sentenceParts: createSentence(
      "Despite the economic downturn, the company managed to generate substantial revenue through online sales.",
      "למרות ההאטה הכלכלית, החברה הצליחה לייצר הכנסה משמעותית באמצעות מכירות מקוונות."
    )
  },
  {
    term: "Deficit",
    translation: "גירעון",
    level: "academic",
    sentenceParts: createSentence(
      "The national budget deficit has reached an all-time high, prompting calls for immediate spending cuts.",
      "הגירעון בתקציב הלאומי הגיע לשיא של כל הזמנים, מה שעורר קריאות לקיצוצים מיידיים בהוצאות."
    )
  },
  {
    term: "Commodity",
    translation: "סחורה / מצרך",
    level: "academic",
    sentenceParts: createSentence(
      "Oil is a valuable commodity that significantly influences the geopolitical relationships between nations.",
      "נפט הוא סחורה יקרת ערך שמשפיעה באופן משמעותי על היחסים הגיאופוליטיים בין אומות."
    )
  },
  {
    term: "Inflation",
    translation: "אינפלציה",
    level: "academic",
    sentenceParts: createSentence(
      "Hyperinflation can cause money to lose its value so quickly that people must carry bags of cash just to buy bread.",
      "היפר-אינפלציה יכולה לגרום לכסף לאבד את ערכו כל כך מהר שאנשים חייבים לשאת שקים של מזומנים רק כדי לקנות לחם."
    )
  },
  {
    term: "Allocation",
    translation: "הקצאה",
    level: "academic",
    sentenceParts: createSentence(
      "The proper allocation of resources is crucial for the success of any large-scale military operation.",
      "ההקצאה הנכונה של משאבים היא קריטית להצלחה של כל מבצע צבאי בקנה מידה גדול."
    )
  },
  {
    term: "Expenditure",
    translation: "הוצאה (כספית)",
    level: "academic",
    sentenceParts: createSentence(
      "The committee reviewed the annual expenditure report to identify areas where costs could be reduced.",
      "הוועדה סקרה את דוח ההוצאות השנתי כדי לזהות תחומים שבהם ניתן להפחית עלויות."
    )
  },
  {
    term: "Capitalism",
    translation: "קפיטליזם",
    level: "academic",
    sentenceParts: createSentence(
      "Critics of capitalism argue that it creates significant wealth inequality between the rich and the poor.",
      "מבקרי הקפיטליזם טוענים שהוא יוצר אי-שוויון משמעותי בעושר בין העשירים לעניים."
    )
  },
  {
    term: "Infrastructure",
    translation: "תשתית",
    level: "academic",
    sentenceParts: createSentence(
      "Investing in infrastructure, such as roads, bridges, and internet connectivity, is essential for economic growth.",
      "השקעה בתשתית, כגון כבישים, גשרים וחיבור לאינטרנט, חיונית לצמיחה כלכלית."
    )
  },
  {
    term: "Monopoly",
    translation: "מונופול",
    level: "academic",
    sentenceParts: createSentence(
      "The government stepped in to break up the monopoly, ensuring fair competition in the telecommunications market.",
      "הממשלה התערבה כדי לפרק את המונופול, ובכך להבטיח תחרות הוגנת בשוק התקשורת."
    )
  },
  {
    term: "Privatization",
    translation: "הפרטה",
    level: "academic",
    sentenceParts: createSentence(
      "The privatization of the national airline was met with protests from unions concerned about job security.",
      "הפרטת חברת התעופה הלאומית נתקלה במחאות מצד איגודים שחששו לביטחון תעסוקתי."
    )
  },
  {
    term: "Fluctuate",
    translation: "להתנדנד / לעלות ולרדת",
    level: "academic",
    sentenceParts: createSentence(
      "Stock market prices tend to fluctuate wildly during periods of political instability or economic uncertainty.",
      "מחירי שוק המניות נוטים להתנדנד בפראות בתקופות של חוסר יציבות פוליטית או אי-ודאות כלכלית."
    )
  },
  {
    term: "Sector",
    translation: "מגזר",
    level: "academic",
    sentenceParts: createSentence(
      "The service sector has grown significantly in recent decades, surpassing manufacturing as the primary source of jobs.",
      "מגזר השירותים צמח משמעותית בעשורים האחרונים, ועקף את הייצור כמקור העיקרי למשרות."
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