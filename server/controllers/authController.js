import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // מוודא שימוש במודל החדש
import { createAndSendTokens } from '../utils/tokenHandler.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // בדיקה פשוטה אם המשתמש קיים
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'משתמש קיים' });

    const hash = await bcrypt.hash(password, 10);
    // יצירת משתמש עם המבנה החדש
    const user = await User.create({ 
      name, 
      email, 
      passwordHash: hash,
      role: 'user',
      vocabulary: { known: [], learning: [] } // אתחול ריק ללמידה
    });

    createAndSendTokens(user, res);
    return res.status(201).json({ 
      message: "נוצר בהצלחה", 
      user: { _id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "שגיאה בהרשמה" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(401).json({ message: 'פרטים שגויים' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'פרטים שגויים' });

    createAndSendTokens(user, res);
    return res.status(200).json({ 
      message: "התחברת", 
      user: { _id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "שגיאה בהתחברות" });
  }
};

export const logout = async (req, res) => {
    res.clearCookie('jwt');
    res.clearCookie('refreshToken');
    res.sendStatus(204);
};

export const refresh = async (req, res) => {
    // פונקציה מפושטת לחידוש טוקן
    res.sendStatus(200); 
};