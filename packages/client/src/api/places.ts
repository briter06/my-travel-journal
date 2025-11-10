import axios from 'axios';
import { environment } from '../env/environment';
import { Places } from '@my-travel-journal/common';

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

export const getAllCountries = async (): Promise<{
  countries: string[];
} | null> => {
  try {
    const result = await axios.get(
      `${environment.apiUrl}/places/countries/all`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );
    return result.data as { countries: string[] };
  } catch (_err) {
    return null;
  }
};
