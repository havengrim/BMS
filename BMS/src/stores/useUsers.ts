import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { User } from './useAccount';
import { useToast } from '@/hooks/use-toast';

// ✅ Fetch all users
export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: () => api.get('/api/users/', { withCredentials: true }).then(res => res.data),
    staleTime: 1000 * 60 * 5,
  });
};

// ✅ Fetch single user by ID
export const useUser = (id: number) => {
  return useQuery<User, Error>({
    queryKey: ['user', id],
    queryFn: () => api.get(`/api/users/${id}/`).then(res => res.data),
    enabled: !!id,
  });
};

// ✅ Update user with toast
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData | Partial<User> }) =>
      api.put(`/api/users/${id}/`, data, {
        headers: data instanceof FormData ? {
          'Content-Type': 'multipart/form-data',
        } : {},
      }).then(res => res.data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'User updated successfully.',
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update user.',
        variant: 'destructive',
      });
    },
  });
};

// ✅ Delete user with toast
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/users/${id}/`).then(res => res.data),
    onSuccess: () => {
      toast({
        title: 'Deleted',
        description: 'User deleted successfully.',
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete user.',
        variant: 'destructive',
      });
    },
  });
};
