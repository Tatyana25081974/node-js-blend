import { readProducts } from '../utils/readProducts.js'; //відкриває файл db.json і повертає масив;
import { writeProducts } from '../utils/writeProducts.js'; //записує нові дані в db.json
import { createFakeProduct } from '../utils/createFakeProduct.js';// повертає об'єкт продукту (генерує випадкові значення).

import { PATH_DB } from '../constants/products.js';

export const generateProducts = async (count) => {
  const existing = await readProducts(PATH_DB); // зчитуємо існуючі продукти
  const newProducts = [];

  for (let i = 0; i < count; i++) {
    newProducts.push(createFakeProduct());
  }

  const updated = [...existing, ...newProducts]; // не перезаписуємо все, а додаємо нові продукти до вже існуючих.

  await writeProducts (PATH_DB, updated);
  console.log(`✅ Додано ${count} нових продуктів.`);
};


const count = parseInt(process.argv[2]) || 1;
generateProducts(count);
