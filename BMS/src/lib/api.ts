import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // adjust if path is different

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle automatic token refresh
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
        // Call refresh token endpoint — refresh token is in HttpOnly cookie
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
          {},
          { withCredentials: true }
        );

        // Retry original request after refreshing the token
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        useAuthStore.getState().logout(); // Optional: reset store or redirect to login
      }
    }

    return Promise.reject(error);
  }
);
