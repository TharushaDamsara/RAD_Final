import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, Toast } from '../../types';
const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light',
  toasts: [],
  modal: {
    open: false,
    content: null
  }
};
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    showToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Date.now().toString();
      state.toasts.push({
        ...action.payload,
        id
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    openModal: (state, action: PayloadAction<any>) => {
      state.modal = {
        open: true,
        content: action.payload
      };
    },
    closeModal: state => {
      state.modal = {
        open: false,
        content: null
      };
    }
  }
});
export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  showToast,
  removeToast,
  openModal,
  closeModal
} = uiSlice.actions;
export default uiSlice.reducer;