import { readProducts } from '../utils/readProducts.js';  //читає масив продуктів
import { PATH_DB } from '../constants/products.js';

export async function getTotalPrice() {
  try {
    const products = await readProducts(PATH_DB); //зчитуємо всі продукти з файлу db.json у вигляді масиву об'єктів:

    const total = products.reduce((sum, product) => {
      const price = parseFloat(product.price);
      return sum + (isNaN(price) ? 0 : price);
    }, 0); //.reduce(...) — проходить по кожному продукту й накопичує суму,sum — проміжний підсумок,product — поточний продукт
      //isNaN(price) ? 0 : price — якщо ціна неправильна → додаємо 0,Початкове значення суми — 0

    return total;
  } catch (error) {
    console.error('❌ Помилка при підрахунку вартості:', error.message);
    return 0;
  }
}

// Виводимо результат у консоль
getTotalPrice().then(total => {
  console.log(`🟢 Загальна вартість усіх продуктів: ${total.toFixed(2)} грн`);
});
