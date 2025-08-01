import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export type Announcement = {
  id: number;
  title: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  location: string;
  target_audience: string;
  image?: string;
  created_at: string;
};

// Fetch all announcements
export const useAnnouncements = () => {
  return useQuery<Announcement[], Error>({
    queryKey: ['announcements'],
    queryFn: () => api.get('/api/announcements/', { withCredentials: true }).then(res => res.data),
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch single announcement
export const useAnnouncement = (id: number) => {
  return useQuery<Announcement, Error>({
    queryKey: ['announcement', id],
    queryFn: () => api.get(`/api/announcements/${id}/`, { withCredentials: true }).then(res => res.data),
    enabled: !!id,
  });
};

// Create announcement
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: FormData | Partial<Announcement>) =>
      api.post('/api/announcements/create/', data, {
        headers: data instanceof FormData ? {
          'Content-Type': 'multipart/form-data',
        } : {},
        withCredentials: true,
      }).then(res => res.data),

    onSuccess: () => {
      toast({ title: 'Created', description: 'Announcement created successfully.' });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create announcement.', variant: 'destructive' });
    },
  });
};

// Edit announcement
export const useEditAnnouncement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData | Partial<Announcement> }) =>
      api.put(`/api/announcements/${id}/edit/`, data, {
        headers: data instanceof FormData ? {
          'Content-Type': 'multipart/form-data',
        } : {},
        withCredentials: true,
      }).then(res => res.data),

    onSuccess: () => {
      toast({ title: 'Updated', description: 'Announcement updated successfully.' });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update announcement.', variant: 'destructive' });
    },
  });
};

// Delete announcement
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/api/announcements/${id}/delete/`, { withCredentials: true }).then(res => res.data),

    onSuccess: () => {
      toast({ title: 'Deleted', description: 'Announcement deleted successfully.' });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete announcement.', variant: 'destructive' });
    },
  });
};
