import { createSlice } from '@reduxjs/toolkit';

const initialState: { isSideBarOpen: boolean } = {
  isSideBarOpen: false,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    toggleSideBar: state => {
      state.isSideBarOpen = !state.isSideBarOpen;
    },
  },
});

export const { toggleSideBar } = navigationSlice.actions;
export default navigationSlice.reducer;
