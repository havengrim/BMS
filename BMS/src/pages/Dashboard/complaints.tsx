import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import * as React from "react"
import { AlertCircle, CheckCircle, Clock, FileText, Plus, Search, Download, Eye, Edit, Trash2 } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample data
const complaintsData = [
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


export default function Page() {
     const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)

  const filteredComplaints = complaintsData.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    const matchesCategory = categoryFilter === "all" || complaint.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

     const stats = {
    total: complaintsData.length,
    pending: complaintsData.filter((c) => c.status === "Pending").length,
    inProgress: complaintsData.filter((c) => c.status === "In Progress").length,
    resolved: complaintsData.filter((c) => c.status === "Resolved").length,
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
             <div className="space-y-6 px-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                    <h1 className="text-3xl font-bold tracking-tight">Complaints Management</h1>
                    <p className="text-muted-foreground">Manage and track barangay complaints and concerns</p>
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
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">Awaiting action</p>
                    </CardContent>
                    </Card>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                        <p className="text-xs text-muted-foreground">Currently being addressed</p>
                    </CardContent>
                    </Card>
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                        <p className="text-xs text-muted-foreground">Successfully completed</p>
                    </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardHeader>
                    <CardTitle>Complaints List</CardTitle>
                    <CardDescription>View and manage all barangay complaints</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-1 items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search complaints..."
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
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
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

                    {/* Complaints Table */}
                    <div className="mt-4 rounded-md border">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Complainant</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
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
                                <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                                </TableCell>
                                <TableCell>
                                <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                                </TableCell>
                                <TableCell>{complaint.dateSubmitted}</TableCell>
                                <TableCell>{complaint.assignedTo}</TableCell>
                                <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 5v.01M12 12v.01M12 19v.01"
                                        />
                                        </svg>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>

                    {filteredComplaints.length === 0 && (
                        <div className="text-center py-8">
                        <p className="text-muted-foreground">No complaints found matching your criteria.</p>
                        </div>
                    )}
                    </CardContent>
                </Card>
                </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
