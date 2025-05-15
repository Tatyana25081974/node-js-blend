import express from 'express';
import cors from 'cors';
import pino from 'pino-http'; //логер, який виводить інформацію про запити (наприклад: метод, шлях, час).


import productsRouter from './routers/products.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';



const app = express();


app.use(express.json()); //дозволяє обробляти JSON-дані з запитів та відповідями 
app.use(cors()); //Додає заголовки, щоб дозволити доступ з інших сайтів (наприклад, з фронтенду).
app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);
app.get('/', (req, res) => {
  res.json({
    message: 'Hello world!',
  });
});

app.use('/products', productsRouter);
app.use(notFoundHandler);
app.use(errorHandler); // має бути останнім!

// 5. Отримуємо порт зі змінної оточення або 3000
const PORT = process.env.PORT || 3000;

// 6. Запускаємо сервер
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

