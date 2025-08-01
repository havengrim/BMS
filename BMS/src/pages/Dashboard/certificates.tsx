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
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  FileText,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  Edit,
  Trash2,
} from "lucide-react"

interface CertificateRequest {
  id: string
  requestNumber: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  certificateType: string
  purpose: string
  dateSubmitted: string
  status: "pending" | "processing" | "approved" | "rejected" | "completed"
  priority: "normal" | "urgent"
  fee: string
  notes?: string
  documents: string[]
  processedBy?: string
  completedDate?: string
}

const initialRequests: CertificateRequest[] = [
  {
    id: "1",
    requestNumber: "BR-2024-001",
    applicantName: "Juan Dela Cruz",
    applicantEmail: "juan.delacruz@email.com",
    applicantPhone: "09171234567",
    certificateType: "Barangay Clearance",
    purpose: "Employment Requirements",
    dateSubmitted: "2024-01-15",
    status: "completed",
    priority: "normal",
    fee: "₱50.00",
    documents: ["Valid ID", "Proof of Residency", "Application Form"],
    processedBy: "Maria Santos",
    completedDate: "2024-01-16",
  },
  {
    id: "2",
    requestNumber: "BR-2024-002",
    applicantName: "Maria Garcia",
    applicantEmail: "maria.garcia@email.com",
    applicantPhone: "09187654321",
    certificateType: "Certificate of Indigency",
    purpose: "Medical Assistance",
    dateSubmitted: "2024-01-16",
    status: "processing",
    priority: "urgent",
    fee: "Free",
    documents: ["Valid ID", "Medical Certificate", "Income Statement"],
    processedBy: "Pedro Rodriguez",
  },
  {
    id: "3",
    requestNumber: "BR-2024-003",
    applicantName: "Carlos Santos",
    applicantEmail: "carlos.santos@email.com",
    applicantPhone: "09191234567",
    certificateType: "Business Permit",
    purpose: "Sari-sari Store Operation",
    dateSubmitted: "2024-01-17",
    status: "pending",
    priority: "normal",
    fee: "₱200.00",
    documents: ["DTI Registration", "Valid ID", "Location Sketch"],
  },
  {
    id: "4",
    requestNumber: "BR-2024-004",
    applicantName: "Ana Rodriguez",
    applicantEmail: "ana.rodriguez@email.com",
    applicantPhone: "09201234567",
    certificateType: "Certificate of Residency",
    purpose: "School Enrollment",
    dateSubmitted: "2024-01-18",
    status: "approved",
    priority: "normal",
    fee: "₱30.00",
    documents: ["Valid ID", "Utility Bill", "School Requirements"],
    processedBy: "Elena Reyes",
  },
  {
    id: "5",
    requestNumber: "BR-2024-005",
    applicantName: "Roberto Fernandez",
    applicantEmail: "roberto.fernandez@email.com",
    applicantPhone: "09211234567",
    certificateType: "Senior Citizen Certificate",
    purpose: "Discount Privileges",
    dateSubmitted: "2024-01-19",
    status: "rejected",
    priority: "normal",
    fee: "Free",
    documents: ["Valid ID", "Birth Certificate"],
    notes: "Missing required documents - birth certificate not clear enough to verify age",
    processedBy: "Miguel Torres",
  },
  {
    id: "6",
    requestNumber: "BR-2024-006",
    applicantName: "Lisa Mendoza",
    applicantEmail: "lisa.mendoza@email.com",
    applicantPhone: "09221234567",
    certificateType: "Certificate of Good Moral Character",
    purpose: "Job Application",
    dateSubmitted: "2024-01-20",
    status: "processing",
    priority: "normal",
    fee: "₱75.00",
    documents: ["Valid ID", "Character References", "Police Clearance"],
    processedBy: "Rosa Fernandez",
  },
]


const certificateTypes = [
  "All",
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
  "Business Permit",
  "Senior Citizen Certificate",
  "Certificate of Good Moral Character",
]

