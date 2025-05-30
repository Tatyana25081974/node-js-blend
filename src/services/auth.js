import { randomBytes } from 'crypto'; // для генерації випадкових токенів
import bcrypt from 'bcrypt'; // для порівняння паролів
import createHttpError from 'http-errors'; // для створення HTTP-помилок

import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js'; // константи часу життя токенів
import { SessionsCollection } from '../db/models/session.js'; // модель сесії
import { UsersCollection } from '../db/models/user.js'; // модель користувача

export const registerUser = async (payload) => {
    return await UsersCollection.create(payload);
  };

export const loginUser = async (payload) => {
  // 1. Шукаємо користувача по email
  const user = await UsersCollection.findOne({ email: payload.email });

  // 2. Якщо не знайдено — повертаємо помилку 404
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  // 3. Порівнюємо надісланий пароль із захешованим у базі
  const isEqual = await bcrypt.compare(payload.password, user.password);

  // 4. Якщо паролі не співпадають — помилка 401 (Unauthorized)
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  // 5. Якщо вже була сесія — видаляємо її (одна активна сесія на користувача)
  await SessionsCollection.deleteOne({ userId: user._id });

  // 6. Генеруємо нові access і refresh токени
  const accessToken = randomBytes(30).toString('base64'); // строка довжиною 30 байт у base64
  const refreshToken = randomBytes(30).toString('base64');

  // 7. Створюємо нову сесію в базі з токенами і часом дії
  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES), // access-токен на 15 хв
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),         // refresh-токен на 1 день
  });
};
export const logoutUser = async (sessionId) => {
    await SessionsCollection.deleteOne({ _id: sessionId });
};
const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');
  
    return {
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    };
  };
  
  export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    const session = await SessionsCollection.findOne({
      _id: sessionId,
      refreshToken,
    });
  
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }
  
    const isSessionTokenExpired =
      new Date() > new Date(session.refreshTokenValidUntil);
  
    if (isSessionTokenExpired) {
      throw createHttpError(401, 'Session token expired');
    }
    
    const newSession = createSession();
  
    await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
  
    return await SessionsCollection.create({
      userId: session.userId,
      ...newSession,
    });
  };