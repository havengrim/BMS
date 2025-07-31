import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/auth';
import { api } from '@/lib/api';
import Cookies from 'js-cookie';

type AuthState = {
  [x: string]: any;
  user: User | null;
  token: string | null;
  
  setUser: (user: User) => void;
  clearAuth: () => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
  
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: Cookies.get('access_token') || null,

      setUser: (user) => set({ user }),

      clearAuth: () => {
        set({ user: null, token: null });
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
      },

      logout: () => {
        set({ user: null, token: null });
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        
      },

      refreshToken: async () => {
        try {
          const res = await api.post('/api/token/refresh/', null, { withCredentials: true });

          const accessToken = res.data?.access || Cookies.get('access_token');
          if (accessToken) {
            Cookies.set('access_token', accessToken, { expires: 1 / 24 });
            set({ token: accessToken });
          }

          const userRes = await api.get('/api/auth/user/', { withCredentials: true });
          set({ user: userRes.data });
        } catch (error) {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }), // only persist these
    }
  )
);
