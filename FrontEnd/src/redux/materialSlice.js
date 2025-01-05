// src/store/materialSlice.js
import { createSlice } from '@reduxjs/toolkit';

const materialSlice = createSlice({
  name: 'material',
  initialState: {
    title: '',
    description: '',
    deadline: '',
  },
  reducers: {
    setMaterial: (state, action) => {
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.deadline = action.payload.deadline;
    },
    clearMaterial: (state) => {
      state.title = '';
      state.description = '';
      state.deadline = '';
    },
  },
});

export const { setMaterial, clearMaterial } = materialSlice.actions;
export default materialSlice.reducer;