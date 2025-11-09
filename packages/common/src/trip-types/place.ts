export type Place = {
  id: number;
  name: string | null;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
};

export type Places = Record<number, Place>;
