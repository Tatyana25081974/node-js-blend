

import { writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function writeProducts(filePath, products) {
  try {
    const resolvedPath = path.resolve(filePath); //path.resolve(...) перетворює відносний шлях (типу 'src/db/db.json') на абсолютний
    const json = JSON.stringify(products, null, 2); //Перетворює масив об’єктів у JSON-рядок
    await writeFile(resolvedPath, json, 'utf8');
  } catch (error) {
    console.error('❌ Помилка запису у файл:', error.message);
  }
}

