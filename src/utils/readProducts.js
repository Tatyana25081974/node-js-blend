import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PATH_DB } from '../constants/products.js';

export async function readProducts() {
  try {
    const filePath = path.resolve(PATH_DB); // абсолютний шлях
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data); // розпарсили JSON у масив
  } catch (error) {
    console.error('❌ Помилка читання файлу:', error.message);
    return [];
  }
}