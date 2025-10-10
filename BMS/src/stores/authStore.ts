import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { api as apiClient } from "@/lib/api"; // Axios instance
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

          // Backend reads refresh token from HttpOnly cookie, no body needed
          const res = await apiClient.post("/api/token/refresh/", {}, { withCredentials: true });

          const accessToken = res.data?.access;
          if (!accessToken) throw new Error("No access token returned from refresh");

          // Store JS-readable access token in cookie
          Cookies.set("access_token", accessToken, { expires: 1 / 24, secure: true, sameSite: "Lax" });
          set({ token: accessToken });
          console.log("[AuthStore] Access token updated:", accessToken);

          // Fetch current user using new access token
          const userRes = await apiClient.get("/api/auth/user/", {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true, // optional if backend reads from cookie
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
        token: state.token,
      }),
    }
  )
);
