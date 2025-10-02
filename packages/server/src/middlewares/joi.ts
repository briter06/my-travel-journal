import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
export const joiMiddleware =
  (joiSchema: Joi.Schema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const result = joiSchema.validate(body);
    if (result.error != null) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: result.error.message,
      });
    } else {
      req.body = result.value;
      next();
    }
  };
