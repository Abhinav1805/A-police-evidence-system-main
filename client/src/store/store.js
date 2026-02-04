import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import evidenceReducer from './slices/evidenceSlice';
import userReducer from './slices/userSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    evidence: evidenceReducer,
    users: userReducer,
    theme: themeReducer,
  },
});