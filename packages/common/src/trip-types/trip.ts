import { Journey } from './journey.js';
import { Place } from './place.js';

export type Trip = {
  info: {
    id: number;
    name: string;
    date?: Date;
  };
  places: Record<number, Place>;
  journeys: Journey[];
  color?: string;
};

export type Trips = Record<number, Trip>;
