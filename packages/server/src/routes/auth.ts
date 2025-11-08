import express from 'express';
import { joiMiddleware } from '../middlewares/joi.js';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { environment } from '../env/environment.js';
import { UserModel } from '../db/models/user-model.js';
import { StatusCodes } from 'http-status-codes';
import expressAsyncHandler from 'express-async-handler';
import { claimNonce, verifyLogin } from '../crypto/hmac.js';
import { decryptPassword } from '../crypto/rsa.js';
import { logger } from '../utils/logger.js';
import { authMiddleware } from '../middlewares/auth.js';

export const authRouter = express.Router();

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(3).required(),
});

authRouter.post(
  '/login/:nonce',
  joiMiddleware(loginSchema),
  expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findByPk(`${req.body.username}`);
    if (user != null) {
      const verificationResult = verifyLogin(
        user.username,
        user.password,
        req.body.password,
        req.params.nonce,
      );
      if (!verificationResult) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: false,
          error: 'UNAUTHORIZED',
        });
        return;
      }
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
        status: false,
        error: 'UNAUTHORIZED',
      });
    }
  }),
);

authRouter.post(
  '/signup/:nonce',
  joiMiddleware(loginSchema),
  expressAsyncHandler(async (req, res) => {
    const activeNonce = claimNonce(req.params.nonce);
    if (activeNonce == null || activeNonce.privateKey == null) {
      res
        .json({
          status: false,
          error: 'BAD_REQUEST',
        })
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const decryptedPassword = decryptPassword(
      activeNonce.privateKey,
      req.body.password,
    );
    const user = await UserModel.findByPk(req.body.username);
    if (user != null) {
      res
        .json({
          status: false,
          error: 'USER_ALREADY_EXISTS',
        })
        .status(StatusCodes.INTERNAL_SERVER_ERROR);
      return;
    }
    await UserModel.create({
      username: req.body.username,
      password: decryptedPassword,
    });
    logger.info(`${req.body.username} signed up`);
    res.json({ status: true }).status(StatusCodes.OK);
  }),
);

authRouter.get(
  '/me',
  expressAsyncHandler(authMiddleware),
  expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findByPk(req.username, {
      raw: true,
    });
    if (user == null) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        error: 'UNAUTHORIZED',
      });
      return;
    }
    res.json({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }),
);