export default function Certificates() {
  const [requests, setRequests] = useState<CertificateRequest[]>(initialRequests)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedRequest, setSelectedRequest] = useState<CertificateRequest | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<CertificateRequest | null>(null)
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.certificateType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || request.status === selectedStatus
    const matchesPriority = selectedPriority === "All" || request.priority === selectedPriority
    const matchesType = selectedType === "All" || request.certificateType === selectedType

    return matchesSearch && matchesStatus && matchesPriority && matchesType
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRequests = filteredRequests.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }

  const handleViewRequest = (request: CertificateRequest) => {
    setSelectedRequest(request)
    setIsViewDialogOpen(true)
  }

  const handleEditRequest = (request: CertificateRequest) => {
    setEditingRequest({ ...request })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingRequest) {
      setRequests(
        requests.map((request) =>
          request.id === editingRequest.id
            ? {
                ...editingRequest,
                processedBy: editingRequest.status !== "pending" ? "Current User" : undefined,
                completedDate:
                  editingRequest.status === "completed" ? new Date().toISOString().split("T")[0] : undefined,
              }
            : request,
        ),
      )
      setIsEditDialogOpen(false)
      setEditingRequest(null)
    }
  }

  const handleDeleteRequest = (requestId: string) => {
    setRequests(requests.filter((request) => request.id !== requestId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <AlertCircle className="h-4 w-4" />
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
      case "processing":
        return "Being worked on by staff"
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

  const getPriorityColor = (priority: string) => {
    return priority === "urgent" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
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
                {/* Header */}
                <div className="px-6">
                  

                  {/* Stats Cards */}
                  <div className="grid gap-4 md:grid-cols-4 mb-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{requests.length}</div>
                        <p className="text-xs text-muted-foreground">All requests ever received</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Waiting</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {requests.filter((r) => r.status === "pending").length}
                        </div>
                        <p className="text-xs text-muted-foreground">New requests to review</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Working On</CardTitle>
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {requests.filter((r) => r.status === "processing").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Currently being prepared</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ready</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {requests.filter((r) => r.status === "completed").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Ready for pickup</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Filters */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium mb-3">Find Requests</h3>
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Type a name, request number, or certificate type to search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-full lg:w-40">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All Statuses</SelectItem>
                          <SelectItem value="pending">Waiting</SelectItem>
                          <SelectItem value="processing">Working On</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Denied</SelectItem>
                          <SelectItem value="completed">Ready</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                        <SelectTrigger className="w-full lg:w-40">
                          <SelectValue placeholder="All Priorities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All Priorities</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
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

                {/* Requests Table */}
                <div>
                  <Card className="!border-none !py-0 !shadow-none">
                    <CardHeader>
                      <CardTitle>All Certificate Requests</CardTitle>
                      <CardDescription>
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredRequests.length)} of{" "}
                        {filteredRequests.length} requests
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Request Number</TableHead>
                            <TableHead>Person Requesting</TableHead>
                            <TableHead>Certificate Type</TableHead>
                            <TableHead>Date Submitted</TableHead>
                            <TableHead>Current Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Fee</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="font-medium">{request.requestNumber}</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{request.applicantName}</div>
                                  <div className="text-sm text-muted-foreground">{request.applicantEmail}</div>
                                </div>
                              </TableCell>
                              <TableCell>{request.certificateType}</TableCell>
                              <TableCell>{new Date(request.dateSubmitted).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <Badge className={getStatusColor(request.status)}>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(request.status)}
                                      {request.status === "pending" && "Waiting"}
                                      {request.status === "processing" && "Working On"}
                                      {request.status === "approved" && "Approved"}
                                      {request.status === "rejected" && "Denied"}
                                      {request.status === "completed" && "Ready"}
                                    </div>
                                  </Badge>
                                  <p className="text-xs text-muted-foreground">
                                    {getStatusExplanation(request.status)}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getPriorityColor(request.priority)}>
                                  {request.priority === "urgent" ? "Urgent" : "Normal"}
                                </Badge>
                              </TableCell>
                              <TableCell>{request.fee}</TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                  {/* View Button */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewRequest(request)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View Details</p>
                                    </TooltipContent>
                                  </Tooltip>

                                  {/* Edit Button */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditRequest(request)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Edit & Update Status</p>
                                    </TooltipContent>
                                  </Tooltip>

                                  {/* Delete Button */}
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
                                        <p>Delete Request</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete This Request?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to permanently delete the certificate request from{" "}
                                          <strong>{request.applicantName}</strong>?
                                          <br />
                                          <br />
                                          This action cannot be undone. The request will be completely removed from the
                                          system.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel - Keep Request</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteRequest(request.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Yes, Delete Forever
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

                      {/* Pagination */}
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

                {/* View Request Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        View Details - {selectedRequest?.requestNumber}
                      </DialogTitle>
                      <DialogDescription>All information about this certificate request (read-only)</DialogDescription>
                    </DialogHeader>
                    {selectedRequest && (
                      <div className="grid gap-6 py-4">
                        {/* Applicant Information */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            About the Person Requesting
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="font-medium">Full Name:</Label>
                              <p>{selectedRequest.applicantName}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Email Address:</Label>
                              <p>{selectedRequest.applicantEmail}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Phone Number:</Label>
                              <p>{selectedRequest.applicantPhone}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Why They Need It:</Label>
                              <p>{selectedRequest.purpose}</p>
                            </div>
                          </div>
                        </div>

                        {/* Request Information */}
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            About This Request
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="font-medium">Certificate Type:</Label>
                              <p>{selectedRequest.certificateType}</p>
                            </div>
                            <div>
                              <Label className="font-medium">When They Applied:</Label>
                              <p>{new Date(selectedRequest.dateSubmitted).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Current Status:</Label>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(selectedRequest.status)}>
                                  {selectedRequest.status === "pending" && "Waiting"}
                                  {selectedRequest.status === "processing" && "Working On"}
                                  {selectedRequest.status === "approved" && "Approved"}
                                  {selectedRequest.status === "rejected" && "Denied"}
                                  {selectedRequest.status === "completed" && "Ready"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  ({getStatusExplanation(selectedRequest.status)})
                                </span>
                              </div>
                            </div>
                            <div>
                              <Label className="font-medium">Priority Level:</Label>
                              <Badge className={getPriorityColor(selectedRequest.priority)}>
                                {selectedRequest.priority === "urgent" ? "Urgent - Handle First" : "Normal Priority"}
                              </Badge>
                            </div>
                            <div>
                              <Label className="font-medium">Fee to Pay:</Label>
                              <p className="font-semibold">{selectedRequest.fee}</p>
                            </div>
                            {selectedRequest.processedBy && (
                              <div>
                                <Label className="font-medium">Handled By:</Label>
                                <p>{selectedRequest.processedBy}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Documents */}
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3">Documents They Submitted</h4>
                          <ul className="space-y-2">
                            {selectedRequest.documents.map((doc, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="font-medium">{doc}</span>
                                <span className="text-green-600 text-xs">✓ Received</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Notes */}
                        {selectedRequest.notes && (
                          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                            <h4 className="font-semibold mb-2 text-red-800">Important Notes</h4>
                            <p className="text-sm text-red-700">{selectedRequest.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Edit Request Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        Edit Request - {editingRequest?.requestNumber}
                      </DialogTitle>
                      <DialogDescription>
                        Update the status and add notes for this certificate request
                      </DialogDescription>
                    </DialogHeader>
                    {editingRequest && (
                      <div className="grid gap-6 py-4">
                        {/* Request Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Request Summary</h4>
                          <p className="text-sm">
                            <strong>{editingRequest.applicantName}</strong> requested a{" "}
                            <strong>{editingRequest.certificateType}</strong> for{" "}
                            <strong>{editingRequest.purpose}</strong>
                          </p>
                        </div>

                        {/* Status Update */}
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="status" className="text-base font-medium">
                              Update Status
                            </Label>
                            <p className="text-sm text-muted-foreground mb-2">
                              Choose what stage this request is currently in
                            </p>
                            <Select
                              value={editingRequest.status}
                              onValueChange={(value: CertificateRequest["status"]) =>
                                setEditingRequest({ ...editingRequest, status: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Waiting - New request to review</SelectItem>
                                <SelectItem value="processing">Working On - Currently being prepared</SelectItem>
                                <SelectItem value="approved">Approved - Ready to be completed</SelectItem>
                                <SelectItem value="rejected">Denied - Request cannot be fulfilled</SelectItem>
                                <SelectItem value="completed">Ready - Certificate is ready for pickup</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Priority Update */}
                          <div>
                            <Label htmlFor="priority" className="text-base font-medium">
                              Priority Level
                            </Label>
                            <p className="text-sm text-muted-foreground mb-2">Set how urgent this request is</p>
                            <Select
                              value={editingRequest.priority}
                              onValueChange={(value: CertificateRequest["priority"]) =>
                                setEditingRequest({ ...editingRequest, priority: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal - Regular processing</SelectItem>
                                <SelectItem value="urgent">Urgent - Handle first</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Notes */}
                          <div>
                            <Label htmlFor="notes" className="text-base font-medium">
                              Notes
                            </Label>
                            <p className="text-sm text-muted-foreground mb-2">
                              Add any important information or reasons (especially if denying the request)
                            </p>
                            <Textarea
                              id="notes"
                              placeholder="Example: Missing clear photo of ID, or documents are not complete..."
                              value={editingRequest.notes || ""}
                              onChange={(e) => setEditingRequest({ ...editingRequest, notes: e.target.value })}
                              rows={4}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <DialogFooter className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel - Don't Save
                      </Button>
                      <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                        Save Changes
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
