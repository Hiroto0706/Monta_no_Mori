// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import imagesReducer from './slice';

const store = configureStore({
  reducer: {
    images: imagesReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export default store;
