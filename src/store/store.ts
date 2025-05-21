
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import itemsReducer from './slices/itemsSlice';
import costsReducer from './slices/costsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    costs: costsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
