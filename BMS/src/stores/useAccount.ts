import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api'; 
import { useAuthStore } from '@/stores/authStore';

type LoginInput = {
  email: string;
  password: string;
};

type LoginResponse = {
  access: string;
  refresh: string;
};

export const useLogin = () => {
  const setTokens = useAuthStore((s) => s.setTokens);

  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: (data) => api.post('/api/token/', data).then(res => res.data),
    onSuccess: ({ access, refresh }) => {
      setTokens(access, refresh);
    },
  });
};
