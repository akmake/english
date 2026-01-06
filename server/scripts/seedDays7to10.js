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
// יום 7: חוק ומשפט (Law)
// ============================================================================
const day7Data = [
  { term: "Defendant", translation: "נאשם / נתבע", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"defendant",he:"נאשם"},{en:"stood",he:"עמד"},{en:"up",he:"למעלה"}] },
  { term: "Prosecution", translation: "תביעה (הצד התובע)", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"prosecution",he:"תביעה"},{en:"rested",he:"סיימה"},{en:"case",he:"תיק"}] },
  { term: "Verdict", translation: "פסק דין / הכרעת דין", level: "academic", sentenceParts: [{en:"Guilty",he:"אשם"},{en:"verdict",he:"פסק דין"}] },
  { term: "Legislation", translation: "חקיקה", level: "academic", sentenceParts: [{en:"New",he:"חדשה"},{en:"legislation",he:"חקיקה"},{en:"passed",he:"עברה"}] },
  { term: "Constitution", translation: "חוקה", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"US",he:"ארהב"},{en:"constitution",he:"חוקה"}] },
  { term: "Penalty", translation: "עונש / קנס", level: "advanced", sentenceParts: [{en:"Death",he:"מוות"},{en:"penalty",he:"עונש"}] },
  { term: "Fraud", translation: "הונאה", level: "advanced", sentenceParts: [{en:"Tax",he:"מס"},{en:"fraud",he:"הונאה"}] },
  { term: "Witness", translation: "עד (במשפט)", level: "intermediate", sentenceParts: [{en:"Eye",he:"ראייה"},{en:"witness",he:"עד"}] },
  { term: "Evidence", translation: "ראיות", level: "academic", sentenceParts: [{en:"No",he:"אין"},{en:"evidence",he:"ראיות"},{en:"found",he:"נמצאו"}] },
  { term: "Innocent", translation: "חף מפשע", level: "intermediate", sentenceParts: [{en:"He",he:"הוא"},{en:"is",he:"הינו"},{en:"innocent",he:"חף מפשע"}] },
  { term: "Accuse", translation: "להאשים", level: "advanced", sentenceParts: [{en:"Do",he:"אל"},{en:"not",he:"תעשה"},{en:"accuse",he:"תאשים"},{en:"him",he:"אותו"}] },
  { term: "Appeal", translation: "לערער / ערעור", level: "academic", sentenceParts: [{en:"File",he:"הגש"},{en:"an",he:"אחד"},{en:"appeal",he:"ערעור"}] },
  { term: "Arrest", translation: "לעצור / מעצר", level: "intermediate", sentenceParts: [{en:"Under",he:"תחת"},{en:"arrest",he:"מעצר"}] },
  { term: "Attorney", translation: "עורך דין", level: "advanced", sentenceParts: [{en:"Defense",he:"הגנה"},{en:"attorney",he:"עורך דין"}] },
  { term: "Civil", translation: "אזרחי", level: "academic", sentenceParts: [{en:"Civil",he:"אזרחיות"},{en:"rights",he:"זכויות"}] },
  { term: "Convict", translation: "להרשיע / אסיר", level: "academic", sentenceParts: [{en:"Convict",he:"הרשע"},{en:"the",he:"את ה"},{en:"criminal",he:"פושע"}] },
  { term: "Court", translation: "בית משפט", level: "intermediate", sentenceParts: [{en:"In",he:"ב"},{en:"court",he:"בית משפט"}] },
  { term: "Crime", translation: "פשע", level: "intermediate", sentenceParts: [{en:"Fight",he:"הילחם"},{en:"crime",he:"פשע"}] },
  { term: "Criminal", translation: "פלילי / פושע", level: "intermediate", sentenceParts: [{en:"Criminal",he:"פלילי"},{en:"record",he:"רישום"}] },
  { term: "Deny", translation: "להכחיש / למנוע", level: "advanced", sentenceParts: [{en:"Deny",he:"הכחש"},{en:"the",he:"את ה"},{en:"charges",he:"אישומים"}] },
  { term: "Dispute", translation: "מחלוקת / סכסוך", level: "academic", sentenceParts: [{en:"Legal",he:"משפטית"},{en:"dispute",he:"מחלוקת"}] },
  { term: "Enforce", translation: "לאכוף", level: "academic", sentenceParts: [{en:"Enforce",he:"אכוף"},{en:"the",he:"את ה"},{en:"law",he:"חוק"}] },
  { term: "Guilty", translation: "אשם", level: "intermediate", sentenceParts: [{en:"Plead",he:"הצהיר"},{en:"guilty",he:"אשם"}] },
  { term: "Illegal", translation: "לא חוקי", level: "intermediate", sentenceParts: [{en:"Illegal",he:"לא חוקיים"},{en:"drugs",he:"סמים"}] },
  { term: "Investigate", translation: "לחקור", level: "advanced", sentenceParts: [{en:"Investigate",he:"חקור"},{en:"the",he:"את ה"},{en:"case",he:"מקרה"}] },
  { term: "Judge", translation: "שופט", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"judge",he:"שופט"},{en:"ruled",he:"פסק"}] },
  { term: "Jury", translation: "חבר מושבעים", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"jury",he:"מושבעים"},{en:"decided",he:"החליט"}] },
  { term: "Justice", translation: "צדק", level: "advanced", sentenceParts: [{en:"Serve",he:"שרת"},{en:"justice",he:"צדק"}] },
  { term: "Legal", translation: "חוקי / משפטי", level: "intermediate", sentenceParts: [{en:"Legal",he:"משפטי"},{en:"advice",he:"עצה"}] },
  { term: "Trial", translation: "משפט", level: "intermediate", sentenceParts: [{en:"Fair",he:"הוגן"},{en:"trial",he:"משפט"}] }
];

