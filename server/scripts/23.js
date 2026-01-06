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
// יום 2: עסקים וקריירה (משפטים ארוכים - 10 מילים ומעלה)
// ============================================================================
const day2Data = [
  // 1-10
  { term: "Efficient", translation: "יעיל", level: "advanced", sentenceParts: [{en:"To",he:"כדי"},{en:"be",he:"להיות"},{en:"truly",he:"באמת"},{en:"efficient",he:"יעיל"},{en:"you",he:"אתה"},{en:"must",he:"חייב"},{en:"prioritize",he:"לתעדף"},{en:"your",he:"את ה"},{en:"tasks",he:"משימות"},{en:"every",he:"כל"},{en:"single",he:"בודד"},{en:"day",he:"יום"}] },
  { term: "Salary", translation: "משכורת", level: "intermediate", sentenceParts: [{en:"She",he:"היא"},{en:"negotiated",he:"ניהלה מו\"מ"},{en:"a",he:"על"},{en:"higher",he:"גבוהה יותר"},{en:"salary",he:"משכורת"},{en:"because",he:"בגלל"},{en:"she",he:"ש"},{en:"has",he:"יש לה"},{en:"more",he:"יותר"},{en:"experience",he:"ניסיון"},{en:"than",he:"מאשר"},{en:"others",he:"אחרים"}] },
  { term: "Manage", translation: "לנהל / להסתדר", level: "intermediate", sentenceParts: [{en:"It",he:"זה"},{en:"can",he:"יכול"},{en:"be",he:"להיות"},{en:"difficult",he:"קשה"},{en:"to",he:"ל"},{en:"manage",he:"לנהל"},{en:"a",he:"אחד"},{en:"large",he:"גדול"},{en:"team",he:"צוות"},{en:"from",he:"מ"},{en:"remote",he:"מרוחקים"},{en:"locations",he:"מיקומים"}] },
  { term: "Career", translation: "קריירה", level: "intermediate", sentenceParts: [{en:"Building",he:"בניית"},{en:"a",he:"אחת"},{en:"successful",he:"מוצלחת"},{en:"career",he:"קריירה"},{en:"requires",he:"דורשת"},{en:"a",he:"ה"},{en:"lot",he:"הרבה"},{en:"of",he:"של"},{en:"hard",he:"קשה"},{en:"work",he:"עבודה"},{en:"and",he:"ו"},{en:"dedication",he:"מסירות"}] },
  { term: "Deadline", translation: "מועד אחרון / דד-ליין", level: "advanced", sentenceParts: [{en:"We",he:"אנחנו"},{en:"have",he:"חייבים"},{en:"to",he:"ל"},{en:"work",he:"לעבוד"},{en:"overtime",he:"שעות נוספות"},{en:"because",he:"כי"},{en:"the",he:"ה"},{en:"deadline",he:"דד-ליין"},{en:"is",he:"הוא"},{en:"approaching",he:"מתקרב"},{en:"very",he:"מאוד"},{en:"fast",he:"מהר"}] },
  { term: "Negotiate", translation: "לשאת ולתת (מו\"מ)", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"two",he:"שתי"},{en:"companies",he:"חברות"},{en:"will",he:"יעשו"},{en:"negotiate",he:"ישאו ויתנו"},{en:"the",he:"על ה"},{en:"terms",he:"תנאים"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"agreement",he:"הסכם"},{en:"tomorrow",he:"מחר"}] },
  { term: "Consumer", translation: "צרכן", level: "academic", sentenceParts: [{en:"Every",he:"כל"},{en:"consumer",he:"צרכן"},{en:"should",he:"צריך"},{en:"know",he:"לדעת"},{en:"their",he:"את ה"},{en:"rights",he:"זכויות"},{en:"before",he:"לפני"},{en:"making",he:"ביצוע"},{en:"a",he:"אחת"},{en:"large",he:"גדולה"},{en:"purchase",he:"רכישה"}] },
  { term: "Profit", translation: "רווח", level: "advanced", sentenceParts: [{en:"The",he:"ה"},{en:"company",he:"חברה"},{en:"generated",he:"ייצרה"},{en:"a",he:"אחד"},{en:"huge",he:"ענק"},{en:"profit",he:"רווח"},{en:"after",he:"אחרי"},{en:"launching",he:"השקת"},{en:"its",he:"שלה"},{en:"new",he:"חדש"},{en:"product",he:"מוצר"}] },
  { term: "Investment", translation: "השקעה", level: "academic", sentenceParts: [{en:"Buying",he:"קניית"},{en:"real",he:"נדל\"ן"},{en:"estate",he:"(נכס)"},{en:"is",he:"היא"},{en:"often",he:"לרוב"},{en:"considered",he:"נחשבת"},{en:"a",he:"אחת"},{en:"very",he:"מאוד"},{en:"safe",he:"בטוחה"},{en:"long-term",he:"לטווח ארוך"},{en:"investment",he:"השקעה"}] },
  { term: "Debt", translation: "חוב", level: "advanced", sentenceParts: [{en:"It",he:"זה"},{en:"took",he:"לקח"},{en:"him",he:"לו"},{en:"several",he:"מספר"},{en:"years",he:"שנים"},{en:"to",he:"כדי"},{en:"pay",he:"לשלם"},{en:"off",he:"את"},{en:"his",he:"שלו"},{en:"student",he:"סטודנט"},{en:"loan",he:"הלוואת"},{en:"debt",he:"חוב"}] },

  // 11-20
  { term: "Executive", translation: "מנהל בכיר / ביצועי", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"chief",he:"ראשי"},{en:"executive",he:"מנהל"},{en:"officer",he:"בכיר (מנכ\"ל)"},{en:"made",he:"קיבל"},{en:"an",he:"אחת"},{en:"important",he:"חשובה"},{en:"decision",he:"החלטה"},{en:"regarding",he:"לגבי"},{en:"the",he:"ה"},{en:"budget",he:"תקציב"}] },
  { term: "Proposal", translation: "הצעה", level: "advanced", sentenceParts: [{en:"They",he:"הם"},{en:"submitted",he:"הגישו"},{en:"a",he:"אחת"},{en:"detailed",he:"מפורטת"},{en:"proposal",he:"הצעה"},{en:"hoping",he:"בתקווה"},{en:"to",he:"ל"},{en:"win",he:"לזכות"},{en:"the",he:"ב"},{en:"government",he:"ממשלתי"},{en:"contract",he:"חוזה"}] },
  { term: "Revenue", translation: "הכנסה (של חברה/מדינה)", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"company's",he:"של החברה"},{en:"annual",he:"שנתית"},{en:"revenue",he:"הכנסה"},{en:"has",he:"הייתה"},{en:"increased",he:"גדלה"},{en:"significantly",he:"משמעותית"},{en:"compared",he:"בהשוואה"},{en:"to",he:"ל"},{en:"last",he:"שעברה"},{en:"year",he:"שנה"}] },
  { term: "Strategy", translation: "אסטרטגיה", level: "academic", sentenceParts: [{en:"We",he:"אנחנו"},{en:"developed",he:"פיתחנו"},{en:"a",he:"אחת"},{en:"new",he:"חדשה"},{en:"marketing",he:"שיווק"},{en:"strategy",he:"אסטרטגיה"},{en:"to",he:"כדי"},{en:"attract",he:"למשוך"},{en:"younger",he:"צעירים יותר"},{en:"customers",he:"לקוחות"}] },
  { term: "Supply", translation: "אספקה / היצע", level: "advanced", sentenceParts: [{en:"The",he:"ה"},{en:"global",he:"עולמית"},{en:"supply",he:"אספקה"},{en:"chain",he:"שרשרת"},{en:"was",he:"הייתה"},{en:"disrupted",he:"משובשת"},{en:"due",he:"עקב"},{en:"to",he:"ל"},{en:"the",he:"ה"},{en:"recent",he:"אחרונה"},{en:"crisis",he:"משבר"}] },
  { term: "Target", translation: "מטרה / יעד", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"sales",he:"מכירות"},{en:"team",he:"צוות"},{en:"missed",he:"פספס"},{en:"its",he:"שלו"},{en:"monthly",he:"חודשי"},{en:"target",he:"יעד"},{en:"by",he:"ב"},{en:"a",he:"אחד"},{en:"small",he:"קטן"},{en:"margin",he:"פער"}] },
  { term: "Transaction", translation: "עסקה / העברה", level: "academic", sentenceParts: [{en:"Please",he:"אנא"},{en:"wait",he:"המתן"},{en:"while",he:"בזמן ש"},{en:"we",he:"אנחנו"},{en:"process",he:"מעבדים"},{en:"your",he:"שלך"},{en:"credit",he:"אשראי"},{en:"card",he:"כרטיס"},{en:"transaction",he:"עסקה"}] },
  { term: "Collapse", translation: "להתמוטט / לקרוס", level: "advanced", sentenceParts: [{en:"Without",he:"ללא"},{en:"proper",he:"מתאים"},{en:"support",he:"תמיכה"},{en:"the",he:"ה"},{en:"entire",he:"שלם"},{en:"business",he:"עסקי"},{en:"model",he:"מודל"},{en:"might",he:"עלול"},{en:"collapse",he:"לקרוס"},{en:"completely",he:"לחלוטין"}] },
  { term: "Commerce", translation: "מסחר", level: "academic", sentenceParts: [{en:"Electronic",he:"אלקטרוני"},{en:"commerce",he:"מסחר"},{en:"has",he:"כבר"},{en:"revolutionized",he:"עשה מהפכה"},{en:"the",he:"ב"},{en:"way",he:"דרך"},{en:"people",he:"אנשים"},{en:"buy",he:"קונים"},{en:"goods",he:"מוצרים"}] },
  { term: "Currency", translation: "מטבע", level: "advanced", sentenceParts: [{en:"You",he:"אתה"},{en:"should",he:"כדאי ש"},{en:"exchange",he:"תמיר"},{en:"your",he:"שלך"},{en:"money",he:"כסף"},{en:"to",he:"ל"},{en:"local",he:"מקומי"},{en:"currency",he:"מטבע"},{en:"upon",he:"עם"},{en:"arrival",he:"הגעה"}] },

  // 21-30
  { term: "Expansion", translation: "התרחבות", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"rapid",he:"מהירה"},{en:"expansion",he:"התרחבות"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"city",he:"עיר"},{en:"created",he:"יצרה"},{en:"many",he:"הרבה"},{en:"new",he:"חדשות"},{en:"job",he:"עבודה"},{en:"opportunities",he:"הזדמנויות"}] },
  { term: "Fund", translation: "קרן / לממן", level: "advanced", sentenceParts: [{en:"The",he:"ה"},{en:"organization",he:"ארגון"},{en:"is",he:"הוא"},{en:"looking",he:"מחפש"},{en:"for",he:"עבור"},{en:"donors",he:"תורמים"},{en:"to",he:"כדי"},{en:"fund",he:"לממן"},{en:"their",he:"שלהם"},{en:"upcoming",he:"קרב ובא"},{en:"research",he:"מחקר"}] },
  { term: "Inflation", translation: "אינפלציה", level: "academic", sentenceParts: [{en:"High",he:"גבוהה"},{en:"inflation",he:"אינפלציה"},{en:"means",he:"אומרת"},{en:"that",he:"ש"},{en:"your",he:"שלך"},{en:"money",he:"כסף"},{en:"buys",he:"קונה"},{en:"less",he:"פחות"},{en:"than",he:"מאשר"},{en:"it",he:"שהוא"},{en:"used",he:"נהג"},{en:"to",he:"ל"}] },
  { term: "Insurance", translation: "ביטוח", level: "intermediate", sentenceParts: [{en:"It",he:"זה"},{en:"is",he:"זה"},{en:"illegal",he:"לא חוקי"},{en:"to",he:"ל"},{en:"drive",he:"לנהוג"},{en:"a",he:"ב"},{en:"car",he:"מכונית"},{en:"without",he:"בלי"},{en:"valid",he:"תקף"},{en:"car",he:"רכב"},{en:"insurance",he:"ביטוח"}] },
  { term: "Launch", translation: "להשיק / לשגר", level: "advanced", sentenceParts: [{en:"The",he:"ה"},{en:"tech",he:"טכנולוגיה"},{en:"giant",he:"ענקית"},{en:"plans",he:"מתכננת"},{en:"to",he:"ל"},{en:"launch",he:"להשיק"},{en:"a",he:"אחת"},{en:"new",he:"חדשה"},{en:"version",he:"גרסה"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"app",he:"אפליקציה"}] },
  { term: "Manufacture", translation: "לייצר", level: "academic", sentenceParts: [{en:"It",he:"זה"},{en:"costs",he:"עולה"},{en:"less",he:"פחות"},{en:"to",he:"ל"},{en:"manufacture",he:"לייצר"},{en:"clothes",he:"בגדים"},{en:"in",he:"ב"},{en:"countries",he:"מדינות"},{en:"with",he:"עם"},{en:"lower",he:"נמוך יותר"},{en:"wages",he:"שכר"}] },
  { term: "Merger", translation: "מיזוג", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"proposed",he:"מוצע"},{en:"merger",he:"מיזוג"},{en:"between",he:"בין"},{en:"the",he:"ה"},{en:"banks",he:"בנקים"},{en:"was",he:"היה"},{en:"approved",he:"מאושר"},{en:"by",he:"על ידי"},{en:"the",he:"ה"},{en:"regulators",he:"רגולטורים"}] },
  { term: "Promotion", translation: "קידום", level: "intermediate", sentenceParts: [{en:"After",he:"אחרי"},{en:"working",he:"עבודה"},{en:"hard",he:"קשה"},{en:"for",he:"במשך"},{en:"two",he:"שנתיים"},{en:"years",he:"שנים"},{en:"he",he:"הוא"},{en:"finally",he:"סוף סוף"},{en:"received",he:"קיבל"},{en:"a",he:"אחד"},{en:"promotion",he:"קידום"}] },
  { term: "Recruit", translation: "לגייס", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"army",he:"צבא"},{en:"tries",he:"מנסה"},{en:"to",he:"ל"},{en:"recruit",he:"לגייס"},{en:"young",he:"צעירים"},{en:"people",he:"אנשים"},{en:"straight",he:"ישר"},{en:"out",he:"מחוץ"},{en:"of",he:"של"},{en:"high",he:"תיכון"},{en:"school",he:"בית ספר"}] },
  { term: "Strike", translation: "שביתה / להכות", level: "advanced", sentenceParts: [{en:"Public",he:"ציבורית"},{en:"transportation",he:"תחבורה"},{en:"stopped",he:"נעצרה"},{en:"because",he:"בגלל"},{en:"the",he:"ה"},{en:"drivers",he:"נהגים"},{en:"decided",he:"החליטו"},{en:"to",he:"ל"},{en:"go",he:"ללכת"},{en:"on",he:"על"},{en:"strike",he:"שביתה"}] }
];

