import { Places, Trips } from '@my-travel-journal/common';
import { createSlice } from '@reduxjs/toolkit';

const initialState: { places: Places; trips: Trips; tripsForMap: Trips } = {
  places: {},
  trips: {},
  tripsForMap: {},
};

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setPlaces: (state, action) => {
      state.places = action.payload;
    },
    setTrips: (state, action) => {
      state.trips = action.payload;
    },
    setTripsForMap: (state, action) => {
      state.tripsForMap = action.payload;
    },
  },
});

export const { setPlaces, setTrips, setTripsForMap } = tripsSlice.actions;
export default tripsSlice.reducer;
