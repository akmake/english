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
// יום 4: פסיכולוגיה וחברה (30 מילים - משפטים ארוכים)
// ============================================================================
const day4Data = [
  // אקדמי / גבוה (1-15)
  { term: "Cognition", translation: "קוגניציה / הכרה", level: "academic", sentenceParts: [{en:"Human",he:"אנושית"},{en:"cognition",he:"קוגניציה"},{en:"involves",he:"מערבת"},{en:"complex",he:"מורכבים"},{en:"mental",he:"מנטליים"},{en:"processes",he:"תהליכים"},{en:"such",he:"כמו"},{en:"as",he:"למשל"},{en:"memory",he:"זיכרון"},{en:"and",he:"ו"},{en:"attention",he:"קשב"}] },
  { term: "Perception", translation: "תפיסה", level: "academic", sentenceParts: [{en:"Our",he:"שלנו"},{en:"perception",he:"תפיסה"},{en:"of",he:"של"},{en:"reality",he:"מציאות"},{en:"is",he:"היא"},{en:"often",he:"לרוב"},{en:"influenced",he:"מושפעת"},{en:"by",he:"על ידי"},{en:"our",he:"שלנו"},{en:"past",he:"עבר"},{en:"experiences",he:"חוויות"}] },
  { term: "Conscious", translation: "מודע", level: "advanced", sentenceParts: [{en:"He",he:"הוא"},{en:"made",he:"עשה"},{en:"a",he:"אחד"},{en:"conscious",he:"מודע"},{en:"effort",he:"מאמץ"},{en:"to",he:"כדי"},{en:"change",he:"לשנות"},{en:"his",he:"שלו"},{en:"bad",he:"רעים"},{en:"habits",he:"הרגלים"},{en:"this",he:"הזה"},{en:"year",he:"שנה"}] },
  { term: "Subconscious", translation: "תת-מודע", level: "academic", sentenceParts: [{en:"Many",he:"רבים"},{en:"of",he:"מ"},{en:"our",he:"שלנו"},{en:"fears",he:"פחדים"},{en:"are",he:"הם"},{en:"hidden",he:"חבויים"},{en:"deep",he:"עמוק"},{en:"within",he:"בתוך"},{en:"the",he:"ה"},{en:"subconscious",he:"תת-מודע"},{en:"mind",he:"תודעה/מוח"}] },
  { term: "Stimulus", translation: "גירוי", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"rat",he:"חולדה"},{en:"responded",he:"הגיבה"},{en:"immediately",he:"מיידית"},{en:"to",he:"ל"},{en:"the",he:"ה"},{en:"visual",he:"ויזואלי"},{en:"stimulus",he:"גירוי"},{en:"in",he:"ב"},{en:"the",he:"ה"},{en:"lab",he:"מעבדה"}] },
  { term: "Hierarchy", translation: "היררכיה / מדרג", level: "academic", sentenceParts: [{en:"There",he:"יש"},{en:"is",he:"היא"},{en:"a",he:"אחת"},{en:"clear",he:"ברורה"},{en:"hierarchy",he:"היררכיה"},{en:"of",he:"של"},{en:"needs",he:"צרכים"},{en:"that",he:"ש"},{en:"motivates",he:"מניעה"},{en:"human",he:"אנושית"},{en:"behavior",he:"התנהגות"}] },
  { term: "Integration", translation: "שילוב / אינטגרציה", level: "academic", sentenceParts: [{en:"Successful",he:"מוצלח"},{en:"social",he:"חברתי"},{en:"integration",he:"שילוב"},{en:"is",he:"הוא"},{en:"important",he:"חשוב"},{en:"for",he:"עבור"},{en:"immigrants",he:"מהגרים"},{en:"in",he:"ב"},{en:"a",he:"אחת"},{en:"new",he:"חדשה"},{en:"country",he:"מדינה"}] },
  { term: "Intervention", translation: "התערבות", level: "advanced", sentenceParts: [{en:"Early",he:"מוקדמת"},{en:"medical",he:"רפואית"},{en:"intervention",he:"התערבות"},{en:"can",he:"יכולה"},{en:"save",he:"להציל"},{en:"lives",he:"חיים"},{en:"in",he:"ב"},{en:"cases",he:"מקרים"},{en:"of",he:"של"},{en:"severe",he:"חמורה"},{en:"disease",he:"מחלה"}] },
  { term: "Norm", translation: "נורמה", level: "academic", sentenceParts: [{en:"It",he:"זה"},{en:"is",he:"הוא"},{en:"considered",he:"נחשב"},{en:"a",he:"אחת"},{en:"social",he:"חברתית"},{en:"norm",he:"נורמה"},{en:"to",he:"ל"},{en:"shake",he:"ללחוץ"},{en:"hands",he:"ידיים"},{en:"when",he:"כש"},{en:"meeting",he:"פוגשים"},{en:"someone",he:"מישהו"}] },
  { term: "Trauma", translation: "טראומה", level: "advanced", sentenceParts: [{en:"It",he:"זה"},{en:"takes",he:"לוקח"},{en:"time",he:"זמן"},{en:"to",he:"כדי"},{en:"recover",he:"להחלים"},{en:"from",he:"מ"},{en:"a",he:"אחת"},{en:"severe",he:"חמורה"},{en:"psychological",he:"פסיכולוגית"},{en:"trauma",he:"טראומה"}] },
  { term: "Bias", translation: "הטיה / דעה קדומה", level: "academic", sentenceParts: [{en:"We",he:"אנחנו"},{en:"must",he:"חייבים"},{en:"be",he:"להיות"},{en:"aware",he:"מודעים"},{en:"of",he:"ל"},{en:"our",he:"שלנו"},{en:"own",he:"עצמיות"},{en:"biases",he:"הטיות"},{en:"when",he:"כש"},{en:"judging",he:"שופטים"},{en:"others",he:"אחרים"}] },
  { term: "Diversity", translation: "גיוון", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"university",he:"אוניברסיטה"},{en:"promotes",he:"מקבלת"},{en:"cultural",he:"תרבותי"},{en:"diversity",he:"גיוון"},{en:"among",he:"בקרב"},{en:"its",he:"שלה"},{en:"students",he:"סטודנטים"},{en:"and",he:"ו"},{en:"staff",he:"צוות"}] },
  { term: "Ethics", translation: "אתיקה / מוסר", level: "academic", sentenceParts: [{en:"Medical",he:"רפואית"},{en:"ethics",he:"אתיקה"},{en:"prevents",he:"מונעת"},{en:"doctors",he:"רופאים"},{en:"from",he:"מ"},{en:"harming",he:"לפגוע"},{en:"their",he:"שלהם"},{en:"patients",he:"מטופלים"},{en:"intentionally",he:"בכוונה"}] },
  { term: "Incentive", translation: "תמריץ", level: "advanced", sentenceParts: [{en:"Money",he:"כסף"},{en:"is",he:"הוא"},{en:"not",he:"לא"},{en:"always",he:"תמיד"},{en:"the",he:"ה"},{en:"best",he:"טוב ביותר"},{en:"incentive",he:"תמריץ"},{en:"for",he:"עבור"},{en:"hard",he:"קשה"},{en:"work",he:"עבודה"}] },
  { term: "Rationale", translation: "רציונל / נימוק", level: "academic", sentenceParts: [{en:"Can",he:"האם"},{en:"you",he:"אתה"},{en:"explain",he:"להסביר"},{en:"the",he:"את ה"},{en:"rationale",he:"רציונל"},{en:"behind",he:"מאחורי"},{en:"your",he:"שלך"},{en:"strange",he:"מוזרה"},{en:"decision",he:"החלטה"}] },
  
  // רגיל / בינוני (16-30)
  { term: "Behavior", translation: "התנהגות", level: "intermediate", sentenceParts: [{en:"His",he:"שלו"},{en:"behavior",he:"התנהגות"},{en:"in",he:"ב"},{en:"class",he:"כיתה"},{en:"has",he:"היא"},{en:"improved",he:"השתפרה"},{en:"a",he:"ה"},{en:"lot",he:"הרבה"},{en:"since",he:"מאז"},{en:"last",he:"שעבר"},{en:"month",he:"חודש"}] },
  { term: "Attitude", translation: "גישה", level: "intermediate", sentenceParts: [{en:"Having",he:"שיש"},{en:"a",he:"אחת"},{en:"positive",he:"חיובית"},{en:"attitude",he:"גישה"},{en:"can",he:"יכולה"},{en:"help",he:"לעזור"},{en:"you",he:"לך"},{en:"succeed",he:"להצליח"},{en:"in",he:"ב"},{en:"life",he:"חיים"}] },
  { term: "Conflict", translation: "סכסוך / קונפליקט", level: "intermediate", sentenceParts: [{en:"They",he:"הם"},{en:"tried",he:"ניסו"},{en:"to",he:"ל"},{en:"resolve",he:"לפתור"},{en:"the",he:"את ה"},{en:"conflict",he:"סכסוך"},{en:"without",he:"מבלי"},{en:"using",he:"להשתמש"},{en:"any",he:"שום"},{en:"violence",he:"אלימות"}] },
  { term: "Emotion", translation: "רגש", level: "intermediate", sentenceParts: [{en:"Fear",he:"פחד"},{en:"is",he:"הוא"},{en:"a",he:"אחד"},{en:"very",he:"מאוד"},{en:"powerful",he:"חזק"},{en:"human",he:"אנושי"},{en:"emotion",he:"רגש"},{en:"that",he:"ש"},{en:"protects",he:"מגן"},{en:"us",he:"עלינו"}] },
  { term: "Identity", translation: "זהות", level: "intermediate", sentenceParts: [{en:"Teenagers",he:"בני נוער"},{en:"often",he:"לרוב"},{en:"struggle",he:"נאבקים"},{en:"to",he:"כדי"},{en:"find",he:"למצוא"},{en:"their",he:"שלהם"},{en:"true",he:"אמיתית"},{en:"identity",he:"זהות"},{en:"in",he:"ב"},{en:"high",he:"תיכון"},{en:"school",he:"בית ספר"}] },
  { term: "Mental", translation: "נפשי / מנטלי", level: "intermediate", sentenceParts: [{en:"Physical",he:"פיזי"},{en:"exercise",he:"אימון"},{en:"is",he:"הוא"},{en:"also",he:"גם"},{en:"good",he:"טוב"},{en:"for",he:"עבור"},{en:"your",he:"שלך"},{en:"mental",he:"נפשית"},{en:"health",he:"בריאות"}] },
  { term: "Personality", translation: "אישיות", level: "intermediate", sentenceParts: [{en:"She",he:"היא"},{en:"has",he:"יש לה"},{en:"a",he:"אחת"},{en:"very",he:"מאוד"},{en:"outgoing",he:"מוחצנת"},{en:"and",he:"ו"},{en:"friendly",he:"חברותית"},{en:"personality",he:"אישיות"}] },
  { term: "Reaction", translation: "תגובה", level: "intermediate", sentenceParts: [{en:"His",he:"שלו"},{en:"reaction",he:"תגובה"},{en:"to",he:"ל"},{en:"the",he:"ה"},{en:"bad",he:"רעות"},{en:"news",he:"חדשות"},{en:"was",he:"הייתה"},{en:"surprisingly",he:"באופן מפתיע"},{en:"calm",he:"רגועה"}] },
  { term: "Relationship", translation: "מערכת יחסים", level: "intermediate", sentenceParts: [{en:"Building",he:"בניית"},{en:"a",he:"אחת"},{en:"strong",he:"חזקה"},{en:"relationship",he:"מערכת יחסים"},{en:"takes",he:"לוקחת"},{en:"years",he:"שנים"},{en:"of",he:"של"},{en:"trust",he:"אמון"}] },
  { term: "Social", translation: "חברתי", level: "intermediate", sentenceParts: [{en:"Humans",he:"בני אדם"},{en:"are",he:"הם"},{en:"social",he:"חברתיים"},{en:"creatures",he:"יצורים"},{en:"who",he:"ש"},{en:"need",he:"צריכים"},{en:"to",he:"ל"},{en:"live",he:"לחיות"},{en:"in",he:"ב"},{en:"groups",he:"קבוצות"}] },
  { term: "Stress", translation: "לחץ / מתח", level: "intermediate", sentenceParts: [{en:"Too",he:"יותר מדי"},{en:"much",he:"הרבה"},{en:"stress",he:"לחץ"},{en:"at",he:"ב"},{en:"work",he:"עבודה"},{en:"can",he:"יכול"},{en:"cause",he:"לגרום"},{en:"serious",he:"רציניות"},{en:"health",he:"בריאותיות"},{en:"problems",he:"בעיות"}] },
  { term: "Support", translation: "תמיכה / לתמוך", level: "intermediate", sentenceParts: [{en:"My",he:"שלי"},{en:"family",he:"משפחה"},{en:"always",he:"תמיד"},{en:"gives",he:"נותנת"},{en:"me",he:"לי"},{en:"great",he:"נהדרת"},{en:"emotional",he:"רגשית"},{en:"support",he:"תמיכה"}] },
  { term: "Thought", translation: "מחשבה", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"mere",he:"עצם ה"},{en:"thought",he:"מחשבה"},{en:"of",he:"על"},{en:"flying",he:"טיסה"},{en:"makes",he:"עושה"},{en:"him",he:"אותו"},{en:"feel",he:"להרגיש"},{en:"nervous",he:"עצבני"}] },
  { term: "Tradition", translation: "מסורת", level: "intermediate", sentenceParts: [{en:"It",he:"זה"},{en:"is",he:"היא"},{en:"a",he:"אחת"},{en:"long",he:"ארוכה"},{en:"family",he:"משפחתית"},{en:"tradition",he:"מסורת"},{en:"to",he:"ל"},{en:"meet",he:"להיפגש"},{en:"every",he:"כל"},{en:"Friday",he:"שישי"}] },
  { term: "Value", translation: "ערך / להעריך", level: "intermediate", sentenceParts: [{en:"We",he:"אנחנו"},{en:"should",he:"צריכים"},{en:"value",he:"להעריך"},{en:"honesty",he:"כנות"},{en:"more",he:"יותר"},{en:"than",he:"מאשר"},{en:"money",he:"כסף"},{en:"or",he:"או"},{en:"fame",he:"פרסום"}] }
];

