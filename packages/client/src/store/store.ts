import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './slices/loading';
import tripsReducer from './slices/trips';
import sessionSlice from './slices/session';

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    trips: tripsReducer,
    session: sessionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
