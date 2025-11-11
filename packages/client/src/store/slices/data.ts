import { Locations, Trips } from '@my-travel-journal/common';
import { createSlice } from '@reduxjs/toolkit';

const initialState: { locations: Locations; trips: Trips; tripsForMap: Trips } =
  {
    locations: {},
    trips: {},
    tripsForMap: {},
  };

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setLocations: (state, action) => {
      state.locations = action.payload;
    },
    setTrips: (state, action) => {
      state.trips = action.payload;
    },
    setTripsForMap: (state, action) => {
      state.tripsForMap = action.payload;
    },
  },
});

export const { setLocations, setTrips, setTripsForMap } = tripsSlice.actions;
export default tripsSlice.reducer;
