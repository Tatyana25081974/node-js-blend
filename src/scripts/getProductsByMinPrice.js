import { readProducts } from '../utils/readProducts.js';
import { PATH_DB } from '../constants/products.js';

export async function getProductsByMinPrice(minPrice) {
  try {
    const products = await readProducts(PATH_DB);

    const filtered = products.filter(product => {
      const price = parseFloat(product.price);
      return price >= minPrice;
    });

    return filtered;
  } catch (error) {
    console.error('❌ Помилка при читанні продуктів:', error.message);
    return [];
  }
}

// Отримуємо значення з командного рядка
const input = process.argv[2];
const minPrice = parseFloat(input);

if (isNaN(minPrice)) {
  console.error('❌ Введено некоректну ціну. Приклад: npm run get-products-by-min-price -- 100');
  process.exit(1);
}

getProductsByMinPrice(minPrice).then(products => {
  console.log(`🟢 Знайдено ${products.length} продуктів з ціною >= ${minPrice}:`);
  console.log(products);
});
