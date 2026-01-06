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
// יום 7: מילות מפתח לאמירנט - היגיון, זמן ותארים (30 מילים)
// ============================================================================
const day7Data = [
  // אקדמי / גבוה - נפוץ מאוד בהשלמת משפטים (1-15)
  { term: "Ambiguous", translation: "דו-משמעי / מעורפל", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"politician's",he:"של הפוליטיקאי"},{en:"answer",he:"תשובה"},{en:"was",he:"הייתה"},{en:"so",he:"כל כך"},{en:"ambiguous",he:"מעורפלת"},{en:"that",he:"ש"},{en:"no",he:"אף"},{en:"one",he:"אחד"},{en:"understood",he:"הבין"},{en:"his",he:"שלו"},{en:"true",he:"אמיתית"},{en:"position",he:"עמדה"}] },
  { term: "Inevitable", translation: "בלתי נמנע", level: "academic", sentenceParts: [{en:"It",he:"זה"},{en:"was",he:"היה"},{en:"inevitable",he:"בלתי נמנע"},{en:"that",he:"ש"},{en:"the",he:"ה"},{en:"two",he:"שתי"},{en:"teams",he:"קבוצות"},{en:"would",he:"יעשו"},{en:"meet",he:"יפגשו"},{en:"in",he:"ב"},{en:"the",he:"ה"},{en:"final",he:"סופי"},{en:"match",he:"משחק"}] },
  { term: "Obsolete", translation: "מיושן / שעבר זמנו", level: "academic", sentenceParts: [{en:"Typewriters",he:"מכונות כתיבה"},{en:"became",he:"נהיו"},{en:"almost",he:"כמעט"},{en:"completely",he:"לגמרי"},{en:"obsolete",he:"מיושנות"},{en:"after",he:"אחרי"},{en:"computers",he:"מחשבים"},{en:"became",he:"נהיו"},{en:"popular",he:"פופולריים"}] },
  { term: "Subsequent", translation: "עוקב / שבא אחרי", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"first",he:"ראשון"},{en:"chapter",he:"פרק"},{en:"was",he:"היה"},{en:"boring",he:"משעמם"},{en:"but",he:"אבל"},{en:"the",he:"ה"},{en:"subsequent",he:"עוקבים"},{en:"chapters",he:"פרקים"},{en:"were",he:"היו"},{en:"exciting",he:"מרגשים"}] },
  { term: "Distinguish", translation: "להבחין / להבדיל", level: "academic", sentenceParts: [{en:"It",he:"זה"},{en:"is",he:"הוא"},{en:"difficult",he:"קשה"},{en:"to",he:"ל"},{en:"distinguish",he:"להבחין"},{en:"between",he:"בין"},{en:"the",he:"ה"},{en:"twins",he:"תאומים"},{en:"because",he:"בגלל"},{en:"they",he:"שהם"},{en:"look",he:"נראים"},{en:"identical",he:"זהים"}] },
  { term: "Reluctant", translation: "מסויג / לא שש ל...", level: "academic", sentenceParts: [{en:"He",he:"הוא"},{en:"was",he:"היה"},{en:"very",he:"מאוד"},{en:"reluctant",he:"מסויג"},{en:"to",he:"ל"},{en:"lend",he:"להלוות"},{en:"money",he:"כסף"},{en:"to",he:"ל"},{en:"someone",he:"מישהו"},{en:"he",he:"שהוא"},{en:"hardly",he:"בקושי"},{en:"knew",he:"הכיר"}] },
  { term: "Pervasive", translation: "נרחב / מתפשט", level: "academic", sentenceParts: [{en:"Corruption",he:"שחיתות"},{en:"is",he:"היא"},{en:"a",he:"אחת"},{en:"pervasive",he:"נרחבת"},{en:"problem",he:"בעיה"},{en:"that",he:"ש"},{en:"affects",he:"משפיעה"},{en:"every",he:"כל"},{en:"level",he:"רמה"},{en:"of",he:"של"},{en:"society",he:"חברה"}] },
  { term: "Explicit", translation: "מפורש", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"manager",he:"מנהל"},{en:"gave",he:"נתן"},{en:"explicit",he:"מפורשות"},{en:"instructions",he:"הוראות"},{en:"not",he:"לא"},{en:"to",he:"ל"},{en:"touch",he:"לגעת"},{en:"the",he:"ב"},{en:"expensive",he:"יקר"},{en:"equipment",he:"ציוד"}] },
  { term: "Implicit", translation: "משתמע / מרומז", level: "academic", sentenceParts: [{en:"There",he:"יש"},{en:"was",he:"הייתה"},{en:"an",he:"אחת"},{en:"implicit",he:"משתמעת"},{en:"agreement",he:"הסכמה"},{en:"between",he:"בין"},{en:"them",he:"ביניהם"},{en:"to",he:"ל"},{en:"keep",he:"לשמור"},{en:"the",he:"את ה"},{en:"secret",he:"סוד"}] },
  { term: "Deteriorate", translation: "להידרדר", level: "academic", sentenceParts: [{en:"His",he:"שלו"},{en:"health",he:"בריאות"},{en:"began",he:"התחילה"},{en:"to",he:"ל"},{en:"deteriorate",he:"להידרדר"},{en:"rapidly",he:"במהירות"},{en:"after",he:"אחרי"},{en:"he",he:"שהוא"},{en:"stopped",he:"הפסיק"},{en:"taking",he:"לקחת"},{en:"the",he:"את ה"},{en:"medicine",he:"תרופה"}] },
  { term: "Sustain", translation: "לקיים / להחזיק מעמד", level: "academic", sentenceParts: [{en:"It",he:"זה"},{en:"is",he:"הוא"},{en:"hard",he:"קשה"},{en:"to",he:"ל"},{en:"sustain",he:"להחזיק מעמד"},{en:"interest",he:"עניין"},{en:"in",he:"ב"},{en:"a",he:"אחד"},{en:"project",he:"פרויקט"},{en:"that",he:"ש"},{en:"takes",he:"לוקח"},{en:"years",he:"שנים"}] },
  { term: "Prohibit", translation: "לאסור", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"new",he:"חדשים"},{en:"laws",he:"חוקים"},{en:"strictly",he:"בחומרה"},{en:"prohibit",he:"אוסרים"},{en:"smoking",he:"עישון"},{en:"in",he:"ב"},{en:"all",he:"כל"},{en:"public",he:"ציבוריים"},{en:"places",he:"מקומות"}] },
  { term: "Implement", translation: "ליישם", level: "academic", sentenceParts: [{en:"We",he:"אנחנו"},{en:"need",he:"צריכים"},{en:"a",he:"אחת"},{en:"plan",he:"תוכנית"},{en:"to",he:"כדי"},{en:"implement",he:"ליישם"},{en:"the",he:"את ה"},{en:"changes",he:"שינויים"},{en:"in",he:"ב"},{en:"the",he:"ה"},{en:"system",he:"מערכת"}] },
  { term: "Coherent", translation: "קריא / עקבי / הגיוני", level: "academic", sentenceParts: [{en:"He",he:"הוא"},{en:"was",he:"היה"},{en:"too",he:"מדי"},{en:"tired",he:"עייף"},{en:"to",he:"כדי"},{en:"form",he:"ליצור"},{en:"a",he:"אחד"},{en:"coherent",he:"הגיוני"},{en:"sentence",he:"משפט"},{en:"during",he:"במהלך"},{en:"the",he:"ה"},{en:"interview",he:"ראיון"}] },
  { term: "Precede", translation: "להקדים", level: "academic", sentenceParts: [{en:"A",he:"אחת"},{en:"short",he:"קצרה"},{en:"introduction",he:"הקדמה"},{en:"will",he:"תעשה"},{en:"precede",he:"תקדים"},{en:"the",he:"את ה"},{en:"main",he:"עיקרית"},{en:"presentation",he:"מצגת"},{en:"by",he:"על ידי"},{en:"the",he:"ה"},{en:"professor",he:"פרופסור"}] },
  
  // בינוני / נפוץ בטקסטים (16-30)
  { term: "Annual", translation: "שנתי", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"company's",he:"של החברה"},{en:"annual",he:"שנתי"},{en:"report",he:"דוח"},{en:"showed",he:"הראה"},{en:"a",he:"אחת"},{en:"significant",he:"משמעותית"},{en:"increase",he:"עלייה"},{en:"in",he:"ב"},{en:"sales",he:"מכירות"}] },
  { term: "Attempt", translation: "ניסיון / לנסות", level: "intermediate", sentenceParts: [{en:"This",he:"זה"},{en:"is",he:"הוא"},{en:"her",he:"שלה"},{en:"second",he:"שני"},{en:"attempt",he:"ניסיון"},{en:"to",he:"ל"},{en:"climb",he:"לטפס"},{en:"Mount",he:"הר"},{en:"Everest",he:"אוורסט"},{en:"this",he:"הזה"},{en:"year",he:"שנה"}] },
  { term: "Benefit", translation: "יתרון / תועלת", level: "intermediate", sentenceParts: [{en:"One",he:"אחד"},{en:"major",he:"עיקרי"},{en:"benefit",he:"יתרון"},{en:"of",he:"של"},{en:"exercise",he:"אימון"},{en:"is",he:"הוא"},{en:"improved",he:"משופרת"},{en:"heart",he:"לב"},{en:"health",he:"בריאות"}] },
  { term: "Capable", translation: "מסוגל", level: "intermediate", sentenceParts: [{en:"She",he:"היא"},{en:"is",he:"הינה"},{en:"capable",he:"מסוגלת"},{en:"of",he:"ל"},{en:"solving",he:"פתירת"},{en:"very",he:"מאוד"},{en:"complex",he:"מורכבות"},{en:"mathematical",he:"מתמטיות"},{en:"problems",he:"בעיות"}] },
  { term: "Constant", translation: "קבוע / מתמיד", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"baby",he:"תינוק"},{en:"needs",he:"צריך"},{en:"constant",he:"מתמדת"},{en:"attention",he:"תשומת לב"},{en:"from",he:"מ"},{en:"his",he:"שלו"},{en:"parents",he:"הורים"},{en:"at",he:"ב"},{en:"this",he:"זה"},{en:"age",he:"גיל"}] },
  { term: "Demand", translation: "דרישה / ביקוש", level: "intermediate", sentenceParts: [{en:"There",he:"יש"},{en:"is",he:"הוא"},{en:"a",he:"אחת"},{en:"high",he:"גבוהה"},{en:"demand",he:"דרישה"},{en:"for",he:"עבור"},{en:"skilled",he:"מיומנים"},{en:"workers",he:"עובדים"},{en:"in",he:"ב"},{en:"the",he:"ה"},{en:"tech",he:"טכנולוגיה"},{en:"industry",he:"תעשיית"}] },
  { term: "Essential", translation: "חיוני", level: "intermediate", sentenceParts: [{en:"Water",he:"מים"},{en:"is",he:"הם"},{en:"essential",he:"חיוניים"},{en:"for",he:"עבור"},{en:"all",he:"כל"},{en:"forms",he:"צורות"},{en:"of",he:"של"},{en:"life",he:"חיים"},{en:"on",he:"על"},{en:"Earth",he:"כדור הארץ"}] },
  { term: "Former", translation: "קודם / לשעבר", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"former",he:"לשעבר"},{en:"president",he:"נשיא"},{en:"gave",he:"נתן"},{en:"a",he:"אחד"},{en:"speech",he:"נאום"},{en:"at",he:"ב"},{en:"the",he:"ה"},{en:"conference",he:"כנס"},{en:"yesterday",he:"אתמול"}] },
  { term: "Latter", translation: "השני מבין שניים", level: "intermediate", sentenceParts: [{en:"Between",he:"בין"},{en:"London",he:"לונדון"},{en:"and",he:"ו"},{en:"Paris",he:"פריז"},{en:"I",he:"אני"},{en:"prefer",he:"מעדיף"},{en:"the",he:"את ה"},{en:"latter",he:"השנייה (פריז)"}] },
  { term: "Major", translation: "עיקרי / ראשי", level: "intermediate", sentenceParts: [{en:"Traffic",he:"תנועה"},{en:"is",he:"היא"},{en:"a",he:"אחת"},{en:"major",he:"עיקרית"},{en:"problem",he:"בעיה"},{en:"in",he:"ב"},{en:"almost",he:"כמעט"},{en:"every",he:"כל"},{en:"big",he:"גדולה"},{en:"city",he:"עיר"}] },
  { term: "Purpose", translation: "מטרה", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"main",he:"עיקרית"},{en:"purpose",he:"מטרה"},{en:"of",he:"של"},{en:"this",he:"הזו"},{en:"meeting",he:"פגישה"},{en:"is",he:"היא"},{en:"to",he:"ל"},{en:"discuss",he:"לדון"},{en:"the",he:"ב"},{en:"budget",he:"תקציב"}] },
  { term: "Recent", translation: "אחרון / עדכני", level: "intermediate", sentenceParts: [{en:"In",he:"ב"},{en:"recent",he:"אחרונות"},{en:"years",he:"שנים"},{en:"technology",he:"טכנולוגיה"},{en:"has",he:"כבר"},{en:"changed",he:"שינתה"},{en:"our",he:"שלנו"},{en:"daily",he:"יום יומיים"},{en:"lives",he:"חיים"}] },
  { term: "Severe", translation: "חמור", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"storm",he:"סופה"},{en:"caused",he:"גרמה"},{en:"severe",he:"חמור"},{en:"damage",he:"נזק"},{en:"to",he:"ל"},{en:"houses",he:"בתים"},{en:"along",he:"לאורך"},{en:"the",he:"ה"},{en:"coast",he:"חוף"}] },
  { term: "Visible", translation: "נראה לעין", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"stars",he:"כוכבים"},{en:"are",he:"הם"},{en:"clearly",he:"באופן ברור"},{en:"visible",he:"נראים לעין"},{en:"in",he:"ב"},{en:"the",he:"ה"},{en:"sky",he:"שמיים"},{en:"at",he:"ב"},{en:"night",he:"לילה"}] },
  { term: "Domestic", translation: "ביתי / מקומי", level: "intermediate", sentenceParts: [{en:"Cats",he:"חתולים"},{en:"and",he:"ו"},{en:"dogs",he:"כלבים"},{en:"are",he:"הם"},{en:"the",he:"ה"},{en:"most",he:"הכי"},{en:"common",he:"נפוצות"},{en:"domestic",he:"ביתיות"},{en:"animals",he:"חיות"}] }
];

