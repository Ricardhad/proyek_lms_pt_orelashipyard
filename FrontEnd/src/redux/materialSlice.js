// materialSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courseID: '',
  mentorID: '',
  gambar: null,        // Store image path
  imagePreview: null,  // For UI preview
  namaModul: '',
  Deskripsi: '',
  Deadline: ''
};

const materialSlice = createSlice({
  name: 'material',
  initialState,
  reducers: {
    setMaterial: (state, action) => {
      return { ...state, ...action.payload };
    },
    setGambar: (state, action) => {
      state.gambar = action.payload.path;
      state.imagePreview = action.payload.preview;
    },
    clearMaterial: () => initialState
  }
});

export const { 
  setMaterial, 
  setGambar, 
  clearMaterial 
} = materialSlice.actions;

// Selectors
export const selectMaterial = (state) => state.material;

export default materialSlice.reducer;