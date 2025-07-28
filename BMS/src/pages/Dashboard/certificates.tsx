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
import {
  FileText,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  User,
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
    notes: "Incomplete documents - missing proof of age",
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

const statuses = ["All", "pending", "processing", "approved", "rejected", "completed"]
const priorities = ["All", "normal", "urgent"]
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
  const [actionNotes, setActionNotes] = useState("")

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

  const handleStatusUpdate = (requestId: string, newStatus: CertificateRequest["status"]) => {
    setRequests(
      requests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: newStatus,
              processedBy: newStatus !== "pending" ? "Current User" : undefined,
              completedDate: newStatus === "completed" ? new Date().toISOString().split("T")[0] : undefined,
              notes: actionNotes || request.notes,
            }
          : request,
      ),
    )
    setActionNotes("")
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

  const getPriorityColor = (priority: string) => {
    return priority === "urgent" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
  }

  return (
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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Header */}
              <div className="px-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight">Certificate Requests</h1>
                    <p className="text-muted-foreground text-md">Manage and process certificate requests from residents</p>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4 mb-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{requests.length}</div>
                      <p className="text-xs text-muted-foreground">All time requests</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending</CardTitle>
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{requests.filter((r) => r.status === "pending").length}</div>
                      <p className="text-xs text-muted-foreground">Awaiting review</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Processing</CardTitle>
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {requests.filter((r) => r.status === "processing").length}
                      </div>
                      <p className="text-xs text-muted-foreground">Being processed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Completed</CardTitle>
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
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, request number, or certificate type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full lg:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === "All" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className="w-full lg:w-40">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority === "All" ? "All Priority" : priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Certificate Type" />
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

              {/* Requests Table */}
              <div>
                <Card className="border-none !py-0">
                  <CardHeader>
                    <CardTitle>Certificate Requests</CardTitle>
                    <CardDescription>
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredRequests.length)} of{" "}
                      {filteredRequests.length} requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Request #</TableHead>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Certificate Type</TableHead>
                          <TableHead>Date Submitted</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Fee</TableHead>
                          <TableHead>Actions</TableHead>
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
                              <Badge className={getStatusColor(request.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(request.status)}
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(request.priority)}>
                                {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{request.fee}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleViewRequest(request)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {request.status === "pending" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleStatusUpdate(request.id, "processing")}
                                    >
                                      <Check className="h-4 w-4 text-green-600" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <X className="h-4 w-4 text-red-600" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Reject Request</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to reject this certificate request? Please provide a
                                            reason.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <Textarea
                                          placeholder="Reason for rejection..."
                                          value={actionNotes}
                                          onChange={(e) => setActionNotes(e.target.value)}
                                        />
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleStatusUpdate(request.id, "rejected")}>
                                            Reject Request
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                )}
                                {request.status === "processing" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStatusUpdate(request.id, "completed")}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </Button>
                                )}
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
                      <FileText className="h-5 w-5" />
                      Request Details - {selectedRequest?.requestNumber}
                    </DialogTitle>
                    <DialogDescription>Complete information about this certificate request</DialogDescription>
                  </DialogHeader>
                  {selectedRequest && (
                    <div className="grid gap-6 py-4">
                      {/* Applicant Information */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Applicant Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="font-medium">Name:</Label>
                            <p>{selectedRequest.applicantName}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Email:</Label>
                            <p>{selectedRequest.applicantEmail}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Phone:</Label>
                            <p>{selectedRequest.applicantPhone}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Purpose:</Label>
                            <p>{selectedRequest.purpose}</p>
                          </div>
                        </div>
                      </div>

                      {/* Request Information */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Request Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="font-medium">Certificate Type:</Label>
                            <p>{selectedRequest.certificateType}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Date Submitted:</Label>
                            <p>{new Date(selectedRequest.dateSubmitted).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Status:</Label>
                            <Badge className={getStatusColor(selectedRequest.status)}>
                              {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                            </Badge>
                          </div>
                          <div>
                            <Label className="font-medium">Priority:</Label>
                            <Badge className={getPriorityColor(selectedRequest.priority)}>
                              {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)}
                            </Badge>
                          </div>
                          <div>
                            <Label className="font-medium">Fee:</Label>
                            <p>{selectedRequest.fee}</p>
                          </div>
                          {selectedRequest.processedBy && (
                            <div>
                              <Label className="font-medium">Processed By:</Label>
                              <p>{selectedRequest.processedBy}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Documents */}
                      <div>
                        <h4 className="font-semibold mb-3">Submitted Documents</h4>
                        <ul className="space-y-1">
                          {selectedRequest.documents.map((doc, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Notes */}
                      {selectedRequest.notes && (
                        <div>
                          <h4 className="font-semibold mb-2">Notes</h4>
                          <p className="text-sm bg-muted p-3 rounded-md">{selectedRequest.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                      Close
                    </Button>
                    {selectedRequest?.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (selectedRequest) {
                              handleStatusUpdate(selectedRequest.id, "processing")
                              setIsViewDialogOpen(false)
                            }
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            if (selectedRequest) {
                              handleStatusUpdate(selectedRequest.id, "rejected")
                              setIsViewDialogOpen(false)
                            }
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    {selectedRequest?.status === "processing" && (
                      <Button
                        onClick={() => {
                          if (selectedRequest) {
                            handleStatusUpdate(selectedRequest.id, "completed")
                            setIsViewDialogOpen(false)
                          }
                        }}
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
