// Імпортуємо бібліотеку для створення помилок HTTP (наприклад, 404, 500)
import createHttpError from 'http-errors';

// Імпортуємо бібліотеку для показу Swagger-документації через браузер
import swaggerUI from 'swagger-ui-express';

// Вбудований модуль Node.js для роботи з файлами
import fs from 'node:fs';

// Імпортуємо шлях до файлу документації (зазвичай ./docs/openapi.json або .yaml)
import { SWAGGER_PATH } from '../constants/index.js';

// Головна функція, яка повертає middleware для підключення Swagger UI
export const swaggerDocs = () => {
  try {
    // Пробуємо зчитати файл документації за шляхом SWAGGER_PATH
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());

    // Повертаємо масив middleware: обслуговування файлів + показ документації
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch {
    // Якщо виникла помилка при зчитуванні/парсингу файлу — повертаємо middleware з помилкою 500
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
