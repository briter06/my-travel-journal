import { Place, Trip } from "./Place";

export type Data = Record<
  string,
  {
    places: Record<string, Place>;
    trips: Trip[];
    color: string
  }
>;
