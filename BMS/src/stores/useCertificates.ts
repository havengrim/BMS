"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export type Status = "pending" | "approved" | "rejected" | "completed";
// Types
export type Certificate = {
  id: number
  certificate_type: string
  request_number: string
  first_name: string
  last_name: string
  middle_name?: string
  complete_address: string
  contact_number: string
  email_address: string
  purpose: string
  agree_terms: boolean
  status:Status;
  created_at: string
  user: number
}

export type CreateCertificateInput = {
  certificate_type: string
  first_name: string
  last_name: string
  middle_name?: string
  complete_address: string
  contact_number: string
  email_address: string
  purpose: string
  agree_terms: boolean
}

export type EditCertificateInput = {
  certificate_type: string
  first_name: string
  last_name: string
  middle_name?: string
  complete_address: string
  contact_number: string
  email_address: string
  purpose: string
  agree_terms: boolean
  status: "pending" | "approved" | "rejected" | "completed"
}

const CERTIFICATE_BASE_URL = "/api/certificates"

// GET all certificates
export const useCertificates = () =>
  useQuery<Certificate[], Error>({
    queryKey: ["certificates"],
    queryFn: () =>
      api.get(`${CERTIFICATE_BASE_URL}/`, { withCredentials: true }).then(res => res.data),
    staleTime: 1000 * 60 * 5,
  })

// GET single certificate
export const useCertificate = (id: number | string) =>
  useQuery({
    queryKey: ["certificate", id],
    queryFn: async () => {
      const { data } = await api.get(`${CERTIFICATE_BASE_URL}/${id}/`, { withCredentials: true })
      return data
    },
    enabled: !!id,
    retry: false,
  })

// CREATE certificate
export const useCreateCertificate = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateCertificateInput) =>
      api.post(`${CERTIFICATE_BASE_URL}/create/`, data, { withCredentials: true }).then(res => res.data),
    onSuccess: () => {
      toast({ title: "Created", description: "Certificate created successfully." })
      queryClient.invalidateQueries({ queryKey: ["certificates"] })
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create certificate.", variant: "destructive" })
    },
  })
}

// UPDATE certificate
export const useEditCertificate = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EditCertificateInput }) =>
      api.put(`${CERTIFICATE_BASE_URL}/edit/${id}/`, data, { withCredentials: true }).then(res => res.data),
    onSuccess: () => {
      toast({ title: "Updated", description: "Certificate updated successfully." })
      queryClient.invalidateQueries({ queryKey: ["certificates"] })
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update certificate.", variant: "destructive" })
    },
  })
}

// DELETE certificate
export const useDeleteCertificate = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`${CERTIFICATE_BASE_URL}/delete/${id}/`, { withCredentials: true }).then(res => res.data),
    onSuccess: () => {
      toast({ title: "Deleted", description: "Certificate deleted successfully." })
      queryClient.invalidateQueries({ queryKey: ["certificates"] })
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete certificate.", variant: "destructive" })
    },
  })
}