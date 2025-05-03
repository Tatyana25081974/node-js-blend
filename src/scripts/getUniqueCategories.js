import { readProducts } from '../utils/readProducts.js';
import { PATH_DB } from '../constants/products.js';

export async function getUniqueCategories() {
  try {
    const products = await readProducts(PATH_DB);

      const allCategories = products.map(product => product.category);//Проходимо по кожному продукту,Забираємо тільки його category
      //Отримуємо масив всіх категорій, навіть якщо є повтори
    const uniqueCategories = [...new Set(allCategories)]; //масив даних,які не повторюються 

    return uniqueCategories;
  } catch (error) {
    console.error('❌ Помилка при отриманні категорій:', error.message);
    return [];
  }
}

// Виклик функції та логування результату
getUniqueCategories().then(categories => {
  console.log(`🟢 Унікальні категорії (${categories.length}):`);
  console.log(categories);
});
