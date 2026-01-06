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
// יום 3: מדע ומחקר (Science)
// ============================================================================
const day3Data = [
  { term: "Empirical", translation: "אמפירי / נסיוני", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"data",he:"נתונים"},{en:"is",he:"הינם"},{en:"empirical",he:"אמפיריים"}] },
  { term: "Hypothesis", translation: "השערה", level: "academic", sentenceParts: [{en:"Test",he:"בדוק"},{en:"your",he:"את ה"},{en:"hypothesis",he:"השערה"},{en:"now",he:"עכשיו"}] },
  { term: "Correlation", translation: "מתאם", level: "academic", sentenceParts: [{en:"No",he:"אין"},{en:"correlation",he:"מתאם"},{en:"was",he:"נמצא"},{en:"found",he:"נמצא"}] },
  { term: "Fluctuate", translation: "להתנודד", level: "advanced", sentenceParts: [{en:"Prices",he:"מחירים"},{en:"fluctuate",he:"מתנודדים"},{en:"daily",he:"יומית"}] },
  { term: "Anomaly", translation: "חריגה", level: "academic", sentenceParts: [{en:"It",he:"זו"},{en:"is",he:"היא"},{en:"an",he:"אחת"},{en:"anomaly",he:"חריגה"}] },
  { term: "Verify", translation: "לאמת", level: "advanced", sentenceParts: [{en:"Please",he:"בבקשה"},{en:"verify",he:"אמת"},{en:"the",he:"את ה"},{en:"results",he:"תוצאות"}] },
  { term: "Simulation", translation: "הדמיה", level: "intermediate", sentenceParts: [{en:"Running",he:"מריץ"},{en:"a",he:"אחת"},{en:"simulation",he:"הדמיה"}] },
  { term: "Phenomenon", translation: "תופעה", level: "academic", sentenceParts: [{en:"A",he:"אחת"},{en:"strange",he:"מוזרה"},{en:"phenomenon",he:"תופעה"}] },
  { term: "Innovation", translation: "חדשנות", level: "advanced", sentenceParts: [{en:"We",he:"אנחנו"},{en:"need",he:"צריכים"},{en:"innovation",he:"חדשנות"}] },
  { term: "Accumulate", translation: "לצבור", level: "advanced", sentenceParts: [{en:"Dust",he:"אבק"},{en:"tends",he:"נוטה"},{en:"to",he:"ל"},{en:"accumulate",he:"להצטבר"}] },
  { term: "Component", translation: "רכיב", level: "academic", sentenceParts: [{en:"A",he:"אחד"},{en:"key",he:"מרכזי"},{en:"component",he:"רכיב"}] },
  { term: "Feasible", translation: "בר-ביצוע", level: "academic", sentenceParts: [{en:"It",he:"זה"},{en:"is",he:"הוא"},{en:"not",he:"לא"},{en:"feasible",he:"בר ביצוע"}] },
  { term: "Validity", translation: "תוקף", level: "academic", sentenceParts: [{en:"Check",he:"בדוק"},{en:"the",he:"את ה"},{en:"validity",he:"תוקף"}] },
  { term: "Abstract", translation: "מופשט", level: "academic", sentenceParts: [{en:"Abstract",he:"מופשטת"},{en:"art",he:"אומנות"}] },
  { term: "Analyze", translation: "לנתח", level: "academic", sentenceParts: [{en:"Analyze",he:"נתח"},{en:"the",he:"את ה"},{en:"text",he:"טקסט"}] },
  { term: "Approximate", translation: "משוער", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"approximate",he:"משוער"},{en:"time",he:"זמן"}] },
  { term: "Characteristic", translation: "מאפיין", level: "academic", sentenceParts: [{en:"A",he:"אחד"},{en:"unique",he:"ייחודי"},{en:"characteristic",he:"מאפיין"}] },
  { term: "Clarify", translation: "להבהיר", level: "advanced", sentenceParts: [{en:"Let",he:"תן"},{en:"me",he:"לי"},{en:"clarify",he:"להבהיר"}] },
  { term: "Conclusion", translation: "מסקנה", level: "intermediate", sentenceParts: [{en:"What",he:"מה"},{en:"is",he:"היא"},{en:"the",he:"ה"},{en:"conclusion",he:"מסקנה"}] },
  { term: "Conduct", translation: "לערוך / התנהגות", level: "academic", sentenceParts: [{en:"Conduct",he:"ערוך"},{en:"a",he:"אחד"},{en:"study",he:"מחקר"}] },
  { term: "Confirm", translation: "לאשר", level: "intermediate", sentenceParts: [{en:"Please",he:"בבקשה"},{en:"confirm",he:"אשר"}] },
  { term: "Consequence", translation: "השלכה", level: "academic", sentenceParts: [{en:"Face",he:"תתמודד עם"},{en:"the",he:"ה"},{en:"consequence",he:"השלכה"}] },
  { term: "Consider", translation: "לשקול", level: "intermediate", sentenceParts: [{en:"Consider",he:"שקול"},{en:"it",he:"זאת"},{en:"done",he:"עשוי"}] },
  { term: "Contradict", translation: "לסתור", level: "academic", sentenceParts: [{en:"Do",he:"אל"},{en:"not",he:"תעשה"},{en:"contradict",he:"תסתור"},{en:"me",he:"אותי"}] },
  { term: "Crucial", translation: "מכריע", level: "advanced", sentenceParts: [{en:"A",he:"אחד"},{en:"crucial",he:"מכריע"},{en:"step",he:"צעד"}] },
  { term: "Demonstrate", translation: "להדגים", level: "academic", sentenceParts: [{en:"I",he:"אני"},{en:"will",he:"אעשה"},{en:"demonstrate",he:"אדגים"}] },
  { term: "Determine", translation: "לקבוע", level: "academic", sentenceParts: [{en:"Determine",he:"קבע"},{en:"the",he:"את ה"},{en:"cause",he:"סיבה"}] },
  { term: "Device", translation: "מכשיר", level: "intermediate", sentenceParts: [{en:"Electronic",he:"אלקטרוני"},{en:"device",he:"מכשיר"}] },
  { term: "Dimension", translation: "מימד", level: "academic", sentenceParts: [{en:"Another",he:"אחר"},{en:"dimension",he:"מימד"}] },
  { term: "Logical", translation: "הגיוני", level: "intermediate", sentenceParts: [{en:"Be",he:"תהיה"},{en:"logical",he:"הגיוני"}] }
];

