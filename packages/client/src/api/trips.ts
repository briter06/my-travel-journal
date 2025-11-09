import axios from 'axios';
import { environment } from '../env/environment';
import { Trips } from '@my-travel-journal/common';

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
