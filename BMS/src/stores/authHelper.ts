import { api } from '@/lib/api';
import type { User } from './useAccount';

export const fetchCurrentUser = async (
  setUser: (user: User) => void,
  clearAuth: () => void,
  setLoading: (loading: boolean) => void,
  refreshAccessToken: () => Promise<void>
) => {
  setLoading(true);
  try {
    // Use cookies/middleware; optional: add header from store
    const { data: user } = await api.get('/api/auth/user/', { 
      withCredentials: true,
      // headers: { Authorization: `Bearer ${useAuthStore.getState().accessToken}` },  // If not using middleware
    });
    setUser(user);
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        await refreshAccessToken();  // Auto-refresh
        // Retry fetch after refresh
        const { data: user } = await api.get('/api/auth/user/', { withCredentials: true });
        setUser(user);
      } catch (refreshErr) {
        clearAuth();
      }
    } else {
      clearAuth();
    }
  } finally {
    setLoading(false);
  }
};