import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // Adjust path if needed

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
  
        const authStore = useAuthStore.getState();
        await authStore.refreshAccessToken();

        return api(originalRequest);
      } catch (refreshError: any) {
        console.error('Token refresh failed:', refreshError?.response?.data || refreshError.message);
        
        // Logout on failure (clears store/cookies)
        useAuthStore.getState().logout();

      }
    }

    return Promise.reject(error);
  }
);