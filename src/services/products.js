import createHttpError from 'http-errors'; //для створення помилок
import { Product } from '../db/models/productModel.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';



export const getAllProducts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const productsQuery = Product.find(); // пошук всіх продуктів

  const totalItems = await Product.find() //
    .merge(productsQuery) // метод копіює фільтри з productsQuery у поточний запит.
    .countDocuments(); //Рахує, скільки документів знайдено, враховуючи фільтри.

  const products = await productsQuery
  .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(totalItems, perPage, page);

  return {
    data: products,
    ...paginationData,
  };
};

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