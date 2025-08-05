"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import * as React from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Search,
  Eye,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useComplaints,  useUpdateComplaint, useDeleteComplaint } from "@/stores/useComplaints";
import { useAuthStore } from "@/stores/authStore";

// Complaint type from hooks
export type Complaint = {
  id: number;
  reference_number: string;
  type: string;
  fullname: string;
  contact_number: string;
  address: string;
  email_address: string;
  subject: string;
  detailed_description: string;
  respondent_name: string;
  respondent_address: string;
  latitude: number;
  longitude: number;
  location: { lat: number; lng: number };
  date_filed: string;
  status: string;
  priority: string;
  evidence: { id: number; file_url: string };
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "investigating":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "mediation":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusExplanation = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "New complaint - waiting to be assigned";
    case "investigating":
      return "Being worked on by assigned team";
    case "mediation":
      return "In mediation process";
    case "resolved":
      return "Complaint has been fixed";
    default:
      return "";
  }
};

const getStatusDisplay = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Waiting";
    case "investigating":
      return "Working On";
    case "mediation":
      return "In Mediation";
    case "resolved":
      return "Fixed";
    default:
      return status;
  }
};

const getPriorityDisplay = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "Urgent";
    case "medium":
      return "Normal";
    case "low":
      return "Low";
    default:
      return priority;
  }
};

