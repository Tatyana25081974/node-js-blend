import { Product } from '../models/productModel.js';

export async function getAllProducts() {
  const products = await Product.find();
  return products;
}