// ============================================================================
// יום 5: חוק, ממשל ופוליטיקה (30 מילים - משפטים ארוכים)
// ============================================================================
const day5Data = [
  // אקדמי / גבוה (1-15)
  { term: "Legislation", translation: "חקיקה", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"government",he:"ממשלה"},{en:"passed",he:"העבירה"},{en:"new",he:"חדשה"},{en:"legislation",he:"חקיקה"},{en:"to",he:"כדי"},{en:"protect",he:"להגן"},{en:"the",he:"על ה"},{en:"environment",he:"סביבה"}] },
  { term: "Constitution", translation: "חוקה", level: "academic", sentenceParts: [{en:"Every",he:"כל"},{en:"law",he:"חוק"},{en:"must",he:"חייב"},{en:"comply",he:"לציית"},{en:"with",he:"ל"},{en:"the",he:"ה"},{en:"principles",he:"עקרונות"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"constitution",he:"חוקה"}] },
  { term: "Sovereign", translation: "ריבון / ריבוני", level: "academic", sentenceParts: [{en:"Every",he:"כל"},{en:"sovereign",he:"ריבונית"},{en:"state",he:"מדינה"},{en:"has",he:"יש לה"},{en:"the",he:"ה"},{en:"right",he:"זכות"},{en:"to",he:"ל"},{en:"defend",he:"להגן"},{en:"its",he:"שלה"},{en:"borders",he:"גבולות"}] },
  { term: "Amendment", translation: "תיקון (לחוק)", level: "advanced", sentenceParts: [{en:"They",he:"הם"},{en:"proposed",he:"הציעו"},{en:"an",he:"אחד"},{en:"amendment",he:"תיקון"},{en:"to",he:"ל"},{en:"the",he:"ה"},{en:"contract",he:"חוזה"},{en:"before",he:"לפני"},{en:"signing",he:"חתימה"},{en:"it",he:"עליו"}] },
  { term: "Verdict", translation: "פסק דין / גזר דין", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"jury",he:"חבר המושבעים"},{en:"delivered",he:"מסר"},{en:"a",he:"אחד"},{en:"guilty",he:"אשם"},{en:"verdict",he:"פסק דין"},{en:"after",he:"אחרי"},{en:"two",he:"שעתיים"},{en:"hours",he:"שעות"}] },
  { term: "Liability", translation: "חבות / אחריות משפטית", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"company",he:"חברה"},{en:"denied",he:"הכחישה"},{en:"any",he:"כל"},{en:"liability",he:"אחריות משפטית"},{en:"for",he:"עבור"},{en:"the",he:"ה"},{en:"accident",he:"תאונה"},{en:"that",he:"ש"},{en:"occurred",he:"קרתה"}] },
  { term: "Regime", translation: "משטר", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"old",he:"ישן"},{en:"regime",he:"משטר"},{en:"was",he:"היה"},{en:"overthrown",he:"הופל"},{en:"by",he:"על ידי"},{en:"a",he:"אחת"},{en:"popular",he:"פופולרית"},{en:"revolution",he:"מהפכה"}] },
  { term: "Diplomat", translation: "דיפלומט", level: "academic", sentenceParts: [{en:"A",he:"אחד"},{en:"good",he:"טוב"},{en:"diplomat",he:"דיפלומט"},{en:"knows",he:"יודע"},{en:"how",he:"איך"},{en:"to",he:"ל"},{en:"solve",he:"לפתור"},{en:"problems",he:"בעיות"},{en:"without",he:"בלי"},{en:"fighting",he:"לחימה"}] },
  { term: "Autonomy", translation: "אוטונומיה / עצמאות", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"region",he:"אזור"},{en:"was",he:"היה"},{en:"granted",he:"מוענק"},{en:"full",he:"מלאה"},{en:"autonomy",he:"אוטונומיה"},{en:"over",he:"על"},{en:"its",he:"שלו"},{en:"internal",he:"פנימיים"},{en:"affairs",he:"עניינים"}] },
  { term: "Bureaucracy", translation: "ביורוקרטיה", level: "advanced", sentenceParts: [{en:"Too",he:"יותר מדי"},{en:"much",he:"הרבה"},{en:"bureaucracy",he:"ביורוקרטיה"},{en:"can",he:"יכולה"},{en:"slow",he:"להאט"},{en:"down",he:"למטה (את)"},{en:"the",he:"ה"},{en:"entire",he:"שלם"},{en:"process",he:"תהליך"}] },
  { term: "Coalition", translation: "קואליציה", level: "academic", sentenceParts: [{en:"Several",he:"מספר"},{en:"parties",he:"מפלגות"},{en:"formed",he:"יצרו"},{en:"a",he:"אחת"},{en:"coalition",he:"קואליציה"},{en:"to",he:"כדי"},{en:"run",he:"לנהל"},{en:"the",he:"את ה"},{en:"government",he:"ממשלה"}] },
  { term: "Delegate", translation: "להאציל (סמכות) / נציג", level: "advanced", sentenceParts: [{en:"A",he:"אחד"},{en:"manager",he:"מנהל"},{en:"must",he:"חייב"},{en:"learn",he:"ללמוד"},{en:"how",he:"איך"},{en:"to",he:"ל"},{en:"delegate",he:"להאציל"},{en:"tasks",he:"משימות"},{en:"to",he:"ל"},{en:"employees",he:"עובדים"}] },
  { term: "Petition", translation: "עצומה / עתירה", level: "advanced", sentenceParts: [{en:"Thousands",he:"אלפים"},{en:"of",he:"של"},{en:"people",he:"אנשים"},{en:"signed",he:"חתמו"},{en:"the",he:"על ה"},{en:"petition",he:"עצומה"},{en:"against",he:"נגד"},{en:"the",he:"ה"},{en:"new",he:"חדש"},{en:"law",he:"חוק"}] },
  { term: "Protocol", translation: "פרוטוקול / נוהל", level: "academic", sentenceParts: [{en:"You",he:"אתה"},{en:"must",he:"חייב"},{en:"follow",he:"לעקוב אחרי"},{en:"the",he:"ה"},{en:"safety",he:"בטיחות"},{en:"protocol",he:"פרוטוקול"},{en:"at",he:"ב"},{en:"all",he:"כל"},{en:"times",he:"זמנים"}] },
  { term: "Sanction", translation: "סנקציה / עונש", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"country",he:"מדינה"},{en:"faced",he:"התמודדה"},{en:"severe",he:"חמורות"},{en:"economic",he:"כלכליות"},{en:"sanctions",he:"סנקציות"},{en:"from",he:"מ"},{en:"the",he:"ה"},{en:"world",he:"עולם"}] },
  
  // רגיל / בינוני (16-30)
  { term: "Candidate", translation: "מועמד", level: "intermediate", sentenceParts: [{en:"He",he:"הוא"},{en:"is",he:"הוא"},{en:"the",he:"ה"},{en:"best",he:"טוב ביותר"},{en:"candidate",he:"מועמד"},{en:"for",he:"עבור"},{en:"the",he:"ה"},{en:"job",he:"עבודה"},{en:"right",he:"כרגע"},{en:"now",he:"עכשיו"}] },
  { term: "Election", translation: "בחירות", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"next",he:"הבאות"},{en:"general",he:"כלליות"},{en:"election",he:"בחירות"},{en:"will",he:"יעשו"},{en:"be",he:"להיות (יערכו)"},{en:"held",he:"מוחזקות"},{en:"in",he:"ב"},{en:"November",he:"נובמבר"}] },
  { term: "Illegal", translation: "לא חוקי", level: "intermediate", sentenceParts: [{en:"It",he:"זה"},{en:"is",he:"הוא"},{en:"illegal",he:"לא חוקי"},{en:"to",he:"ל"},{en:"park",he:"לחנות"},{en:"your",he:"שלך"},{en:"car",he:"רכב"},{en:"in",he:"ב"},{en:"front",he:"מול"},{en:"of",he:"של"},{en:"that",he:"ההוא"},{en:"gate",he:"שער"}] },
  { term: "Justice", translation: "צדק", level: "intermediate", sentenceParts: [{en:"They",he:"הם"},{en:"are",he:"הינם"},{en:"fighting",he:"נלחמים"},{en:"for",he:"עבור"},{en:"justice",he:"צדק"},{en:"and",he:"ו"},{en:"equality",he:"שוויון"},{en:"for",he:"עבור"},{en:"all",he:"כל"},{en:"citizens",he:"אזרחים"}] },
  { term: "Lawyer", translation: "עורך דין", level: "intermediate", sentenceParts: [{en:"You",he:"אתה"},{en:"should",he:"צריך"},{en:"consult",he:"להתייעץ"},{en:"with",he:"עם"},{en:"a",he:"אחד"},{en:"lawyer",he:"עורך דין"},{en:"before",he:"לפני"},{en:"signing",he:"חתימת"},{en:"anything",he:"משהו"}] },
  { term: "Official", translation: "רשמי / פקיד", level: "intermediate", sentenceParts: [{en:"We",he:"אנחנו"},{en:"received",he:"קיבלנו"},{en:"an",he:"אחד"},{en:"official",he:"רשמי"},{en:"letter",he:"מכתב"},{en:"from",he:"מ"},{en:"the",he:"ה"},{en:"city",he:"עירייה"},{en:"council",he:"מועצת"}] },
  { term: "Policy", translation: "מדיניות", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"company",he:"חברה"},{en:"has",he:"יש לה"},{en:"a",he:"אחת"},{en:"strict",he:"קפדנית"},{en:"policy",he:"מדיניות"},{en:"against",he:"נגד"},{en:"smoking",he:"עישון"},{en:"inside",he:"בתוך"},{en:"the",he:"ה"},{en:"building",he:"בניין"}] },
  { term: "Politics", translation: "פוליטיקה", level: "intermediate", sentenceParts: [{en:"She",he:"היא"},{en:"is",he:"הינה"},{en:"very",he:"מאוד"},{en:"interested",he:"מתעניינת"},{en:"in",he:"ב"},{en:"politics",he:"פוליטיקה"},{en:"and",he:"ו"},{en:"world",he:"עולמיים"},{en:"events",he:"אירועים"}] },
  { term: "Protect", translation: "להגן", level: "intermediate", sentenceParts: [{en:"We",he:"אנחנו"},{en:"must",he:"חייבים"},{en:"do",he:"לעשות"},{en:"more",he:"יותר"},{en:"to",he:"כדי"},{en:"protect",he:"להגן"},{en:"endangered",he:"בסכנת הכחדה"},{en:"animals",he:"חיות"}] },
  { term: "Rights", translation: "זכויות", level: "intermediate", sentenceParts: [{en:"Everyone",he:"כולם"},{en:"should",he:"צריכים"},{en:"respect",he:"לכבד"},{en:"the",he:"את ה"},{en:"human",he:"אדם"},{en:"rights",he:"זכויות"},{en:"of",he:"של"},{en:"others",he:"אחרים"}] },
  { term: "Rule", translation: "כלל / לשלוט", level: "intermediate", sentenceParts: [{en:"You",he:"אתה"},{en:"must",he:"חייב"},{en:"follow",he:"לעקוב אחרי"},{en:"every",he:"כל"},{en:"single",he:"יחיד"},{en:"rule",he:"כלל"},{en:"in",he:"ב"},{en:"this",he:"הזה"},{en:"game",he:"משחק"}] },
  { term: "Safety", translation: "בטיחות", level: "intermediate", sentenceParts: [{en:"Your",he:"שלך"},{en:"safety",he:"בטיחות"},{en:"is",he:"היא"},{en:"our",he:"שלנו"},{en:"top",he:"עליונה"},{en:"priority",he:"עדיפות"},{en:"during",he:"במהלך"},{en:"the",he:"ה"},{en:"flight",he:"טיסה"}] },
  { term: "Vote", translation: "להצביע / קול", level: "intermediate", sentenceParts: [{en:"It",he:"זה"},{en:"is",he:"הוא"},{en:"important",he:"חשוב"},{en:"to",he:"ל"},{en:"go",he:"ללכת"},{en:"and",he:"ו"},{en:"vote",he:"להצביע"},{en:"in",he:"ב"},{en:"the",he:"ה"},{en:"election",he:"בחירות"}] },
  { term: "Witness", translation: "עד (ראייה)", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"police",he:"משטרה"},{en:"are",he:"הם"},{en:"looking",he:"מחפשים"},{en:"for",he:"אחר"},{en:"a",he:"אחד"},{en:"witness",he:"עד"},{en:"to",he:"ל"},{en:"the",he:"ה"},{en:"crime",he:"פשע"}] },
  { term: "Authority", translation: "סמכות / רשות", level: "intermediate", sentenceParts: [{en:"Only",he:"רק"},{en:"the",he:"ה"},{en:"manager",he:"מנהל"},{en:"has",he:"יש לו"},{en:"the",he:"ה"},{en:"authority",he:"סמכות"},{en:"to",he:"ל"},{en:"sign",he:"לחתום"},{en:"checks",he:"צ'קים"}] }
];

