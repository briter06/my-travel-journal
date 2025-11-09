import { Journey } from './journey.js';
import { Place } from './place.js';

export type Trip = {
  info: {
    id: number;
    name: string;
    date?: string;
  };
  places: Record<number, Place>;
  journeys: Journey[];
};

export type Trips = Record<number, Trip>;
