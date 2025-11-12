import { createSlice } from '@reduxjs/toolkit';

export type Me = {
  email: string;
  firstName: string;
  lastName: string;
};

const initialState: { me: Me | null } = {
  me: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setMe: (state, action) => {
      state.me = action.payload;
    },
    clearSession: state => {
      state.me = null;
    },
  },
});

export const { setMe, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
