import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  user: null,
};

// Create a slice for authentication
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Set user data from decoded token
    },

    clearUser: (state) => {
      state.user = null; // Clear user data
    },
  },
});

// Export actions
export const { setUser, clearUser } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;