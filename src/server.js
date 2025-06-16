// src/server.js

import express from 'express';
import cors from 'cors';
import pino from 'pino-http'; // логер запитів
import cookieParser from 'cookie-parser'; // для роботи з куками

import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { UPLOAD_DIR } from './constants/index.js'; 

// 🔁 Створюємо функцію запуску сервера
export const startServer = () => {
  const app = express(); // Створення екземпляру додатку

  // 📦 Підключення middleware

  // Роздача завантажених файлів (наприклад: фото)
  app.use('/uploads', express.static(UPLOAD_DIR));

  // Swagger документація буде доступна на /api-docs
  app.use('/api-docs', swaggerDocs());

  // Дозвіл обробляти JSON тіла запитів
  app.use(express.json());

  // Дозвіл на запити з інших джерел (localhost:5173 тощо)
  app.use(cors());

  // Працюємо з куками
  app.use(cookieParser());

  // Логування запитів у консоль
  app.use(
    pino({
      transport: {
        target: 'pino-pretty', // робить лог читаємим
      },
    }),
  );

  // 👋 Тестовий маршрут
  app.get('/', (req, res) => {
    res.json({ message: 'Hello world!' });
  });

  // 🌐 Основний роутер
  app.use(router);

  // 🧭 Обробники помилок
  app.use(notFoundHandler);
  app.use(errorHandler); // завжди останній

  // 🚀 Запуск сервера
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};

// 🧩 Викликаємо функцію
startServer();
