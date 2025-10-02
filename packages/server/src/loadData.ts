import fs from 'fs';
import path from 'path';
import { TripModel } from './db/models/trip-model';
import { PlaceModel } from './db/models/place-model';
import { JourneyModel } from './db/models/journey-model';
import { UserTripModel } from './db/models/user-trip-model';
import { logger } from './utils/logger';
import { Place } from '@my-travel-journal/common';

const processTrip = async (username: string, dataS: string) => {
  const { info, places, trips } = JSON.parse(dataS);
  const trip = {
    name: info.id,
    date: new Date(info.date),
  };
  const createdTrip = await TripModel.create(trip);
  const createdPlaces: Record<string, number> = {};
  const placesJson = Object.entries<Place>(places);
  for (const [key, placeJson] of placesJson) {
    const place = {
      name: placeJson.name || null,
      city: placeJson.city,
      country: placeJson.country,
      latitude: placeJson.coordinates.latitude,
      longitude: placeJson.coordinates.longitude,
      description: placeJson.description || null,
      tripId: createdTrip.id,
    };
    const createdPlace = await PlaceModel.create(place);
    createdPlaces[key] = createdPlace.id;
  }
  for (const journeyJson of trips) {
    const journey = {
      from: createdPlaces[journeyJson.from],
      to: createdPlaces[journeyJson.to],
      date: new Date(journeyJson.date),
      tripId: createdTrip.id,
    };
    await JourneyModel.create(journey);
  }

  const userTrip = {
    username: username,
    tripId: createdTrip.id,
  };
  await UserTripModel.create(userTrip);
};

export async function loadData(username: string, dirPath: string) {
  const filesAndDirs = fs.readdirSync(dirPath);

  for (const name of filesAndDirs) {
    const fullPath = path.join(dirPath, name);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively read subdirectory
      await loadData(username, fullPath);
    } else if (stat.isFile()) {
      // Read file content
      const content = fs.readFileSync(fullPath, 'utf8');
      await processTrip(username, content);
    }
  }
}

export const loadDataFromFolder = async (username: string) => {
  const pathFolder =
    'C:/Users/brite/Documents/workspaces/node/my-travel-journal/packages/client/places';
  logger.info(`Loading data from ${pathFolder} ...`);
  await loadData(username, pathFolder);
  logger.info(`Data has been loaded from ${pathFolder}`);
};
