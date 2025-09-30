import { placesRouter } from './routes/places';
import express from 'express';

export const apiRouter = express.Router();

apiRouter.use(express.json());

apiRouter.use('/places', placesRouter);