// ============================================================================
// יום 4: חברה ותרבות (Society)
// ============================================================================
const day4Data = [
  { term: "Convention", translation: "מוסכמה", level: "academic", sentenceParts: [{en:"Social",he:"חברתית"},{en:"convention",he:"מוסכמה"}] },
  { term: "Heritage", translation: "מורשת", level: "advanced", sentenceParts: [{en:"Rich",he:"עשירה"},{en:"heritage",he:"מורשת"}] },
  { term: "Diverse", translation: "מגוון", level: "advanced", sentenceParts: [{en:"Diverse",he:"מגוונת"},{en:"culture",he:"תרבות"}] },
  { term: "Integration", translation: "שילוב", level: "academic", sentenceParts: [{en:"Social",he:"חברתי"},{en:"integration",he:"שילוב"}] },
  { term: "Intervene", translation: "להתערב", level: "academic", sentenceParts: [{en:"Do",he:"אל"},{en:"not",he:"תעשה"},{en:"intervene",he:"תתערב"}] },
  { term: "Reform", translation: "רפורמה", level: "advanced", sentenceParts: [{en:"New",he:"חדשה"},{en:"reform",he:"רפורמה"}] },
  { term: "Tradition", translation: "מסורת", level: "intermediate", sentenceParts: [{en:"Old",he:"ישנה"},{en:"tradition",he:"מסורת"}] },
  { term: "Norm", translation: "נורמה", level: "academic", sentenceParts: [{en:"Social",he:"חברתית"},{en:"norm",he:"נורמה"}] },
  { term: "Contemporary", translation: "עכשווי", level: "academic", sentenceParts: [{en:"Contemporary",he:"עכשווי"},{en:"art",he:"אומנות"}] },
  { term: "Ethics", translation: "אתיקה", level: "academic", sentenceParts: [{en:"Work",he:"עבודה"},{en:"ethics",he:"אתיקה"}] },
  { term: "Minority", translation: "מיעוט", level: "intermediate", sentenceParts: [{en:"A",he:"אחד"},{en:"small",he:"קטן"},{en:"minority",he:"מיעוט"}] },
  { term: "Dominant", translation: "דומיננטי", level: "advanced", sentenceParts: [{en:"Dominant",he:"דומיננטי"},{en:"role",he:"תפקיד"}] },
  { term: "Abandon", translation: "לנטוש", level: "advanced", sentenceParts: [{en:"Abandon",he:"נטוש"},{en:"ship",he:"ספינה"}] },
  { term: "Adapt", translation: "להסתגל", level: "advanced", sentenceParts: [{en:"Adapt",he:"הסתגל"},{en:"to",he:"ל"},{en:"change",he:"שינוי"}] },
  { term: "Advocate", translation: "לתמוך / סנגור", level: "academic", sentenceParts: [{en:"Advocate",he:"תמוך"},{en:"for",he:"ב"},{en:"peace",he:"שלום"}] },
  { term: "Aid", translation: "סיוע", level: "intermediate", sentenceParts: [{en:"First",he:"ראשונה"},{en:"aid",he:"עזרה/סיוע"}] },
  { term: "Aspect", translation: "היבט", level: "advanced", sentenceParts: [{en:"Every",he:"כל"},{en:"aspect",he:"היבט"}] },
  { term: "Attitude", translation: "גישה", level: "intermediate", sentenceParts: [{en:"Good",he:"טובה"},{en:"attitude",he:"גישה"}] },
  { term: "Authority", translation: "סמכות", level: "academic", sentenceParts: [{en:"Legal",he:"חוקית"},{en:"authority",he:"סמכות"}] },
  { term: "Awareness", translation: "מודעות", level: "advanced", sentenceParts: [{en:"Raise",he:"העלה"},{en:"awareness",he:"מודעות"}] },
  { term: "Community", translation: "קהילה", level: "intermediate", sentenceParts: [{en:"Local",he:"מקומית"},{en:"community",he:"קהילה"}] },
  { term: "Conflict", translation: "קונפליקט", level: "academic", sentenceParts: [{en:"Resolve",he:"פתור"},{en:"conflict",he:"סכסוך"}] },
  { term: "Conform", translation: "להתאים לנורמה", level: "academic", sentenceParts: [{en:"Conform",he:"התאם"},{en:"to",he:"ל"},{en:"rules",he:"חוקים"}] },
  { term: "Consent", translation: "הסכמה", level: "academic", sentenceParts: [{en:"Written",he:"כתובה"},{en:"consent",he:"הסכמה"}] },
  { term: "Contribute", translation: "לתרום", level: "advanced", sentenceParts: [{en:"Contribute",he:"תרום"},{en:"money",he:"כסף"}] },
  { term: "Controversy", translation: "מחלוקת", level: "academic", sentenceParts: [{en:"Big",he:"גדולה"},{en:"controversy",he:"מחלוקת"}] },
  { term: "Cooperate", translation: "לשתף פעולה", level: "intermediate", sentenceParts: [{en:"Please",he:"בבקשה"},{en:"cooperate",he:"שתף פעולה"}] },
  { term: "Crisis", translation: "משבר", level: "advanced", sentenceParts: [{en:"Economic",he:"כלכלי"},{en:"crisis",he:"משבר"}] },
  { term: "Criteria", translation: "קריטריונים", level: "academic", sentenceParts: [{en:"Meet",he:"עמוד ב"},{en:"criteria",he:"קריטריונים"}] },
  { term: "Criticize", translation: "לבקר", level: "advanced", sentenceParts: [{en:"Do",he:"אל"},{en:"not",he:"תעשה"},{en:"criticize",he:"תבקר"}] }
];

