import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from './slices/authSlice';
import expenseReducer from './slices/expenseSlice';
import aiReducer from './slices/aiSlice';
import uiReducer from './slices/uiSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    ai: aiReducer,
    ui: uiReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  })
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;