import { Locations, Trip, Trips } from '@my-travel-journal/common';
import { callAPI } from './helper';

export const getTrips = () =>
  callAPI<{ locations: Locations; trips: Trips }>('GET', '/trips');

export const getTrip = async (tripId: string, allLocations?: boolean) =>
  callAPI<{ locations: Locations; trip: Trip }>('GET', `/trips/${tripId}`, {
    queryParams: {
      allLocations: (allLocations === true).toString(),
    },
  });
