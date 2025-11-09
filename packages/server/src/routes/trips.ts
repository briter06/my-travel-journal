import express from 'express';
import { UserTripModel } from '../db/models/user-trip-model.js';
import { TripModel } from '../db/models/trip-model.js';
import { Trip, Trips } from '@my-travel-journal/common';
import { PlaceModel } from '../db/models/place-model.js';
import { JourneyModel } from '../db/models/journey-model.js';
import expressAsyncHandler from 'express-async-handler';

export const tripsRouter = express.Router();

const getTrip = async (
  placeIds: Set<number>,
  trip: TripModel,
): Promise<Trip> => {
  const internalPlaceIds: Set<number> = new Set<number>();
  const journeys = (
    await JourneyModel.findAll({
      where: {
        tripId: trip.id,
      },
      raw: true,
    })
  ).map(journey => {
    placeIds.add(journey.from);
    internalPlaceIds.add(journey.from);
    if (journey.to != null) placeIds.add(journey.to);
    return {
      from: journey.from,
      to: journey.to,
      date: journey.date.toISOString(),
    };
  });
  return {
    info: {
      id: trip.id,
      name: trip.name,
      year: trip.year,
    },
    placeIds: Array.from(internalPlaceIds),
    journeys,
  };
};

const getPlaces = async (placeIds: Set<number>) => {
  const places = await PlaceModel.findAll({
    where: {
      id: Array.from(placeIds),
    },
    raw: true,
  });
  const placeMap: Record<number, PlaceModel> = {};
  for (const place of places) {
    placeMap[place.id] = place;
  }
  return placeMap;
};

tripsRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
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
    const placeIds = new Set<number>();
    for (const trip of trips) {
      result[trip.id] = await getTrip(placeIds, trip);
    }

    res.json({
      places: await getPlaces(placeIds),
      trips: result,
    });
  }),
);

tripsRouter.get(
  '/:tripId',
  expressAsyncHandler(async (req, res) => {
    const tripId = Number(req.params.tripId);
    const trip = await TripModel.findByPk(tripId);
    if (trip == null) {
      res.status(404).json({ message: 'Trip not found' });
      return;
    }
    const userTrip = await UserTripModel.findOne({
      where: {
        email: req.email!,
        tripId: tripId,
      },
    });
    if (userTrip == null) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    const placeIds = new Set<number>();
    const result = await getTrip(placeIds, trip);
    res.json({
      places: await getPlaces(placeIds),
      trip: result,
    });
  }),
);
