import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { sequelize } from '../db/init.js';
import { joiMiddleware } from '../middlewares/joi.js';
import Joi from 'joi';
import { LOCATION_TYPES, LocationModel } from '../db/models/location-model.js';
import { v4 } from 'uuid';
import { respond } from '../utils/response.js';

export const locationsRouter = express.Router();

const makeLocationMap = (locations: LocationModel[]) => {
  const locationMap: Record<string, LocationModel> = {};
  for (const loc of locations) {
    locationMap[loc.id] = loc;
  }
  return locationMap;
};

locationsRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const myLocations = makeLocationMap(
      await LocationModel.findAll({
        where: {
          owner: req.email!,
        },
        raw: true,
      }),
    );
    respond(res, {
      locations: myLocations,
    });
  }),
);

locationsRouter.get(
  '/countries',
  expressAsyncHandler(async (req, res) => {
    const countries = await LocationModel.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('country')), 'country'],
      ],
      where: {
        owner: req.email!,
      },
      raw: true,
    });
    respond(res, {
      countries: countries.map(c => c.country),
    });
  }),
);

locationsRouter.post(
  '/',
  joiMiddleware(
    Joi.object({
      country: Joi.string().required(),
      locality: Joi.string().required(),
      name: Joi.string().required().allow(null),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      type: Joi.number()
        .required()
        .valid(...Object.values(LOCATION_TYPES)),
    }),
  ),
  expressAsyncHandler(async (req, res) => {
    const body = req.body;
    const locationId = `internal_mwt_${v4()}`;
    await LocationModel.create({
      id: locationId,
      country: body.country,
      locality: body.locality,
      name: body.name,
      latitude: body.latitude,
      longitude: body.longitude,
      type: body.type,
      owner: body.type === LOCATION_TYPES.MANUAL ? req.email! : null,
    });
    respond(res, { id: locationId });
  }),
);
