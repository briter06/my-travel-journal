import { createSlice } from '@reduxjs/toolkit';

const initialState: { isLoggedIn: boolean; username: string } = {
  isLoggedIn: false,
  username: '',
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    clearSession: state => {
      state.isLoggedIn = false;
      state.username = '';
    },
  },
});

export const { setIsLoggedIn, setUsername, clearSession } =
  sessionSlice.actions;
export default sessionSlice.reducer;
