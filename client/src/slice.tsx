// src/store/slices/imagesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserImage } from './pages/Content/Home/Home';

interface ImagesState {
  images: UserImage[];
}

const initialState: ImagesState = {
  images: [],
};

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<UserImage[]>) => {
      console.log(action.payload)
      state.images = action.payload;
    },
  },
});

export const { setImages } = imagesSlice.actions;
export default imagesSlice.reducer;
