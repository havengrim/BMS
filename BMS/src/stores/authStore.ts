import { create } from "zustand";


export type UserProfile = {
  name: string;
  contact_number: string;
  address: string;
  civil_status: string;
  birthdate: string;
  role: string;
  image?: string | null;
};

export type User = {
  id: number;
  username: string;
  email: string;
  profile?: UserProfile | null;
};

export type AuthState = {
  user: User | null;
  // You might not need to store tokens if using HttpOnly cookies for security
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  // Since cookies are HttpOnly, js-cookie won't see them. You can set null here initially.
  accessToken: null,
  refreshToken: null,
  setTokens: (access, refresh) => {
    // If you want to store tokens in non-HttpOnly cookies (not recommended), you can set them here.
    // Otherwise, your backend manages tokens via HttpOnly cookies.

    console.log("setTokens called, but tokens stored server-side in HttpOnly cookies");

    // Optionally save tokens in store if you get them from somewhere else:
    set({ accessToken: access, refreshToken: refresh });
  },
  setUser: (user) => set({ user }),
  clearAuth: () => {
    // Call your backend logout endpoint to clear HttpOnly cookies if you have one
    // Here just clear user state and tokens in store
    set({ user: null, accessToken: null, refreshToken: null });
  },
  logout: () => {
    // Same as clearAuth or call logout API
    set({ user: null, accessToken: null, refreshToken: null });
  },
}));
