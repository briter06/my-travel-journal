import { Journey } from './journey.js';

export type Trip = {
  info: {
    id: number;
    name: string;
    year: string | null;
  };
  placeIds: number[];
  journeys: Journey[];
};

export type Trips = Record<number, Trip>;