// ============================================================================
// יום 3: מדע ומחקר (משפטים ארוכים - 10 מילים ומעלה)
// ============================================================================
const day3Data = [
  // 1-10
  { term: "Empirical", translation: "אמפירי / נסיוני", level: "academic", sentenceParts: [{en:"Scientific",he:"מדעיות"},{en:"theories",he:"תיאוריות"},{en:"must",he:"חייבות"},{en:"always",he:"תמיד"},{en:"be",he:"להיות"},{en:"supported",he:"נתמכות"},{en:"by",he:"על ידי"},{en:"strong",he:"חזקות"},{en:"empirical",he:"אמפיריות"},{en:"evidence",he:"ראיות"}] },
  { term: "Hypothesis", translation: "השערה / היפותזה", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"researchers",he:"חוקרים"},{en:"formulated",he:"ניסחו"},{en:"a",he:"אחת"},{en:"hypothesis",he:"השערה"},{en:"that",he:"ש"},{en:"linked",he:"קישרה"},{en:"diet",he:"תזונה"},{en:"to",he:"ל"},{en:"heart",he:"לב"},{en:"disease",he:"מחלת"}] },
  { term: "Correlation", translation: "מתאם / קורלציה", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"study",he:"מחקר"},{en:"found",he:"מצא"},{en:"a",he:"אחד"},{en:"strong",he:"חזק"},{en:"positive",he:"חיובי"},{en:"correlation",he:"מתאם"},{en:"between",he:"בין"},{en:"smoking",he:"עישון"},{en:"and",he:"ו"},{en:"lung",he:"ריאות"},{en:"cancer",he:"סרטן"}] },
  { term: "Fluctuate", translation: "להתנודד / לעלות ולרדת", level: "advanced", sentenceParts: [{en:"The",he:"ה"},{en:"stock",he:"מניה"},{en:"market",he:"שוק"},{en:"prices",he:"מחירים"},{en:"tend",he:"נוטים"},{en:"to",he:"ל"},{en:"fluctuate",he:"להתנודד"},{en:"wildly",he:"בפראות"},{en:"during",he:"במהלך"},{en:"times",he:"זמנים"},{en:"of",he:"של"},{en:"crisis",he:"משבר"}] },
  { term: "Anomaly", translation: "חריגה / אנומליה", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"astronomers",he:"אסטרונומים"},{en:"detected",he:"זיהו"},{en:"a",he:"אחת"},{en:"strange",he:"מוזרה"},{en:"anomaly",he:"חריגה"},{en:"in",he:"ב"},{en:"the",he:"ה"},{en:"orbit",he:"מסלול"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"planet",he:"כוכב"}] },
  { term: "Verify", translation: "לאמת", level: "advanced", sentenceParts: [{en:"We",he:"אנחנו"},{en:"need",he:"צריכים"},{en:"to",he:"ל"},{en:"verify",he:"לאמת"},{en:"the",he:"את ה"},{en:"results",he:"תוצאות"},{en:"by",he:"על ידי"},{en:"running",he:"הרצת"},{en:"the",he:"את ה"},{en:"experiment",he:"ניסוי"},{en:"one",he:"אחת"},{en:"more",he:"עוד"},{en:"time",he:"פעם"}] },
  { term: "Simulation", translation: "הדמיה", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"computer",he:"מחשב"},{en:"simulation",he:"סימולציה"},{en:"showed",he:"הראתה"},{en:"what",he:"מה"},{en:"would",he:"היה"},{en:"happen",he:"קורה"},{en:"if",he:"אם"},{en:"the",he:"ה"},{en:"dam",he:"סכר"},{en:"broke",he:"נשבר"}] },
  { term: "Phenomenon", translation: "תופעה", level: "academic", sentenceParts: [{en:"Scientists",he:"מדענים"},{en:"are",he:"הינם"},{en:"trying",he:"מנסים"},{en:"to",he:"ל"},{en:"explain",he:"להסביר"},{en:"this",he:"את ה"},{en:"unusual",he:"יוצאת דופן"},{en:"weather",he:"מזג אוויר"},{en:"phenomenon",he:"תופעה"}] },
  { term: "Innovation", translation: "חדשנות", level: "advanced", sentenceParts: [{en:"Technological",he:"טכנולוגית"},{en:"innovation",he:"חדשנות"},{en:"is",he:"היא"},{en:"the",he:"ה"},{en:"key",he:"מפתח"},{en:"to",he:"ל"},{en:"solving",he:"פתירת"},{en:"many",he:"רבות"},{en:"environmental",he:"סביבתיות"},{en:"problems",he:"בעיות"}] },
  { term: "Accumulate", translation: "לצבור", level: "advanced", sentenceParts: [{en:"Dust",he:"אבק"},{en:"tends",he:"נוטה"},{en:"to",he:"ל"},{en:"accumulate",he:"להצטבר"},{en:"quickly",he:"מהר"},{en:"under",he:"מתחת"},{en:"the",he:"ה"},{en:"furniture",he:"ריהוט"},{en:"if",he:"אם"},{en:"you",he:"אתה"},{en:"don't",he:"לא"},{en:"clean",he:"מנקה"}] },

  // 11-20
  { term: "Component", translation: "רכיב", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"engine",he:"מנוע"},{en:"is",he:"הוא"},{en:"a",he:"אחד"},{en:"critical",he:"קריטי"},{en:"component",he:"רכיב"},{en:"of",he:"של"},{en:"any",he:"כל"},{en:"functioning",he:"מתפקד"},{en:"vehicle",he:"רכב"}] },
  { term: "Feasible", translation: "בר-ביצוע", level: "academic", sentenceParts: [{en:"It",he:"זה"},{en:"is",he:"הוא"},{en:"not",he:"לא"},{en:"economically",he:"כלכלית"},{en:"feasible",he:"בר ביצוע"},{en:"to",he:"ל"},{en:"build",he:"לבנות"},{en:"a",he:"אחד"},{en:"bridge",he:"גשר"},{en:"in",he:"ב"},{en:"that",he:"ההוא"},{en:"location",he:"מיקום"}] },
  { term: "Validity", translation: "תוקף", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"judge",he:"שופט"},{en:"questioned",he:"הטיל ספק ב"},{en:"the",he:"ה"},{en:"validity",he:"תוקף"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"witness's",he:"של העד"},{en:"testimony",he:"עדות"},{en:"in",he:"ב"},{en:"court",he:"בית משפט"}] },
  { term: "Abstract", translation: "מופשט / תקציר", level: "academic", sentenceParts: [{en:"Mathematics",he:"מתמטיקה"},{en:"often",he:"לרוב"},{en:"deals",he:"מתעסקת"},{en:"with",he:"עם"},{en:"abstract",he:"מופשטים"},{en:"concepts",he:"מושגים"},{en:"that",he:"ש"},{en:"are",he:"הם"},{en:"hard",he:"קשים"},{en:"to",he:"ל"},{en:"visualize",he:"לדמיין"}] },
  { term: "Analyze", translation: "לנתח", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"software",he:"תוכנה"},{en:"can",he:"יכולה"},{en:"analyze",he:"לנתח"},{en:"huge",he:"ענקיות"},{en:"amounts",he:"כמויות"},{en:"of",he:"של"},{en:"data",he:"מידע"},{en:"in",he:"ב"},{en:"seconds",he:"שניות"}] },
  { term: "Approximate", translation: "משוער / מקורב", level: "intermediate", sentenceParts: [{en:"Can",he:"יכול"},{en:"you",he:"אתה"},{en:"give",he:"לתת"},{en:"me",he:"לי"},{en:"the",he:"את ה"},{en:"approximate",he:"משוער"},{en:"time",he:"זמן"},{en:"of",he:"של"},{en:"arrival",he:"הגעה"},{en:"for",he:"עבור"},{en:"the",he:"ה"},{en:"train",he:"רכבת"}] },
  { term: "Characteristic", translation: "מאפיין", level: "academic", sentenceParts: [{en:"One",he:"אחד"},{en:"main",he:"עיקרי"},{en:"characteristic",he:"מאפיין"},{en:"of",he:"של"},{en:"gold",he:"זהב"},{en:"is",he:"הוא"},{en:"that",he:"ש"},{en:"it",he:"הוא"},{en:"does",he:"עושה"},{en:"not",he:"לא"},{en:"rust",he:"מחליד"}] },
  { term: "Clarify", translation: "להבהיר", level: "advanced", sentenceParts: [{en:"The",he:"ה"},{en:"teacher",he:"מורה"},{en:"needed",he:"היה צריך"},{en:"to",he:"ל"},{en:"clarify",he:"להבהיר"},{en:"the",he:"את ה"},{en:"instructions",he:"הוראות"},{en:"before",he:"לפני"},{en:"the",he:"ה"},{en:"exam",he:"מבחן"},{en:"started",he:"התחיל"}] },
  { term: "Conclusion", translation: "מסקנה", level: "intermediate", sentenceParts: [{en:"After",he:"אחרי"},{en:"reviewing",he:"סקירת"},{en:"the",he:"ה"},{en:"facts",he:"עובדות"},{en:"we",he:"אנחנו"},{en:"came",he:"הגענו"},{en:"to",he:"ל"},{en:"a",he:"אחת"},{en:"different",he:"שונה"},{en:"conclusion",he:"מסקנה"}] },
  { term: "Conduct", translation: "לערוך (ניסוי) / התנהגות", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"university",he:"אוניברסיטה"},{en:"will",he:"תעשה"},{en:"conduct",he:"תערוך"},{en:"a",he:"אחד"},{en:"study",he:"מחקר"},{en:"on",he:"על"},{en:"sleep",he:"שינה"},{en:"patterns",he:"דפוסי"}] },

  // 21-30
  { term: "Confirm", translation: "לאשר", level: "intermediate", sentenceParts: [{en:"Please",he:"אנא"},{en:"call",he:"התקשר"},{en:"the",he:"ל"},{en:"hotel",he:"מלון"},{en:"to",he:"כדי"},{en:"confirm",he:"לאשר"},{en:"our",he:"שלנו"},{en:"reservation",he:"הזמנה"},{en:"for",he:"עבור"},{en:"next",he:"הבא"},{en:"week",he:"שבוע"}] },
  { term: "Consequence", translation: "תוצאה / השלכה", level: "academic", sentenceParts: [{en:"Losing",he:"איבוד"},{en:"your",he:"שלך"},{en:"job",he:"עבודה"},{en:"can",he:"יכול"},{en:"be",he:"להיות"},{en:"a",he:"אחת"},{en:"serious",he:"רצינית"},{en:"consequence",he:"השלכה"},{en:"of",he:"של"},{en:"poor",he:"גרועים"},{en:"performance",he:"ביצועים"}] },
  { term: "Consider", translation: "לשקול / להחשיב", level: "intermediate", sentenceParts: [{en:"You",he:"אתה"},{en:"should",he:"צריך"},{en:"seriously",he:"ברצינות"},{en:"consider",he:"לשקול"},{en:"the",he:"את ה"},{en:"offer",he:"הצעה"},{en:"before",he:"לפני"},{en:"you",he:"אתה"},{en:"reject",he:"דוחה"},{en:"it",he:"אותה"}] },
  { term: "Contradict", translation: "לסתור", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"witness's",he:"של העד"},{en:"statement",he:"הצהרה"},{en:"seems",he:"נראית"},{en:"to",he:"כ"},{en:"contradict",he:"סותרת"},{en:"the",he:"את ה"},{en:"video",he:"וידאו"},{en:"evidence",he:"ראיות"}] },
  { term: "Crucial", translation: "מכריע / קריטי", level: "advanced", sentenceParts: [{en:"It",he:"זה"},{en:"is",he:"הוא"},{en:"crucial",he:"קריטי"},{en:"to",he:"ל"},{en:"follow",he:"לעקוב אחרי"},{en:"the",he:"ה"},{en:"safety",he:"בטיחות"},{en:"procedures",he:"נהלי"},{en:"in",he:"ב"},{en:"the",he:"ה"},{en:"lab",he:"מעבדה"}] },
  { term: "Demonstrate", translation: "להדגים / להוכיח", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"instructor",he:"מדריך"},{en:"will",he:"יעשה"},{en:"demonstrate",he:"ידגים"},{en:"the",he:"את ה"},{en:"proper",he:"נכונה"},{en:"technique",he:"טכניקה"},{en:"for",he:"עבור"},{en:"lifting",he:"הרמת"},{en:"weights",he:"משקולות"}] },
  { term: "Determine", translation: "לקבוע / להחליט", level: "academic", sentenceParts: [{en:"Doctors",he:"רופאים"},{en:"use",he:"משתמשים"},{en:"blood",he:"דם"},{en:"tests",he:"בדיקות"},{en:"to",he:"כדי"},{en:"determine",he:"לקבוע"},{en:"the",he:"את ה"},{en:"cause",he:"סיבה"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"illness",he:"מחלה"}] },
  { term: "Device", translation: "מכשיר / התקן", level: "intermediate", sentenceParts: [{en:"This",he:"זה"},{en:"electronic",he:"אלקטרוני"},{en:"device",he:"מכשיר"},{en:"is",he:"הוא"},{en:"used",he:"משומש"},{en:"to",he:"כדי"},{en:"measure",he:"למדוד"},{en:"radiation",he:"קרינה"},{en:"levels",he:"רמות"}] },
  { term: "Dimension", translation: "מימד", level: "academic", sentenceParts: [{en:"Adding",he:"הוספת"},{en:"sound",he:"סאונד"},{en:"adds",he:"מוסיפה"},{en:"a",he:"אחד"},{en:"new",he:"חדש"},{en:"dimension",he:"מימד"},{en:"to",he:"ל"},{en:"the",he:"ה"},{en:"virtual",he:"וירטואלית"},{en:"reality",he:"מציאות"},{en:"experience",he:"חוויה"}] },
  { term: "Logical", translation: "הגיוני / לוגי", level: "intermediate", sentenceParts: [{en:"There",he:"אין"},{en:"is",he:"יש"},{en:"no",he:"שום"},{en:"logical",he:"הגיוני"},{en:"explanation",he:"הסבר"},{en:"for",he:"עבור"},{en:"why",he:"למה"},{en:"the",he:"ה"},{en:"system",he:"מערכת"},{en:"crashed",he:"קרסה"},{en:"yesterday",he:"אתמול"}] }
];

// --- הפונקציה הראשית ---
const seedDays2and3 = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI חסר בקובץ .env");
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 מחובר ל-DB. מתחיל בהזנת ימים 2 ו-3 עם משפטים ארוכים...');

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

    console.log('🎉 הושלם בהצלחה! ימים 2 ו-3 נטענו עם משפטים ארוכים.');
    process.exit(0);

  } catch (err) {
    console.error('❌ שגיאה:', err);
    process.exit(1);
  }
};

// הפעלת הפונקציה
seedDays2and3();