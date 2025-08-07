"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";


export type EmergencyReport = {
id: string;
  name: string;
  incident_type: string;
  description: string;
  media_file?: string | null; // URL string
  status: string;
  location_text: string;
  latitude: number;
  longitude: number;
  submitted_at: string;
  created_at:string;
  updated_at: string;
  phone_number: string;
};

export type CreateEmergencyInput = {
  name: string;
  incident_type: string;
  description: string;
  media_file?: File | null; // File upload
  location_text: string;
  latitude: number;
  longitude: number;
};

export type EditEmergencyInput = {
  name?: string;
  incident_type?: string;
  description?: string;
  status?: string;
  location_text?: string;
  latitude?: number;
  longitude?: number;
};

// Base API URL
const EMERGENCY_BASE_URL = "/api/emergencies";

// GET all emergencies
export const useEmergencies = () =>
  useQuery<EmergencyReport[], Error>({
    queryKey: ["emergencies"],
    queryFn: () =>
      api
        .get(`${EMERGENCY_BASE_URL}/`, { withCredentials: true })
        .then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

// GET single emergency by ID
export const useEmergency = (id: number | string) =>
  useQuery({
    queryKey: ["emergency", id],
    queryFn: async () => {
      const { data } = await api.get(`${EMERGENCY_BASE_URL}/${id}/`, {
        withCredentials: true,
      });
      return data;
    },
    enabled: !!id,
    retry: false,
  });

// CREATE emergency
export const useCreateEmergency = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateEmergencyInput) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("incident_type", data.incident_type);
      formData.append("description", data.description);
      formData.append("location_text", data.location_text);
      formData.append("latitude", data.latitude.toString());
      formData.append("longitude", data.longitude.toString());
      if (data.media_file) {
        formData.append("media_file", data.media_file);
      }

      return api.post(`${EMERGENCY_BASE_URL}/`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => res.data);
    },
    onSuccess: () => {
      toast({ title: "Created", description: "Emergency report submitted." });
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit emergency report.",
        variant: "destructive",
      });
    },
  });
};

// UPDATE emergency (usually for status or minor edits)
export const useEditEmergency = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<EditEmergencyInput>;
    }) =>
      api
        .patch(`${EMERGENCY_BASE_URL}/${id}/`, data, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: () => {
      toast({ title: "Updated", description: "Emergency updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update emergency.",
        variant: "destructive",
      });
    },
  });
};

// DELETE emergency (optional)
export const useDeleteEmergency = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) =>
      api
        .delete(`${EMERGENCY_BASE_URL}/${id}/`, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: () => {
      toast({ title: "Deleted", description: "Emergency deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ["emergencies"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete emergency.",
        variant: "destructive",
      });
    },
  });
};
