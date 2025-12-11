import axios, { AxiosInstance, AxiosError } from 'axios';

// Use import.meta.env for Vite-based builds, or fallback to hardcoded value
const API_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL ? import.meta.env.VITE_API_URL : 'http://localhost:5000/api';
class ApiService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(config => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, error => Promise.reject(error));

    // Response interceptor for error handling
    this.api.interceptors.response.use(response => response, async (error: AxiosError<any>) => {
      if (error.response?.status === 401) {
        // Token expired, clear auth and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    });
  }
  getInstance(): AxiosInstance {
    return this.api;
  }
}
export const apiService = new ApiService();
export const api = apiService.getInstance();