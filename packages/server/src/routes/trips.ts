import express from 'express';
import { UserTripModel } from '../db/models/user-trip-model';
import { TripModel } from '../db/models/trip-model';
import { Place, Trips } from '@my-travel-journal/common';
import { PlaceModel } from '../db/models/place-model';
import { JourneyModel } from '../db/models/journey-model';
import expressAsyncHandler from 'express-async-handler';

export const tripsRouter = express.Router();

tripsRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const myTrips = (
      await UserTripModel.findAll({
        where: {
          username: req.username!,
        },
      })
    ).map(t => t.tripId);
    const trips = await TripModel.findAll({
      where: { id: myTrips },
      raw: true,
    });
    const result: Trips = {};
    for (const trip of trips) {
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
      result[trip.id] = {
        info: {
          id: trip.id,
          name: trip.name,
          date: trip.date,
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
          date: journey.date,
        })),
      };
    }
    res.json(result);
  }),
);
