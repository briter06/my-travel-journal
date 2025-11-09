import express from 'express';
import { UserTripModel } from '../db/models/user-trip-model.js';
import { TripModel } from '../db/models/trip-model.js';
import { Place, Trips } from '@my-travel-journal/common';
import { PlaceModel } from '../db/models/place-model.js';
import { JourneyModel } from '../db/models/journey-model.js';
import expressAsyncHandler from 'express-async-handler';

export const tripsRouter = express.Router();

const getTrip = async (trip: TripModel) => {
  const places: Record<number, Place> = {};
  const queriedPlaces = await PlaceModel.findAll({
    where: {
      tripId: trip.id,
    },
    raw: true,
  });
  for (const place of queriedPlaces) {
    places[place.id] = {
      name: place.name,
      city: place.city,
      country: place.country,
      coordinates: {
        latitude: place.latitude,
        longitude: place.longitude,
      },
      description: place.description,
    };
  }
  return {
    info: {
      id: trip.id,
      name: trip.name,
      date: trip.date?.toISOString(),
    },
    places: places,
    journeys: (
      await JourneyModel.findAll({
        where: {
          tripId: trip.id,
        },
        raw: true,
      })
    ).map(journey => ({
      from: journey.from,
      to: journey.to,
      date: journey.date.toISOString(),
    })),
  };
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
    for (const trip of trips) {
      result[trip.id] = await getTrip(trip);
    }
    res.json({
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
    const result = await getTrip(trip);
    res.json({
      trip: result,
    });
  }),
);
