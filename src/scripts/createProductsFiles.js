import { readProducts } from '../utils/readProducts.js';
import { PATH_DB, PATH_FILES_DIR } from '../constants/products.js';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

// Функція для перетворення назви у формат з дефісами
function toKebabCase(str) {
  return str.toLowerCase().replace(/\s+/g, '-'); // заміна пробілів на дефіси та перетворення у нижній регістр 
}

export async function createProductsFiles() {
  try {
    const products = await readProducts(PATH_DB);

    for (const product of products) {  //проходимо по кожному продукту
      const fileName = toKebabCase(product.name) + '.json'; // заміна пробілів на дефіси та перетворення у нижній регістр 
      const filePath = path.join(PATH_FILES_DIR, fileName); //повертає абслютний шлях до файла
      const json = JSON.stringify(product, null, 2); //перетворює масив у JSON рядок
      await writeFile(filePath, json, 'utf8'); //записуєм JSON рядок у файл
    }

    console.log(`🟢 Створено ${products.length} файлів у папці files.`);
  } catch (error) {
    console.error('❌ Помилка при створенні файлів продуктів:', error.message);
  }
}

// Виклик
createProductsFiles();