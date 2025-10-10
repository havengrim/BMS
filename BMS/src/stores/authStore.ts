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

    // Get refresh token from store or cookie (fallback)
    const currentRefresh = get().refreshToken || Cookies.get("refresh_token");
    if (!currentRefresh) {
      throw new Error("No refresh token available");
    }

    // Send refresh token in body (as per SimpleJWT)
    const res = await apiClient.post("/api/token/refresh/", { 
      refresh: currentRefresh 
    });
    
    const newAccessToken = res.data?.access;
    if (!newAccessToken) throw new Error("No access token returned");

    // Update tokens (backend may return new refresh too)
    get().setTokens(newAccessToken, res.data?.refresh || undefined);

    // Fetch user with new token
    const userRes = await apiClient.get("/api/auth/user/", {
      headers: { Authorization: `Bearer ${newAccessToken}` },
    });
    set({ user: userRes.data });
    console.log("[AuthStore] Token refresh successful, user data updated:", userRes.data);
  } catch (err: unknown) {
    // TS-safe error handling
    console.error("[AuthStore] Token refresh failed:", err);
    if (err instanceof Error) {
      console.error("Error details:", err.message);
      // Optional: Log response if AxiosError
      // if (isAxiosError(err)) { console.error(err.response?.data); }
    }
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
