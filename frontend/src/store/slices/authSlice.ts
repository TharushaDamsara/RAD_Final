import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterData, User } from '../../types';
import { authService } from '../../services/authService';
const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null
};
export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);

      // save tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      return response.data; // ✅ payload
    } catch (error: any) {
      // Make sure it's always a string
      const message =
        error.response?.data?.message || error.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, {
  rejectWithValue
}) => {
  try {
    const response = await authService.getCurrentUser();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch user');
  }
});
export const updateProfile = createAsyncThunk('auth/updateProfile', async (data: Partial<User>, {
  rejectWithValue
}) => {
  try {
    const response = await authService.updateProfile(data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Update failed');
  }
});
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      authService.logout();
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    clearError: state => {
      state.error = null;
    }
  },
  extraReducers: builder => {
    // Register
    builder.addCase(register.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    }).addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(login.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    }).addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get Current User
    builder.addCase(getCurrentUser.pending, state => {
      state.loading = true;
    }).addCase(getCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    }).addCase(getCurrentUser.rejected, state => {
      state.loading = false;
      state.isAuthenticated = false;
      state.accessToken = null;
    });

    // Update Profile
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  }
});
export const {
  logout,
  clearError
} = authSlice.actions;
export default authSlice.reducer;