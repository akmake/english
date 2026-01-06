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
import learnRoutes from './routes/learnRoutes.js'; // 1. הוספנו את נתיב הלימוד (חשוב!)

// ייבוא מידלוור
import { requireAuth } from './middlewares/authMiddleware.js';

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
// הפעלת החיבור
await connectDB();

const app = express();

// --- הגדרות אבטחה בסיסיות ---
app.use(helmet({ 
  crossOriginResourcePolicy: false // מאפשר טעינת תמונות אם צריך
}));

app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:5173', 
  credentials: true 
}));

// הגדלת מגבלת הגודל (Payload Too Large)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// זה חובה כדי ש-csurf יעבוד ולא יקריס את השרת עם שגיאת 500
app.use(cookieParser(process.env.JWT_ACCESS_SECRET || 'temp-secret-key-for-dev'));

app.use(mongoSanitize());

const csrfProtection = csurf({
  cookie: { 
    key: '_csrf',
    path: '/',
    httpOnly: true,
    // ב-Production זה יהיה true, בפיתוח false
    secure: process.env.NODE_ENV === 'production', 
    // בפיתוח חייבים Lax כדי שזה יעבוד בין פורט 5173 ל-4000
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax' 
  },
});

// --- נתיבים ציבוריים ---
app.use('/api/auth', authRoutes);

// Endpoint לקבלת ה-CSRF Token
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// --- הפעלת הגנת CSRF על כל הנתיבים מכאן ומטה ---
app.use(csrfProtection);

// --- נתיבים מוגנים ---
// ללא השורה הזו, תקבל 404 כשתנסה ליצור אימון
app.use('/api/learn', requireAuth, learnRoutes);

// טיפול בשגיאות 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// טיפול בשגיאות גלובלי
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Form has been tampered with (CSRF Invalid)' });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;