// ============================================================================
// יום 8: פסיכולוגיה ורגש (Psychology)
// ============================================================================
const day8Data = [
  { term: "Cognitive", translation: "קוגניטיבי / הכרתי", level: "academic", sentenceParts: [{en:"Cognitive",he:"קוגניטיבית"},{en:"ability",he:"יכולת"}] },
  { term: "Subconscious", translation: "תת-מודע", level: "academic", sentenceParts: [{en:"Subconscious",he:"תת מודע"},{en:"mind",he:"מוח/תודעה"}] },
  { term: "Perceive", translation: "לתפוס / להבחין", level: "academic", sentenceParts: [{en:"Perceive",he:"תפוס"},{en:"reality",he:"מציאות"}] },
  { term: "Trauma", translation: "טראומה", level: "advanced", sentenceParts: [{en:"Past",he:"עבר"},{en:"trauma",he:"טראומה"}] },
  { term: "Anxiety", translation: "חרדה", level: "advanced", sentenceParts: [{en:"Severe",he:"חמורה"},{en:"anxiety",he:"חרדה"}] },
  { term: "Behavior", translation: "התנהגות", level: "intermediate", sentenceParts: [{en:"Bad",he:"רעה"},{en:"behavior",he:"התנהגות"}] },
  { term: "Conscious", translation: "מודע", level: "advanced", sentenceParts: [{en:"Conscious",he:"מודעת"},{en:"decision",he:"החלטה"}] },
  { term: "Depression", translation: "דיכאון", level: "advanced", sentenceParts: [{en:"Fight",he:"הילחם"},{en:"depression",he:"דיכאון"}] },
  { term: "Emotion", translation: "רגש", level: "intermediate", sentenceParts: [{en:"Show",he:"הראה"},{en:"emotion",he:"רגש"}] },
  { term: "Instinct", translation: "אינסטינקט", level: "advanced", sentenceParts: [{en:"Survival",he:"הישרדות"},{en:"instinct",he:"אינסטינקט"}] },
  { term: "Intelligence", translation: "אינטליגנציה", level: "intermediate", sentenceParts: [{en:"High",he:"גבוהה"},{en:"intelligence",he:"אינטליגנציה"}] },
  { term: "Mental", translation: "נפשי / שכלי", level: "intermediate", sentenceParts: [{en:"Mental",he:"נפשית"},{en:"health",he:"בריאות"}] },
  { term: "Motivation", translation: "מוטיבציה", level: "intermediate", sentenceParts: [{en:"Lack",he:"חוסר"},{en:"motivation",he:"מוטיבציה"}] },
  { term: "Personality", translation: "אישיות", level: "intermediate", sentenceParts: [{en:"Strong",he:"חזקה"},{en:"personality",he:"אישיות"}] },
  { term: "Psychology", translation: "פסיכולוגיה", level: "advanced", sentenceParts: [{en:"Child",he:"ילדים"},{en:"psychology",he:"פסיכולוגיה"}] },
  { term: "Reaction", translation: "תגובה", level: "intermediate", sentenceParts: [{en:"Quick",he:"מהירה"},{en:"reaction",he:"תגובה"}] },
  { term: "Relationship", translation: "מערכת יחסים", level: "intermediate", sentenceParts: [{en:"Close",he:"קרובה"},{en:"relationship",he:"מערכת יחסים"}] },
  { term: "Sensation", translation: "תחושה", level: "advanced", sentenceParts: [{en:"Strange",he:"מוזרה"},{en:"sensation",he:"תחושה"}] },
  { term: "Stimulus", translation: "גירוי", level: "academic", sentenceParts: [{en:"External",he:"חיצוני"},{en:"stimulus",he:"גירוי"}] },
  { term: "Stress", translation: "לחץ / מתח", level: "intermediate", sentenceParts: [{en:"Relieve",he:"הפג"},{en:"stress",he:"לחץ"}] },
  { term: "Therapy", translation: "טיפול / תרפיה", level: "advanced", sentenceParts: [{en:"Need",he:"צריך"},{en:"therapy",he:"טיפול"}] },
  { term: "Bias", translation: "הטיה / דעה קדומה", level: "academic", sentenceParts: [{en:"Cultural",he:"תרבותית"},{en:"bias",he:"הטיה"}] },
  { term: "Cope", translation: "להתמודד", level: "advanced", sentenceParts: [{en:"Cope",he:"התמודד"},{en:"with",he:"עם"},{en:"pain",he:"כאב"}] },
  { term: "Disorder", translation: "הפרעה", level: "academic", sentenceParts: [{en:"Eating",he:"אכילה"},{en:"disorder",he:"הפרעת"}] },
  { term: "Ego", translation: "אגו", level: "intermediate", sentenceParts: [{en:"Big",he:"גדול"},{en:"ego",he:"אגו"}] },
  { term: "Empathy", translation: "אמפתיה", level: "advanced", sentenceParts: [{en:"Show",he:"הראה"},{en:"empathy",he:"אמפתיה"}] },
  { term: "Identity", translation: "זהות", level: "advanced", sentenceParts: [{en:"Secret",he:"סודית"},{en:"identity",he:"זהות"}] },
  { term: "Insight", translation: "תובנה", level: "academic", sentenceParts: [{en:"Gain",he:"השג"},{en:"insight",he:"תובנה"}] },
  { term: "Mood", translation: "מצב רוח", level: "intermediate", sentenceParts: [{en:"Good",he:"טוב"},{en:"mood",he:"מצב רוח"}] },
  { term: "Panic", translation: "פאניקה / בהלה", level: "intermediate", sentenceParts: [{en:"Do",he:"אל"},{en:"not",he:"תעשה"},{en:"panic",he:"פאניקה"}] }
];

