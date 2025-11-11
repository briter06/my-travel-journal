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
import { respond, respondError } from '../utils/response.js';

export const authRouter = express.Router();

const loginSchema = Joi.object({
  email: Joi.string().email().min(3).max(30).required(),
  password: Joi.string().min(3).required(),
});

const signUpSchema = Joi.object({
  email: Joi.string().email().min(3).max(30).required(),
  password: Joi.string().min(3).required(),
  firstName: Joi.string().min(3).max(50).required(),
  lastName: Joi.string().min(3).max(50).required(),
});

authRouter.post(
  '/login/:nonce',
  joiMiddleware(loginSchema),
  expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findByPk(`${req.body.email}`);
    if (user != null) {
      const verificationResult = verifyLogin(
        user.email,
        user.password,
        req.body.password,
        req.params.nonce,
      );
      if (!verificationResult) {
        respondError(res, 'UNAUTHORIZED', StatusCodes.UNAUTHORIZED);
        return;
      }
      respond(res, {
        token: jwt.sign(
          {
            email: user.email,
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
      respondError(res, 'UNAUTHORIZED', StatusCodes.UNAUTHORIZED);
    }
  }),
);

authRouter.post(
  '/signup/:nonce',
  joiMiddleware(signUpSchema),
  expressAsyncHandler(async (req, res) => {
    const activeNonce = claimNonce(req.params.nonce);
    if (activeNonce == null || activeNonce.privateKey == null) {
      respondError(res, 'BAD_REQUEST', StatusCodes.BAD_REQUEST);
      return;
    }
    const decryptedPassword = decryptPassword(
      activeNonce.privateKey,
      req.body.password,
    );
    const user = await UserModel.findByPk(req.body.email);
    if (user != null) {
      respondError(res, 'USER_ALREADY_EXISTS', StatusCodes.CONFLICT);
      return;
    }
    await UserModel.create({
      email: req.body.email,
      password: decryptedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    logger.info(`${req.body.email} signed up`);
    respond(res);
  }),
);

authRouter.get(
  '/me',
  expressAsyncHandler(authMiddleware),
  expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findByPk(req.email, {
      raw: true,
    });
    if (user == null) {
      respondError(res, 'UNAUTHORIZED', StatusCodes.UNAUTHORIZED);
      return;
    }
    respond(res, {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }),
);
