// src/routers/auth.js

import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; // обгортка для try/catch
import { registerUserSchema } from '../validation/auth.js'; // Joi-схема
import { registerUserController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js'; // middleware перевірки
import { loginUserSchema} from '../validation/auth.js'; // Joi-схема
import { loginUserController } from '../controllers/auth.js'; //контроллер
import { logoutUserController } from '../controllers/auth.js';
import { refreshUserSessionController } from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema), // спочатку перевіряємо тіло запиту
  ctrlWrapper(registerUserController), // потім викликаємо контролер
);
router.post(
    '/login',
    validateBody(loginUserSchema),
    ctrlWrapper(loginUserController),
);
router.post('/logout', ctrlWrapper(logoutUserController));
router.post('/refresh', ctrlWrapper(refreshUserSessionController));

export default router;
