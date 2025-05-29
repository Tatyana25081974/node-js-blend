import express from 'express';
import { getProductsController, getProductByIdController, createProductController, updateProductController, deleteProductController } from '../controllers/products.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createProductSchema } from '../validation/products.js';
import { updatedProductSchema } from '../validation/products.js'; 
import { isValidId } from '../middlewares/isValidId.js';

const router = express.Router();

router.get('/', ctrlWrapper(getProductsController));
router.get('/:productId', isValidId,ctrlWrapper(getProductByIdController)); // GET /products/:productId
router.post('/', validateBody(createProductSchema), ctrlWrapper(createProductController)); // ← новий POST роут
router.patch('/:productId',isValidId, validateBody(updatedProductSchema), ctrlWrapper(updateProductController));
router.delete('/:productId',isValidId, ctrlWrapper(deleteProductController));


export default router;
