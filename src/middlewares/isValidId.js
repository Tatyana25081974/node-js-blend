// src/middlewares/isValidId.js 

import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export function isValidId(req, res, next) {
    if (isValidObjectId (req.params.productId) !== true) {
        return next(createHttpError.BadRequest("ID should be an ObjectID"));
    }
    
    next();

}