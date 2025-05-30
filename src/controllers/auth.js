import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';
import { logoutUser } from '../services/auth.js';
import { refreshUsersSession } from '../services/auth.js';

export const registerUserController = async (req, res) => {
    
  const user = await registerUser(req.body);   // 1. Реєструємо користувача

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!', // 2. Успішна відповідь
    data: user, // 3. Віддаємо створеного користувача
  });
};
// Контролер для логіну користувача
export const loginUserController = async (req, res) => {
    // 🔐 Викликаємо сервіс loginUser з переданим email і password
    // -> якщо все ок, отримаємо сесію з accessToken та refreshToken
    const session = await loginUser(req.body);
  
    // 🍪 Зберігаємо refreshToken у cookie:
    // httpOnly — щоб його не можна було прочитати з JavaScript (захист від XSS)
    // expires — коли кука стане неактивною (через ONE_DAY)
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
  
    // 🍪 Також зберігаємо sessionId — для ідентифікації сесії на сервері
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
  
    // 📦 Повертаємо відповідь клієнту: тільки accessToken (refreshToken — в куках)
    res.json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
};
export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }
  
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
  
    res.status(204).send();
  };
  // Хелпер-функція для налаштування куків сесії
const setupSession = (res, session) => {
    // Зберігаємо refreshToken у httpOnly cookie (недоступна з JavaScript)
    // expires — час життя куки (1 день)
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });
  
    // Зберігаємо sessionId у cookie — щоб на сервері ідентифікувати сесію
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_DAY),
    });
};
    // Контролер для оновлення access токена за допомогою refresh токена
export const refreshUserSessionController = async (req, res) => {
    // 🔐 Отримуємо sessionId і refreshToken з cookies
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });
  
    // 🍪 Якщо сесія валідна — знову встановлюємо нові куки (оновлені токени)
    setupSession(res, session);
  
    // 📦 Повертаємо клієнту новий accessToken у відповіді
    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken, // новий accessToken
      },
    });
  };