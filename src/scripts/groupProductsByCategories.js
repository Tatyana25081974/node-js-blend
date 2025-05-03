import { readProducts } from '../utils/readProducts.js';
import { PATH_DB } from '../constants/products.js';

export async function groupProductsByCategories() {
  try {
    const products = await readProducts(PATH_DB);

    const grouped = {};

    for (const product of products) {
      const category = product.category;
      const name = product.name;

      if (!grouped[category]) {
        grouped[category] = [];
      }

      grouped[category].push(name);
    }

    return grouped;
  } catch (error) {
    console.error('❌ Помилка при групуванні продуктів:', error.message);
    return {};
  }
}

// Виклик і логування
groupProductsByCategories().then(result => {
  console.log('🟢 Продукти згруповано за категоріями:');
  console.log(result);
});
