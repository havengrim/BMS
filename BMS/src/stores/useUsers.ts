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
  console.log('Fetching user with id:', id);
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
      api
        .put(`/api/users/${id}/`, data, {
          headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
        })
        .then((res) => res.data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches to avoid overwriting the optimistic update
      await queryClient.cancelQueries({ queryKey: ['users'] });
      await queryClient.cancelQueries({ queryKey: ['user', id] });

      // Snapshot the previous values
      const previousUsers = queryClient.getQueryData(['users']);
      const previousUser = queryClient.getQueryData(['user', id]);

      // Optimistically update the users list cache
      queryClient.setQueryData(['users'], (old: User[] | undefined) => {
        if (!old) return old;
        return old.map((user) =>
          user.id === id ? { ...user, ...(data instanceof FormData ? {} : data) } : user
        );
      });

      // Optimistically update the single user cache
      queryClient.setQueryData(['user', id], (old: User | undefined) => {
        if (!old) return old;
        return { ...old, ...(data instanceof FormData ? {} : data) };
      });

      // Return context for rollback on error
      return { previousUsers, previousUser, id }; // Include id in context
    },
    onSuccess: (_data, variables) => {
      const { id } = variables; // Extract id from mutation variables
      toast({
        title: 'Success',
        description: 'User updated successfully.',
        variant: 'default',
      });
      // Invalidate both the list and single user queries to ensure refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
    onError: (_error, variables, context) => {
      const { id } = variables; // Extract id from mutation variables
      // Rollback to previous data on error
      queryClient.setQueryData(['users'], context?.previousUsers);
      queryClient.setQueryData(['user', id], context?.previousUser);
      toast({
        title: 'Error',
        description: 'Failed to update user.',
        variant: 'destructive',
      });
    },
    onSettled: (_data, _error, variables) => {
      const { id } = variables; // Extract id from mutation variables
      // Ensure queries are refetched after success or error
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
};

// ✅ Delete user with toast
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/users/${id}/`).then(res => res.data),
    onSuccess: (_data, id) => {
      toast({
        title: 'Deleted',
        description: 'User deleted successfully.',
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
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