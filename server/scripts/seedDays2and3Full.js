import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Word from '../models/Word.js';
import Day from '../models/Day.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// ============================================================================
// יום 2: עסקים וקריירה (30 מילים מלאות)
// ============================================================================
const day2Data = [
  // 1-10
  { term: "Efficient", translation: "יעיל", level: "advanced", sentenceParts: [{en:"He",he:"הוא"},{en:"is",he:"הינו"},{en:"an",he:"אחד"},{en:"efficient",he:"יעיל"},{en:"worker",he:"עובד"}] },
  { term: "Salary", translation: "משכורת", level: "intermediate", sentenceParts: [{en:"She",he:"היא"},{en:"receives",he:"מקבלת"},{en:"a",he:"אחת"},{en:"high",he:"גבוהה"},{en:"salary",he:"משכורת"}] },
  { term: "Manage", translation: "לנהל / להסתדר", level: "intermediate", sentenceParts: [{en:"Can",he:"האם"},{en:"you",he:"אתה"},{en:"manage",he:"מסתדר/מנהל"},{en:"the",he:"את ה"},{en:"team",he:"צוות"}] },
  { term: "Career", translation: "קריירה", level: "intermediate", sentenceParts: [{en:"He",he:"הוא"},{en:"focused",he:"התמקד"},{en:"on",he:"ב"},{en:"his",he:"שלו"},{en:"career",he:"קריירה"}] },
  { term: "Deadline", translation: "מועד אחרון / דד-ליין", level: "advanced", sentenceParts: [{en:"We",he:"אנחנו"},{en:"must",he:"חייבים"},{en:"meet",he:"לעמוד ב"},{en:"the",he:"ה"},{en:"deadline",he:"מועד אחרון"}] },
  { term: "Negotiate", translation: "לשאת ולתת (מו\"מ)", level: "academic", sentenceParts: [{en:"They",he:"הם"},{en:"tried",he:"ניסו"},{en:"to",he:"ל"},{en:"negotiate",he:"לנהל מו\"מ על"},{en:"the",he:"ה"},{en:"price",he:"מחיר"}] },
  { term: "Consumer", translation: "צרכן", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"consumer",he:"צרכן"},{en:"has",he:"יש לו"},{en:"rights",he:"זכויות"}] },
  { term: "Profit", translation: "רווח", level: "advanced", sentenceParts: [{en:"The",he:"ה"},{en:"company",he:"חברה"},{en:"made",he:"עשתה"},{en:"a",he:"אחד"},{en:"huge",he:"ענק"},{en:"profit",he:"רווח"}] },
  { term: "Investment", translation: "השקעה", level: "academic", sentenceParts: [{en:"This",he:"זוהי"},{en:"is",he:"היא"},{en:"a",he:"אחת"},{en:"good",he:"טובה"},{en:"investment",he:"השקעה"}] },
  { term: "Debt", translation: "חוב", level: "advanced", sentenceParts: [{en:"He",he:"הוא"},{en:"is",he:"נמצא"},{en:"in",he:"ב"},{en:"deep",he:"עמוק"},{en:"debt",he:"חוב"}] },

  // 11-20
  { term: "Executive", translation: "מנהל בכיר / ביצועי", level: "academic", sentenceParts: [{en:"She",he:"היא"},{en:"is",he:"הינה"},{en:"a",he:"אחת"},{en:"top",he:"בכירה"},{en:"executive",he:"מנהלת"}] },
  { term: "Proposal", translation: "הצעה", level: "advanced", sentenceParts: [{en:"They",he:"הם"},{en:"rejected",he:"דחו"},{en:"the",he:"את ה"},{en:"proposal",he:"הצעה"}] },
  { term: "Revenue", translation: "הכנסה (של חברה/מדינה)", level: "academic", sentenceParts: [{en:"Tax",he:"מס"},{en:"revenue",he:"הכנסה מ"},{en:"increased",he:"גדלה"},{en:"this",he:"הזה"},{en:"year",he:"שנה"}] },
  { term: "Strategy", translation: "אסטרטגיה", level: "academic", sentenceParts: [{en:"We",he:"אנחנו"},{en:"need",he:"צריכים"},{en:"a",he:"אחת"},{en:"new",he:"חדשה"},{en:"strategy",he:"אסטרטגיה"}] },
  { term: "Supply", translation: "אספקה / היצע", level: "advanced", sentenceParts: [{en:"Supply",he:"היצע"},{en:"and",he:"ו"},{en:"demand",he:"ביקוש"},{en:"determine",he:"קובעים את"},{en:"prices",he:"מחירים"}] },
  { term: "Target", translation: "מטרה / יעד", level: "intermediate", sentenceParts: [{en:"Our",he:"שלנו"},{en:"target",he:"יעד"},{en:"is",he:"הוא"},{en:"to",he:"ל"},{en:"grow",he:"לגדול"}] },
  { term: "Transaction", translation: "עסקה / העברה", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"transaction",he:"עסקה"},{en:"was",he:"הייתה"},{en:"completed",he:"הושלמה"}] },
  { term: "Collapse", translation: "להתמוטט / לקרוס", level: "advanced", sentenceParts: [{en:"The",he:"ה"},{en:"market",he:"שוק"},{en:"might",he:"עלול"},{en:"collapse",he:"לקרוס"}] },
  { term: "Commerce", translation: "מסחר", level: "academic", sentenceParts: [{en:"International",he:"בינלאומי"},{en:"commerce",he:"מסחר"},{en:"is",he:"הוא"},{en:"growing",he:"גדל"}] },
  { term: "Currency", translation: "מטבע", level: "advanced", sentenceParts: [{en:"The",he:"ה"},{en:"local",he:"מקומי"},{en:"currency",he:"מטבע"},{en:"is",he:"הוא"},{en:"weak",he:"חלש"}] },

  // 21-30
  { term: "Expansion", translation: "התרחבות", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"expansion",he:"התרחבות"},{en:"cost",he:"עלתה"},{en:"millions",he:"מיליונים"}] },
  { term: "Fund", translation: "קרן / לממן", level: "advanced", sentenceParts: [{en:"They",he:"הם"},{en:"will",he:"יעשו"},{en:"fund",he:"יממנו"},{en:"the",he:"את ה"},{en:"project",he:"פרויקט"}] },
  { term: "Inflation", translation: "אינפלציה", level: "academic", sentenceParts: [{en:"Inflation",he:"אינפלציה"},{en:"reduces",he:"מפחיתה"},{en:"buying",he:"קנייה"},{en:"power",he:"כוח"}] },
  { term: "Insurance", translation: "ביטוח", level: "intermediate", sentenceParts: [{en:"Do",he:"האם"},{en:"you",he:"אתה"},{en:"have",he:"יש לך"},{en:"health",he:"בריאות"},{en:"insurance",he:"ביטוח"}] },
  { term: "Launch", translation: "להשיק / לשגר", level: "advanced", sentenceParts: [{en:"They",he:"הם"},{en:"will",he:"יעשו"},{en:"launch",he:"ישיקו"},{en:"the",he:"את ה"},{en:"product",he:"מוצר"},{en:"soon",he:"בקרוב"}] },
  { term: "Manufacture", translation: "לייצר", level: "academic", sentenceParts: [{en:"They",he:"הם"},{en:"manufacture",he:"מייצרים"},{en:"cars",he:"מכוניות"},{en:"here",he:"כאן"}] },
  { term: "Merger", translation: "מיזוג", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"merger",he:"מיזוג"},{en:"created",he:"יצר"},{en:"a",he:"אחת"},{en:"giant",he:"ענקית"},{en:"company",he:"חברה"}] },
  { term: "Promotion", translation: "קידום", level: "intermediate", sentenceParts: [{en:"He",he:"הוא"},{en:"got",he:"קיבל"},{en:"a",he:"אחד"},{en:"promotion",he:"קידום"},{en:"at",he:"ב"},{en:"work",he:"עבודה"}] },
  { term: "Recruit", translation: "לגייס", level: "academic", sentenceParts: [{en:"We",he:"אנחנו"},{en:"need",he:"צריכים"},{en:"to",he:"ל"},{en:"recruit",he:"לגייס"},{en:"more",he:"עוד"},{en:"staff",he:"צוות"}] },
  { term: "Strike", translation: "שביתה / להכות", level: "advanced", sentenceParts: [{en:"The",he:"ה"},{en:"workers",he:"עובדים"},{en:"went",he:"יצאו"},{en:"on",he:"ל"},{en:"strike",he:"שביתה"}] }
];

