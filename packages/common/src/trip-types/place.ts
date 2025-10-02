export type Place = {
  name: string | null;
  city: string;
  country: string;
  coordinates: Coordinates;
  description: string | null;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};
