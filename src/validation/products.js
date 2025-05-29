import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Поле "name" має бути рядком',
      'string.empty': 'Поле "name" не може бути порожнім',
      'string.min': 'Поле "name" має містити щонайменше 3 символи',
      'string.max': 'Поле "name" має містити не більше 30 символів',
      'any.required': 'Поле "name" є обовʼязковим',
    }),

  price: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'Поле "price" має бути числом',
      'number.positive': 'Поле "price" має бути додатним числом',
      'any.required': 'Поле "price" є обовʼязковим',
    }),

  category: Joi.string()
    .valid('books', 'electronics', 'clothing', 'other')
    .required()
    .messages({
      'string.base': 'Поле "category" має бути рядком',
      'any.only': 'Поле "category" має містити одне з допустимих значень: books, electronics, clothing, other',
      'any.required': 'Поле "category" є обовʼязковим',
    }),

  description: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.base': 'Поле "description" має бути рядком',
      'string.max': 'Поле "description" не може містити більше 500 символів',
    }),
});
export const updatedProductSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    price: Joi.number().positive(),
    category: Joi.string().valid('books', 'electronics', 'clothing', 'other'),
    description: Joi.string().max(500),
});
