import axios from 'axios';
import { environment } from '../env/environment';
import { Locations } from '@my-travel-journal/common';

export type LocationAPIData = {
  country: string;
  locality: string;
  name: string | null;
  latitude: number;
  longitude: number;
  type: number;
};

export const LOCATION_API_TYPES = {
  MANUAL: 1,
};

export const getMyLocations = async (): Promise<{
  locations: Locations;
} | null> => {
  try {
    const result = await axios.get(`${environment.apiUrl}/locations`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return result.data as { locations: Locations };
  } catch (_err) {
    return null;
  }
};

export const getMyCountries = async (): Promise<{
  countries: string[];
} | null> => {
  try {
    const result = await axios.get(
      `${environment.apiUrl}/locations/countries`,
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

export const createLocation = async (
  data: LocationAPIData,
): Promise<{ status: boolean; id: string }> => {
  try {
    const result = await axios.post(`${environment.apiUrl}/locations`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return result.data as { status: boolean; id: string };
  } catch (_err) {
    return { status: false, id: '' };
  }
};
