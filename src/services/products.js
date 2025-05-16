import createHttpError from 'http-errors'; //для створення помилок
import { Product } from '../db/models/productModel.js';


export async function getAllProducts() {
  const products = await Product.find();
  return products;
}

export const getProductById = async (productId) => {
  const product = await Product.findById(productId); //пошук продукту за id

  if (!product) {
    throw createHttpError(404, 'Product not found');
  }

  return product;
};

export const createProduct = async (data) => {
  const newProduct = await Product.create(data);
  return newProduct;
};

export const updateProductService = async (productId, updateData) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    throw createHttpError(404, 'Product not found');
  }

  return updatedProduct;
};



export const deleteProduct = async (productId) => {
  const product = await Product.findOneAndDelete({ _id: productId });
  return product; // якщо null — контролер сам обробить
};