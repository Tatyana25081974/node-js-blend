import { getAllProducts, getProductById, createProduct, updateProductService, deleteProduct } from '../services/products.js';
import createHttpError from 'http-errors';
export const getProductsController = async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found products!',
      data: products,
    });
  } catch (err) {
    next(err); // передаємо помилку до errorHandler
  }
};



// Контролер для отримання одного продукту за ID
export const getProductByIdController = async (req, res, next) => {
  try {
    // 1. Отримуємо ідентифікатор з URL (наприклад: /products/abc123)
    const { productId } = req.params;

    // 2. Викликаємо сервіс, який звертається до бази MongoDB
    const product = await getProductById(productId);

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
    const product = await createProduct(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a product!',
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProductController = async (req, res) => {
  const { productId } = req.params; //отримуємо ідентифікатор продукту
  const updateData = req.body; //отримуємо дані для оновленя

  const updatedProduct = await updateProductService(productId, updateData);

  res.status(200).json({
    status: 200,
    message: "Successfully patched a product!",
    data: updatedProduct,
  });
};

export const deleteProductController = async (req, res, next) => {
  const { productId } = req.params;

  const product = await deleteProduct(productId);

  if (!product) {
    next(createHttpError(404, 'Product not found'));
    return;
  }

  res.status(204).send(); // OK, без тіла відповіді
};