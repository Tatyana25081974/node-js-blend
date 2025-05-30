// Перевірка: чи рядок і чи входить у список дозволених категорій
const parseCategory = (category) => {
    const isString = typeof category === 'string';
    const allowedCategories = ['books', 'electronics', 'clothing', 'other'];
  
    if (!isString) return;
    if (!allowedCategories.includes(category)) return;
  
    return category;
  };
  
  // Перевірка: чи рядок, чи це число, і чи воно не NaN
  const parseNumber = (value) => {
    if (typeof value !== 'string') return;
    const number = parseFloat(value); //Перетворюємо рядок у десяткове число.
    if (Number.isNaN(number)) return;
    return number;
  };
  
  // Основна функція: формує обʼєкт фільтрів
  export const parseProductFilterParams = (query) => {
    const { category, minPrice, maxPrice } = query;
  
    return {
      category: parseCategory(category),
      minPrice: parseNumber(minPrice),
      maxPrice: parseNumber(maxPrice),
    };
  };
  