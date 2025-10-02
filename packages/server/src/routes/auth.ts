import express from 'express';
import { joiMiddleware } from '../middlewares/joi.js';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { environment } from '../env/environment.js';
import { UserModel } from '../db/models/user-model.js';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';

export const authRouter = express.Router();

authRouter.post(
  '/login',
  joiMiddleware(
    Joi.object().keys({
      username: Joi.string().required(),
    }),
  ),
  expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findByPk(`${req.body.username}`);
    if (user != null) {
      res.json({
        token: jwt.sign(
          {
            username: user.username,
          },
          environment.JWT_SECRET,
          {
            ...(environment.JWT_EXPIRES_IN && {
              expiresIn: environment.JWT_EXPIRES_IN,
            }),
          },
        ),
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'UNAUTHORIZED',
      });
    }
  }),
);
