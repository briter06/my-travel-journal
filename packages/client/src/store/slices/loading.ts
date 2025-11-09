import { createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from '../hooks';

const initialState: { loadingProcesses: Record<string, boolean> } = {
  loadingProcesses: {},
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state, action) => {
      state.loadingProcesses[action.payload] = true;
    },
    stopLoading: (state, action) => {
      delete state.loadingProcesses[action.payload];
    },
  },
});

export const isLoading = () =>
  useAppSelector(
    state => Object.keys(state.loading.loadingProcesses).length > 0,
  );

export const { startLoading, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