export default function Page() {
  const { user, loading } = useAuthStore();
  const { data: complaints, isLoading, error } = useComplaints();
  const updateComplaint = useUpdateComplaint();
  const deleteComplaint = useDeleteComplaint();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [selectedComplaint, setSelectedComplaint] = React.useState<Complaint | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingComplaint, setEditingComplaint] = React.useState<Complaint | null>(null);

  // Check if user is admin
  const isAdmin = user && user.profile?.role === "admin";

  // Filter complaints
  const filteredComplaints = complaints?.filter((complaint) => {
    const matchesSearch =
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.reference_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || complaint.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === "all" || complaint.type.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesCategory;
  }) || [];

  // Stats for cards
  const stats = {
    total: complaints?.length || 0,
    pending: complaints?.filter((c) => c.status.toLowerCase() === "pending").length || 0,
    inProgress: complaints?.filter((c) => c.status.toLowerCase() === "investigating").length || 0,
    resolved: complaints?.filter((c) => c.status.toLowerCase() === "resolved").length || 0,
  };

  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsViewDialogOpen(true);
  };

  const handleEditComplaint = (complaint: Complaint) => {
    setEditingComplaint({ ...complaint });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingComplaint) return;

    const formData = new FormData();
    formData.append("status", editingComplaint.status);
    formData.append("priority", editingComplaint.priority);
    // Add other fields if needed, but for admin, typically only status and priority are updated
    formData.append("type", editingComplaint.type);
    formData.append("fullname", editingComplaint.fullname);
    formData.append("contact_number", editingComplaint.contact_number);
    formData.append("email_address", editingComplaint.email_address);
    formData.append("address", editingComplaint.address);
    formData.append("subject", editingComplaint.subject);
    formData.append("detailed_description", editingComplaint.detailed_description);
    formData.append("respondent_name", editingComplaint.respondent_name);
    formData.append("respondent_address", editingComplaint.respondent_address);
    formData.append("latitude", String(editingComplaint.latitude));
    formData.append("longitude", String(editingComplaint.longitude));

    try {
      await updateComplaint.mutateAsync({ id: editingComplaint.id, data: formData });
      setIsEditDialogOpen(false);
      setEditingComplaint(null);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDeleteComplaint = async (id: number) => {
    try {
      await deleteComplaint.mutateAsync(id);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Handle loading and access control
  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col items-center justify-center">
            <p>Loading...</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!isAdmin) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Access Restricted</span>
              </div>
              <p className="text-red-700 mt-2 text-sm">
                Only admin users can access the complaints management dashboard.
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
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
                    <CardContent className="!p-0">
                      {isLoading && (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                          <p className="text-sm text-muted-foreground">Loading complaints...</p>
                        </div>
                      )}

                      {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-700">Failed to load complaints: {error.message}</p>
                        </div>
                      )}

                      {!isLoading && !error && (
                        <>
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
                                    <SelectItem value="pending">Waiting</SelectItem>
                                    <SelectItem value="investigating">Working On</SelectItem>
                                    <SelectItem value="mediation">In Mediation</SelectItem>
                                    <SelectItem value="resolved">Fixed</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="noise">Noise</SelectItem>
                                    <SelectItem value="dispute">Neighbor Dispute</SelectItem>
                                    <SelectItem value="safety">Safety Concern</SelectItem>
                                    <SelectItem value="property">Property Issue</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
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
                                  <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredComplaints.map((complaint) => (
                                  <TableRow key={complaint.id}>
                                    <TableCell className="font-medium">{complaint.reference_number}</TableCell>
                                    <TableCell>
                                      <div className="max-w-[200px] truncate" title={complaint.subject}>
                                        {complaint.subject}
                                      </div>
                                    </TableCell>
                                    <TableCell>{complaint.fullname}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline">{complaint.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge className={getPriorityColor(complaint.priority)}>
                                        {getPriorityDisplay(complaint.priority)}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <div className="space-y-1">
                                        <Badge className={getStatusColor(complaint.status)}>
                                          {getStatusDisplay(complaint.status)}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground">
                                          {getStatusExplanation(complaint.status)}
                                        </p>
                                      </div>
                                    </TableCell>
                                    <TableCell>{new Date(complaint.date_filed).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-center">
                                      <div className="flex items-center justify-center gap-2">
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
                                                <strong>{complaint.fullname}</strong> about{" "}
                                                <strong>{complaint.subject}</strong> (Reference: {complaint.reference_number})?
                                                <br />
                                                <br />
                                                This action cannot be undone. The complaint will be completely removed from the system.
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
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        View Details - {selectedComplaint?.reference_number || "Loading..."}
                      </DialogTitle>
                      <DialogDescription>All information about this complaint (read-only)</DialogDescription>
                    </DialogHeader>
                    {selectedComplaint ? (
                      <div className="grid gap-6 py-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            About the Person Complaining
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="font-medium">Full Name:</Label>
                              <p>{selectedComplaint.fullname || "N/A"}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Contact Number:</Label>
                              <p>{selectedComplaint.contact_number || "Not provided"}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Email Address:</Label>
                              <p>{selectedComplaint.email_address || "Not provided"}</p>
                            </div>
                            <div className="col-span-2">
                              <Label className="font-medium">Address:</Label>
                              <p>{selectedComplaint.address || "Not specified"}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            About This Complaint
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <Label className="font-medium">Problem Title:</Label>
                              <p>{selectedComplaint.subject || "N/A"}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Full Description:</Label>
                              <p className="bg-white p-3 rounded border">{selectedComplaint.detailed_description || "N/A"}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-medium">Category:</Label>
                                <Badge variant="outline">{selectedComplaint.type || "N/A"}</Badge>
                              </div>
                              <div>
                                <Label className="font-medium">Priority Level:</Label>
                                <Badge className={getPriorityColor(selectedComplaint.priority)}>
                                  {getPriorityDisplay(selectedComplaint.priority) || "N/A"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3">Current Status</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="font-medium">Status:</Label>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(selectedComplaint.status)}>
                                  {getStatusDisplay(selectedComplaint.status) || "N/A"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  ({getStatusExplanation(selectedComplaint.status) || "No status available"})
                                </span>
                              </div>
                            </div>
                            <div>
                              <Label className="font-medium">Date Reported:</Label>
                              <p>{selectedComplaint.date_filed ? new Date(selectedComplaint.date_filed).toLocaleDateString() : "N/A"}</p>
                            </div>
                            <div className="col-span-2">
                              <Label className="font-medium">Location:</Label>
                              <p>
                                Latitude: {typeof selectedComplaint.latitude === 'string' && !isNaN(parseFloat(selectedComplaint.latitude))
                                  ? parseFloat(selectedComplaint.latitude).toFixed(6)
                                  : 'N/A'},
                                Longitude: {typeof selectedComplaint.longitude === 'string' && !isNaN(parseFloat(selectedComplaint.longitude))
                                  ? parseFloat(selectedComplaint.longitude).toFixed(6)
                                  : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {selectedComplaint.respondent_name && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3">Respondent Information</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <Label className="font-medium">Name:</Label>
                                <p>{selectedComplaint.respondent_name || "N/A"}</p>
                              </div>
                              <div>
                                <Label className="font-medium">Address:</Label>
                                <p>{selectedComplaint.respondent_address || "Not provided"}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3">Evidence</h4>
                          {selectedComplaint.evidence && selectedComplaint.evidence.file_url ? (
                            /\.(jpg|jpeg|png|gif)$/i.test(selectedComplaint.evidence.file_url) ? (
                              <img
                                src={selectedComplaint.evidence.file_url}
                                alt="Evidence"
                                className="w-auto max-w-full max-h-72 object-contain rounded-lg"
                                onError={() => console.error("Failed to load image:", selectedComplaint.evidence.file_url)}
                              />
                            ) : /\.(mp4|webm|ogg)$/i.test(selectedComplaint.evidence.file_url) ? (
                              <video
                                src={selectedComplaint.evidence.file_url}
                                className="w-auto max-w-full max-h-72 object-contain rounded-lg"
                                controls
                                onError={() => console.error("Failed to load video:", selectedComplaint.evidence.file_url)}
                              />
                            ) : (
                              <p className="text-sm text-muted-foreground">Unsupported file type or invalid URL</p>
                            )
                          ) : (
                            <p className="text-sm text-muted-foreground">No evidence provided for this complaint.</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Loading complaint details...</p>
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
                        Edit Complaint - {editingComplaint?.reference_number}
                      </DialogTitle>
                      <DialogDescription>Update the status and priority for this complaint</DialogDescription>
                    </DialogHeader>
                    {editingComplaint && (
                      <div className="grid gap-6 py-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Complaint Summary</h4>
                          <p className="text-sm">
                            <strong>{editingComplaint.fullname}</strong> reported: <strong>{editingComplaint.subject}</strong>
                          </p>
                        </div>

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
                                <SelectItem value="pending">Waiting - New complaint to assign</SelectItem>
                                <SelectItem value="investigating">Working On - Team is handling it</SelectItem>
                                <SelectItem value="mediation">In Mediation - Mediation scheduled</SelectItem>
                                <SelectItem value="resolved">Fixed - Problem has been solved</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

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
                                <SelectItem value="high">Urgent - Handle immediately</SelectItem>
                                <SelectItem value="medium">Normal - Regular processing</SelectItem>
                                <SelectItem value="low">Low - Handle when available</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                    <DialogFooter className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel - Don't Save
                      </Button>
                      <Button
                        onClick={handleSaveEdit}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={updateComplaint.isPending}
                      >
                        {updateComplaint.isPending ? "Saving..." : "Save Changes"}
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
  );
}
