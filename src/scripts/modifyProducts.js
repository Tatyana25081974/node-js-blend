import { readProducts } from '../utils/readProducts.js';
import { writeProducts } from '../utils/writeProducts.js';
import { PATH_DB } from '../constants/products.js';

export async function modifyProducts() {
  try {
    const products = await readProducts(PATH_DB);

    const modified = products.map(({ description, ...rest }) => rest); // rest — це обʼєкт без description, { description, ...rest }	Витягує поле description з обʼєкта



    await writeProducts(PATH_DB, modified);

    console.log('🟢 Продукти оновлено: поле "description" видалено.');
  } catch (error) {
    console.error('❌ Помилка при оновленні продуктів:', error.message);
  }
}

modifyProducts();
