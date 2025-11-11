import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { respondError } from '../utils/response.js';

export const joiMiddleware =
  (joiSchema: Joi.Schema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const result = joiSchema.validate(body);
    if (result.error != null) {
      respondError(res, result.error.message, StatusCodes.BAD_REQUEST);
    } else {
      req.body = result.value;
      next();
    }
  };
