import express from 'express';
import { getProductsController } from '../controllers/products.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';



const router = express.Router();

router.get('/', ctrlWrapper(getProductsController));



export default router;
