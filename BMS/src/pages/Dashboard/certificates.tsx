"use client"

import type React from "react"
import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  FileText,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  Edit,
  Trash2,
} from "lucide-react"
import { useCertificates, useEditCertificate, useDeleteCertificate, type Certificate, type Status } from "@/stores/useCertificates"

const certificateTypes = [
  "All",
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
  "Business Clearance",
] as const

type CertificateType = typeof certificateTypes[number] extends "All" ? never : typeof certificateTypes[number]

const statusOptions = ["All", "pending", "approved", "rejected", "completed"] as const

export default function Certificates() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"All" | Status>("All")
  const [selectedType, setSelectedType] = useState<string>("All")
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { data: certificates = [], isLoading, error } = useCertificates()
  const editCertificateMutation = useEditCertificate()
  const deleteCertificateMutation = useDeleteCertificate()

  const filteredCertificates = certificates.filter((certificate) => {
    const matchesSearch =
      certificate.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.request_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.certificate_type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || certificate.status === selectedStatus
    const matchesType = selectedType === "All" || certificate.certificate_type === selectedType

    return matchesSearch && matchesStatus && matchesType
  })

  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCertificates = filteredCertificates.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate)
    setIsViewDialogOpen(true)
  }

  const handleEditCertificate = (certificate: Certificate) => {
    setEditingCertificate({ ...certificate })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingCertificate) {
      editCertificateMutation.mutate(
        {
          id: editingCertificate.id,
          data: {
            certificate_type: editingCertificate.certificate_type,
            first_name: editingCertificate.first_name,
            last_name: editingCertificate.last_name,
            middle_name: editingCertificate.middle_name,
            complete_address: editingCertificate.complete_address,
            contact_number: editingCertificate.contact_number,
            email_address: editingCertificate.email_address,
            purpose: editingCertificate.purpose,
            agree_terms: editingCertificate.agree_terms,
            status: editingCertificate.status,
          },
        },
        {
          onSuccess: () => {
            console.log("Certificate updated successfully:", editingCertificate.id)
            setIsEditDialogOpen(false)
            setEditingCertificate(null)
          },
          onError: (error) => {
            console.error("Error updating certificate:", error)
          },
        },
      )
    }
  }

  const handleDeleteCertificate = (id: number) => {
    deleteCertificateMutation.mutate(id, {
      onSuccess: () => {
        console.log("Certificate deleted successfully:", id)
      },
      onError: (error) => {
        console.error("Error deleting certificate:", error)
      },
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusExplanation = (status: string) => {
    switch (status) {
      case "pending":
        return "New request - waiting to be reviewed"
      case "approved":
        return "Approved and being prepared"
      case "rejected":
        return "Request was denied"
      case "completed":
        return "Ready for pickup"
      default:
        return ""
    }
  }

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col mb-18">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-6">
                  <div className="grid gap-4 md:grid-cols-4 mb-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{certificates.length}</div>
                        <p className="text-xs text-muted-foreground">All requests ever received</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {certificates.filter((r) => r.status === "pending").length}
                        </div>
                        <p className="text-xs text-muted-foreground">New requests to review</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {certificates.filter((r) => r.status === "approved").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Approved requests</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {certificates.filter((r) => r.status === "completed").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Ready for pickup</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium mb-3">Find Certificates</h3>
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name, request number, or certificate type..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <Select  value={selectedStatus}
                        onValueChange={(value) => setSelectedStatus(value as Status | "All")}>
                        <SelectTrigger className="w-full lg:w-40">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status === "All"
                                ? "All Statuses"
                                : status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-full lg:w-48">
                          <SelectValue placeholder="All Certificate Types" />
                        </SelectTrigger>
                        <SelectContent>
                          {certificateTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="itemsPerPage" className="text-sm whitespace-nowrap">
                          Show:
                        </Label>
                        <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Card className="!border-none !py-0 !shadow-none">
                    <CardHeader>
                      <CardTitle>All Certificate Requests</CardTitle>
                      <CardDescription>
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredCertificates.length)} of{" "}
                        {filteredCertificates.length} requests
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div>Loading certificates...</div>
                      ) : error ? (
                        <div className="text-red-600">Error: {error.message}</div>
                      ) : filteredCertificates.length === 0 ? (
                        <div className="text-muted-foreground">No certificates found.</div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Request Number</TableHead>
                              <TableHead>Applicant</TableHead>
                              <TableHead>Certificate Type</TableHead>
                              <TableHead>Date Submitted</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentCertificates.map((certificate) => (
                              <TableRow key={certificate.id}>
                                <TableCell className="font-medium">{certificate.request_number}</TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">
                                      {certificate.first_name} {certificate.last_name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{certificate.email_address}</div>
                                  </div>
                                </TableCell>
                                <TableCell>{certificate.certificate_type}</TableCell>
                                <TableCell>{new Date(certificate.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <Badge className={getStatusColor(certificate.status)}>
                                      <div className="flex items-center gap-1">
                                        {getStatusIcon(certificate.status)}
                                        {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                                      </div>
                                    </Badge>
                                    <p className="text-xs text-muted-foreground">
                                      {getStatusExplanation(certificate.status)}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-center gap-2">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleViewCertificate(certificate)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>View Details</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleEditCertificate(certificate)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Edit Certificate</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    <AlertDialog>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <AlertDialogTrigger asChild>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 bg-transparent"
                                            >
                                              <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                          </AlertDialogTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Delete Certificate</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete This Certificate?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to permanently delete the certificate request from{" "}
                                            <strong>
                                              {certificate.first_name} {certificate.last_name}
                                            </strong>
                                            ?<br />
                                            This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteCertificate(certificate.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                className="w-8 h-8 p-0"
                              >
                                {page}
                              </Button>
                            )
                          })}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        View Details - {selectedCertificate?.request_number}
                      </DialogTitle>
                      <DialogDescription>Certificate request details (read-only)</DialogDescription>
                    </DialogHeader>
                    {selectedCertificate && (
                      <div className="grid gap-6 py-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Applicant Information
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="font-medium">Full Name:</Label>
                              <p>
                                {selectedCertificate.first_name} {selectedCertificate.last_name}
                              </p>
                            </div>
                            <div>
                              <Label className="font-medium">Email Address:</Label>
                              <p>{selectedCertificate.email_address}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Phone Number:</Label>
                              <p>{selectedCertificate.contact_number}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Address:</Label>
                              <p>{selectedCertificate.complete_address}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Purpose:</Label>
                              <p>{selectedCertificate.purpose}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Agreed to Terms:</Label>
                              <p>{selectedCertificate.agree_terms ? "Yes" : "No"}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Request Information
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="font-medium">Certificate Type:</Label>
                              <p>{selectedCertificate.certificate_type}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Request Number:</Label>
                              <p>{selectedCertificate.request_number}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Submitted:</Label>
                              <p>{new Date(selectedCertificate.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Status:</Label>
                              <Badge className={getStatusColor(selectedCertificate.status)}>
                                {selectedCertificate.status.charAt(0).toUpperCase() +
                                  selectedCertificate.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        Edit Certificate - {editingCertificate?.request_number}
                      </DialogTitle>
                      <DialogDescription>Update certificate details</DialogDescription>
                    </DialogHeader>
                    {editingCertificate && (
                      <div className="grid gap-6 py-4">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="certificate_type" className="text-base font-medium">
                              Certificate Type
                            </Label>
                            <Select
                              value={editingCertificate.certificate_type}
                              onValueChange={(value: CertificateType) =>
                                setEditingCertificate({ ...editingCertificate, certificate_type: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {certificateTypes
                                  .filter((type) => type !== "All")
                                  .map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="first_name" className="text-base font-medium">
                              First Name
                            </Label>
                            <Input
                              id="first_name"
                              value={editingCertificate.first_name}
                              onChange={(e) =>
                                setEditingCertificate({ ...editingCertificate, first_name: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="last_name" className="text-base font-medium">
                              Last Name
                            </Label>
                            <Input
                              id="last_name"
                              value={editingCertificate.last_name}
                              onChange={(e) =>
                                setEditingCertificate({ ...editingCertificate, last_name: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="middle_name" className="text-base font-medium">
                              Middle Name
                            </Label>
                            <Input
                              id="middle_name"
                              value={editingCertificate.middle_name || ""}
                              onChange={(e) =>
                                setEditingCertificate({ ...editingCertificate, middle_name: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="complete_address" className="text-base font-medium">
                              Address
                            </Label>
                            <Input
                              id="complete_address"
                              value={editingCertificate.complete_address}
                              onChange={(e) =>
                                setEditingCertificate({ ...editingCertificate, complete_address: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="contact_number" className="text-base font-medium">
                              Contact Number
                            </Label>
                            <Input
                              id="contact_number"
                              value={editingCertificate.contact_number}
                              onChange={(e) =>
                                setEditingCertificate({ ...editingCertificate, contact_number: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="email_address" className="text-base font-medium">
                              Email Address
                            </Label>
                            <Input
                              id="email_address"
                              value={editingCertificate.email_address}
                              onChange={(e) =>
                                setEditingCertificate({ ...editingCertificate, email_address: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="purpose" className="text-base font-medium">
                              Purpose
                            </Label>
                            <Input
                              id="purpose"
                              value={editingCertificate.purpose}
                              onChange={(e) =>
                                setEditingCertificate({ ...editingCertificate, purpose: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="agree_terms" className="text-base font-medium">
                              Agree to Terms
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="agree_terms"
                                checked={editingCertificate.agree_terms}
                                onCheckedChange={(checked) =>
                                  setEditingCertificate({
                                    ...editingCertificate,
                                    agree_terms: checked as boolean,
                                  })
                                }
                              />
                              <Label htmlFor="agree_terms" className="text-sm">
                                Applicant agrees to terms and conditions
                              </Label>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="status" className="text-base font-medium">
                              Status
                            </Label>
                            <Select
                              value={editingCertificate.status}
                              onValueChange={(value: Status) =>
                                setEditingCertificate({ ...editingCertificate, status: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                    <DialogFooter className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveEdit}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={editCertificateMutation.isPending}
                      >
                        {editCertificateMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}