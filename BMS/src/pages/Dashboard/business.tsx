"use client";

import * as React from "react";
import {
  ClipboardList,
  FileText,
  Hourglass,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  Edit,
  Trash2,
  User,
  Building,
  Info,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useBusinessPermits, useBusinessPermit, useEditBusinessPermit, useDeleteBusinessPermit } from "@/stores/useBusinessPermits";
import { useToast } from "@/hooks/use-toast";
import { type BusinessPermit, type BusinessPermitStatus } from "@/types/business-permit";

const getStatusColor = (status: BusinessPermitStatus) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "completed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusExplanation = (status: BusinessPermitStatus) => {
  switch (status) {
    case "pending":
      return "Application submitted, awaiting review";
    case "approved":
      return "Permit granted and active";
    case "rejected":
      return "Application denied";
    case "completed":
      return "Permit process completed";
    default:
      return "";
  }
};

export default function BusinessPermitDashboard() {
  const { toast } = useToast();
  const { data: permits = [], isLoading, error } = useBusinessPermits();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | BusinessPermitStatus>("all");
  const [businessTypeFilter, setBusinessTypeFilter] = React.useState("all");
  const [selectedPermitId, setSelectedPermitId] = React.useState<number | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingPermit, setEditingPermit] = React.useState<BusinessPermit | null>(null);

  // Fetch single permit for viewing
  const { data: selectedPermit, isLoading: isPermitLoading } = useBusinessPermit(selectedPermitId || 0);

  // Mutations for edit and delete
  const editPermitMutation = useEditBusinessPermit();
  const deletePermitMutation = useDeleteBusinessPermit();

  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  // Filter permits
  const filteredPermits = permits.filter((permit) => {
    const matchesSearch =
      permit.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || permit.status === statusFilter;
    const matchesBusinessType = businessTypeFilter === "all" || permit.business_type === businessTypeFilter;
    return matchesSearch && matchesStatus && matchesBusinessType;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPermits = filteredPermits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPermits.length / itemsPerPage);

  // Stats for dashboard
  const stats = {
    total: permits.length,
    pending: permits.filter((p) => p.status === "pending").length,
    approved: permits.filter((p) => p.status === "approved").length,
    rejected: permits.filter((p) => p.status === "rejected").length,
    completed: permits.filter((p) => p.status === "completed").length,
  };

  const handleViewPermit = (permit: BusinessPermit) => {
    setSelectedPermitId(permit.id);
    setIsViewDialogOpen(true);
  };

  const handleEditPermit = (permit: BusinessPermit) => {
    setEditingPermit({ ...permit });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingPermit) {
      editPermitMutation.mutate(
        {
          id: editingPermit.id,
          data: {
            id: editingPermit.id,
            business_name: editingPermit.business_name,
            business_type: editingPermit.business_type,
            owner_name: editingPermit.owner_name,
            business_address: editingPermit.business_address,
            contact_number: editingPermit.contact_number,
            owner_address: editingPermit.owner_address,
            business_description: editingPermit.business_description,
            is_renewal: editingPermit.is_renewal,
            status: editingPermit.status,
          },
        },
        {
          onSuccess: () => {
            setIsEditDialogOpen(false);
            setEditingPermit(null);
          },
        }
      );
    }
  };

  const handleDeletePermit = (permitId: number) => {
    deletePermitMutation.mutate(permitId, {
      onSuccess: () => {
        if (currentPermits.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      },
    });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <div>Loading business permits...</div>;
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load business permits. Please try again.",
      variant: "destructive",
    });
    return <div>Error loading permits: {error.message}</div>;
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight">Business Permit Management</h1>
                      <p className="text-muted-foreground text-md">
                        Manage business permit applications and their statuses
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                        <ClipboardList className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Permits</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">All registered business permits</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Hourglass className="h-4 w-4 text-yellow-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">Applications awaiting review</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                        <p className="text-xs text-muted-foreground">Permits granted and active</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        <XCircle className="h-4 w-4 text-red-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                        <p className="text-xs text-muted-foreground">Applications that were denied</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
                        <p className="text-xs text-muted-foreground">Permits fully processed</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card className="!p-0 border-none shadow-none">
                    <CardHeader>
                      <CardTitle>All Business Permits</CardTitle>
                      <CardDescription>View and manage all business permit applications</CardDescription>
                    </CardHeader>
                    <CardContent className="!p-0">
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium mb-3">Find Permits</h3>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-1 items-center space-x-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search by business name, owner name, or ID..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="max-w-sm"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Select
                                    value={statusFilter}
                                    onValueChange={(value: string) => setStatusFilter(value as BusinessPermitStatus | "all")}
                                    >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Business Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {[...new Set(permits.map((p) => p.business_type))].map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Permit ID</TableHead>
                              <TableHead>Business Name</TableHead>
                              <TableHead>Owner Name</TableHead>
                              <TableHead>Business Type</TableHead>
                              <TableHead>Renewal Status</TableHead>
                              <TableHead>Permit Status</TableHead>
                              <TableHead>Date Submitted</TableHead>
                              <TableHead>Last Updated</TableHead>
                              <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentPermits.map((permit: BusinessPermit) => (
                              <TableRow key={permit.id}>
                                <TableCell className="font-medium">{permit.id}</TableCell>
                                <TableCell>
                                  <div className="max-w-[200px] truncate" title={permit.business_name}>
                                    {permit.business_name}
                                  </div>
                                </TableCell>
                                <TableCell>{permit.owner_name}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{permit.business_type}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={permit.is_renewal ? "default" : "secondary"}>
                                    {permit.is_renewal ? "Renewal" : "New"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <Badge className={getStatusColor(permit.status)}>{permit.status}</Badge>
                                    <p className="text-xs text-muted-foreground">
                                      ({getStatusExplanation(permit.status)})
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>{new Date(permit.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(permit.updated_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleViewPermit(permit)}
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
                                          onClick={() => handleEditPermit(permit)}
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
                                          <p>Delete Permit</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      <AlertDialogContent>
                                        <DialogHeader>
                                          <AlertDialogTitle>Delete This Business Permit?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to permanently delete the business permit for{" "}
                                            <strong>{permit.business_name}</strong> owned by{" "}
                                            <strong>{permit.owner_name}</strong>?
                                            <br />
                                            <br />
                                            This action cannot be undone. The permit will be completely removed from the system.
                                          </AlertDialogDescription>
                                        </DialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel - Keep Permit</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeletePermit(permit.id)}
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
                      {filteredPermits.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No business permits found matching your search.</p>
                        </div>
                      )}
                      {totalPages > 1 && (
                        <Pagination className="mt-4">
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (currentPage > 1) handlePageChange(currentPage - 1);
                                }}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                            {Array.from({ length: totalPages }, (_, i) => (
                              <PaginationItem key={i}>
                                <PaginationLink
                                  href="#"
                                  isActive={currentPage === i + 1}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(i + 1);
                                  }}
                                >
                                  {i + 1}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            <PaginationItem>
                              <PaginationNext
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                }}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      )}
                    </CardContent>
                  </Card>
                </div>
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        View Details - {selectedPermit?.id}
                      </DialogTitle>
                      <DialogDescription>All information about this business permit (read-only)</DialogDescription>
                    </DialogHeader>
                    {isPermitLoading ? (
                      <div>Loading permit details...</div>
                    ) : selectedPermit ? (
                      <div className="grid gap-6 py-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            About the Owner
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="font-medium">Full Name:</Label>
                              <p>{selectedPermit.owner_name}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Contact Number:</Label>
                              <p>{selectedPermit.contact_number || "Not provided"}</p>
                            </div>
                            <div className="col-span-2">
                              <Label className="font-medium">Owner Address:</Label>
                              <p>{selectedPermit.owner_address || "Not specified"}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            About This Business
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <Label className="font-medium">Business Name:</Label>
                              <p>{selectedPermit.business_name}</p>
                            </div>
                            <div>
                              <Label className="font-medium">Full Description:</Label>
                              <p className="bg-white p-3 rounded border">
                                {selectedPermit.business_description || "No description provided."}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-medium">Business Type:</Label>
                                <Badge variant="outline">{selectedPermit.business_type}</Badge>
                              </div>
                              <div>
                                <Label className="font-medium">Business Address:</Label>
                                <p>{selectedPermit.business_address}</p>
                              </div>
                            </div>
                            <div>
                              <Label className="font-medium">Application Type:</Label>
                              <Badge variant={selectedPermit.is_renewal ? "default" : "secondary"}>
                                {selectedPermit.is_renewal ? "Renewal" : "New Application"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Permit Status & Dates
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="font-medium">Current Status:</Label>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(selectedPermit.status)}>{selectedPermit.status}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  ({getStatusExplanation(selectedPermit.status)})
                                </span>
                              </div>
                            </div>
                            <div>
                              <Label className="font-medium">Date Submitted:</Label>
                              <p>{new Date(selectedPermit.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="col-span-2">
                              <Label className="font-medium">Last Updated:</Label>
                              <p>{new Date(selectedPermit.updated_at).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>Error loading permit details.</div>
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
                        Edit Business Permit - {editingPermit?.id}
                      </DialogTitle>
                      <DialogDescription>Update the details and status for this business permit</DialogDescription>
                    </DialogHeader>
                    {editingPermit && (
                      <div className="grid gap-6 py-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Permit Summary</h4>
                          <p className="text-sm">
                            <strong>{editingPermit.owner_name}</strong> applied for:{" "}
                            <strong>{editingPermit.business_name}</strong>
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="business_name">Business Name</Label>
                            <Input
                              id="business_name"
                              value={editingPermit.business_name}
                              onChange={(e) => setEditingPermit({ ...editingPermit, business_name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="business_type">Business Type</Label>
                            <Input
                              id="business_type"
                              value={editingPermit.business_type}
                              onChange={(e) => setEditingPermit({ ...editingPermit, business_type: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="owner_name">Owner Name</Label>
                            <Input
                              id="owner_name"
                              value={editingPermit.owner_name}
                              onChange={(e) => setEditingPermit({ ...editingPermit, owner_name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact_number">Contact Number</Label>
                            <Input
                              id="contact_number"
                              value={editingPermit.contact_number}
                              onChange={(e) => setEditingPermit({ ...editingPermit, contact_number: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="business_address">Business Address</Label>
                          <Textarea
                            id="business_address"
                            value={editingPermit.business_address}
                            onChange={(e) => setEditingPermit({ ...editingPermit, business_address: e.target.value })}
                            className="min-h-[80px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="owner_address">Owner Address</Label>
                          <Textarea
                            id="owner_address"
                            value={editingPermit.owner_address}
                            onChange={(e) => setEditingPermit({ ...editingPermit, owner_address: e.target.value })}
                            className="min-h-[80px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="business_description">Business Description</Label>
                          <Textarea
                            id="business_description"
                            value={editingPermit.business_description}
                            onChange={(e) =>
                              setEditingPermit({ ...editingPermit, business_description: e.target.value })
                            }
                            className="min-h-[120px]"
                          />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                          <Label htmlFor="is_renewal">Is Renewal Application?</Label>
                          <Switch
                            id="is_renewal"
                            checked={editingPermit.is_renewal}
                            onCheckedChange={(checked) => setEditingPermit({ ...editingPermit, is_renewal: checked })}
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="status" className="text-base font-medium">
                              Update Status
                            </Label>
                            <p className="text-sm text-muted-foreground mb-2">
                              Choose what stage this permit application is currently in
                            </p>
                            <Select
                              value={editingPermit.status}
                              onValueChange={(value: BusinessPermitStatus) =>
                                setEditingPermit({ ...editingPermit, status: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending - Awaiting review</SelectItem>
                                <SelectItem value="approved">Approved - Permit granted</SelectItem>
                                <SelectItem value="rejected">Rejected - Application denied</SelectItem>
                                <SelectItem value="completed">Completed - Process finalized</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}
                    <DialogFooter className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel - Don&apos;t Save
                      </Button>
                      <Button
                        onClick={handleSaveEdit}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={editPermitMutation.isPending}
                      >
                        {editPermitMutation.isPending ? "Saving..." : "Save Changes"}
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