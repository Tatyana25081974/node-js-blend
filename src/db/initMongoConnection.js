// src/db/initMongoConnection.js
import mongoose from 'mongoose';

export async function initMongoConnection() {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;//отримуємо змінні з файлу .env

  const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(connectionString); //з'єднання з базою даних
    console.log('✅ Mongo connection successfully established!');
  } catch (error) {
    console.error('❌ Mongo connection failed:', error.message);
    process.exit(1); // Завершує програму, якщо з’єднання не встановлено
  }
}
