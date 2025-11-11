export type Location = {
  id: string;
  name: string | null;
  locality: string;
  country: string;
  latitude: string;
  longitude: string;
};

export type Locations = Record<string, Location>;