// ============================================================================
// יום 3: מדע ומחקר (30 מילים מלאות - זהה למה שסיפקתי קודם)
// ============================================================================
const day3Data = [
  // 1-10
  { term: "Empirical", translation: "אמפירי / נסיוני", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"results",he:"תוצאות"},{en:"are",he:"הינן"},{en:"based",he:"מבוססות"},{en:"on",he:"על"},{en:"empirical",he:"אמפירי"},{en:"data",he:"מידע"}] },
  { term: "Hypothesis", translation: "השערה / היפותזה", level: "academic", sentenceParts: [{en:"We",he:"אנחנו"},{en:"need",he:"צריכים"},{en:"to",he:"ל"},{en:"test",he:"לבחון"},{en:"this",he:"הזו"},{en:"hypothesis",he:"השערה"}] },
  { term: "Correlation", translation: "מתאם / קורלציה", level: "academic", sentenceParts: [{en:"There",he:"יש"},{en:"is",he:"הוא"},{en:"a",he:"אחד"},{en:"correlation",he:"מתאם"},{en:"between",he:"בין"},{en:"diet",he:"תזונה"},{en:"and",he:"ו"},{en:"health",he:"בריאות"}] },
  { term: "Fluctuate", translation: "להתנודד / לעלות ולרדת", level: "advanced", sentenceParts: [{en:"Temperatures",he:"טמפרטורות"},{en:"fluctuate",he:"מתנודדות"},{en:"throughout",he:"לאורך"},{en:"the",he:"ה"},{en:"year",he:"שנה"}] },
  { term: "Anomaly", translation: "חריגה / אנומליה", level: "academic", sentenceParts: [{en:"They",he:"הם"},{en:"found",he:"מצאו"},{en:"an",he:"אחת"},{en:"anomaly",he:"חריגה"},{en:"in",he:"ב"},{en:"the",he:"ה"},{en:"system",he:"מערכת"}] },
  { term: "Verify", translation: "לאמת", level: "advanced", sentenceParts: [{en:"Scientists",he:"מדענים"},{en:"must",he:"חייבים"},{en:"verify",he:"לאמת"},{en:"their",he:"שלהם"},{en:"findings",he:"ממצאים"}] },
  { term: "Simulation", translation: "הדמיה", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"simulation",he:"הדמיה"},{en:"mimics",he:"מחקה"},{en:"real",he:"אמיתיים"},{en:"life",he:"חיים"},{en:"conditions",he:"תנאים"}] },
  { term: "Phenomenon", translation: "תופעה", level: "academic", sentenceParts: [{en:"This",he:"זו"},{en:"is",he:"היא"},{en:"a",he:"אחת"},{en:"rare",he:"נדירה"},{en:"natural",he:"טבעית"},{en:"phenomenon",he:"תופעה"}] },
  { term: "Innovation", translation: "חדשנות", level: "advanced", sentenceParts: [{en:"Innovation",he:"חדשנות"},{en:"leads",he:"מובילה"},{en:"to",he:"ל"},{en:"better",he:"טובה יותר"},{en:"technology",he:"טכנולוגיה"}] },
  { term: "Accumulate", translation: "לצבור", level: "advanced", sentenceParts: [{en:"Evidence",he:"ראיות"},{en:"began",he:"החלו"},{en:"to",he:"ל"},{en:"accumulate",he:"להצטבר"},{en:"against",he:"נגד"},{en:"him",he:"אותו"}] },
  
  // 11-20
  { term: "Component", translation: "רכיב", level: "academic", sentenceParts: [{en:"Each",he:"כל"},{en:"component",he:"רכיב"},{en:"is",he:"הוא"},{en:"essential",he:"חיוני"},{en:"for",he:"עבור"},{en:"the",he:"ה"},{en:"machine",he:"מכונה"}] },
  { term: "Feasible", translation: "בר-ביצוע", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"project",he:"פרויקט"},{en:"is",he:"הוא"},{en:"financially",he:"כלכלית"},{en:"feasible",he:"בר ביצוע"}] },
  { term: "Validity", translation: "תוקף", level: "academic", sentenceParts: [{en:"We",he:"אנחנו"},{en:"question",he:"מטילים ספק ב"},{en:"the",he:"ה"},{en:"validity",he:"תוקף"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"test",he:"מבחן"}] },
  { term: "Abstract", translation: "מופשט / תקציר", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"concept",he:"מושג"},{en:"is",he:"הוא"},{en:"too",he:"מדי"},{en:"abstract",he:"מופשט"},{en:"to",he:"כדי"},{en:"grasp",he:"לתפוס/להבין"}] },
  { term: "Analyze", translation: "לנתח", level: "academic", sentenceParts: [{en:"We",he:"אנחנו"},{en:"must",he:"חייבים"},{en:"analyze",he:"לנתח"},{en:"the",he:"ה"},{en:"samples",he:"דגימות"},{en:"carefully",he:"בזהירות"}] },
  { term: "Approximate", translation: "משוער / מקורב", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"approximate",he:"משוער"},{en:"cost",he:"מחיר"},{en:"is",he:"הוא"},{en:"fifty",he:"חמישים"},{en:"dollars",he:"דולר"}] },
  { term: "Characteristic", translation: "מאפיין", level: "academic", sentenceParts: [{en:"What",he:"מה"},{en:"is",he:"הוא"},{en:"the",he:"ה"},{en:"main",he:"עיקרי"},{en:"characteristic",he:"מאפיין"},{en:"of",he:"של"},{en:"birds",he:"ציפורים"}] },
  { term: "Clarify", translation: "להבהיר", level: "advanced", sentenceParts: [{en:"Please",he:"בבקשה"},{en:"clarify",he:"הבהר"},{en:"your",he:"שלך"},{en:"statement",he:"הצהרה"}] },
  { term: "Conclusion", translation: "מסקנה", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"conclusion",he:"מסקנה"},{en:"was",he:"הייתה"},{en:"quite",he:"די"},{en:"unexpected",he:"בלתי צפויה"}] },
  { term: "Conduct", translation: "לערוך (ניסוי) / התנהגות", level: "academic", sentenceParts: [{en:"They",he:"הם"},{en:"will",he:"הולכים"},{en:"conduct",he:"לערוך"},{en:"a",he:"אחד"},{en:"survey",he:"סקר"}] },

  // 21-30
  { term: "Confirm", translation: "לאשר", level: "intermediate", sentenceParts: [{en:"Can",he:"יכול"},{en:"you",he:"אתה"},{en:"confirm",he:"לאשר"},{en:"the",he:"ה"},{en:"date",he:"תאריך"}] },
  { term: "Consequence", translation: "תוצאה / השלכה", level: "academic", sentenceParts: [{en:"Every",he:"כל"},{en:"action",he:"פעולה"},{en:"has",he:"יש לה"},{en:"a",he:"אחת"},{en:"consequence",he:"השלכה"}] },
  { term: "Consider", translation: "לשקול / להחשיב", level: "intermediate", sentenceParts: [{en:"Please",he:"בבקשה"},{en:"consider",he:"שקול"},{en:"all",he:"כל"},{en:"the",he:"ה"},{en:"options",he:"אפשרויות"}] },
  { term: "Contradict", translation: "לסתור", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"evidence",he:"ראיות"},{en:"contradicts",he:"סותרות"},{en:"his",he:"שלו"},{en:"story",he:"סיפור"}] },
  { term: "Crucial", translation: "מכריע / קריטי", level: "advanced", sentenceParts: [{en:"Water",he:"מים"},{en:"is",he:"הם"},{en:"crucial",he:"קריטיים"},{en:"for",he:"עבור"},{en:"survival",he:"הישרדות"}] },
  { term: "Demonstrate", translation: "להדגים / להוכיח", level: "academic", sentenceParts: [{en:"He",he:"הוא"},{en:"will",he:"יעשה"},{en:"demonstrate",he:"ידגים"},{en:"how",he:"איך"},{en:"it",he:"זה"},{en:"works",he:"עובד"}] },
  { term: "Determine", translation: "לקבוע / להחליט", level: "academic", sentenceParts: [{en:"We",he:"אנחנו"},{en:"need",he:"צריכים"},{en:"to",he:"ל"},{en:"determine",he:"לקבוע"},{en:"the",he:"ה"},{en:"cause",he:"סיבה"}] },
  { term: "Device", translation: "מכשיר / התקן", level: "intermediate", sentenceParts: [{en:"This",he:"זה"},{en:"device",he:"מכשיר"},{en:"measures",he:"מודד"},{en:"speed",he:"מהירות"}] },
  { term: "Dimension", translation: "מימד", level: "academic", sentenceParts: [{en:"Time",he:"זמן"},{en:"is",he:"הוא"},{en:"the",he:"ה"},{en:"fourth",he:"רביעי"},{en:"dimension",he:"מימד"}] },
  { term: "Logical", translation: "הגיוני / לוגי", level: "intermediate", sentenceParts: [{en:"It",he:"זה"},{en:"is",he:"הוא"},{en:"the",he:"ה"},{en:"only",he:"יחיד"},{en:"logical",he:"הגיוני"},{en:"choice",he:"בחירה"}] }
];

