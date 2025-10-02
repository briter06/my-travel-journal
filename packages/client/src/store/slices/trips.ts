import { Trips } from '@my-travel-journal/common';
import { createSlice } from '@reduxjs/toolkit';

const initialState: { trips: Trips; tripsForMap: Trips } = {
  trips: {},
  tripsForMap: {},
};

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setTrips: (state, action) => {
      state.trips = action.payload;
    },
    setTripsForMap: (state, action) => {
      state.tripsForMap = action.payload;
    },
  },
});

export const { setTrips, setTripsForMap } = tripsSlice.actions;
export default tripsSlice.reducer;
