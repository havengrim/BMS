import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import { api } from '@/lib/api'; 
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast'; 
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { fetchCurrentUser } from '@/stores/authHelper';
type LoginInput = { email: string; password: string; };

type LoginResponse = {
  access: string;
  refresh: string;
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    profile: {
      name: string;
      contact_number: string;
      address: string;
      civil_status: string;
      birthdate: string;
      role: string;
      image: string | null;
    };
  };
};

type RegisterInput = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  contact_number: string;
  address: string;
  civil_status: string;
  birthdate: string;
};

type RegisterResponse = { message: string };

export type UserProfile = {
  name: string;
  contact_number: string;
  address: string;
  civil_status: string;
  birthdate: string;
  role: string;
  image: string | null;
};


export type User = {
  id: number;
  username: string;
  email: string;
  profile: UserProfile;
};

export const useLogin = () => {
  const setUser = useAuthStore((s: any) => s.setUser);
  const setLoading = useAuthStore((s: any) => s.setLoading);
  const clearAuth = useAuthStore((s: any) => s.clearAuth);
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: (data) =>
      api.post('/api/token/', data, { withCredentials: true }).then((res) => res.data),

    onSuccess: async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/auth/user/', { withCredentials: true });
        const user = res.data;

        setUser(user);

        toast({
          title: 'Login Successful',
          description: 'You have been logged in.',
          variant: 'success',
        });

        const role = user.profile?.role?.toLowerCase();

        if (role === 'resident' || role === 'user') {
          navigate('/');
        } else {
          navigate('/dashboard');
        }
      } catch (err: any) {
        clearAuth();
        toast({
          title: 'Login Failed',
          description: 'Could not fetch authenticated user.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },

    onError: (error) => {
      toast({
        title: 'Login Failed',
        description: error.message || 'Please check your credentials.',
        variant: 'destructive',
      });
    },
  });
};

import Cookies from "js-cookie";

export const useLogout = () => {
  const logout = useAuthStore((s: any) => s.logout);
  const { toast } = useToast();
  const navigate = useNavigate();
const queryClient = useQueryClient(); 
  const handleLogout = async () => {
    try {
      await api.post("/api/logout/", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout API error:", error);
    }

    // Explicitly clear cookies
    Cookies.remove("access_token", { path: "/", domain: undefined });
    Cookies.remove("refresh_token", { path: "/", domain: undefined });

    logout();
    queryClient.clear();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
      variant: "default",
    });

    navigate("/login");
  };

  return handleLogout;
};


export const useRegister = (): UseMutationResult<RegisterResponse, Error, RegisterInput> => {
  const { toast } = useToast();

  return useMutation<RegisterResponse, Error, RegisterInput>({
    mutationFn: (data) => api.post('/api/register/', data).then((res) => res.data),
    onSuccess: (data) => {
      toast({
        title: 'Registration Successful',
        description: data.message || 'You can now login with your credentials.',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Please check your inputs and try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: () => api.get('/api/users/', { withCredentials: true }).then(res => res.data),
    staleTime: 1000 * 60 * 5,
  });
};

export function useLoadCurrentUser() {
  const setUser = useAuthStore(s => s.setUser);
  const clearAuth = useAuthStore(s => s.clearAuth);
  const setLoading = useAuthStore(s => s.setLoading);
  const refreshToken = useAuthStore(s => s.refreshToken);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchCurrentUser(setUser, clearAuth, setLoading, refreshToken);
  }, [setUser, clearAuth, setLoading, refreshToken]);
}