// ============================================================================
// יום 5: טכנולוגיה (Technology)
// ============================================================================
const day5Data = [
  { term: "Algorithm", translation: "אלגוריתם", level: "academic", sentenceParts: [{en:"Complex",he:"מורכב"},{en:"algorithm",he:"אלגוריתם"}] },
  { term: "Artificial", translation: "מלאכותי", level: "advanced", sentenceParts: [{en:"Artificial",he:"מלאכותית"},{en:"intelligence",he:"אינטליגנציה"}] },
  { term: "Database", translation: "מסד נתונים", level: "advanced", sentenceParts: [{en:"Update",he:"עדכן"},{en:"database",he:"מסד נתונים"}] },
  { term: "Interface", translation: "ממשק", level: "academic", sentenceParts: [{en:"User",he:"משתמש"},{en:"interface",he:"ממשק"}] },
  { term: "Virtual", translation: "וירטואלי", level: "intermediate", sentenceParts: [{en:"Virtual",he:"וירטואלית"},{en:"reality",he:"מציאות"}] },
  { term: "Automate", translation: "להפוך לאוטומטי", level: "advanced", sentenceParts: [{en:"Automate",he:"הפוך לאוטומטי"},{en:"tasks",he:"משימות"}] },
  { term: "Compatible", translation: "תואם", level: "academic", sentenceParts: [{en:"Not",he:"לא"},{en:"compatible",he:"תואם"}] },
  { term: "Digital", translation: "דיגיטלי", level: "intermediate", sentenceParts: [{en:"Digital",he:"דיגיטלי"},{en:"world",he:"עולם"}] },
  { term: "Hardware", translation: "חומרה", level: "advanced", sentenceParts: [{en:"New",he:"חדשה"},{en:"hardware",he:"חומרה"}] },
  { term: "Protocol", translation: "פרוטוקול", level: "academic", sentenceParts: [{en:"Safety",he:"בטיחות"},{en:"protocol",he:"פרוטוקול"}] },
  { term: "Encryption", translation: "הצפנה", level: "academic", sentenceParts: [{en:"Data",he:"מידע"},{en:"encryption",he:"הצפנה"}] },
  { term: "Bandwidth", translation: "רוחב פס", level: "advanced", sentenceParts: [{en:"Low",he:"נמוך"},{en:"bandwidth",he:"רוחב פס"}] },
  { term: "Browse", translation: "לגלוש / לעיין", level: "intermediate", sentenceParts: [{en:"Browse",he:"גלוש ב"},{en:"web",he:"רשת"}] },
  { term: "Circuit", translation: "מעגל חשמלי", level: "advanced", sentenceParts: [{en:"Short",he:"קצר"},{en:"circuit",he:"מעגל"}] },
  { term: "Configuration", translation: "תצורה / הגדרות", level: "academic", sentenceParts: [{en:"System",he:"מערכת"},{en:"configuration",he:"תצורה"}] },
  { term: "Detect", translation: "לזהות / לגלות", level: "intermediate", sentenceParts: [{en:"Detect",he:"זהה"},{en:"virus",he:"וירוס"}] },
  { term: "Domain", translation: "דומיין / תחום", level: "academic", sentenceParts: [{en:"Public",he:"ציבורי"},{en:"domain",he:"דומיין/נחלת"}] },
  { term: "Execute", translation: "להוציא לפועל / להריץ", level: "academic", sentenceParts: [{en:"Execute",he:"הרץ"},{en:"program",he:"תוכנית"}] },
  { term: "Fragment", translation: "קטע / שבר", level: "advanced", sentenceParts: [{en:"Code",he:"קוד"},{en:"fragment",he:"קטע"}] },
  { term: "Generate", translation: "ליצור / לחולל", level: "academic", sentenceParts: [{en:"Generate",he:"צור"},{en:"report",he:"דוח"}] },
  { term: "Implement", translation: "ליישם / להטמיע", level: "academic", sentenceParts: [{en:"Implement",he:"הטמע"},{en:"changes",he:"שינויים"}] },
  { term: "Input", translation: "קלט", level: "intermediate", sentenceParts: [{en:"User",he:"משתמש"},{en:"input",he:"קלט"}] },
  { term: "Mechanism", translation: "מנגנון", level: "academic", sentenceParts: [{en:"Locking",he:"נעילה"},{en:"mechanism",he:"מנגנון"}] },
  { term: "Module", translation: "מודול / יחידה", level: "academic", sentenceParts: [{en:"Memory",he:"זיכרון"},{en:"module",he:"מודול"}] },
  { term: "Monitor", translation: "לנטר / צג", level: "intermediate", sentenceParts: [{en:"Monitor",he:"נטר"},{en:"progress",he:"התקדמות"}] },
  { term: "Network", translation: "רשת", level: "intermediate", sentenceParts: [{en:"Secure",he:"מאובטחת"},{en:"network",he:"רשת"}] },
  { term: "Optimize", translation: "לייעל", level: "academic", sentenceParts: [{en:"Optimize",he:"יעל"},{en:"speed",he:"מהירות"}] },
  { term: "Output", translation: "פלט", level: "intermediate", sentenceParts: [{en:"Check",he:"בדוק"},{en:"output",he:"פלט"}] },
  { term: "Platform", translation: "פלטפורמה", level: "intermediate", sentenceParts: [{en:"Online",he:"מקוונת"},{en:"platform",he:"פלטפורמה"}] },
  { term: "Random", translation: "אקראי", level: "intermediate", sentenceParts: [{en:"Random",he:"אקראי"},{en:"number",he:"מספר"}] }
];

