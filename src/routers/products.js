import express from 'express';
import { getProductsController, getProductByIdController, createProductController, updateProductController } from '../controllers/products.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';



const router = express.Router();

router.get('/', ctrlWrapper(getProductsController));
router.get('/:productId', ctrlWrapper(getProductByIdController)); // GET /products/:productId
router.post('/', ctrlWrapper(createProductController)); // ← новий POST роут
router.patch('/:productId', ctrlWrapper(updateProductController));
export default router;
