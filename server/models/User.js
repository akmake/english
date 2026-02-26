import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // --- שדות בסיס (מקורי + חדש) ---
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    passwordHash: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user' 
    },

    // --- חדש: מערכת למידה (Amirnet) ---
    
    // 1. למידה מערכתית (מילים מובנות)
    vocabulary: {
      known: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Word' }],
      learning: [{
        word: { type: mongoose.Schema.Types.ObjectId, ref: 'Word' },
        box: { type: Number, default: 1 }, // קופסאות לייטנר (1-5)
        nextReview: { type: Date, default: Date.now }
      }]
    },

    // 2. מאגר אישי (Deep Drill - החפירה)
    personalVocabulary: [{
      english: { type: String, required: true },
      hebrew: { type: String, required: true },
      masteryLevel: { type: Number, default: 0 }, // רמת שליטה (עולה ככל שמצליחים במשחקים)
      nextReview: { type: Date, default: Date.now },
      addedAt: { type: Date, default: Date.now }
    }],

    // --- מקורי: שדות מהפרויקט הקודם (Cart & Security) ---
    // נשמר כדי לא לשבור לך לוגיקה קודמת 
    cart: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, min: 1, default: 1 },
      _id: false
    }],
    
    twoFactorEnabled: { type: Boolean, default: false },
    totpSecret: { type: String, default: '' },
    
    // מנגנון נעילה (מקורי)
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    tokenVersion: { type: Number, default: 0 },
    loginAttempts: { type: Number, default: 0 } // שדה כפול שהיה במערכות שונות, שמרתי ליתר ביטחון
  },
  { timestamps: true }
);

// --- מתודות וירטואליות (נשמרו מהמקור) ---
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.methods.incrementLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil > Date.now()) return;
  this.failedLoginAttempts += 1;
  this.loginAttempts += 1; 
  if (this.failedLoginAttempts >= 5 || this.loginAttempts >= 5) {
    this.lockUntil = Date.now() + 10 * 60 * 1000; // נעילה ל-10 דקות
  }
  await this.save();
};

userSchema.methods.resetLoginAttempts = async function () {
  this.failedLoginAttempts = 0;
  this.loginAttempts = 0;
  this.lockUntil = null;
  await this.save();
};

// --- תיקון השגיאה: יצירת המודל בצורה בטוחה ---
// בודק אם המודל כבר קיים כדי למנוע OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;