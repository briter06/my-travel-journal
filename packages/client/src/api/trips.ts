import axios from 'axios';
import { environment } from '../env/environment';
import { Trip, Trips } from '@my-travel-journal/common';

export const getTrips = async (): Promise<{ trips: Trips } | null> => {
  try {
    const result = await axios.get(`${environment.apiUrl}/trips`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return result.data as { trips: Trips };
  } catch (err) {
    return null;
  }
};

export const getTrip = async (
  tripId: string,
): Promise<{ trip: Trip } | null> => {
  try {
    const result = await axios.get(`${environment.apiUrl}/trips/${tripId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return result.data as { trip: Trip };
  } catch (err) {
    return null;
  }
};