// ============================================================================
// יום 6: סביבה וטבע (Environment)
// ============================================================================
const day6Data = [
  { term: "Sustainability", translation: "קיימות", level: "academic", sentenceParts: [{en:"Promote",he:"קדם"},{en:"sustainability",he:"קיימות"}] },
  { term: "Conservation", translation: "שימור", level: "academic", sentenceParts: [{en:"Water",he:"מים"},{en:"conservation",he:"שימור"}] },
  { term: "Ecology", translation: "אקולוגיה", level: "academic", sentenceParts: [{en:"Study",he:"למד"},{en:"ecology",he:"אקולוגיה"}] },
  { term: "Extinct", translation: "נכחד", level: "advanced", sentenceParts: [{en:"Extinct",he:"נכחדה"},{en:"species",he:"מין/זן"}] },
  { term: "Habitat", translation: "בית גידול", level: "academic", sentenceParts: [{en:"Natural",he:"טבעי"},{en:"habitat",he:"בית גידול"}] },
  { term: "Pollution", translation: "זיהום", level: "intermediate", sentenceParts: [{en:"Air",he:"אוויר"},{en:"pollution",he:"זיהום"}] },
  { term: "Resource", translation: "משאב", level: "advanced", sentenceParts: [{en:"Natural",he:"טבעי"},{en:"resource",he:"משאב"}] },
  { term: "Renewable", translation: "מתחדש", level: "advanced", sentenceParts: [{en:"Renewable",he:"מתחדשת"},{en:"energy",he:"אנרגיה"}] },
  { term: "Atmosphere", translation: "אטמוספירה", level: "academic", sentenceParts: [{en:"Earth",he:"כדור הארץ"},{en:"atmosphere",he:"אטמוספירה"}] },
  { term: "Climate", translation: "אקלים", level: "intermediate", sentenceParts: [{en:"Climate",he:"אקלים"},{en:"change",he:"שינוי"}] },
  { term: "Biodiversity", translation: "מגוון ביולוגי", level: "academic", sentenceParts: [{en:"Protect",he:"הגן על"},{en:"biodiversity",he:"מגוון ביולוגי"}] },
  { term: "Emission", translation: "פליטה (גזים)", level: "academic", sentenceParts: [{en:"Gas",he:"גז"},{en:"emission",he:"פליטה"}] },
  { term: "Fertile", translation: "פורה", level: "advanced", sentenceParts: [{en:"Fertile",he:"פורה"},{en:"soil",he:"אדמה"}] },
  { term: "Fossil", translation: "מאובן", level: "advanced", sentenceParts: [{en:"Fossil",he:"מאובנים"},{en:"fuel",he:"דלק"}] },
  { term: "Landscape", translation: "נוף", level: "intermediate", sentenceParts: [{en:"Beautiful",he:"יפה"},{en:"landscape",he:"נוף"}] },
  { term: "Marine", translation: "ימי", level: "advanced", sentenceParts: [{en:"Marine",he:"ימיים"},{en:"life",he:"חיים"}] },
  { term: "Migration", translation: "נדידה / הגירה", level: "advanced", sentenceParts: [{en:"Bird",he:"ציפורים"},{en:"migration",he:"נדידת"}] },
  { term: "Organism", translation: "אורגניזם / יצור חי", level: "academic", sentenceParts: [{en:"Living",he:"חי"},{en:"organism",he:"אורגניזם"}] },
  { term: "Preserve", translation: "לשמר", level: "advanced", sentenceParts: [{en:"Preserve",he:"שמר"},{en:"nature",he:"טבע"}] },
  { term: "Radiation", translation: "קרינה", level: "academic", sentenceParts: [{en:"Solar",he:"סולארית"},{en:"radiation",he:"קרינה"}] },
  { term: "Recycle", translation: "למחזר", level: "intermediate", sentenceParts: [{en:"Please",he:"בבקשה"},{en:"recycle",he:"מחזר"}] },
  { term: "Species", translation: "מין / זן", level: "advanced", sentenceParts: [{en:"Endangered",he:"בסכנת הכחדה"},{en:"species",he:"מין"}] },
  { term: "Toxic", translation: "רעיל", level: "advanced", sentenceParts: [{en:"Toxic",he:"רעיל"},{en:"waste",he:"פסולת"}] },
  { term: "Urban", translation: "עירוני", level: "advanced", sentenceParts: [{en:"Urban",he:"עירוני"},{en:"area",he:"אזור"}] },
  { term: "Vital", translation: "חיוני", level: "advanced", sentenceParts: [{en:"Vital",he:"חיוני"},{en:"role",he:"תפקיד"}] },
  { term: "Waste", translation: "פסולת / לבזבז", level: "intermediate", sentenceParts: [{en:"Reduce",he:"הפחת"},{en:"waste",he:"פסולת"}] },
  { term: "Wildlife", translation: "חיות בר", level: "intermediate", sentenceParts: [{en:"Protect",he:"הגן על"},{en:"wildlife",he:"חיות בר"}] },
  { term: "Agriculture", translation: "חקלאות", level: "advanced", sentenceParts: [{en:"Sustainable",he:"בת קיימא"},{en:"agriculture",he:"חקלאות"}] },
  { term: "Erosion", translation: "סחף / שחיקה", level: "academic", sentenceParts: [{en:"Soil",he:"קרקע"},{en:"erosion",he:"סחף"}] },
  { term: "Drought", translation: "בצורת", level: "advanced", sentenceParts: [{en:"Severe",he:"חמורה"},{en:"drought",he:"בצורת"}] }
];

