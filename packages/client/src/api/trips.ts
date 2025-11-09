import axios from 'axios';
import { environment } from '../env/environment';
import { Places, Trip, Trips } from '@my-travel-journal/common';

export const getTrips = async (): Promise<{
  places: Places;
  trips: Trips;
} | null> => {
  try {
    const result = await axios.get(`${environment.apiUrl}/trips`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return result.data as { places: Places; trips: Trips };
  } catch (_err) {
    return null;
  }
};

export const getTrip = async (
  tripId: string,
): Promise<{ places: Places; trip: Trip } | null> => {
  try {
    const result = await axios.get(`${environment.apiUrl}/trips/${tripId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return result.data as { places: Places; trip: Trip };
  } catch (_err) {
    return null;
  }
};

export const getAllPlaces = async (): Promise<{ places: Places } | null> => {
  try {
    const result = await axios.get(`${environment.apiUrl}/places/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return result.data as { places: Places };
  } catch (_err) {
    return null;
  }
};
