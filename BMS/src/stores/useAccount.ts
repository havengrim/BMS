import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { api } from '@/lib/api'; 
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast'; // ✅ correct import

type LoginInput = {
  email: string;
  password: string;
};

type LoginResponse = {
  access: string;
  refresh: string;
};

type RegisterInput = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  contact_number: string;
  address: string;
  civil_status: string;
  birthdate: string; // "YYYY-MM-DD" format
  // role omitted since admin sets it
};

type RegisterResponse = {
  message: string;
};

export const useLogin = () => {
  const setTokens = useAuthStore((s) => s.setTokens);
  const { toast } = useToast();

  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: (data) => api.post('/api/token/', data).then((res) => res.data),
    onSuccess: ({ access, refresh }) => {
      setTokens(access, refresh);
      toast({
        title: 'Login Successful',
        description: 'You have been logged in.',
        variant: 'default',
      });
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
