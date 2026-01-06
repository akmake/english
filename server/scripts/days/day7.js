import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Word from '../../models/Word.js';
import Day from '../../models/Day.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const DAY_NUMBER = 7;
const DAY_TITLE = "פסיכולוגיה והתנהגות (Psychology & Behavior)";

const createSentence = (en, he) => [{ en, he }];

const wordsData = [
  // --- 15 מילים רגילות (גבוהות) ---
  {
    term: "Anxiety",
    translation: "חרדה",
    level: "advanced",
    sentenceParts: createSentence(
      "Public speaking causes severe anxiety for many people, often leading to shaking and sweating.",
      "דיבור בפני קהל גורם לחרדה קשה אצל אנשים רבים, ולעיתים קרובות מוביל לרעידות והזעה."
    )
  },
  {
    term: "Trauma",
    translation: "טראומה",
    level: "advanced",
    sentenceParts: createSentence(
      "Childhood trauma can have lasting effects on an individual's emotional development and mental health.",
      "טראומה בילדות יכולה להיות בעלת השפעות מתמשכות על ההתפתחות הרגשית ובריאות הנפש של היחיד."
    )
  },
  {
    term: "Conscious",
    translation: "מודע",
    level: "advanced",
    sentenceParts: createSentence(
      "He made a conscious decision to quit smoking in order to improve his overall health.",
      "הוא קיבל החלטה מודעת להפסיק לעשן על מנת לשפר את בריאותו הכללית."
    )
  },
  {
    term: "Personality",
    translation: "אישיות",
    level: "advanced",
    sentenceParts: createSentence(
      "Her cheerful personality makes her very popular among her colleagues and friends.",
      "האישיות העליזה שלה הופכת אותה לפופולרית מאוד בקרב עמיתיה וחבריה."
    )
  },
  {
    term: "Mental",
    translation: "נפשי / שכלי",
    level: "advanced",
    sentenceParts: createSentence(
      "Solving puzzles is a great way to keep your mental faculties sharp as you age.",
      "פתרון חידות הוא דרך מצוינת לשמור על הכישורים המנטליים שלך חדים ככל שאתה מתבגר."
    )
  },
  {
    term: "Motivation",
    translation: "מוטיבציה / הנעה",
    level: "advanced",
    sentenceParts: createSentence(
      "Lack of motivation is often the main reason why people fail to stick to their exercise routines.",
      "חוסר מוטיבציה הוא לעיתים קרובות הסיבה העיקרית לכך שאנשים נכשלים בהתמדה בשגרת האימונים שלהם."
    )
  },
  {
    term: "Identity",
    translation: "זהות",
    level: "advanced",
    sentenceParts: createSentence(
      "Adolescence is a critical period where teenagers struggle to establish their own sense of identity.",
      "גיל ההתבגרות הוא תקופה קריטית שבה בני נוער נאבקים לבסס את תחושת הזהות העצמית שלהם."
    )
  },
  {
    term: "Disorder",
    translation: "הפרעה (בריאותית)",
    level: "advanced",
    sentenceParts: createSentence(
      "Eating disorders such as anorexia can cause serious physical damage to the body if left untreated.",
      "הפרעות אכילה כגון אנורקסיה יכולות לגרום לנזק פיזי חמור לגוף אם לא מטפלים בהן."
    )
  },
  {
    term: "Therapy",
    translation: "טיפול / תרפיה",
    level: "advanced",
    sentenceParts: createSentence(
      "After the accident, he needed months of physical therapy to regain the use of his legs.",
      "לאחר התאונה, הוא נזקק לחודשים של פיזיותרפיה (טיפול פיזי) כדי להחזיר את השימוש ברגליו."
    )
  },
  {
    term: "Panic",
    translation: "פאניקה / בהלה",
    level: "advanced",
    sentenceParts: createSentence(
      "A sudden feeling of panic overwhelmed him when he realized he had lost his wallet in the foreign city.",
      "תחושת פאניקה פתאומית הציפה אותו כשקלט שאיבד את הארנק שלו בעיר הזרה."
    )
  },
  {
    term: "Emotion",
    translation: "רגש",
    level: "advanced",
    sentenceParts: createSentence(
      "She tried to hide her emotion, but tears began to stream down her face when she heard the news.",
      "היא ניסתה להסתיר את הרגש שלה, אבל דמעות החלו לזלוג על פניה כששמעה את החדשות."
    )
  },
  {
    term: "Stress",
    translation: "לחץ / מתח",
    level: "advanced",
    sentenceParts: createSentence(
      "High levels of stress at work can lead to burnout and a variety of health problems.",
      "רמות גבוהות של לחץ בעבודה יכולות להוביל לשחיקה ולמגוון בעיות בריאות."
    )
  },
  {
    term: "Depression",
    translation: "דיכאון",
    level: "advanced",
    sentenceParts: createSentence(
      "Clinical depression is more than just feeling sad; it is a serious medical condition that requires treatment.",
      "דיכאון קליני הוא יותר מסתם להרגיש עצוב; זהו מצב רפואי רציני הדורש טיפול."
    )
  },
  {
    term: "Memory",
    translation: "זיכרון",
    level: "advanced",
    sentenceParts: createSentence(
      "He has a photographic memory that allows him to recall details from books he read years ago.",
      "יש לו זיכרון צילומי שמאפשר לו להיזכר בפרטים מספרים שקרא לפני שנים."
    )
  },
  {
    term: "Instinct",
    translation: "אינסטינקט / חוש טבעי",
    level: "advanced",
    sentenceParts: createSentence(
      "Her motherly instinct told her that something was wrong with her child even before the doctor arrived.",
      "האינסטינקט האימהי שלה אמר לה שמשהו לא בסדר עם הילד שלה עוד לפני שהרופא הגיע."
    )
  },

  // --- 15 מילים אקדמיות (אמירנ"ט) ---
  {
    term: "Cognitive",
    translation: "קוגניטיבי (הכרתי)",
    level: "academic",
    sentenceParts: createSentence(
      "Cognitive development in children involves the progression of learning, attention, memory, and thinking skills.",
      "התפתחות קוגניטיבית אצל ילדים כרוכה בהתקדמות של מיומנויות למידה, קשב, זיכרון וחשיבה."
    )
  },
  {
    term: "Subconscious",
    translation: "תת-מודע",
    level: "academic",
    sentenceParts: createSentence(
      "Sigmund Freud believed that our dreams are a reflection of desires hidden in our subconscious mind.",
      "זיגמונד פרויד האמין שהחלומות שלנו הם השתקפות של תשוקות החבויות במוח התת-מודע שלנו."
    )
  },
  {
    term: "Pathology",
    translation: "פתולוגיה (חקר מחלות/הפרעות)",
    level: "academic",
    sentenceParts: createSentence(
      "The pathology of the disease is not yet fully understood, making it difficult to develop an effective cure.",
      "הפתולוגיה של המחלה עדיין אינה מובנת במלואה, מה שמקשה על פיתוח תרופה יעילה."
    )
  },
  {
    term: "Stimulus",
    translation: "גירוי",
    level: "academic",
    sentenceParts: createSentence(
      "In the experiment, the rat was trained to press a lever in response to a visual stimulus.",
      "בניסוי, החולדה אומנה ללחוץ על דוושה בתגובה לגירוי חזותי."
    )
  },
  {
    term: "Conditioning",
    translation: "התניה",
    level: "academic",
    sentenceParts: createSentence(
      "Classical conditioning is a learning process where two stimuli are paired together to produce a response.",
      "התניה קלאסית היא תהליך למידה שבו שני גירויים מוצמדים יחד כדי לייצר תגובה."
    )
  },
  {
    term: "Narcissism",
    translation: "נרקיסיזם (אהבה עצמית מופרזת)",
    level: "academic",
    sentenceParts: createSentence(
      "Extreme narcissism can prevent individuals from empathizing with others and maintaining healthy relationships.",
      "נרקיסיזם קיצוני יכול למנוע מאנשים לחוש אמפתיה לאחרים ולשמור על מערכות יחסים בריאות."
    )
  },
  {
    term: "Introvert",
    translation: "מופנם",
    level: "academic",
    sentenceParts: createSentence(
      "Unlike an extrovert who gains energy from social interaction, an introvert often needs solitude to recharge.",
      "בניגוד למוחצן שמקבל אנרגיה מאינטראקציה חברתית, אדם מופנם זקוק לעיתים קרובות לבדידות כדי להיטען מחדש."
    )
  },
  {
    term: "Extrovert",
    translation: "מוחצן",
    level: "academic",
    sentenceParts: createSentence(
      "Being an extrovert, he loves attending parties and meeting new people everywhere he goes.",
      "בהיותו מוחצן, הוא אוהב להשתתף במסיבות ולפגוש אנשים חדשים בכל מקום אליו הוא הולך."
    )
  },
  {
    term: "Psychoanalysis",
    translation: "פסיכואנליזה",
    level: "academic",
    sentenceParts: createSentence(
      "Psychoanalysis involves exploring a patient's past to understand their current psychological problems.",
      "פסיכואנליזה כרוכה בחקירת עברו של המטופל כדי להבין את הבעיות הפסיכולוגיות הנוכחיות שלו."
    )
  },
  {
    term: "Repression",
    translation: "הדחקה",
    level: "academic",
    sentenceParts: createSentence(
      "Repression is a defense mechanism where painful memories are pushed out of the conscious mind.",
      "הדחקה היא מנגנון הגנה שבו זיכרונות כואבים נדחקים החוצה מהמודעות."
    )
  },
  {
    term: "Perception",
    translation: "תפיסה",
    level: "academic",
    sentenceParts: createSentence(
      "Our perception of reality can be easily distorted by our expectations and past experiences.",
      "התפיסה שלנו את המציאות יכולה להיות מעוותת בקלות על ידי הציפיות וניסיון העבר שלנו."
    )
  },
  {
    term: "Denial",
    translation: "הכחשה",
    level: "academic",
    sentenceParts: createSentence(
      "Living in denial about his addiction prevented him from seeking the help he desperately needed.",
      "החיים בהכחשה לגבי ההתמכרות שלו מנעו ממנו לבקש את העזרה לה הוא נזקק נואשות."
    )
  },
  {
    term: "Rationalization",
    translation: "רציונליזציה (צידוק הגיוני)",
    level: "academic",
    sentenceParts: createSentence(
      "He used rationalization to justify his unethical behavior, claiming that everyone else was doing it too.",
      "הוא השתמש ברציונליזציה כדי להצדיק את התנהגותו הלא אתית, בטענה שכולם עושים זאת גם כן."
    )
  },
  {
    term: "Schizophrenia",
    translation: "סכיזופרניה (שסעת)",
    level: "academic",
    sentenceParts: createSentence(
      "Schizophrenia is a severe mental disorder characterized by hallucinations, delusions, and disorganized thinking.",
      "סכיזופרניה היא הפרעה נפשית חמורה המאופיינת בהזיות, מחשבות שווא וחשיבה לא מאורגנת."
    )
  },
  {
    term: "Projection",
    translation: "השלכה (פסיכולוגית)",
    level: "academic",
    sentenceParts: createSentence(
      "Psychological projection occurs when a person attributes their own unacceptable feelings to someone else.",
      "השלכה פסיכולוגית מתרחשת כאשר אדם מייחס את הרגשות הבלתי מקובלים שלו למישהו אחר."
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