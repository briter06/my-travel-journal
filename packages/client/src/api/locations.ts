import { Locations } from '@my-travel-journal/common';
import { callAPI } from './helper';

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

export const getMyLocations = () =>
  callAPI<{ locations: Locations }>('GET', '/locations');

export const getMyCountries = () =>
  callAPI<{ countries: string[] }>('GET', '/locations/countries');

export const createLocation = (data: LocationAPIData) =>
  callAPI<{ id: string }>('POST', '/locations', { payload: data });
