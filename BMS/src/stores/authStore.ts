import { create } from 'zustand'
import Cookies from 'js-cookie'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  setTokens: (access: string, refresh: string) => void
  clearTokens: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: Cookies.get('accessToken') || null,
  refreshToken: Cookies.get('refreshToken') || null,
  setTokens: (access, refresh) => {
    Cookies.set('accessToken', access)
    Cookies.set('refreshToken', refresh)
    set({ accessToken: access, refreshToken: refresh })
  },
  clearTokens: () => {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    set({ accessToken: null, refreshToken: null })
  },
}))
