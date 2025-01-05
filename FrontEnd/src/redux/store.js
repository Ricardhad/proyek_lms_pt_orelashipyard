import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Import the auth slice
import materialReducer from './materialSlice';
const store = configureStore({
  reducer: {
    auth: authReducer, // Add the auth reducer
    material: materialReducer,
  },
});

export default store;