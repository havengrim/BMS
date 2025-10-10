import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export type Complaint = {
  id: number;
  reference_number: string;
  type: string;
  fullname: string;
  contact_number: string;
  address: string;
  email_address: string;
  subject: string;
  detailed_description: string;
  respondent_name: string;
  respondent_address: string;
  latitude: number;
  longitude: number;
  location: { lat: number; lng: number };
  date_filed: string;
  status: string;
  priority: string;
  evidence: { id: number; file_url: string };
};

export const useComplaintByID = () => {
  return useQuery<Complaint[], Error>({
    queryKey: ['complaints'],
    queryFn: () => api.get('/api/complaints/my-complaints/').then(res => res.data),
    staleTime: 1000 * 60 * 5,
  });
};
// Fetch all complaints for the authenticated user
export const useComplaints = () => {
  return useQuery<Complaint[], Error>({
    queryKey: ['complaints'],
    queryFn: () => api.get('/api/complaints/').then(res => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

// Fetch a single complaint by ID
export const useComplaint = (id: number) => {
  return useQuery<Complaint, Error>({
    queryKey: ['complaint', id],
    queryFn: () => api.get(`/api/complaints/${id}/`).then(res => res.data),
    enabled: !!id,
  });
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: FormData) =>
      api.post('/api/complaints/create/', data, {
        headers: {
          'Content-Type': 'multipart/form-data', // 👈 explicitly set
        },
      }).then(res => res.data),

    onSuccess: () => {
      toast({
        title: 'Complaint submitted',
        description: 'Your complaint has been created.',
      });
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },

    onError: (error: any) => {
      console.error('Submission error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit complaint.',
        variant: 'destructive',
      });
    },
  });
};

// Update complaint by ID
export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      api.put(`/api/complaints/${id}/update/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(res => res.data),
    onSuccess: () => {
      toast({ title: 'Complaint updated', description: 'Complaint updated successfully.' });
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update complaint.', variant: 'destructive' });
    },
  });
};

// Delete complaint by ID
export const useDeleteComplaint = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/api/complaints/${id}/delete/`).then(res => res.data),
    onSuccess: () => {
      toast({ title: 'Complaint deleted', description: 'Complaint deleted successfully.' });
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete complaint.', variant: 'destructive' });
    },
  });
};