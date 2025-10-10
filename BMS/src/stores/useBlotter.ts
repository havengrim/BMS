"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// --- Types ---

export type Status = "pending" | "under_investigation" | "resolved" | "dismissed";

export type Priority = "High" | "Medium" | "Low" | "Varies";

export type IncidentType =
  | "Noise Complaint"
  | "Theft/Burglary"
  | "Neighbor Dispute"
  | "Traffic Violation"
  | "Property Damage"
  | "Others";

export type BlotterReport = {
  report_number: number;
  filed_by: number | null; // user id
  complainant_name: string;
  contact_number?: string | null;
  email_address?: string | null;
  respondent_name?: string | null;
  incident_type: IncidentType;
  incident_date: string; // ISO date string
  incident_time: string; // ISO time string
  location: string;
  description: string;
  witnesses?: string | null;
  agree_terms: boolean;
  priority: Priority;
  status: Status;
  resolution_notes?: string | null;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
};

export type CreateBlotterInput = Omit<
  BlotterReport,
  | "report_number"
  | "filed_by"
  | "status"
  | "resolution_notes"
  | "created_at"
  | "updated_at"
>;

export type EditBlotterInput = Partial<
  Omit<
    BlotterReport,
    "report_number" | "filed_by" | "created_at" | "updated_at"
  >
>;

// --- API base url ---

const BLOTTER_BASE_URL = "/api/blotters";

// --- Hooks ---

// GET all blotters
export const useBlotters = () =>
  useQuery<BlotterReport[], Error>({
    queryKey: ["blotters"],
    queryFn: () =>
      api.get(`${BLOTTER_BASE_URL}/`, { withCredentials: true }).then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });

// GET single blotter by report_number
export const useBlotter = (id: number | string) =>
  useQuery<BlotterReport, Error>({
    queryKey: ["blotter", id],
    queryFn: () =>
      api.get(`${BLOTTER_BASE_URL}/${id}/`, { withCredentials: true }).then((res) => res.data),
    enabled: !!id,
    retry: false,
  });

// CREATE blotter
export const useCreateBlotter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateBlotterInput) =>
      api.post(`${BLOTTER_BASE_URL}/`, data, { withCredentials: true }).then((res) => res.data),
    onSuccess: () => {
      toast({ title: "Created", description: "Blotter report created successfully." });
      queryClient.invalidateQueries({ queryKey: ["blotters"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create blotter report.", variant: "destructive" });
    },
  });
};

// UPDATE blotter
export const useEditBlotter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EditBlotterInput }) =>
      api.patch(`${BLOTTER_BASE_URL}/${id}/`, data, { withCredentials: true }).then((res) => res.data),
    onSuccess: () => {
      toast({ title: "Updated", description: "Blotter report updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["blotters"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update blotter report.", variant: "destructive" });
    },
  });
};

// DELETE blotter
export const useDeleteBlotter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`${BLOTTER_BASE_URL}/${id}/`, { withCredentials: true }).then((res) => res.data),
    onSuccess: () => {
      toast({ title: "Deleted", description: "Blotter report deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ["blotters"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete blotter report.", variant: "destructive" });
    },
  });
};
