import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { api as apiClient } from "@/lib/api"; // Axios instance
import type { User } from "@/types/auth";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;

  isAuthenticated: () => boolean;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get, storeApi) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,

      isAuthenticated: () => !!get().user && !!get().accessToken,

      setUser: (user: User) => set({ user }),

      setTokens: (accessToken: string, refreshToken?: string) => {
        set({ accessToken, refreshToken: refreshToken ?? get().refreshToken });

        Cookies.set("access_token", accessToken, { expires: 1 / 24, secure: true, sameSite: "Lax" });
        if (refreshToken) {
          Cookies.set("refresh_token", refreshToken, { expires: 7, secure: true, sameSite: "Lax" }); // longer expiry
        }
      },

      setLoading: (loading: boolean) => set({ loading }),

      clearAuth: () => {
        set({ user: null, accessToken: null, refreshToken: null });
        Cookies.remove("access_token", { path: "/", secure: true, sameSite: "Lax" });
        Cookies.remove("refresh_token", { path: "/", secure: true, sameSite: "Lax" });
        storeApi.persist.clearStorage();
        localStorage.removeItem("auth-storage");
      },

      logout: () => {
        get().clearAuth();
      },

      refreshAccessToken: async () => {
        try {
          set({ loading: true });
          console.log("[AuthStore] Attempting token refresh...");

          // Send empty body; backend reads HttpOnly cookie
          const res = await apiClient.post("/api/token/refresh/", {}, { withCredentials: true });
          const newAccessToken = res.data?.access;
          if (!newAccessToken) throw new Error("No access token returned");

          // Update access token in store and JS cookie
          get().setTokens(newAccessToken);

          // Fetch user data using new access token
          const userRes = await apiClient.get("/api/auth/user/", {
            headers: { Authorization: `Bearer ${newAccessToken}` },
            withCredentials: true,
          });
          set({ user: userRes.data });
          console.log("[AuthStore] Token refresh successful, user data updated:", userRes.data);
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
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
