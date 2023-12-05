// src/store/slices/imagesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserImage } from "./pages/Content/Home/Home";

interface ImagesState {
  images: UserImage[];
  query: string | null;
}

const initialState: ImagesState = {
  images: [],
  query: null,
};

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<UserImage[]>) => {
      state.images = action.payload;
    },
    setSearchQueryParameter: (state, action: PayloadAction<string | null>) => {
      state.query = action.payload;
    },
  },
});

export const { setImages, setSearchQueryParameter } = imagesSlice.actions;
export default imagesSlice.reducer;