// ============================================================================
// יום 6: תרבות, אומנות ומדיה (30 מילים - משפטים ארוכים)
// ============================================================================
const day6Data = [
  // אקדמי / גבוה (1-15)
  { term: "Aesthetic", translation: "אסתטי", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"building",he:"בניין"},{en:"has",he:"יש לו"},{en:"a",he:"אחת"},{en:"very",he:"מאוד"},{en:"unique",he:"ייחודית"},{en:"and",he:"ו"},{en:"pleasing",he:"נעימה"},{en:"aesthetic",he:"אסתטיקה"},{en:"design",he:"עיצוב"}] },
  { term: "Composition", translation: "קומפוזיציה / הרכב", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"composition",he:"קומפוזיציה"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"painting",he:"ציור"},{en:"draws",he:"מושכת"},{en:"the",he:"את ה"},{en:"eye",he:"עין"},{en:"to",he:"ל"},{en:"the",he:"ה"},{en:"center",he:"מרכז"}] },
  { term: "Narrative", translation: "נרטיב / עלילה", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"film",he:"סרט"},{en:"has",he:"יש לו"},{en:"a",he:"אחד"},{en:"complex",he:"מורכב"},{en:"narrative",he:"נרטיב"},{en:"structure",he:"מבנה"},{en:"that",he:"ש"},{en:"confuses",he:"מבלבל"},{en:"viewers",he:"צופים"}] },
  { term: "Metaphor", translation: "מטאפורה", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"poet",he:"משורר"},{en:"used",he:"השתמש"},{en:"a",he:"אחת"},{en:"beautiful",he:"יפה"},{en:"metaphor",he:"מטאפורה"},{en:"to",he:"כדי"},{en:"describe",he:"לתאר"},{en:"the",he:"את ה"},{en:"sunset",he:"שקיעה"}] },
  { term: "Perspective", translation: "פרספקטיבה / נקודת מבט", level: "academic", sentenceParts: [{en:"Try",he:"נסה"},{en:"to",he:"ל"},{en:"look",he:"להסתכל"},{en:"at",he:"על"},{en:"the",he:"ה"},{en:"problem",he:"בעיה"},{en:"from",he:"מ"},{en:"a",he:"אחת"},{en:"different",he:"שונה"},{en:"perspective",he:"פרספקטיבה"}] },
  { term: "Exhibition", translation: "תערוכה", level: "advanced", sentenceParts: [{en:"We",he:"אנחנו"},{en:"visited",he:"ביקרנו"},{en:"a",he:"אחת"},{en:"modern",he:"מודרנית"},{en:"art",he:"אומנות"},{en:"exhibition",he:"תערוכה"},{en:"at",he:"ב"},{en:"the",he:"ה"},{en:"museum",he:"מוזיאון"},{en:"yesterday",he:"אתמול"}] },
  { term: "Contemporary", translation: "עכשווי / בן זמננו", level: "academic", sentenceParts: [{en:"I",he:"אני"},{en:"prefer",he:"מעדיף"},{en:"contemporary",he:"עכשווית"},{en:"music",he:"מוזיקה"},{en:"over",he:"על פני"},{en:"classical",he:"קלאסית"},{en:"music",he:"מוזיקה"},{en:"most",he:"רוב"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"time",he:"זמן"}] },
  { term: "Interpretation", translation: "פרשנות", level: "academic", sentenceParts: [{en:"There",he:"יש"},{en:"are",he:"הן"},{en:"many",he:"הרבה"},{en:"possible",he:"אפשריות"},{en:"interpretations",he:"פרשנויות"},{en:"of",he:"של"},{en:"this",he:"זה"},{en:"famous",he:"מפורסם"},{en:"poem",he:"שיר"}] },
  { term: "Authentic", translation: "אותנטי / מקורי", level: "advanced", sentenceParts: [{en:"This",he:"זוהי"},{en:"is",he:"היא"},{en:"an",he:"אחת"},{en:"authentic",he:"אותנטית"},{en:"Italian",he:"איטלקית"},{en:"pizza",he:"פיצה"},{en:"made",he:"עשויה"},{en:"by",he:"על ידי"},{en:"a",he:"אחד"},{en:"real",he:"אמיתי"},{en:"chef",he:"שף"}] },
  { term: "Genre", translation: "ז'אנר / סוגה", level: "academic", sentenceParts: [{en:"Science",he:"מדע"},{en:"fiction",he:"בדיוני"},{en:"is",he:"הוא"},{en:"my",he:"שלי"},{en:"favorite",he:"מועדף"},{en:"literary",he:"ספרותי"},{en:"genre",he:"ז'אנר"},{en:"to",he:"ל"},{en:"read",he:"לקרוא"}] },
  { term: "Heritage", translation: "מורשת", level: "academic", sentenceParts: [{en:"It",he:"זה"},{en:"is",he:"הוא"},{en:"important",he:"חשוב"},{en:"to",he:"ל"},{en:"preserve",he:"לשמר"},{en:"our",he:"שלנו"},{en:"cultural",he:"תרבותית"},{en:"heritage",he:"מורשת"},{en:"for",he:"עבור"},{en:"future",he:"עתידיים"},{en:"generations",he:"דורות"}] },
  { term: "Review", translation: "ביקורת / סקירה", level: "advanced", sentenceParts: [{en:"The",he:"ה"},{en:"movie",he:"סרט"},{en:"received",he:"קיבל"},{en:"a",he:"אחת"},{en:"bad",he:"רעה"},{en:"review",he:"ביקורת"},{en:"in",he:"ב"},{en:"the",he:"ה"},{en:"newspaper",he:"עיתון"},{en:"this",he:"הזה"},{en:"morning",he:"בוקר"}] },
  { term: "Publication", translation: "פרסום (הוצאה לאור)", level: "academic", sentenceParts: [{en:"The",he:"ה"},{en:"publication",he:"פרסום"},{en:"of",he:"של"},{en:"his",he:"שלו"},{en:"new",he:"חדש"},{en:"book",he:"ספר"},{en:"was",he:"היה"},{en:"delayed",he:"מעוכב"},{en:"by",he:"ב"},{en:"a",he:"אחד"},{en:"month",he:"חודש"}] },
  { term: "Abstract", translation: "מופשט", level: "academic", sentenceParts: [{en:"She",he:"היא"},{en:"paints",he:"מציירת"},{en:"in",he:"ב"},{en:"a",he:"אחד"},{en:"very",he:"מאוד"},{en:"abstract",he:"מופשט"},{en:"style",he:"סגנון"},{en:"that",he:"ש"},{en:"is",he:"הוא"},{en:"hard",he:"קשה"},{en:"to",he:"ל"},{en:"understand",he:"להבין"}] }, // שונה מ-Abstract של יום 3 (תקציר)
  { term: "Inspiration", translation: "השראה", level: "advanced", sentenceParts: [{en:"She",he:"היא"},{en:"gets",he:"מקבלת"},{en:"her",he:"שלה"},{en:"inspiration",he:"השראה"},{en:"from",he:"מ"},{en:"walking",he:"הליכה"},{en:"in",he:"ב"},{en:"nature",he:"טבע"},{en:"every",he:"כל"},{en:"day",he:"יום"}] },
  
  // רגיל / בינוני (16-30)
  { term: "Art", translation: "אומנות", level: "intermediate", sentenceParts: [{en:"Modern",he:"מודרנית"},{en:"art",he:"אומנות"},{en:"can",he:"יכולה"},{en:"sometimes",he:"לפעמים"},{en:"be",he:"להיות"},{en:"difficult",he:"קשה"},{en:"for",he:"עבור"},{en:"people",he:"אנשים"},{en:"to",he:"ל"},{en:"appreciate",he:"להעריך"}] },
  { term: "Author", translation: "סופר / מחבר", level: "intermediate", sentenceParts: [{en:"Who",he:"מי"},{en:"is",he:"הוא"},{en:"your",he:"שלך"},{en:"favorite",he:"מועדף"},{en:"author",he:"סופר"},{en:"of",he:"של"},{en:"children's",he:"ילדים"},{en:"books",he:"ספרי"}] },
  { term: "Media", translation: "מדיה / תקשורת", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"media",he:"מדיה"},{en:"plays",he:"משחקת"},{en:"a",he:"אחד"},{en:"big",he:"גדול"},{en:"role",he:"תפקיד"},{en:"in",he:"ב"},{en:"shaping",he:"עיצוב"},{en:"public",he:"ציבורית"},{en:"opinion",he:"דעה"}] },
  { term: "Music", translation: "מוזיקה", level: "intermediate", sentenceParts: [{en:"Listening",he:"האזנה"},{en:"to",he:"ל"},{en:"music",he:"מוזיקה"},{en:"helps",he:"עוזרת"},{en:"me",he:"לי"},{en:"relax",he:"להירגע"},{en:"after",he:"אחרי"},{en:"a",he:"אחד"},{en:"long",he:"ארוך"},{en:"day",he:"יום"}] },
  { term: "Style", translation: "סגנון", level: "intermediate", sentenceParts: [{en:"She",he:"היא"},{en:"has",he:"יש לה"},{en:"a",he:"אחד"},{en:"very",he:"מאוד"},{en:"distinct",he:"מובחן"},{en:"style",he:"סגנון"},{en:"of",he:"של"},{en:"writing",he:"כתיבה"},{en:"that",he:"ש"},{en:"is",he:"הוא"},{en:"easy",he:"קל"},{en:"to",he:"ל"},{en:"recognize",he:"לזהות"}] },
  { term: "Audience", translation: "קהל", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"audience",he:"קהל"},{en:"clapped",he:"מחא כפיים"},{en:"loudly",he:"בקול רם"},{en:"at",he:"ב"},{en:"the",he:"ה"},{en:"end",he:"סוף"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"concert",he:"הופעה"}] },
  { term: "Classic", translation: "קלאסי", level: "intermediate", sentenceParts: [{en:"This",he:"זהו"},{en:"is",he:"הוא"},{en:"a",he:"אחד"},{en:"classic",he:"קלאסי"},{en:"movie",he:"סרט"},{en:"that",he:"ש"},{en:"everyone",he:"כולם"},{en:"should",he:"צריכים"},{en:"watch",he:"לצפות"},{en:"at",he:"לפחות"},{en:"least",he:"פעם"},{en:"once",he:"אחת"}] },
  { term: "Design", translation: "עיצוב / לעצב", level: "intermediate", sentenceParts: [{en:"They",he:"הם"},{en:"hired",he:"שכרו"},{en:"an",he:"אחד"},{en:"expert",he:"מומחה"},{en:"to",he:"כדי"},{en:"design",he:"לעצב"},{en:"their",he:"שלהם"},{en:"new",he:"חדש"},{en:"website",he:"אתר"}] },
  { term: "Image", translation: "תמונה / תדמית", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"company",he:"חברה"},{en:"is",he:"היא"},{en:"trying",he:"מנסה"},{en:"to",he:"ל"},{en:"improve",he:"לשפר"},{en:"its",he:"שלה"},{en:"public",he:"ציבורית"},{en:"image",he:"תדמית"}] },
  { term: "Museum", translation: "מוזיאון", level: "intermediate", sentenceParts: [{en:"You",he:"אתה"},{en:"can",he:"יכול"},{en:"see",he:"לראות"},{en:"ancient",he:"עתיקים"},{en:"artifacts",he:"חפצים"},{en:"in",he:"ב"},{en:"the",he:"ה"},{en:"history",he:"היסטוריה"},{en:"museum",he:"מוזיאון"}] },
  { term: "Painting", translation: "ציור", level: "intermediate", sentenceParts: [{en:"This",he:"זה"},{en:"painting",he:"ציור"},{en:"is",he:"הוא"},{en:"worth",he:"שווה"},{en:"millions",he:"מיליונים"},{en:"of",he:"של"},{en:"dollars",he:"דולרים"},{en:"today",he:"היום"}] },
  { term: "Perform", translation: "להופיע / לבצע", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"band",he:"להקה"},{en:"will",he:"תעשה"},{en:"perform",he:"תופיע"},{en:"live",he:"בלייב"},{en:"on",he:"על"},{en:"stage",he:"במה"},{en:"tonight",he:"הלילה"}] },
  { term: "Scene", translation: "סצנה / זירה", level: "intermediate", sentenceParts: [{en:"The",he:"ה"},{en:"final",he:"סופית"},{en:"scene",he:"סצנה"},{en:"of",he:"של"},{en:"the",he:"ה"},{en:"movie",he:"סרט"},{en:"was",he:"הייתה"},{en:"very",he:"מאוד"},{en:"emotional",he:"מרגשת"}] },
  { term: "Studio", translation: "סטודיו / אולפן", level: "intermediate", sentenceParts: [{en:"He",he:"הוא"},{en:"spends",he:"מבלה"},{en:"most",he:"רוב"},{en:"of",he:"של"},{en:"his",he:"שלו"},{en:"time",he:"זמן"},{en:"working",he:"עובד"},{en:"in",he:"ב"},{en:"his",he:"שלו"},{en:"studio",he:"סטודיו"}] },
  { term: "Trend", translation: "טרנד / מגמה", level: "intermediate", sentenceParts: [{en:"Fashion",he:"אופנה"},{en:"trends",he:"טרנדים"},{en:"change",he:"משתנים"},{en:"very",he:"מאוד"},{en:"quickly",he:"מהר"},{en:"these",he:"האלו"},{en:"days",he:"ימים"}] }
];

// --- הפונקציה הראשית ---
const seedDays4to6 = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI חסר בקובץ .env");
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 מחובר ל-DB. מתחיל בהזנת ימים 4, 5 ו-6...');

    // מחיקת נתונים קודמים של ימים 4, 5, 6
    await Day.deleteMany({ dayNumber: { $in: [4, 5, 6] } });

    // מחיקת המילים עצמן למניעת כפילויות
    const allTerms = [
      ...day4Data.map(d => d.term), 
      ...day5Data.map(d => d.term),
      ...day6Data.map(d => d.term)
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

    // יצירת יום 4
    await createDay(4, "פסיכולוגיה וחברה", day4Data);
    
    // יצירת יום 5
    await createDay(5, "חוק, ממשל ופוליטיקה", day5Data);

    // יצירת יום 6
    await createDay(6, "תרבות, אומנות ומדיה", day6Data);

    console.log('🎉 הושלם בהצלחה! ימים 4, 5 ו-6 נטענו.');
    process.exit(0);

  } catch (err) {
    console.error('❌ שגיאה:', err);
    process.exit(1);
  }
};

// הפעלת הפונקציה
seedDays4to6();