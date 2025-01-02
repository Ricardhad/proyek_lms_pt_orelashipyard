import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Import the auth slice

const store = configureStore({
  reducer: {
    auth: authReducer, // Add the auth reducer
  },
});

export default store;