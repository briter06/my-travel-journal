import express from 'express';
import { Place } from '@my-travel-journal/common';
import expressAsyncHandler from 'express-async-handler';
import { sequelize } from '../db/init.js';
import { QueryTypes } from 'sequelize';
import { PlaceModel } from '../db/models/place-model.js';

export const placesRouter = express.Router();

const getMyPlaces = (email: string, specificFields?: string) =>
  sequelize.query<Place>(
    `
    SELECT DISTINCT ${specificFields ?? 'p.id, p.name, p.city, p.country, p.latitude, p.longitude'} 
    FROM places p, trips t, journeys j, users u, \`user-trip\` ut 
    WHERE u.email = ut.email
    AND ut.tripId = t.id
    AND t.id = j.tripId
    AND (j.\`from\` = p.id OR j.to = p.id)
    AND u.email = :email
    `,
    {
      replacements: { email },
      type: QueryTypes.SELECT,
    },
  );

placesRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const myPlaces = await getMyPlaces(req.email!);
    res.json({
      places: myPlaces,
    });
  }),
);

placesRouter.get(
  '/all',
  expressAsyncHandler(async (_req, res) => {
    const places = await PlaceModel.findAll({
      raw: true,
    });
    res.json({
      places: places,
    });
  }),
);

placesRouter.get(
  '/countries',
  expressAsyncHandler(async (req, res) => {
    const countries = await getMyPlaces(req.email!, 'p.country as country');
    res.json({
      countries: countries.map(c => c.country),
    });
  }),
);

placesRouter.get(
  '/countries/all',
  expressAsyncHandler(async (_req, res) => {
    const countries = await PlaceModel.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('country')), 'country'],
      ],
      raw: true,
    });
    res.json({
      countries: countries.map(c => c.country),
    });
  }),
);
