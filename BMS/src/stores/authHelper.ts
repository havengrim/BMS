import { api } from '@/lib/api';

export async function fetchCurrentUser(
  setUser: (user: any) => void,
  clearAuth: () => void,
  setLoading: (loading: boolean) => void,
  refreshToken: () => Promise<void>
) {
  setLoading(true);
  try {
    const res = await api.get('/api/auth/user/', { withCredentials: true });
    setUser(res.data);
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        await refreshToken();

        const res = await api.get('/api/auth/user/', { withCredentials: true });
        setUser(res.data);
      } catch (refreshError) {
        clearAuth();
      }
    } else {
      clearAuth();
    }
  } finally {
    setLoading(false);
  }
}