// --- הפונקציה הראשית ---
// כאן היה הבאג שלך - השם של הפונקציה חייב להתאים לקריאה בסוף!
const seedDays2and3 = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI חסר בקובץ .env");
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 מחובר ל-DB. מתחיל בהזנת ימים 2 ו-3 מלאים...');

    // מחיקת נתונים קודמים של ימים 2 ו-3
    await Day.deleteMany({ dayNumber: { $in: [2, 3] } });

    // מחיקת המילים עצמן למניעת כפילויות
    const allTerms = [...day2Data.map(d => d.term), ...day3Data.map(d => d.term)];
    await Word.deleteMany({ term: { $in: allTerms } });

    // פונקציית עזר ליצירת יום
    const createDay = async (dayNum, title, wordsData) => {
      const wordIds = [];
      for (const item of wordsData) {
        // יוצר את המילה
        const word = await Word.create(item);
        wordIds.push(word._id);
      }
      // יוצר את היום ומקשר אליו את המילים
      await Day.create({
        dayNumber: dayNum,
        title: title,
        words: wordIds
      });
      console.log(`✅ יום ${dayNum} (${title}) נוצר עם ${wordsData.length} מילים.`);
    };

    // יצירת יום 2
    await createDay(2, "עסקים וקריירה", day2Data);
    
    // יצירת יום 3
    await createDay(3, "מדע ומחקר", day3Data);

    console.log('🎉 הושלם בהצלחה! ימים 2 ו-3 נטענו.');
    process.exit(0);

  } catch (err) {
    console.error('❌ שגיאה:', err);
    process.exit(1);
  }
};

// הפעלת הפונקציה (השם כאן חייב להיות זהה לשם למעלה!)
seedDays2and3();