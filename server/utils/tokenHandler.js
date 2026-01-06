import jwt from 'jsonwebtoken';

// 1. שינוי זמן הטוקן מ-15 דקות ל-30 יום
const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30d' });

// 2. שינוי זמן הרפרש טוקן ל-30 יום (לייתר ביטחון)
const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

export const createAndSendTokens = (user, res) => {
  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id, v: user.tokenVersion });

  const secure = process.env.NODE_ENV === 'production';

  res
    .cookie('jwt', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure,
      // 3. שינוי זמן העוגייה ל-30 יום (במילישניות)
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure,
      // 4. גם את זה נעדכן ל-30 יום
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};