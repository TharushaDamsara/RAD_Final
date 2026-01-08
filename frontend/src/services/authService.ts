import { api } from './api';
import { LoginCredentials, RegisterData, User } from '../types';

interface AuthResponse {
  success: boolean;
  data: { user: User; accessToken: string; refreshToken: string };
}

export const authService = {
  register(data: RegisterData): Promise<AuthResponse> {
    return api.post('/auth/register', data).then(res => res.data);
  },

  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return api.post('/auth/login', credentials).then(res => res.data);
  },

  getCurrentUser(): Promise<{ success: boolean; data: User }> {
    return api.get('/auth/me').then(res => res.data);
  },

  updateProfile(data: Partial<User>): Promise<{ success: boolean; data: User }> {
    return api.put('/auth/profile', data).then(res => res.data);
  },

  changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return api.put('/auth/password', { currentPassword, newPassword }).then();
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
