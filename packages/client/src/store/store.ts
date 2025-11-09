import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './slices/loading';
import tripsReducer from './slices/data';
import sessionSlice from './slices/session';
import navigationSlice from './slices/navigation';

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    trips: tripsReducer,
    session: sessionSlice,
    navigation: navigationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
