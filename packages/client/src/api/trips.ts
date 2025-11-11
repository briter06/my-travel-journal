import axios from 'axios';
import { environment } from '../env/environment';
import { Locations, Trip, Trips } from '@my-travel-journal/common';

export const getTrips = async (): Promise<{
  locations: Locations;
  trips: Trips;
} | null> => {
  try {
    const result = await axios.get(`${environment.apiUrl}/trips`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return result.data as { locations: Locations; trips: Trips };
  } catch (_err) {
    return null;
  }
};

export const getTrip = async (
  tripId: string,
  allLocations?: boolean,
): Promise<{ locations: Locations; trip: Trip } | null> => {
  try {
    const result = await axios.get(
      `${environment.apiUrl}/trips/${tripId}${allLocations === true ? '?allLocations=true' : ''}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );
    return result.data as { locations: Locations; trip: Trip };
  } catch (_err) {
    return null;
  }
};
