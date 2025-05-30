import { getAllProducts, getProductById, createProduct, updateProductService, deleteProduct } from '../services/products.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseProductFilterParams } from '../utils/parseProductFilterParams.js';


export const getProductsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = parseSortParams(req.query);

  const filter = parseProductFilterParams(req.query);

  const products = await getAllProducts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id, // 🔐 додаємо userId
  });
  res.json({
    status: 200,
    message: 'Successfully found products!',
    data: products,
  });
  
};




// Контролер для отримання одного продукту за ID
export const getProductByIdController = async (req, res, next) => {
  try {
    // 1. Отримуємо ідентифікатор з URL (наприклад: /products/abc123)
    const { productId } = req.params;
    const userId = req.user._id; // 🔐 додаємо userId

    // 2. Викликаємо сервіс, який звертається до бази MongoDB
    const product = await getProductById(productId, userId);

    // 3. Якщо продукт знайдено — повертаємо успішну відповідь
    res.status(200).json({
      status: 200,
      message: `Successfully found product with id ${productId}!`,
      data: product,
    });

  } catch (err) {
    // 4. Якщо сталася помилка — передаємо її до глобального обробника (errorHandler)
    next(err);
  }
};

export const createProductController = async (req, res, next) => {
  try {
    const userId = req.user._id; // 🔐 додаємо userId
    const product = await createProduct({ ...req.body, userId });
    res.status(201).json({
      status: 201,
      message: 'Successfully created a product!',
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProductController = async (req, res, next) => {
  try {
    // Отримуємо ID продукту з параметрів запиту
    const { productId } = req.params;

    // 🔒 Перевірка: чи передано хоча б одне поле для оновлення
    if (Object.keys(req.body).length === 0) {
      throw createHttpError(400, 'No data provided for update');
    }

    // 🔐 Захист: видаляємо поле userId, якщо воно раптом прийшло в тілі запиту
    if ('userId' in req.body) {
      delete req.body.userId;
    }

    // Отримуємо userId із токена (через middleware authenticate)
    const userId = req.user._id;

    // Оновлюємо продукт через сервісну функцію:
    // перевіряється приналежність userId + виконується оновлення
    const updatedProduct = await updateProductService(productId, req.body, userId);

    // Якщо продукт не знайдено або не належить користувачу
    if (!updatedProduct) {
      throw createHttpError(404, 'Product not found');
    }

    // ✅ Якщо все успішно — повертаємо відповідь
    res.status(200).json({
      status: 200,
      message: 'Successfully patched a product!',
      data: updatedProduct,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProductController = async (req, res, next) => {
  try {
    // 1. Отримуємо productId з параметрів запиту
    const { productId } = req.params;

    // 2. Отримуємо userId з токена (middleware authenticate)
    const userId = req.user._id;

    // 3. Видаляємо продукт, якщо він належить користувачу
    const product = await deleteProduct(productId, userId);

    // 4. Якщо продукт не знайдено або не належить — помилка
    if (!product) {
      throw createHttpError(404, 'Product not found');
    }

    // 5. Повертаємо статус 204 (без тіла відповіді)
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};