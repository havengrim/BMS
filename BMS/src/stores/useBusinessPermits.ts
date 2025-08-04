"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { BusinessPermit, CreateBusinessPermitInput, EditBusinessPermitInput } from "@/types/business-permit";

const BUSINESS_PERMIT_URL = "/api/certificates/business-permits/";

// GET all permits
export const useBusinessPermits = () =>
  useQuery<BusinessPermit[], Error>({
    queryKey: ["business-permits"],
    queryFn: () =>
      api.get(BUSINESS_PERMIT_URL, { withCredentials: true }).then(res => {
        return res.data.map((permit: any) => ({
          ...permit,
          id: String(permit.id), // Convert id to string
        }));
      }),
    staleTime: 1000 * 60 * 5,
  });
// GET single permit
export const useBusinessPermit = (id: number | string) =>
  useQuery({
    queryKey: ["business-permit", id],
    queryFn: () =>
      api.get(`${BUSINESS_PERMIT_URL}/${id}/`, { withCredentials: true }).then(res => res.data),
    enabled: !!id,
    retry: false,
  });

// CREATE permit
export const useCreateBusinessPermit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateBusinessPermitInput) =>
      api.post(BUSINESS_PERMIT_URL, data, { withCredentials: true }).then(res => res.data),
    onSuccess: () => {
      toast({ title: "Created", description: "Business permit created successfully." });
      queryClient.invalidateQueries({ queryKey: ["business-permits"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create permit.", variant: "destructive" });
    },
  });
};

// UPDATE permit (for admin use only)
export const useEditBusinessPermit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EditBusinessPermitInput }) =>
      api.put(`${BUSINESS_PERMIT_URL}${id}/`, data, { withCredentials: true }).then(res => res.data),
    onSuccess: () => {
      toast({ title: "Updated", description: "Business permit updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["business-permits"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update permit.", variant: "destructive" });
    },
  });
};

// DELETE permit (for admin use only)
export const useDeleteBusinessPermit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`${BUSINESS_PERMIT_URL}/${id}/`, { withCredentials: true }).then(res => res.data),
    onSuccess: () => {
      toast({ title: "Deleted", description: "Business permit deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ["business-permits"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete permit.", variant: "destructive" });
    },
  });
};