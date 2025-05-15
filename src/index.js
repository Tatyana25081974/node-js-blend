import 'dotenv/config'; // завантажуємо змінні з файлу .env
import { initMongoConnection } from './db/initMongoConnection.js';
import './server.js'; // запускає Express

await initMongoConnection(); // підключення до MongoDB

