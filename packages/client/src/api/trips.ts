import axios from 'axios';
import { environment } from '../env/environment';
import { Trips } from '@my-travel-journal/common';

type GetTripsResult = {
  username: string;
  trips: Trips;
};

export const getTrips = async (): Promise<GetTripsResult | null> => {
  try {
    const result = await axios.get(`${environment.apiUrl}/trips`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return result.data as GetTripsResult;
  } catch (err) {
    return null;
  }
};
