import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { api as apiClient } from "@/lib/api"; // renamed to avoid conflict
import type { User } from "@/types/auth";

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;

  isAuthenticated: () => boolean;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get, storeApi) => ({
      user: null,
      token: null,
      loading: false,

      isAuthenticated: () => !!get().user && !!get().token,

      setUser: (user: User) => set({ user }),

      setLoading: (loading: boolean) => set({ loading }),

      clearAuth: () => {
        set({ user: null, token: null });
        Cookies.remove("access_token", { path: "/", secure: true, sameSite: "Lax" });
        Cookies.remove("refresh_token", { path: "/", secure: true, sameSite: "Lax" });
        storeApi.persist.clearStorage();
        localStorage.removeItem("auth-storage");
      },

      logout: () => {
        get().clearAuth();
        
      },

        refreshToken: async () => {
        try {
          set({ loading: true });
          console.log("[AuthStore] Attempting token refresh...");

          // If backend reads refresh token from HttpOnly cookie, no body is needed
          const res = await apiClient.post("/api/token/refresh/");

          const accessToken = res.data?.access;
          if (!accessToken) throw new Error("No access token returned from refresh");

          // Store access token in cookie
          Cookies.set("access_token", accessToken, { expires: 1 / 24, secure: true, sameSite: "Lax" });
          set({ token: accessToken });
          console.log("[AuthStore] Access token updated:", accessToken);

          // Fetch user data using new access token
          const userRes = await apiClient.get("/api/auth/user/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          set({ user: userRes.data });
          console.log("[AuthStore] User data refreshed:", userRes.data);
        } catch (err) {
          console.error("[AuthStore] Token refresh failed:", err);
          get().logout();
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state: AuthState) => ({
        user: state.user,
        token: state.token, // Persist token too
      }),
    }
  )
);

/* 
Usage:  
In your top-level React component (e.g., App.tsx), add this to auto refresh token every 50 minutes:

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth";

function App() {
  const refreshToken = useAuthStore((staFte) => state.refreshToken);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 50 * 60 * 1000); // 50 minutes

    return () => clearInterval(interval);
  }, [refreshToken]);

  // your app JSX
}
*/
