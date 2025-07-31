import { useMutation, useQuery } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import { api } from '@/lib/api'; 
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast'; 
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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

type UserProfile = {
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
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: (data) => api.post('/api/token/', data).then((res) => res.data),
    onSuccess: ({ user }) => {
      setUser(user); // tokens are HttpOnly cookies, no need to store in state

      toast({
        title: 'Login Successful',
        description: 'You have been logged in.',
        variant: 'success',
      });

      if (user.profile?.role?.toLowerCase() === 'user') {
        navigate('/');
      } else {
        navigate('/dashboard');
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

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/api/logout/", {}, { withCredentials: true }); // ✅ Send cookies
    } catch (error) {
      console.error("Logout API error:", error); // Even on failure, proceed
    }

    logout(); // Clear Zustand state

    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
      variant: "default",
    });

    setTimeout(() => {
      navigate("/login");
    }, 1500);
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
    queryFn: () => api.get('/api/users/').then(res => res.data),
    staleTime: 1000 * 60 * 5,
  });
};

export function useLoadCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    async function fetchUser() {
      try {
        // Try to get current user with cookies sent
        const res = await api.get('/api/auth/user/', { withCredentials: true });
        setUser(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          // Unauthorized: try refreshing token
          try {
            await api.post('/api/token/refresh/', null, { withCredentials: true });
            // Retry fetching user again with cookies
            const res = await api.get('/api/auth/user/', { withCredentials: true });
            setUser(res.data);
          } catch {
            clearAuth();
          }
        } else {
          clearAuth();
        }
      }
    }
    fetchUser();
  }, [setUser, clearAuth]);
}