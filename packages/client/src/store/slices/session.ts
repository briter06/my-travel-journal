import { createSlice } from '@reduxjs/toolkit';

export type Me = {
  username: string;
  firstName: string;
  lastName: string;
};

const initialState: { isLoggedIn: boolean; me: Me | null } = {
  isLoggedIn: false,
  me: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setMe: (state, action) => {
      state.me = action.payload;
    },
    clearSession: state => {
      state.isLoggedIn = false;
      state.me = null;
    },
  },
});

export const { setIsLoggedIn, setMe, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
