import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import csurf from 'csurf';
import mongoose from 'mongoose';

// ייבוא נתיבים
import authRoutes from './routes/auth.js';
import learnRoutes from './routes/learnRoutes.js';

// ייבוא מידלוור
import { requireAuth } from './middlewares/authMiddleware.js';

// בדיקה אם אנחנו בפיתוח או בייצור
const isProduction = process.env.NODE_ENV === 'production';

// חיבור למסד הנתונים
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✔ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
await connectDB();

const app = express();

// --- הגדרות אבטחה בסיסיות ---
app.use(helmet({ 
  crossOriginResourcePolicy: false 
}));

app.use(cors({
  origin: [
    'http://localhost:5173',               // פיתוח
    'https://english-1-hwkw.onrender.com'  // פרודקשן
  ],
  credentials: true 
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser(process.env.JWT_ACCESS_SECRET || 'temp-secret-key-for-dev'));
app.use(mongoSanitize());

// --- הגדרת CSRF ---
const csrfProtection = csurf({
  cookie: {
    key: '_csrf',
    path: '/',
    httpOnly: true,
    secure: isProduction, 
    sameSite: isProduction ? 'none' : 'lax'
  },
});

// נתיבים שפתוחים לפני CSRF
app.use('/api/auth', authRoutes);

// --- הפעלת הגנת CSRF ---
app.use(csrfProtection);

// שליחת הטוקן לקליינט (חובה ל-Axios)
app.use((req, res, next) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token); 
  next();
});

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// --- נתיבים מוגנים (התיקון כאן!) ---

// 1. תמיכה לאחור (עבור הדפים הישנים: Dashboard, Daily, וכו')
app.use('/api/learn', requireAuth, learnRoutes);

// 2. תמיכה בפיצ'ר החדש (Deep Drill שעובד עם v1)
app.use('/api/v1/learn', requireAuth, learnRoutes);


// טיפול בשגיאות 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// טיפול בשגיאות גלובלי
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ 
        message: 'CSRF Token missing or invalid',
        code: 'CSRF_ERROR'
    });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;