import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export type Certificate = {
  id: number
  name: string
  recipient: string
  certificate_type: string
  request_number: string
  date_issued: string
  purpose: string
  address: string
  issued_by: string
  remarks: string
  valid_until: string
}

export type BusinessPermit = {
  id: number
  business_name: string
  business_type: string
  owner_name: string
  business_address: string
  contact_number: string
  owner_address: string
  business_description: string
  is_renewal: boolean
}

// GET all certificates
export const useCertificates = () =>
  useQuery<Certificate[], Error>({
    queryKey: ["certificates"],
    queryFn: () =>
      api.get("/api/certificates/", { withCredentials: true }).then(res => res.data),
    staleTime: 1000 * 60 * 5,
  })

// GET single certificate
export const useCertificate = (id: number) =>
  useQuery<Certificate, Error>({
    queryKey: ["certificate", id],
    queryFn: () =>
      api.get(`/api/certificates/view/${id}/`, { withCredentials: true }).then(res => res.data),
    enabled: !!id,
  })

// CREATE certificate
export const useCreateCertificate = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: Omit<Certificate, "id">) =>
      api.post("/api/certificates/create/", data, { withCredentials: true }).then(res => res.data),
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
    mutationFn: ({ id, data }: { id: number; data: Omit<Certificate, "id"> }) =>
      api.put(`/api/certificates/edit/${id}/`, data, { withCredentials: true }).then(res => res.data),
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
      api.delete(`/api/certificates/delete/${id}/`, { withCredentials: true }).then(res => res.data),
    onSuccess: () => {
      toast({ title: "Deleted", description: "Certificate deleted successfully." })
      queryClient.invalidateQueries({ queryKey: ["certificates"] })
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete certificate.", variant: "destructive" })
    },
  })
}

// GET all permits
export const useBusinessPermits = () =>
  useQuery<BusinessPermit[], Error>({
    queryKey: ["business-permits"],
    queryFn: () =>
      api.get("/api/certificates/business-permits/", { withCredentials: true }).then(res => res.data),
    staleTime: 1000 * 60 * 5,
  })

// GET single permit
export const useBusinessPermit = (id: number) =>
  useQuery<BusinessPermit, Error>({
    queryKey: ["business-permit", id],
    queryFn: () =>
      api.get(`/api/certificates/business-permits/${id}/`, { withCredentials: true }).then(res => res.data),
    enabled: !!id,
  })

// CREATE permit
export const useCreateBusinessPermit = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: Omit<BusinessPermit, "id">) =>
      api.post("/api/certificates/business-permits/", data, { withCredentials: true }).then(res => res.data),
    onSuccess: () => {
      toast({ title: "Created", description: "Business permit created successfully." })
      queryClient.invalidateQueries({ queryKey: ["business-permits"] })
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create business permit.", variant: "destructive" })
    },
  })
}

// UPDATE permit
export const useEditBusinessPermit = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<BusinessPermit, "id"> }) =>
      api.put(`/api/certificates/business-permits/${id}/`, data, { withCredentials: true }).then(res => res.data),
    onSuccess: () => {
      toast({ title: "Updated", description: "Business permit updated successfully." })
      queryClient.invalidateQueries({ queryKey: ["business-permits"] })
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update business permit.", variant: "destructive" })
    },
  })
}

// DELETE permit
export const useDeleteBusinessPermit = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/api/certificates/business-permits/${id}/`, { withCredentials: true }).then(res => res.data),
    onSuccess: () => {
      toast({ title: "Deleted", description: "Business permit deleted successfully." })
      queryClient.invalidateQueries({ queryKey: ["business-permits"] })
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete business permit.", variant: "destructive" })
    },
  })
}