// ============================================================================
// יום 8: סביבה וטבע (נושא נפוץ בקטעי קריאה באמירנט)
// ============================================================================
const day8Data = [
  // אקדמי / גבוה (1-15)
  { term: "Adaptation", translation: "הסתגלות", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"camel's",he:"של הגמל"},{en:"hump",he:"דבשת"},{en:"is",he:"היא"},{en:"an",he:"אחת"},{en:"adaptation",he:"הסתגלות"},{en:"to",he:"ל"},{en:"living",he:"מחייה"},{en:"in",he:"ב"},{en:"dry",he:"יבשים"},{en:"deserts",he:"מדבריות"}] },
  { term: "Biodiversity", translation: "מגוון ביולוגי", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"rainforest",he:"יער גשם"},{en:"is",he:"הוא"},{en:"known",he:"ידוע"},{en:"for",he:"עבור"},{en:"its",he:"שלו"},{en:"incredible",he:"מדהים"},{en:"biodiversity",he:"מגוון ביולוגי"},{en:"of",he:"של"},{en:"plants",he:"צמחים"}] },
  { term: "Conservation", translation: "שימור", level: "academic", sentenceParts: [{en:"Water",he:"מים"},{en:"conservation",he:"שימור"},{en:"is",he:"הוא"},{en:"very",he:"מאוד"},{en:"important",he:"חשוב"},{en:"in",he:"ב"},{en:"areas",he:"אזורים"},{en:"that",he:"ש"},{en:"suffer",he:"סובלים"},{en:"from",he:"מ"},{en:"drought",he:"בצורת"}] },
  { term: "Contaminate", translation: "לזהם (חומרים)", level: "academic", sentenceParts: [{en:"Industrial",he:"תעשייתיים"},{en:"factories",he:"מפעלים"},{en:"often",he:"לרוב"},{en:"contaminate",he:"מזהמים"},{en:"the",he:"את ה"},{en:"local",he:"מקומי"},{en:"water",he:"מים"},{en:"supply",he:"אספקת"},{en:"with",he:"עם"},{en:"chemicals",he:"כימיקלים"}] },
  { term: "Depletion", translation: "דילול / התרוקנות", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"rapid",he:"מהירה"},{en:"depletion",he:"התרוקנות/דילול"},{en:"of",he:"של"},{en:"natural",he:"טבעיים"},{en:"resources",he:"משאבים"},{en:"is",he:"הוא"},{en:"a",he:"אחת"},{en:"global",he:"עולמית"},{en:"concern",he:"דאגה"}] },
  { term: "Emission", translation: "פליטה (של גז/אור)", level: "academic", sentenceParts: [{en:"We",he:"אנחנו"},{en:"must",he:"חייבים"},{en:"reduce",he:"להפחית"},{en:"carbon",he:"פחמן"},{en:"emissions",he:"פליטות"},{en:"to",he:"כדי"},{en:"stop",he:"לעצור"},{en:"global",he:"גלובלית"},{en:"warming",he:"התחממות"}] },
  { term: "Extinction", translation: "הכחדה", level: "academic", sentenceParts: [{en:"Many",he:"הרבה"},{en:"species",he:"מינים"},{en:"face",he:"עומדים בפני"},{en:"the",he:"ה"},{en:"threat",he:"איום"},{en:"of",he:"של"},{en:"total",he:"מוחלטת"},{en:"extinction",he:"הכחדה"},{en:"due",he:"עקב"},{en:"to",he:"ל"},{en:"hunting",he:"ציד"}] },
  { term: "Habitat", translation: "בית גידול", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"destruction",he:"הרס"},{en:"of",he:"של"},{en:"their",he:"שלהם"},{en:"natural",he:"טבעי"},{en:"habitat",he:"בית גידול"},{en:"leaves",he:"משאיר"},{en:"animals",he:"חיות"},{en:"homeless",he:"חסרי בית"}] },
  { term: "Irrigation", translation: "השקיה", level: "academic", sentenceParts: [{en:"Modern",he:"מודרניות"},{en:"irrigation",he:"השקייה"},{en:"systems",he:"מערכות"},{en:"help",he:"עוזרות"},{en:"farmers",he:"חקלאים"},{en:"grow",he:"לגדל"},{en:"crops",he:"יבולים"},{en:"in",he:"ב"},{en:"dry",he:"יבשה"},{en:"land",he:"אדמה"}] },
  { term: "Migration", translation: "הגירה / נדידה", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"annual",he:"שנתית"},{en:"migration",he:"נדידה"},{en:"of",he:"של"},{en:"birds",he:"ציפורים"},{en:"is",he:"היא"},{en:"an",he:"אחת"},{en:"amazing",he:"מדהימה"},{en:"natural",he:"טבעית"},{en:"phenomenon",he:"תופעה"}] },
  { term: "Predator", translation: "טורף", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"lion",he:"אריה"},{en:"is",he:"הוא"},{en:"an",he:"אחד"},{en:"apex",he:"על (פסגה)"},{en:"predator",he:"טורף"},{en:"at",he:"ב"},{en:"the",he:"ה"},{en:"top",he:"ראש"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"food",he:"מזון"},{en:"chain",he:"שרשרת"}] },
  { term: "Preservation", translation: "שימור (מצב קיים)", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"preservation",he:"שימור"},{en:"of",he:"של"},{en:"historical",he:"היסטוריים"},{en:"buildings",he:"בניינים"},{en:"is",he:"הוא"},{en:"vital",he:"חיוני"},{en:"for",he:"עבור"},{en:"the",he:"ה"},{en:"city's",he:"של העיר"},{en:"culture",he:"תרבות"}] },
  { term: "Renewable", translation: "מתחדש", level: "academic", sentenceParts: [{en:"Solar",he:"סולארית"},{en:"and",he:"ו"},{en:"wind",he:"רוח"},{en:"energy",he:"אנרגיה"},{en:"are",he:"הם"},{en:"examples",he:"דוגמאות"},{en:"of",he:"של"},{en:"renewable",he:"מתחדשים"},{en:"power",he:"כוח"},{en:"sources",he:"מקורות"}] },
  { term: "Species", translation: "מין / זן (ביולוגיה)", level: "academic", sentenceParts: [{en:"Scientists",he:"מדענים"},{en:"discovered",he:"גילו"},{en:"a",he:"אחד"},{en:"new",he:"חדש"},{en:"species",he:"מין"},{en:"of",he:"של"},{en:"frog",he:"צפרדע"},{en:"in",he:"ב"},{en:"the",he:"ה"},{en:"jungle",he:"ג'ונגל"}] },
  { term: "Vegetation", translation: "צמחייה", level: "academic", sentenceParts: [{en:"Dense",he:"צפופה"},{en:"vegetation",he:"צמחייה"},{en:"covers",he:"מכסה"},{en:"the",he:"את ה"},{en:"ground",he:"קרקע"},{en:"in",he:"ב"},{en:"the",he:"ה"},{en:"tropical",he:"טרופי"},{en:"forest",he:"יער"}] },

  // בינוני / נפוץ בטקסטים (16-30)
  { term: "Agriculture", translation: "חקלאות", level: "intermediate", sentenceParts: [{en:"Agriculture",he:"חקלאות"},{en:"is",he:"היא"},{en:"the",he:"ה"},{en:"main",he:"עיקרי"},{en:"source",he:"מקור"},{en:"of",he:"של"},{en:"food",he:"מזון"},{en:"for",he:"עבור"},{en:"the",he:"ה"},{en:"human",he:"אנושית"},{en:"population",he:"אוכלוסייה"}] },
  { term: "Atmosphere", translation: "אטמוספירה / אווירה", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"earth's",he:"של כדור הארץ"},{en:"atmosphere",he:"אטמוספירה"},{en:"protects",he:"מגנה"},{en:"us",he:"עלינו"},{en:"from",he:"מ"},{en:"the",he:"ה"},{en:"sun's",he:"של השמש"},{en:"harmful",he:"מזיקות"},{en:"rays",he:"קרניים"}] },
  { term: "Climate", translation: "אקלים", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"climate",he:"אקלים"},{en:"in",he:"ב"},{en:"this",he:"הזה"},{en:"region",he:"אזור"},{en:"is",he:"הוא"},{en:"very",he:"מאוד"},{en:"hot",he:"חם"},{en:"and",he:"ו"},{en:"dry",he:"יבש"}] },
  { term: "Crop", translation: "יבול", level: "intermediate", sentenceParts: [{en:"Wheat",he:"חיטה"},{en:"is",he:"היא"},{en:"an",he:"אחד"},{en:"important",he:"חשוב"},{en:"crop",he:"יבול"},{en:"grown",he:"שגדל"},{en:"in",he:"ב"},{en:"many",he:"הרבה"},{en:"countries",he:"מדינות"}] },
  { term: "Disaster", translation: "אסון", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"earthquake",he:"רעידת אדמה"},{en:"was",he:"הייתה"},{en:"a",he:"אחד"},{en:"terrible",he:"נורא"},{en:"natural",he:"טבע"},{en:"disaster",he:"אסון"},{en:"for",he:"עבור"},{en:"the",he:"ה"},{en:"city",he:"עיר"}] },
  { term: "Energy", translation: "אנרגיה", level: "intermediate", sentenceParts: [{en:"We",he:"אנחנו"},{en:"need",he:"צריכים"},{en:"to",he:"ל"},{en:"find",he:"למצוא"},{en:"cleaner",he:"נקיים יותר"},{en:"sources",he:"מקורות"},{en:"of",he:"של"},{en:"energy",he:"אנרגיה"},{en:"soon",he:"בקרוב"}] },
  { term: "Fuel", translation: "דלק", level: "intermediate", sentenceParts: [{en:"Prices",he:"מחירים"},{en:"of",he:"של"},{en:"fossil",he:"מאובנים"},{en:"fuel",he:"דלק"},{en:"are",he:"הם"},{en:"rising",he:"עולים"},{en:"all",he:"כל"},{en:"over",he:"ברחבי"},{en:"the",he:"ה"},{en:"world",he:"עולם"}] },
  { term: "Landscape", translation: "נוף", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"landscape",he:"נוף"},{en:"was",he:"היה"},{en:"beautiful",he:"יפה"},{en:"with",he:"עם"},{en:"green",he:"ירוקות"},{en:"hills",he:"גבעות"},{en:"and",he:"ו"},{en:"rivers",he:"נהרות"}] },
  { term: "Layer", translation: "שכבה", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"ozone",he:"אוזון"},{en:"layer",he:"שכבת"},{en:"is",he:"היא"},{en:"getting",he:"נהיית"},{en:"thinner",he:"דקה יותר"},{en:"because",he:"בגלל"},{en:"of",he:"של"},{en:"pollution",he:"זיהום"}] },
  { term: "Natural", translation: "טבעי", level: "intermediate", sentenceParts: [{en:"Honey",he:"דבש"},{en:"is",he:"הוא"},{en:"a",he:"אחד"},{en:"natural",he:"טבעי"},{en:"sweetener",he:"ממתיק"},{en:"that",he:"ש"},{en:"is",he:"הוא"},{en:"healthier",he:"בריא יותר"},{en:"than",he:"מאשר"},{en:"sugar",he:"סוכר"}] },
  { term: "Pollution", translation: "זיהום", level: "intermediate", sentenceParts: [{en:"Air",he:"אוויר"},{en:"pollution",he:"זיהום"},{en:"causes",he:"גורם"},{en:"breathing",he:"נשימה"},{en:"problems",he:"בעיות"},{en:"for",he:"עבור"},{en:"many",he:"הרבה"},{en:"people",he:"אנשים"},{en:"in",he:"ב"},{en:"cities",he:"ערים"}] },
  { term: "Resource", translation: "משאב", level: "intermediate", sentenceParts: [{en:"Water",he:"מים"},{en:"is",he:"הם"},{en:"our",he:"שלנו"},{en:"most",he:"הכי"},{en:"valuable",he:"יקר ערך"},{en:"natural",he:"טבעי"},{en:"resource",he:"משאב"},{en:"on",he:"ב"},{en:"earth",he:"כדור הארץ"}] },
  { term: "Soil", translation: "אדמה / קרקע", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"farmers",he:"חקלאים"},{en:"planted",he:"שתלו"},{en:"the",he:"את ה"},{en:"seeds",he:"זרעים"},{en:"in",he:"ב"},{en:"rich",he:"עשירה"},{en:"fertile",he:"פורייה"},{en:"soil",he:"אדמה"}] },
  { term: "Weather", translation: "מזג אוויר", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"weather",he:"מזג אוויר"},{en:"forecast",he:"תחזית"},{en:"predicts",he:"חוזה"},{en:"heavy",he:"כבד"},{en:"rain",he:"גשם"},{en:"for",he:"עבור"},{en:"tomorrow",he:"מחר"}] },
  { term: "Environment", translation: "סביבה", level: "intermediate", sentenceParts: [{en:"We",he:"אנחנו"},{en:"should",he:"צריכים"},{en:"all",he:"כולם"},{en:"work",he:"לעבוד"},{en:"together",he:"ביחד"},{en:"to",he:"כדי"},{en:"save",he:"להציל"},{en:"the",he:"את ה"},{en:"environment",he:"סביבה"}] }
];

