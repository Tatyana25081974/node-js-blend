const parseCategory = (category) => {
    const isString = typeof category === 'string'; // перевіряємо, що це рядок
    const allowedCategories = ['books', 'electronics', 'clothing', 'other']; // список дозволених категорій
  
    if (!isString) return; // якщо не рядок — нічого не повертаємо
    if (!allowedCategories.includes(category)) return; // якщо значення не входить у список — нічого не повертаємо
  
    return category; // якщо все ок — повертаємо значення
  };
  
  const parseNumber = (value) => {
    if (typeof value !== 'string') return; // параметри приходять як строки, інакше — ігноруємо
  
    const number = parseFloat(value); // перетворюємо рядок у число з крапкою. Якщо value — це рядок, пробуємо перетворити його на десяткове число.
    if (Number.isNaN(number)) return; // якщо не вдалося — нічого не повертаємо
  
    return number; // повертаємо число
  };
  export const parseProductFilterParams = (query) => {
    const { category, minPrice, maxPrice } = query;
  
    return {
      category: parseCategory(category), // перевірка і фільтрація категорії
      minPrice: parseNumber(minPrice),   // безпечне перетворення
      maxPrice: parseNumber(maxPrice),   // безпечне перетворення
    };
  };
//Формує обʼєкт filters з правильними значеннями, які зручно передавати далі в getAllProducts(...).