// ============================================================================
// יום 9: כלכלה מתקדמת (Advanced Economics)
// ============================================================================
const day9Data = [
  { term: "Fiscal", translation: "פיסקלי (כספי/תקציבי)", level: "academic", sentenceParts: [{en:"Fiscal",he:"פיסקלית"},{en:"policy",he:"מדיניות"}] },
  { term: "Monetary", translation: "מוניטרי (קשור למטבע)", level: "academic", sentenceParts: [{en:"Monetary",he:"מוניטרית"},{en:"fund",he:"קרן"}] },
  { term: "Recession", translation: "מיתון", level: "academic", sentenceParts: [{en:"Deep",he:"עמוק"},{en:"recession",he:"מיתון"}] },
  { term: "Bankruptcy", translation: "פשיטת רגל", level: "advanced", sentenceParts: [{en:"File",he:"הגש"},{en:"for",he:"עבור"},{en:"bankruptcy",he:"פשיטת רגל"}] },
  { term: "Asset", translation: "נכס", level: "academic", sentenceParts: [{en:"Valuable",he:"יקר ערך"},{en:"asset",he:"נכס"}] },
  { term: "Equity", translation: "הון עצמי / הוגנות", level: "academic", sentenceParts: [{en:"Private",he:"פרטי"},{en:"equity",he:"הון"}] },
  { term: "Dividend", translation: "דיבידנד", level: "academic", sentenceParts: [{en:"Annual",he:"שנתי"},{en:"dividend",he:"דיבידנד"}] },
  { term: "Mortgage", translation: "משכנתא", level: "advanced", sentenceParts: [{en:"Pay",he:"שלם"},{en:"the",he:"את ה"},{en:"mortgage",he:"משכנתא"}] },
  { term: "Audit", translation: "ביקורת (חשבונאית)", level: "academic", sentenceParts: [{en:"Internal",he:"פנימית"},{en:"audit",he:"ביקורת"}] },
  { term: "Capital", translation: "הון", level: "advanced", sentenceParts: [{en:"Raise",he:"גייס"},{en:"capital",he:"הון"}] },
  { term: "Deficit", translation: "גירעון", level: "academic", sentenceParts: [{en:"Budget",he:"תקציבי"},{en:"deficit",he:"גירעון"}] },
  { term: "Incentive", translation: "תמריץ", level: "advanced", sentenceParts: [{en:"Tax",he:"מס"},{en:"incentive",he:"תמריץ"}] },
  { term: "Income", translation: "הכנסה", level: "intermediate", sentenceParts: [{en:"High",he:"גבוהה"},{en:"income",he:"הכנסה"}] },
  { term: "Interest", translation: "ריבית / עניין", level: "intermediate", sentenceParts: [{en:"Interest",he:"ריבית"},{en:"rate",he:"שיעור"}] },
  { term: "Liability", translation: "התחייבות / חבות", level: "academic", sentenceParts: [{en:"Legal",he:"חוקית"},{en:"liability",he:"חבות"}] },
  { term: "Loan", translation: "הלוואה", level: "intermediate", sentenceParts: [{en:"Student",he:"סטודנט"},{en:"loan",he:"הלוואת"}] },
  { term: "Market", translation: "שוק", level: "intermediate", sentenceParts: [{en:"Stock",he:"מניות"},{en:"market",he:"שוק"}] },
  { term: "Monopoly", translation: "מונופול", level: "academic", sentenceParts: [{en:"Illegal",he:"לא חוקי"},{en:"monopoly",he:"מונופול"}] },
  { term: "Pension", translation: "פנסיה", level: "advanced", sentenceParts: [{en:"Pension",he:"פנסיה"},{en:"fund",he:"קרן"}] },
  { term: "Poverty", translation: "עוני", level: "advanced", sentenceParts: [{en:"Extreme",he:"קיצוני"},{en:"poverty",he:"עוני"}] },
  { term: "Property", translation: "רכוש / נכס", level: "intermediate", sentenceParts: [{en:"Private",he:"פרטי"},{en:"property",he:"רכוש"}] },
  { term: "Prosperity", translation: "שגשוג", level: "academic", sentenceParts: [{en:"Peace",he:"שלום"},{en:"and",he:"ו"},{en:"prosperity",he:"שגשוג"}] },
  { term: "Share", translation: "מניה / חלק", level: "intermediate", sentenceParts: [{en:"Buy",he:"קנה"},{en:"shares",he:"מניות"}] },
  { term: "Stock", translation: "מלאי / מניה", level: "advanced", sentenceParts: [{en:"Out",he:"נגמר"},{en:"of",he:"ה"},{en:"stock",he:"מלאי"}] },
  { term: "Subsidy", translation: "סבסוד", level: "academic", sentenceParts: [{en:"Government",he:"ממשלתי"},{en:"subsidy",he:"סבסוד"}] },
  { term: "Tax", translation: "מס", level: "intermediate", sentenceParts: [{en:"Income",he:"הכנסה"},{en:"tax",he:"מס"}] },
  { term: "Trade", translation: "סחר", level: "intermediate", sentenceParts: [{en:"Free",he:"חופשי"},{en:"trade",he:"סחר"}] },
  { term: "Value", translation: "ערך", level: "intermediate", sentenceParts: [{en:"Market",he:"שוק"},{en:"value",he:"ערך"}] },
  { term: "Wealth", translation: "עושר", level: "advanced", sentenceParts: [{en:"Great",he:"רב"},{en:"wealth",he:"עושר"}] },
  { term: "Welfare", translation: "רווחה", level: "academic", sentenceParts: [{en:"Social",he:"חברתית"},{en:"welfare",he:"רווחה"}] }
];

