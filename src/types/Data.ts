import { Moment } from "moment";
import { Place, Trip } from "./Place";

export type Data = Record<
  string,
  {
    info: {
      id: string
      date?: Moment
    }
    places: Record<string, Place>;
    trips: Trip[];
    color: string
  }
>;
