// src/server.js

import express from 'express';
import cors from 'cors';
import pino from 'pino-http'; // логер запитів
import cookieParser from 'cookie-parser'; // для роботи з куками

import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

// 🔁 Створюємо функцію запуску сервера
export const startServer = () => {
  const app = express();

  // 📦 Middleware
  app.use(express.json()); // для роботи з JSON
  app.use(cors()); // дозвіл на запити з інших доменів
  app.use(cookieParser()); // дозволяє читати та записувати куки

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
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