// ============================================================================
// יום 10: חינוך ולמידה (Education)
// ============================================================================
const day10Data = [
  { term: "Curriculum", translation: "תוכנית לימודים", level: "academic", sentenceParts: [{en:"School",he:"בית ספר"},{en:"curriculum",he:"תוכנית לימודים"}] },
  { term: "Literacy", translation: "אוריינות (קרוא וכתוב)", level: "academic", sentenceParts: [{en:"Digital",he:"דיגיטלית"},{en:"literacy",he:"אוריינות"}] },
  { term: "Tuition", translation: "שכר לימוד", level: "advanced", sentenceParts: [{en:"High",he:"גבוה"},{en:"tuition",he:"שכר לימוד"}] },
  { term: "Scholarship", translation: "מלגה", level: "advanced", sentenceParts: [{en:"Full",he:"מלאה"},{en:"scholarship",he:"מלגה"}] },
  { term: "Academic", translation: "אקדמי", level: "intermediate", sentenceParts: [{en:"Academic",he:"אקדמית"},{en:"degree",he:"תואר"}] },
  { term: "Faculty", translation: "סגל / פקולטה", level: "academic", sentenceParts: [{en:"Faculty",he:"סגל"},{en:"member",he:"חבר"}] },
  { term: "Discipline", translation: "משמעת / תחום דעת", level: "advanced", sentenceParts: [{en:"Self",he:"עצמית"},{en:"discipline",he:"משמעת"}] },
  { term: "Lecture", translation: "הרצאה", level: "intermediate", sentenceParts: [{en:"Boring",he:"משעממת"},{en:"lecture",he:"הרצאה"}] },
  { term: "Thesis", translation: "תזה", level: "academic", sentenceParts: [{en:"Master",he:"תואר שני"},{en:"thesis",he:"תזה"}] },
  { term: "Graduate", translation: "בוגר תואר", level: "intermediate", sentenceParts: [{en:"College",he:"מכללה"},{en:"graduate",he:"בוגר"}] },
  { term: "Assignment", translation: "מטלה", level: "intermediate", sentenceParts: [{en:"Homework",he:"שיעורי בית"},{en:"assignment",he:"מטלה"}] },
  { term: "Campus", translation: "קמפוס", level: "intermediate", sentenceParts: [{en:"College",he:"מכללה"},{en:"campus",he:"קמפוס"}] },
  { term: "Certificate", translation: "תעודה", level: "intermediate", sentenceParts: [{en:"Birth",he:"לידה"},{en:"certificate",he:"תעודה"}] },
  { term: "College", translation: "מכללה", level: "intermediate", sentenceParts: [{en:"Go",he:"לך"},{en:"to",he:"ל"},{en:"college",he:"מכללה"}] },
  { term: "Course", translation: "קורס", level: "intermediate", sentenceParts: [{en:"Online",he:"מקוון"},{en:"course",he:"קורס"}] },
  { term: "Degree", translation: "תואר", level: "intermediate", sentenceParts: [{en:"Bachelor",he:"ראשון"},{en:"degree",he:"תואר"}] },
  { term: "Diploma", translation: "דיפלומה", level: "advanced", sentenceParts: [{en:"High",he:"תיכון"},{en:"school",he:"בית ספר"},{en:"diploma",he:"דיפלומה"}] },
  { term: "Educate", translation: "לחנך", level: "intermediate", sentenceParts: [{en:"Educate",he:"חנך"},{en:"yourself",he:"עצמך"}] },
  { term: "Exam", translation: "מבחן", level: "intermediate", sentenceParts: [{en:"Final",he:"סופי"},{en:"exam",he:"מבחן"}] },
  { term: "Grade", translation: "ציון / כיתה", level: "intermediate", sentenceParts: [{en:"Good",he:"טוב"},{en:"grade",he:"ציון"}] },
  { term: "Instruct", translation: "להנחות", level: "advanced", sentenceParts: [{en:"Instruct",he:"הנחה"},{en:"the",he:"את ה"},{en:"students",he:"תלמידים"}] },
  { term: "Knowledge", translation: "ידע", level: "intermediate", sentenceParts: [{en:"General",he:"כללי"},{en:"knowledge",he:"ידע"}] },
  { term: "Learn", translation: "ללמוד", level: "intermediate", sentenceParts: [{en:"Learn",he:"למד"},{en:"English",he:"אנגלית"}] },
  { term: "Lesson", translation: "שיעור", level: "intermediate", sentenceParts: [{en:"Piano",he:"פסנתר"},{en:"lesson",he:"שיעור"}] },
  { term: "Library", translation: "ספרייה", level: "intermediate", sentenceParts: [{en:"Public",he:"ציבורית"},{en:"library",he:"ספרייה"}] },
  { term: "Master", translation: "לשלוט ב / תואר שני", level: "advanced", sentenceParts: [{en:"Master",he:"שלט ב"},{en:"the",he:"את ה"},{en:"skill",he:"מיומנות"}] },
  { term: "Research", translation: "מחקר", level: "advanced", sentenceParts: [{en:"Scientific",he:"מדעי"},{en:"research",he:"מחקר"}] },
  { term: "School", translation: "בית ספר", level: "intermediate", sentenceParts: [{en:"High",he:"תיכון"},{en:"school",he:"בית ספר"}] },
  { term: "Student", translation: "תלמיד / סטודנט", level: "intermediate", sentenceParts: [{en:"University",he:"אוניברסיטה"},{en:"student",he:"סטודנט"}] },
  { term: "Study", translation: "ללמוד / מחקר", level: "intermediate", sentenceParts: [{en:"Study",he:"למד"},{en:"hard",he:"קשה"}] }
];

const seedDays7to10 = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI חסר");
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 מחובר ל-DB. מתחיל בהזנת ימים 7-10...');

    await Day.deleteMany({ dayNumber: { $in: [7, 8, 9, 10] } });

    const terms = [
      ...day7Data.map(d=>d.term), ...day8Data.map(d=>d.term),
      ...day9Data.map(d=>d.term), ...day10Data.map(d=>d.term)
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

    await createDay(7, "חוק ומשפט", day7Data);
    await createDay(8, "פסיכולוגיה ורגש", day8Data);
    await createDay(9, "כלכלה מתקדמת", day9Data);
    await createDay(10, "חינוך ולמידה", day10Data);

    console.log('🎉 ימים 7-10 הושלמו!');
    process.exit(0);
  } catch (err) {
    console.error('❌ שגיאה:', err);
    process.exit(1);
  }
};

seedDays7to10();