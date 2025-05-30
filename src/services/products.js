import createHttpError from 'http-errors'; //для створення помилок
import { Product } from '../db/models/productModel.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';





export const getAllProducts = async({
  page = 1,             // номер сторінки (за замовчуванням 1)
  perPage = 10,         // скільки продуктів на сторінку (за замовчуванням 10)
  sortOrder = SORT_ORDER.ASC, // порядок сортування (ASC або DESC)
  sortBy = '_id',       // поле, за яким сортувати
  filter = {},
  userId,
}) => {
  const limit = perPage;                  // скільки елементів показати
  const skip = (page - 1) * perPage;      // скільки елементів пропустити (наприклад, для 2-ї сторінки — 10)

  
 

  // Створюємо запит без виконання (lazy query)
  const productsQuery = Product.find({ userId });   // створює базовий запит на всі продукти

  // Додаємо фільтрацію до запиту, якщо є відповідні параметри
  if (filter.category) {
    productsQuery.where('category').equals(filter.category); 
    // додає умову: category === "значення з фільтра"
  }
  if (filter.minPrice) {
    productsQuery.where('price').gte(filter.minPrice); 
    // додає умову: price >= minPrice
  }
  if (filter.maxPrice) {
    productsQuery.where('price').lte(filter.maxPrice); 
    // додає умову: price <= maxPrice
  }

  // Підраховує кількість всіх документів, які задовольняють умови фільтрації
 // const totalItems = await Product.find()
   // .merge(productsQuery) // копіює фільтри з productsQuery в новий запит
   // .countDocuments();    // рахує, скільки таких документів знайдено

  // Отримуємо список продуктів з урахуванням пагінації та сортування
  //const products = await productsQuery
   // .skip(skip) // пропускає певну кількість документів (наприклад, для 2-ї сторінки пропустить 10)
   // .limit(limit) // обмежує кількість результатів (наприклад, 10 на сторінку)
   // .sort({ [sortBy]: sortOrder }) // сортує за заданим полем і порядком
  // .exec(); // виконує запит (до цього моменту запит був ще "в підготовці")
  
  const [totalItems, products] = await Promise.all([
    Product.find().merge(productsQuery).countDocuments(),
    productsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  // Обчислюємо мета-дані пагінації (наприклад, скільки всього сторінок)
  const paginationData = calculatePaginationData(totalItems, perPage, page);

  // Повертаємо результат — масив продуктів та мета-дані пагінації
  return {
    data: products,
    ...paginationData,
  };
};

export const getProductById = async (productId, userId) => {
  const product = await Product.findOne({ _id: productId, userId });

  if (!product) {
    throw createHttpError(404, 'Product not found');
  }

  return product;
};

export const createProduct = async (data) => {
  const newProduct = await Product.create(data);
  return newProduct;
};

export const updateProductService = async (productId, updateData, userId) => {
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: productId, userId }, // перевірка, що продукт належить саме цьому користувачу
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    throw createHttpError(404, 'Product not found');
  }

  return updatedProduct;
};

export const deleteProduct = async (productId, userId) => {
  const product = await Product.findOneAndDelete({
    _id: productId,
    userId, // 🔐 Перевірка приналежності продукту користувачу
  });

  if (!product) {
    throw createHttpError(404, 'Product not found');
  }

  return product;
};