const seedDays3to6 = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI חסר");
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 מחובר ל-DB. מתחיל בהזנת ימים 3-6...');

    await Day.deleteMany({ dayNumber: { $in: [3, 4, 5, 6] } });

    // מחיקת מילים למניעת כפילויות
    const terms = [
      ...day3Data.map(d=>d.term), ...day4Data.map(d=>d.term),
      ...day5Data.map(d=>d.term), ...day6Data.map(d=>d.term)
    ];
    await Word.deleteMany({ term: { $in: terms } });

    const createDay = async (num, title, data) => {
      const ids = [];
      for (const item of data) {
        const word = await Word.create(item);
        ids.push(word._id);
      }
      await Day.create({ dayNumber: num, title, words: ids });
      console.log(`✅ יום ${num} (${title}) נוצר עם ${data.length} מילים.`);
    };

    await createDay(3, "מדע ומחקר", day3Data);
    await createDay(4, "חברה ותרבות", day4Data);
    await createDay(5, "טכנולוגיה", day5Data);
    await createDay(6, "סביבה וטבע", day6Data);

    console.log('🎉 ימים 3-6 הושלמו!');
    process.exit(0);
  } catch (err) {
    console.error('❌ שגיאה:', err);
    process.exit(1);
  }
};

seedDays3to6();