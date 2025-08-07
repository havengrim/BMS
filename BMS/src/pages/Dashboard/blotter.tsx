import React, { useState, useMemo } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Clock, CheckCircle, Package, AlertTriangle, Edit, Trash2, Eye, Filter, Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useBlotters, useEditBlotter, useDeleteBlotter, type BlotterReport, type Status, type Priority } from "@/stores/useBlotter";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "under_investigation", label: "Under Investigation" },
  { value: "resolved", label: "Resolved" },
  { value: "dismissed", label: "Dismissed" },
];

const priorityOptions = [
  { value: "all", label: "All Priority" },
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

const incidentTypeOptions = [
  { value: "all", label: "All Types" },
  { value: "Noise Complaint", label: "Noise Complaint" },
  { value: "Theft/Burglary", label: "Theft/Burglary" },
  { value: "Neighbor Dispute", label: "Neighbor Dispute" },
  { value: "Traffic Violation", label: "Traffic Violation" },
  { value: "Property Damage", label: "Property Damage" },
  { value: "Others", label: "Others" },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "under_investigation":
      return <Package className="h-4 w-4" />;
    case "resolved":
      return <CheckCircle className="h-4 w-4" />;
    case "dismissed":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "under_investigation":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200";
    case "dismissed":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 border-red-200";
    case "Medium":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function BlotterAdminDashboard() {
  const { data: reports = [], isLoading } = useBlotters();
  const editBlotter = useEditBlotter();
  const deleteBlotter = useDeleteBlotter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedReport, setSelectedReport] = useState<BlotterReport | null>(null);
  const [editingReport, setEditingReport] = useState<BlotterReport | null>(null);
  const [deletingReport, setDeletingReport] = useState<BlotterReport | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter and search logic
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch = 
        report.report_number.toString().includes(searchTerm.toLowerCase()) ||
        report.complainant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.incident_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || report.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter;
      const matchesType = typeFilter === "all" || report.incident_type === typeFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });
  }, [reports, searchTerm, statusFilter, priorityFilter, typeFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const stats = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r: BlotterReport) => r.status === "pending").length;
    const investigating = reports.filter((r: BlotterReport) => r.status === "under_investigation").length;
    const resolved = reports.filter((r: BlotterReport) => r.status === "resolved").length;
    
    return { total, pending, investigating, resolved };
  }, [reports]);

  const handleView = (report: BlotterReport) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleEdit = (report: BlotterReport) => {
    setEditingReport(report);
    setEditDialogOpen(true);
  };

  const handleDelete = (report: BlotterReport) => {
    setDeletingReport(report);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingReport) return;

    editBlotter.mutate({
      id: editingReport.report_number,
      data: {
        status: editingReport.status,
        priority: editingReport.priority,
        respondent_name: editingReport.respondent_name,
        witnesses: editingReport.witnesses,
        resolution_notes: editingReport.resolution_notes,
      }
    });

    setEditDialogOpen(false);
    setEditingReport(null);
  };

  const confirmDelete = () => {
    if (!deletingReport) return;

    deleteBlotter.mutate(deletingReport.report_number);
    
    setDeleteDialogOpen(false);
    setDeletingReport(null);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setTypeFilter("all");
    setCurrentPage(1);
    toast({ title: "Filters Cleared", description: "All filters have been reset." });
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
              <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">Blotter Management</h1>
                    <p className="text-muted-foreground">
                      Manage and track all incident reports in the barangay
                    </p>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.total}</div>
                      <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending</CardTitle>
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.pending}</div>
                      <p className="text-xs text-muted-foreground">Awaiting review</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Investigating</CardTitle>
                      <Package className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.investigating}</div>
                      <p className="text-xs text-muted-foreground">In progress</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.resolved}</div>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters & Search
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search reports..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {incidentTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" onClick={resetFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Reports Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Incident Reports</CardTitle>
                    <CardDescription>
                      Showing {paginatedReports.length} of {filteredReports.length} reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reference</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Complainant</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedReports.map((report) => (
                          <TableRow key={report.report_number}>
                            <TableCell className="font-medium">BLT-{report.report_number}</TableCell>
                            <TableCell>{report.incident_type}</TableCell>
                            <TableCell>{report.complainant_name}</TableCell>
                            <TableCell>
                              {new Date(report.incident_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(report.status)} flex items-center gap-1 w-fit`}>
                                {getStatusIcon(report.status)}
                                {report.status.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(report.priority)}>
                                {report.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleView(report)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(report)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(report)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* View Dialog */}
                <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Incident Report Details</DialogTitle>
                      <DialogDescription>
                        Reference: BLT-{selectedReport?.report_number}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedReport && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div>
                            <Label className="font-medium">Incident Type</Label>
                            <p>{selectedReport.incident_type}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Complainant</Label>
                            <p>{selectedReport.complainant_name}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Contact Number</Label>
                            <p>{selectedReport.contact_number || "N/A"}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Email</Label>
                            <p>{selectedReport.email_address || "N/A"}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Incident Date & Time</Label>
                            <p>{new Date(selectedReport.incident_date).toLocaleDateString()} at {selectedReport.incident_time}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Location</Label>
                            <p>{selectedReport.location}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Respondent</Label>
                            <p>{selectedReport.respondent_name || "N/A"}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label className="font-medium">Status</Label>
                            <div className="mt-1">
                              <Badge className={getStatusColor(selectedReport.status)}>
                                {selectedReport.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Label className="font-medium">Priority</Label>
                            <div className="mt-1">
                              <Badge className={getPriorityColor(selectedReport.priority)}>
                                {selectedReport.priority}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Label className="font-medium">Date Filed</Label>
                            <p>{new Date(selectedReport.created_at).toLocaleString()}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Last Updated</Label>
                            <p>{new Date(selectedReport.updated_at).toLocaleString()}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Witnesses</Label>
                            <p>{selectedReport.witnesses || "None"}</p>
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <div>
                            <Label className="font-medium">Description</Label>
                            <p className="mt-1 text-sm">{selectedReport.description}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Resolution Notes</Label>
                            <p className="mt-1 text-sm">{selectedReport.resolution_notes || "No notes available"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Incident Report</DialogTitle>
                      <DialogDescription>
                        Reference: BLT-{editingReport?.report_number}
                      </DialogDescription>
                    </DialogHeader>
                    {editingReport && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                              value={editingReport.status}
                              onValueChange={(value) => setEditingReport({ ...editingReport, status: value as Status })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="under_investigation">Under Investigation</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="dismissed">Dismissed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="edit-priority">Priority</Label>
                            <Select
                              value={editingReport.priority}
                              onValueChange={(value) => setEditingReport({ ...editingReport, priority: value as Priority })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="edit-respondent">Respondent Name</Label>
                            <Input
                              id="edit-respondent"
                              value={editingReport.respondent_name || ""}
                              onChange={(e) => setEditingReport({ ...editingReport, respondent_name: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-witnesses">Witnesses</Label>
                            <Textarea
                              id="edit-witnesses"
                              value={editingReport.witnesses || ""}
                              onChange={(e) => setEditingReport({ ...editingReport, witnesses: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-notes">Resolution Notes</Label>
                            <Textarea
                              id="edit-notes"
                              value={editingReport.resolution_notes || ""}
                              onChange={(e) => setEditingReport({ ...editingReport, resolution_notes: e.target.value })}
                              className="min-h-[100px]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit} disabled={editBlotter.isPending}>
                        {editBlotter.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the incident report
                        <strong> BLT-{deletingReport?.report_number}</strong> and remove all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={confirmDelete} 
                        className="bg-red-600 hover:bg-red-700"
                        disabled={deleteBlotter.isPending}
                      >
                        {deleteBlotter.isPending ? "Deleting..." : "Delete Report"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}