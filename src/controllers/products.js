import { getAllProducts } from '../services/products.js';

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