// ============================================================================
// יום 9: בריאות, טכנולוגיה וגוף האדם (נפוץ בקטעי קריאה באמירנט)
// ============================================================================
const day9Data = [
  // אקדמי / גבוה (1-15)
  { term: "Alleviate", translation: "להקל / לשכך", level: "academic", sentenceParts: [{en:"This",he:"זוהי"},{en:"new",he:"חדשה"},{en:"medicine",he:"תרופה"},{en:"is",he:"היא"},{en:"designed",he:"מתוכננת"},{en:"to",he:"כדי"},{en:"alleviate",he:"להקל"},{en:"pain",he:"כאב"},{en:"without",he:"בלי"},{en:"side",he:"לוואי"},{en:"effects",he:"תופעות"}] },
  { term: "Artificial", translation: "מלאכותי", level: "academic", sentenceParts: [{en:"Artificial",he:"מלאכותית"},{en:"intelligence",he:"בינה"},{en:"is",he:"היא"},{en:"becoming",he:"הופכת"},{en:"more",he:"יותר"},{en:"advanced",he:"מתקדמת"},{en:"every",he:"כל"},{en:"single",he:"בודד"},{en:"year",he:"שנה"}] },
  { term: "Deficiency", translation: "מחסור / ליקוי", level: "academic", sentenceParts: [{en:"A",he:"אחד"},{en:"deficiency",he:"מחסור"},{en:"in",he:"ב"},{en:"Vitamin",he:"ויטמין"},{en:"D",he:"די"},{en:"can",he:"יכול"},{en:"lead",he:"להוביל"},{en:"to",he:"ל"},{en:"weak",he:"חלשות"},{en:"bones",he:"עצמות"}] },
  { term: "Diagnosis", translation: "אבחנה", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"early",he:"מוקדמת"},{en:"diagnosis",he:"אבחנה"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"disease",he:"מחלה"},{en:"saved",he:"הצילה"},{en:"the",he:"את ה"},{en:"patient's",he:"של המטופל"},{en:"life",he:"חיים"}] },
  { term: "Disorder", translation: "הפרעה (בריאותית)", level: "academic", sentenceParts: [{en:"He",he:"הוא"},{en:"suffers",he:"סובל"},{en:"from",he:"מ"},{en:"a",he:"אחת"},{en:"rare",he:"נדירה"},{en:"genetic",he:"גנטית"},{en:"disorder",he:"הפרעה"},{en:"that",he:"ש"},{en:"affects",he:"משפיעה על"},{en:"his",he:"שלו"},{en:"vision",he:"ראייה"}] },
  { term: "Dosage", translation: "מינון", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"doctor",he:"רופא"},{en:"recommended",he:"המליץ"},{en:"lowering",he:"להנמיך"},{en:"the",he:"את ה"},{en:"dosage",he:"מינון"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"medication",he:"תרופה"}] },
  { term: "Efficacy", translation: "יעילות (של תרופה/טיפול)", level: "academic", sentenceParts: [{en:"Researchers",he:"חוקרים"},{en:"are",he:"הם"},{en:"testing",he:"בודקים"},{en:"the",he:"את ה"},{en:"efficacy",he:"יעילות"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"new",he:"חדש"},{en:"vaccine",he:"חיסון"}] },
  { term: "Impair", translation: "לפגום / להחליש", level: "academic", sentenceParts: [{en:"Drinking",he:"שתיית"},{en:"alcohol",he:"אלכוהול"},{en:"can",he:"יכולה"},{en:"seriously",he:"ברצינות"},{en:"impair",he:"לפגוע ב"},{en:"your",he:"שלך"},{en:"ability",he:"יכולת"},{en:"to",he:"ל"},{en:"drive",he:"לנהוג"}] },
  { term: "Infection", translation: "זיהום (חיידקי/ויראלי)", level: "academic", sentenceParts: [{en:"You",he:"אתה"},{en:"should",he:"צריך"},{en:"clean",he:"לנקות"},{en:"the",he:"את ה"},{en:"wound",he:"פצע"},{en:"to",he:"כדי"},{en:"prevent",he:"למנוע"},{en:"infection",he:"זיהום"},{en:"from",he:"מ"},{en:"bacteria",he:"חיידקים"}] },
  { term: "Inhibition", translation: "עכבה / מעצור", level: "academic", sentenceParts: [{en:"Alcohol",he:"אלכוהול"},{en:"often",he:"לרוב"},{en:"lowers",he:"מנמיך"},{en:"people's",he:"של אנשים"},{en:"social",he:"חברתיים"},{en:"inhibitions",he:"עכבות/מעצורים"},{en:"at",he:"ב"},{en:"parties",he:"מסיבות"}] },
  { term: "Mutation", translation: "מוטציה / שינוי גנטי", level: "academic", sentenceParts: [{en:"A",he:"אחת"},{en:"genetic",he:"גנטית"},{en:"mutation",he:"מוטציה"},{en:"caused",he:"גרמה"},{en:"the",he:"ל"},{en:"virus",he:"וירוס"},{en:"to",he:"ל"},{en:"become",he:"להפוך"},{en:"more",he:"יותר"},{en:"dangerous",he:"מסוכן"}] },
  { term: "Prescription", translation: "מרשם רופא", level: "academic", sentenceParts: [{en:"You",he:"אתה"},{en:"cannot",he:"לא יכול"},{en:"buy",he:"לקנות"},{en:"this",he:"הזאת"},{en:"medicine",he:"תרופה"},{en:"without",he:"בלי"},{en:"a",he:"אחד"},{en:"doctor's",he:"של רופא"},{en:"prescription",he:"מרשם"}] },
  { term: "Prevalence", translation: "שכיחות / נפיצות", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"prevalence",he:"שכיחות"},{en:"of",he:"של"},{en:"allergies",he:"אלרגיות"},{en:"has",he:"כבר"},{en:"increased",he:"גדלה"},{en:"in",he:"ב"},{en:"modern",he:"מודרנית"},{en:"society",he:"חברה"}] },
  { term: "Symptom", translation: "תסמין", level: "academic", sentenceParts: [{en:"A",he:"אחד"},{en:"common",he:"נפוץ"},{en:"symptom",he:"תסמין"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"flu",he:"שפעת"},{en:"is",he:"הוא"},{en:"a",he:"אחד"},{en:"high",he:"גבוה"},{en:"fever",he:"חום"}] },
  { term: "Transmission", translation: "העברה / שידור", level: "academic", sentenceParts: [{en:"Masks",he:"מסכות"},{en:"help",he:"עוזרות"},{en:"prevent",he:"למנוע"},{en:"the",he:"את ה"},{en:"transmission",he:"העברה"},{en:"of",he:"של"},{en:"viruses",he:"וירוסים"},{en:"between",he:"בין"},{en:"people",he:"אנשים"}] },

  // בינוני / נפוץ בטקסטים (16-30)
  { term: "Access", translation: "גישה", level: "intermediate", sentenceParts: [{en:"Many",he:"הרבה"},{en:"people",he:"אנשים"},{en:"do",he:"עושים"},{en:"not",he:"לא"},{en:"have",he:"יש"},{en:"access",he:"גישה"},{en:"to",he:"ל"},{en:"clean",he:"נקיים"},{en:"drinking",he:"שתייה"},{en:"water",he:"מים"}] },
  { term: "Bacteria", translation: "חיידקים", level: "intermediate", sentenceParts: [{en:"Not",he:"לא"},{en:"all",he:"כל"},{en:"bacteria",he:"חיידקים"},{en:"are",he:"הם"},{en:"harmful",he:"מזיקים"},{en:"some",he:"חלק"},{en:"are",he:"הם"},{en:"good",he:"טובים"},{en:"for",he:"עבור"},{en:"you",he:"אותך"}] },
  { term: "Cell", translation: "תא (בגוף) / סלולרי", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"cell",he:"תא"},{en:"is",he:"הוא"},{en:"the",he:"ה"},{en:"smallest",he:"הכי קטנה"},{en:"unit",he:"יחידה"},{en:"of",he:"של"},{en:"life",he:"חיים"},{en:"in",he:"ב"},{en:"our",he:"שלנו"},{en:"bodies",he:"גופים"}] },
  { term: "Cure", translation: "מרפא / תרופה", level: "intermediate", sentenceParts: [{en:"Scientists",he:"מדענים"},{en:"are",he:"הם"},{en:"still",he:"עדיין"},{en:"looking",he:"מחפשים"},{en:"for",he:"אחר"},{en:"a",he:"אחד"},{en:"cure",he:"מרפא"},{en:"for",he:"עבור"},{en:"cancer",he:"סרטן"}] },
  { term: "Diet", translation: "תזונה / דיאטה", level: "intermediate", sentenceParts: [{en:"A",he:"אחת"},{en:"balanced",he:"מאוזנת"},{en:"diet",he:"תזונה"},{en:"is",he:"היא"},{en:"essential",he:"חיונית"},{en:"for",he:"עבור"},{en:"maintaining",he:"תחזוקת"},{en:"good",he:"טובה"},{en:"health",he:"בריאות"}] },
  { term: "Disease", translation: "מחלה", level: "intermediate", sentenceParts: [{en:"Heart",he:"לב"},{en:"disease",he:"מחלת"},{en:"is",he:"היא"},{en:"a",he:"אחת"},{en:"leading",he:"מובילה"},{en:"cause",he:"סיבה"},{en:"of",he:"של"},{en:"death",he:"מוות"},{en:"worldwide",he:"ברחבי העולם"}] },
  { term: "Drug", translation: "תרופה / סם", level: "intermediate", sentenceParts: [{en:"This",he:"זו"},{en:"drug",he:"תרופה"},{en:"can",he:"יכולה"},{en:"help",he:"לעזור"},{en:"reduce",he:"להפחית"},{en:"high",he:"גבוה"},{en:"blood",he:"דם"},{en:"pressure",he:"לחץ"}] },
  { term: "Exercise", translation: "פעילות גופנית / תרגיל", level: "intermediate", sentenceParts: [{en:"Regular",he:"רגילה"},{en:"exercise",he:"פעילות גופנית"},{en:"makes",he:"עושה"},{en:"your",he:"שלך"},{en:"muscles",he:"שרירים"},{en:"stronger",he:"חזקים יותר"},{en:"and",he:"ו"},{en:"healthier",he:"בריאים יותר"}] },
  { term: "Function", translation: "תפקוד / פונקציה", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"main",he:"עיקרי"},{en:"function",he:"תפקוד"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"heart",he:"לב"},{en:"is",he:"הוא"},{en:"to",he:"ל"},{en:"pump",he:"לשאוב"},{en:"blood",he:"דם"}] },
  { term: "Muscle", translation: "שריר", level: "intermediate", sentenceParts: [{en:"He",he:"הוא"},{en:"pulled",he:"מתח"},{en:"a",he:"אחד"},{en:"muscle",he:"שריר"},{en:"in",he:"ב"},{en:"his",he:"שלו"},{en:"leg",he:"רגל"},{en:"while",he:"בזמן ש"},{en:"playing",he:"שיחק"},{en:"soccer",he:"כדורגל"}] },
  { term: "Patient", translation: "מטופל / סבלני", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"nurse",he:"אח/ות"},{en:"checked",he:"בדק/ה"},{en:"the",he:"את ה"},{en:"patient",he:"מטופל"},{en:"every",he:"כל"},{en:"hour",he:"שעה"},{en:"during",he:"במהלך"},{en:"the",he:"ה"},{en:"night",he:"לילה"}] },
  { term: "Poison", translation: "רעל", level: "intermediate", sentenceParts: [{en:"Some",he:"כמה"},{en:"mushrooms",he:"פטריות"},{en:"contain",he:"מכילות"},{en:"deadly",he:"קטלני"},{en:"poison",he:"רעל"},{en:"so",he:"אז"},{en:"be",he:"היה"},{en:"careful",he:"זהיר"}] },
  { term: "Recovery", translation: "התאוששות / החלמה", level: "intermediate", sentenceParts: [{en:"His",he:"שלו"},{en:"recovery",he:"החלמה"},{en:"from",he:"מ"},{en:"the",he:"ה"},{en:"surgery",he:"ניתוח"},{en:"took",he:"לקחה"},{en:"longer",he:"ארוך יותר"},{en:"than",he:"מאשר"},{en:"expected",he:"מצופה"}] },
  { term: "Surgery", translation: "ניתוח", level: "intermediate", sentenceParts: [{en:"She",he:"היא"},{en:"needs",he:"צריכה"},{en:"surgery",he:"ניתוח"},{en:"to",he:"כדי"},{en:"fix",he:"לתקן"},{en:"her",he:"שלו"},{en:"broken",he:"שבורה"},{en:"knee",he:"ברך"}] },
  { term: "Treatment", translation: "טיפול / יחס", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"best",he:"טוב ביותר"},{en:"treatment",he:"טיפול"},{en:"for",he:"עבור"},{en:"a",he:"אחד"},{en:"cold",he:"הצטננות"},{en:"is",he:"הוא"},{en:"rest",he:"מנוחה"},{en:"and",he:"ו"},{en:"liquids",he:"נוזלים"}] }
];

// --- הפונקציה הראשית ---
const seedDays7to9 = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI חסר בקובץ .env");
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 מחובר ל-DB. מתחיל בהזנת ימים 7, 8 ו-9 (ממוקד אמירנט)...');

    // מחיקת נתונים קודמים של ימים 7, 8, 9
    await Day.deleteMany({ dayNumber: { $in: [7, 8, 9] } });

    // מחיקת המילים עצמן למניעת כפילויות
    const allTerms = [
      ...day7Data.map(d => d.term), 
      ...day8Data.map(d => d.term),
      ...day9Data.map(d => d.term)
    ];
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

    // יצירת יום 7
    await createDay(7, "מילות מפתח: היגיון וזמן (אמירנט)", day7Data);
    
    // יצירת יום 8
    await createDay(8, "סביבה, טבע וגיאוגרפיה", day8Data);

    // יצירת יום 9
    await createDay(9, "בריאות, טכנולוגיה וגוף האדם", day9Data);

    console.log('🎉 הושלם בהצלחה! ימים 7, 8 ו-9 נטענו.');
    process.exit(0);

  } catch (err) {
    console.error('❌ שגיאה:', err);
    process.exit(1);
  }
};

// הפעלת הפונקציה
seedDays7to9();