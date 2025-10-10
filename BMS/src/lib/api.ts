import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // For HttpOnly refresh cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Refresh access token (store updates access/user)
        await useAuthStore.getState().refreshAccessToken();

        // Retry original request (interceptor adds new token)
        return api(originalRequest);
      } catch (refreshError: any) {
        console.error(
          'Token refresh failed:',
          refreshError?.response?.data || refreshError.message
        );
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);
