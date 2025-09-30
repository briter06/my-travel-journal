import express from 'express';

export const placesRouter = express.Router();

placesRouter.get('/', (_req, res) => {
  res.json({
    places: [],
  });
});
