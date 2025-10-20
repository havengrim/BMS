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
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = useAuthStore((s) => s.setTokens);
  const setLoading = useAuthStore((s) => s.setLoading);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Helper to extract and format error messages from API response
  const getErrorMessage = (error: Error): string => {
    if (axios.isAxiosError(error) && error.response?.data) {
      const data = error.response.data as Record<string, string[]>;
      // Join all error messages from fields (e.g., "No user found with this email." or "Incorrect password.")
      const messages = Object.values(data).flat().join(' ');
      return messages || 'An unknown error occurred.';
    }
    return error.message || 'Please check your credentials.';
  };

  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: (data) =>
      api.post('/api/token/', data, { withCredentials: true }).then((res) => res.data),

    onSuccess: async (loginData) => {
      setLoading(true);
      try {
        if (!loginData.access) throw new Error("Access token missing from login response");

        // Store access token in Zustand + cookie
        setTokens(loginData.access, loginData.refresh);

        // Use loginData.user directly (already returned from login)
        setUser(loginData.user);

        toast({
          title: 'Login Successful',
          description: 'You have been logged in.',
          variant: 'success',
        });

        // Navigate based on role
        const role = loginData.user.profile?.role?.toLowerCase();
        if (role === 'resident' || role === 'user') {
          navigate('/');
        } else {
          navigate('/dashboard');
        }
      } catch (err: any) {
        clearAuth();
        toast({
          title: 'Login Failed',
          description: err.message || 'Could not fetch authenticated user.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },

    onError: (error) => {
      const errorMessage = getErrorMessage(error); // Use the helper to show actual backend errors
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};

  import Cookies from "js-cookie";
import axios from 'axios';

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

    onError: (error: any) => {
      let description = 'Please check your inputs and try again.';

      if (error.response?.data) {
        const data = error.response.data;

        if (data.non_field_errors) {
          // ✅ Handle weak password validation errors
          description = Array.isArray(data.non_field_errors)
            ? data.non_field_errors.join(' ') // OR use '\n' for new lines
            : data.non_field_errors;
        } else if (data.confirm_password) {
          description = 'Passwords do not match. Please check and try again.';
        } else if (data.username) {
          description = 'Username already taken. Please choose another one.';
        } else if (data.email) {
          description = 'Email already registered. Please use another email.';
        } else if (data.contact_number || data.phone) {
          description = 'Phone number already in use.';
        } else if (data.password) {
          description = 'Password does not meet requirements. Please try a stronger password.';
        } else {
          // Fallback for other field errors
          const firstKey = Object.keys(data)[0];
          if (firstKey) {
            description = `${firstKey.charAt(0).toUpperCase() + firstKey.slice(1)} is invalid.`;
          }
        }
      }

      toast({
        title: 'Registration Failed',
        description,
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
    const setUser = useAuthStore((s) => s.setUser);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const setLoading = useAuthStore((s) => s.setLoading);
    const refreshAccessToken = useAuthStore((s) => s.refreshAccessToken);

    const hasFetched = useRef(false);
    useEffect(() => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      fetchCurrentUser(setUser, clearAuth, setLoading, refreshAccessToken);
    }, [setUser, clearAuth, setLoading, refreshAccessToken]);
  }