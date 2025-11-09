import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { environment } from '../env/environment.js';
import { UserModel } from '../db/models/user-model.js';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (authHeader != null && authHeader !== '') {
    const token = authHeader.split(' ')[1];
    let user;
    let email;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = jwt.verify(token, environment.JWT_SECRET);
      email = result.email;
      user = await UserModel.findByPk(email);
    } catch (_err) {
      user = null;
    }
    if (user == null) {
      res.status(StatusCodes.FORBIDDEN).json({
        error: 'FORBIDDEN',
      });
    } else {
      req.email = email;
      next();
    }
  } else {
    res.status(StatusCodes.FORBIDDEN).json({
      error: 'FORBIDDEN',
    });
  }
};
