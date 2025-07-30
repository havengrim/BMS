"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import * as React from "react"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  HelpCircle,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Complaint {
  id: string
  title: string
  complainant: string
  category: string
  priority: string
  status: string
  dateSubmitted: string
  assignedTo: string
  description: string
  contactNumber?: string
  location?: string
  resolution?: string
}

// Sample data
const initialComplaints: Complaint[] = [
  {
    id: "C-2024-001",
    title: "Noise Complaint - Loud Music",
    complainant: "Maria Santos",
    category: "Noise",
    priority: "Medium",
    status: "In Progress",
    dateSubmitted: "2024-01-15",
    assignedTo: "Brgy. Tanod Team A",
    description: "Loud music from neighbor's house during late hours",
    contactNumber: "09171234567",
    location: "Block 5, Lot 12, Main Street",
  },
  {
    id: "C-2024-002",
    title: "Street Light Not Working",
    complainant: "Juan Dela Cruz",
    category: "Infrastructure",
    priority: "High",
    status: "Pending",
    dateSubmitted: "2024-01-14",
    assignedTo: "Maintenance Team",
    description: "Street light on Main Street has been broken for 3 days",
    contactNumber: "09187654321",
    location: "Main Street corner Rizal Avenue",
  },
  {
    id: "C-2024-003",
    title: "Stray Dogs in the Area",
    complainant: "Ana Rodriguez",
    category: "Animal Control",
    priority: "Medium",
    status: "Resolved",
    dateSubmitted: "2024-01-10",
    assignedTo: "Animal Control Unit",
    description: "Multiple stray dogs causing disturbance in residential area",
    contactNumber: "09191234567",
    location: "Residential Area Block 3",
    resolution: "Stray dogs were safely captured and relocated to animal shelter",
  },
  {
    id: "C-2024-004",
    title: "Illegal Parking",
    complainant: "Pedro Martinez",
    category: "Traffic",
    priority: "Low",
    status: "In Progress",
    dateSubmitted: "2024-01-12",
    assignedTo: "Traffic Enforcement",
    description: "Vehicles blocking the fire lane near the market",
    contactNumber: "09201234567",
    location: "Market Area, Fire Lane",
  },
  {
    id: "C-2024-005",
    title: "Water Leak on Road",
    complainant: "Rosa Garcia",
    category: "Infrastructure",
    priority: "High",
    status: "Pending",
    dateSubmitted: "2024-01-16",
    assignedTo: "Public Works",
    description: "Major water leak causing road damage on Rizal Street",
    contactNumber: "09211234567",
    location: "Rizal Street near the school",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Resolved":
      return "bg-green-100 text-green-800 border-green-200"
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 border-red-200"
    case "Medium":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "Low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusExplanation = (status: string) => {
  switch (status) {
    case "Pending":
      return "New complaint - waiting to be assigned"
    case "In Progress":
      return "Being worked on by assigned team"
    case "Resolved":
      return "Complaint has been fixed"
    case "Rejected":
      return "Complaint was not valid"
    default:
      return ""
  }
}

export default function Page() {
  const [complaints, setComplaints] = React.useState<Complaint[]>(initialComplaints)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [selectedComplaint, setSelectedComplaint] = React.useState<Complaint | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [editingComplaint, setEditingComplaint] = React.useState<Complaint | null>(null)

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    const matchesCategory = categoryFilter === "all" || complaint.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  }

  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setIsViewDialogOpen(true)
  }

  const handleEditComplaint = (complaint: Complaint) => {
    setEditingComplaint({ ...complaint })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingComplaint) {
      setComplaints(
        complaints.map((complaint) => (complaint.id === editingComplaint.id ? editingComplaint : complaint)),
      )
      setIsEditDialogOpen(false)
      setEditingComplaint(null)
    }
  }

  const handleDeleteComplaint = (complaintId: string) => {
    setComplaints(complaints.filter((complaint) => complaint.id !== complaintId))
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
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="space-y-6 px-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight">Complaints Management</h1>
                      <p className="text-muted-foreground text-md">Handle complaints and concerns from residents</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                        <HelpCircle className="h-4 w-4" />
                        <div>
                          <p className="font-medium">Simple Actions:</p>
                          <p>👁️ View • ✏️ Edit (to update status) • 🗑️ Delete</p>
                        </div>
                      </div>
                      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Complaint
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Add New Complaint</DialogTitle>
                            <DialogDescription>Register a new complaint or concern from a resident.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="complainant">Complainant Name</Label>
                                <Input id="complainant" placeholder="Enter full name" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="contact">Contact Number</Label>
                                <Input id="contact" placeholder="Enter phone number" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="title">Complaint Title</Label>
                              <Input id="title" placeholder="Brief description of the complaint" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="noise">Noise</SelectItem>
                                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                                    <SelectItem value="animal-control">Animal Control</SelectItem>
                                    <SelectItem value="traffic">Traffic</SelectItem>
                                    <SelectItem value="sanitation">Sanitation</SelectItem>
                                    <SelectItem value="security">Security</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea id="description" placeholder="Detailed description of the complaint" rows={4} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="location">Location/Address</Label>
                              <Input id="location" placeholder="Specific location where the issue occurred" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={() => setIsAddDialogOpen(false)}>Submit Complaint</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">All registered complaints</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Waiting</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">New complaints to assign</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Working On</CardTitle>
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                        <p className="text-xs text-muted-foreground">Being handled by teams</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Fixed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                        <p className="text-xs text-muted-foreground">Successfully resolved</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Filters and Search */}
                  <Card className="!p-0 border-none shadow-none">
                    <CardHeader>
                      <CardTitle>All Complaints</CardTitle>
                      <CardDescription>View and manage all barangay complaints</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium mb-3">Find Complaints</h3>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-1 items-center space-x-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search by title, complainant name, or ID..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="max-w-sm"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Pending">Waiting</SelectItem>
                                <SelectItem value="In Progress">Working On</SelectItem>
                                <SelectItem value="Resolved">Fixed</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="Noise">Noise</SelectItem>
                                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                <SelectItem value="Animal Control">Animal Control</SelectItem>
                                <SelectItem value="Traffic">Traffic</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Complaints Table */}
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Complaint ID</TableHead>
                              <TableHead>Problem Description</TableHead>
                              <TableHead>Person Complaining</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Priority</TableHead>
                              <TableHead>Current Status</TableHead>
                              <TableHead>Date Reported</TableHead>
                              <TableHead>Assigned Team</TableHead>
                              <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredComplaints.map((complaint) => (
                              <TableRow key={complaint.id}>
                                <TableCell className="font-medium">{complaint.id}</TableCell>
                                <TableCell>
                                  <div className="max-w-[200px] truncate" title={complaint.title}>
                                    {complaint.title}
                                  </div>
                                </TableCell>
                                <TableCell>{complaint.complainant}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{complaint.category}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getPriorityColor(complaint.priority)}>
                                    {complaint.priority === "High" && "Urgent"}
                                    {complaint.priority === "Medium" && "Normal"}
                                    {complaint.priority === "Low" && "Low"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <Badge className={getStatusColor(complaint.status)}>
                                      {complaint.status === "Pending" && "Waiting"}
                                      {complaint.status === "In Progress" && "Working On"}
                                      {complaint.status === "Resolved" && "Fixed"}
                                      {complaint.status === "Rejected" && "Rejected"}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground">
                                      {getStatusExplanation(complaint.status)}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>{new Date(complaint.dateSubmitted).toLocaleDateString()}</TableCell>
                                <TableCell>{complaint.assignedTo}</TableCell>
                                <TableCell className="text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    {/* View Button */}
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleViewComplaint(complaint)}
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
                                          onClick={() => handleEditComplaint(complaint)}
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
                                          <p>Delete Complaint</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete This Complaint?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to permanently delete the complaint from{" "}
                                            <strong>{complaint.complainant}</strong> about{" "}
                                            <strong>{complaint.title}</strong>?
                                            <br />
                                            <br />
                                            This action cannot be undone. The complaint will be completely removed from
                                            the system.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel - Keep Complaint</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteComplaint(complaint.id)}
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
                      </div>

                      {filteredComplaints.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No complaints found matching your search.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* View Complaint Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        View Details - {selectedComplaint?.id}
                      </DialogTitle>
                      <DialogDescription>All information about this complaint (read-only)</DialogDescription>
                    </DialogHeader>
                    {selectedComplaint && (
                      <div className="grid gap-6 py-4">
                        {/* Complainant Information */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            About the Person Complaining
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="font-medium">Full Name:</Label>
                              <p>{selectedComplaint.complainant}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Contact Number:</Label>
                              <p>{selectedComplaint.contactNumber || "Not provided"}</p>
                            </div>
                            <div className="col-span-2">
                              <Label className="font-medium">Location of Problem:</Label>
                              <p>{selectedComplaint.location || "Not specified"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Complaint Information */}
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            About This Complaint
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <Label className="font-medium">Problem Title:</Label>
                              <p>{selectedComplaint.title}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Full Description:</Label>
                              <p className="bg-white p-3 rounded border">{selectedComplaint.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-medium">Category:</Label>
                                <Badge variant="outline">{selectedComplaint.category}</Badge>
                              </div>
                              <div>
                                <Label className="font-medium">Priority Level:</Label>
                                <Badge className={getPriorityColor(selectedComplaint.priority)}>
                                  {selectedComplaint.priority === "High" && "Urgent - Handle First"}
                                  {selectedComplaint.priority === "Medium" && "Normal Priority"}
                                  {selectedComplaint.priority === "Low" && "Low Priority"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status Information */}
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3">Current Status</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="font-medium">Status:</Label>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(selectedComplaint.status)}>
                                  {selectedComplaint.status === "Pending" && "Waiting"}
                                  {selectedComplaint.status === "In Progress" && "Working On"}
                                  {selectedComplaint.status === "Resolved" && "Fixed"}
                                  {selectedComplaint.status === "Rejected" && "Rejected"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  ({getStatusExplanation(selectedComplaint.status)})
                                </span>
                              </div>
                            </div>
                            <div>
                              <Label className="font-medium">Assigned Team:</Label>
                              <p>{selectedComplaint.assignedTo}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Date Reported:</Label>
                              <p>{new Date(selectedComplaint.dateSubmitted).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        {/* Resolution */}
                        {selectedComplaint.resolution && (
                          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                            <h4 className="font-semibold mb-2 text-green-800">How It Was Fixed</h4>
                            <p className="text-sm text-green-700">{selectedComplaint.resolution}</p>
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

                {/* Edit Complaint Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        Edit Complaint - {editingComplaint?.id}
                      </DialogTitle>
                      <DialogDescription>Update the status and add information for this complaint</DialogDescription>
                    </DialogHeader>
                    {editingComplaint && (
                      <div className="grid gap-6 py-4">
                        {/* Complaint Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Complaint Summary</h4>
                          <p className="text-sm">
                            <strong>{editingComplaint.complainant}</strong> reported:{" "}
                            <strong>{editingComplaint.title}</strong>
                          </p>
                        </div>

                        {/* Status Update */}
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="status" className="text-base font-medium">
                              Update Status
                            </Label>
                            <p className="text-sm text-muted-foreground mb-2">
                              Choose what stage this complaint is currently in
                            </p>
                            <Select
                              value={editingComplaint.status}
                              onValueChange={(value: string) =>
                                setEditingComplaint({ ...editingComplaint, status: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Waiting - New complaint to assign</SelectItem>
                                <SelectItem value="In Progress">Working On - Team is handling it</SelectItem>
                                <SelectItem value="Resolved">Fixed - Problem has been solved</SelectItem>
                                <SelectItem value="Rejected">Rejected - Complaint is not valid</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Priority Update */}
                          <div>
                            <Label htmlFor="priority" className="text-base font-medium">
                              Priority Level
                            </Label>
                            <p className="text-sm text-muted-foreground mb-2">Set how urgent this complaint is</p>
                            <Select
                              value={editingComplaint.priority}
                              onValueChange={(value: string) =>
                                setEditingComplaint({ ...editingComplaint, priority: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="High">Urgent - Handle immediately</SelectItem>
                                <SelectItem value="Medium">Normal - Regular processing</SelectItem>
                                <SelectItem value="Low">Low - Handle when available</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Assigned Team */}
                          <div>
                            <Label htmlFor="assignedTo" className="text-base font-medium">
                              Assigned Team
                            </Label>
                            <p className="text-sm text-muted-foreground mb-2">Which team should handle this?</p>
                            <Input
                              id="assignedTo"
                              value={editingComplaint.assignedTo}
                              onChange={(e) => setEditingComplaint({ ...editingComplaint, assignedTo: e.target.value })}
                              placeholder="Enter team name"
                            />
                          </div>

                          {/* Resolution (if status is Resolved) */}
                          {editingComplaint.status === "Resolved" && (
                            <div>
                              <Label htmlFor="resolution" className="text-base font-medium">
                                How Was It Fixed?
                              </Label>
                              <p className="text-sm text-muted-foreground mb-2">
                                Explain what was done to solve the problem
                              </p>
                              <Textarea
                                id="resolution"
                                placeholder="Example: Street light was repaired and is now working properly..."
                                value={editingComplaint.resolution || ""}
                                onChange={(e) =>
                                  setEditingComplaint({ ...editingComplaint, resolution: e.target.value })
                                }
                                rows={3}
                              />
                            </div>
                          )}
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
