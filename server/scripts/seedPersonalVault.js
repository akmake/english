import 'dotenv/config'; // טוען את המשתנים מ-.env (חובה לחיבור ל-DB)
import mongoose from 'mongoose';
import User from '../models/User.js';
// --- הגדרות ---
// שנה את זה לאימייל שלך כדי שהמילים ייכנסו אליך!
const TARGET_EMAIL = 'yosefdaean@gmail.com'; // <--- שנה כאן

const highLevelWords = [
  { english: "Ubiquitous", hebrew: "נמצא בכל מקום" },
  { english: "Ephemeral", hebrew: "חולף, זמני, ארעי" },
  { english: "Mitigate", hebrew: "להקל, למתן, לשכך" },
  { english: "Ambiguous", hebrew: "דו-משמעי, מעורפל" },
  { english: "Superfluous", hebrew: "מיותר, עודף" },
  { english: "Benevolent", hebrew: "נדיב, טוב לב" },
  { english: "Pragmatic", hebrew: "מעשי, פרגמטי" },
  { english: "Inevitable", hebrew: "בלתי נמנע" },
  { english: "Lucid", hebrew: "צלול, ברור, נהיר" },
  { english: "Profound", hebrew: "עמוק, נחרץ, מעמיק" },
  { english: "Reluctant", hebrew: "מסויג, לא רצון" },
  { english: "Versatile", hebrew: "רב-גוני, ורסטילי" },
  { english: "Candid", hebrew: "כן, גלוי לב" },
  { english: "Deterrent", hebrew: "מרתיע, גורם מעכב" },
  { english: "Eccentric", hebrew: "מוזר, חריג, תמהוני" },
  { english: "Fluctuate", hebrew: "להתנדנד, להשתנות תדיר" },
  { english: "Hypothetical", hebrew: "היפותטי, משוער" },
  { english: "Indifferent", hebrew: "אדיש" },
  { english: "Meticulous", hebrew: "קפדני, מדוקדק" },
  { english: "Obsolete", hebrew: "מיושן, שעבר זמנו" },
  { english: "Paradox", hebrew: "סתירה, פרדוקס" },
  { english: "Resilient", hebrew: "עמיד, בעל כושר התאוששות" },
  { english: "Scrutinize", hebrew: "לבחון בקפידה, לחקור" },
  { english: "Subtle", hebrew: "עדין, מתוחכם, דק" },
  { english: "Tedious", hebrew: "מייגע, משעמם" },
  { english: "Viable", hebrew: "מעשי, ישיים, בר-קיימא" },
  { english: "Wary", hebrew: "זהיר, חשדן" },
  { english: "Abstract", hebrew: "מופשט" },
  { english: "Advocate", hebrew: "לתמוך, לסנגר; סנגור" },
  { english: "Ambivalent", hebrew: "רגשות מעורבים" },
  { english: "Arbitrary", hebrew: "שרירותי" },
  { english: "Coherent", hebrew: "עקבי, הגיוני, מלוכד" },
  { english: "Comprehensive", hebrew: "מקיף, כולל" },
  { english: "Concur", hebrew: "להסכים, לשתף פעולה" },
  { english: "Conventional", hebrew: "שגרתי, מקובל, קונבנציונלי" },
  { english: "Deviate", hebrew: "לסטות, לחרוג" },
  { english: "Dilemma", hebrew: "דילמה, התלבטות" },
  { english: "Diverse", hebrew: "מגוון, שונה" },
  { english: "Eloquent", hebrew: "רהוט, בעל כושר ביטוי" },
  { english: "Enhance", hebrew: "לשפר, להגביר, לחזק" },
  { english: "Explicit", hebrew: "מפורש, ברור" },
  { english: "Implicit", hebrew: "משתמע, מרומז" },
  { english: "Inhibit", hebrew: "לעכב, לבלום, לדכא" },
  { english: "Innovative", hebrew: "חדשני" },
  { english: "Integrity", hebrew: "יושרה, הגינות; שלמות" },
  { english: "Lethargic", hebrew: "רדום, אדיש, חסר מרץ" },
  { english: "Mundane", hebrew: "יומיומי, שגרתי, בנאלי" },
  { english: "Nostalgia", hebrew: "געגועים לעבר, נוסטלגיה" },
  { english: "Obscure", hebrew: "ערפולי, לא ברור; להסתיר" },
  { english: "Optimistic", hebrew: "אופטימי" }
];

const seedVault = async () => {
  try {
    // 1. חיבור למסד הנתונים
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected.');

    // 2. מציאת המשתמש
    console.log(`🔍 Looking for user: ${TARGET_EMAIL}...`);
    const user = await User.findOne({ email: TARGET_EMAIL });

    if (!user) {
      console.error(`❌ User not found! Please check the email in the script.`);
      process.exit(1);
    }

    // 3. הוספת המילים (תוך מניעת כפילויות)
    console.log(`📦 Injecting ${highLevelWords.length} Amirnet words...`);
    
    let addedCount = 0;
    
    // מוודא שהמערך קיים
    if (!user.personalVocabulary) user.personalVocabulary = [];

    highLevelWords.forEach(word => {
      // בדיקה אם המילה כבר קיימת (Case insensitive)
      const exists = user.personalVocabulary.find(
        w => w.english.toLowerCase() === word.english.toLowerCase()
      );

      if (!exists) {
        user.personalVocabulary.push({
          english: word.english,
          hebrew: word.hebrew,
          masteryLevel: 0,       // מתחיל מאפס
          nextReview: new Date() // זמין מיידית לחפירה
        });
        addedCount++;
      }
    });

    // 4. שמירה
    await user.save();
    console.log(`🎉 Success! Added ${addedCount} new words to your Personal Vault.`);
    console.log(`🚀 Total words in vault: ${user.personalVocabulary.length}`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding vault:', error);
    process.exit(1);
  }
};

seedVault();