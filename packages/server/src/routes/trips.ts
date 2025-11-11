import express from 'express';
import { UserTripModel } from '../db/models/user-trip-model.js';
import { TripModel } from '../db/models/trip-model.js';
import { Trip, Trips } from '@my-travel-journal/common';
import { JourneyModel } from '../db/models/journey-model.js';
import expressAsyncHandler from 'express-async-handler';
import { LocationModel } from '../db/models/location-model.js';
import { joiMiddleware } from '../middlewares/joi.js';
import { Joi } from '../utils/joi.js';
import { respond, respondError } from '../utils/response.js';
import { StatusCodes } from 'http-status-codes';

export const tripsRouter = express.Router();

const getTrip = async (
  trip: TripModel,
  locationIds?: Set<string>,
): Promise<Trip> => {
  const internalLocationIds: Set<string> = new Set<string>();
  const journeys = (
    await JourneyModel.findAll({
      where: {
        tripId: trip.id,
      },
      raw: true,
    })
  ).map(journey => {
    internalLocationIds.add(journey.from);
    locationIds?.add(journey.from);
    if (journey.to != null) locationIds?.add(journey.to);
    return {
      from: journey.from,
      to: journey.to,
      date: journey.date.toISOString(),
    };
  });
  return {
    info: {
      id: trip.id.toString(),
      name: trip.name,
      year: trip.year,
    },
    locationIds: Array.from(internalLocationIds),
    journeys,
  };
};

const getLocations = async (locationIds?: Set<string>) => {
  const manualLocations = await LocationModel.findAll({
    ...(locationIds != null
      ? {
          where: {
            id: Array.from(locationIds).map(id => Number(id)),
          },
        }
      : null),
    raw: true,
  });
  const locationMap: Record<string, LocationModel> = {};
  for (const location of manualLocations) {
    locationMap[location.id] = location;
  }
  return locationMap;
};

tripsRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const includeAll = req.query.allLocations === 'true';
    const myTrips = (
      await UserTripModel.findAll({
        where: {
          email: req.email!,
        },
      })
    ).map(t => t.tripId);
    const trips = await TripModel.findAll({
      where: { id: myTrips },
      raw: true,
    });
    const result: Trips = {};
    const locationIds = new Set<string>();
    for (const trip of trips) {
      result[trip.id] = await getTrip(trip, locationIds);
    }
    respond(res, {
      locations: await getLocations(includeAll ? undefined : locationIds),
      trips: result,
    });
  }),
);

tripsRouter.get(
  '/:tripId',
  expressAsyncHandler(async (req, res) => {
    const includeAll = req.query.allLocations === 'true';
    const tripId = Number(req.params.tripId);
    const trip = await TripModel.findByPk(tripId);
    if (trip == null) {
      respondError(res, 'TRIP_NOT_FOUND');
      return;
    }
    const userTrip = await UserTripModel.findOne({
      where: {
        email: req.email!,
        tripId: tripId,
      },
    });
    if (userTrip == null) {
      respondError(res, 'FORBIDDEN', StatusCodes.FORBIDDEN);
      return;
    }
    const locationIds = new Set<string>();
    const result = await getTrip(trip, locationIds);
    respond(res, {
      locations: await getLocations(includeAll ? undefined : locationIds),
      trip: result,
    });
  }),
);

tripsRouter.post(
  '/',
  joiMiddleware(
    Joi.object().keys({
      name: Joi.string().required(),
      year: Joi.number().required().allow(null),
      journies: Joi.array()
        .items(
          Joi.object().keys({
            from: Joi.string().required(),
            to: Joi.string().allow(null),
            date: Joi.dateString().required(),
          }),
        )
        .required(),
    }),
  ),
  expressAsyncHandler(async (req, res) => {
    const body = req.body;
    const trip = await TripModel.create({
      name: body.name,
      year: body.year,
    });
    for (const journey of body.journies) {
      await JourneyModel.create({
        tripId: trip.id,
        from: journey.from,
        to: journey.to,
        date: new Date(journey.date),
      });
    }
    await UserTripModel.create({
      email: req.email!,
      tripId: trip.id,
    });
    respond(res, { id: trip.id.toString() });
  }),
);
