import expressAsyncHandler from 'express-async-handler';
import { authMiddleware } from './middlewares/auth.js';
import { authRouter } from './routes/auth.js';
import { tripsRouter } from './routes/trips.js';
import express from 'express';
import { cryptoRouter } from './routes/crypto.js';

export const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.use('/auth', authRouter);
apiRouter.use('/crypto', cryptoRouter);
apiRouter.use('/trips', expressAsyncHandler(authMiddleware), tripsRouter);
