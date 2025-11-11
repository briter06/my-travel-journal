import { Journey } from './journey.js';

export type Trip = {
  info: {
    id: string;
    name: string;
    year: string | null;
  };
  locationIds: string[];
  journeys: Journey[];
};

export type Trips = Record<string, Trip>;
