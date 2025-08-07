"use client";

import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Clock,
  CheckCircle,
  Package,
  AlertTriangle,
  Shield,
  Users,
  Volume2,
  Car,
  Home,
  FilePlus,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  useBlotters,
  useCreateBlotter,
  type IncidentType,
  type Priority,
} from "@/stores/useBlotter";
import { useAuthStore } from "@/stores/authStore";
import { useQueryClient } from "@tanstack/react-query";

const incidentTypes = [
  {
    id: "noise-complaint",
    name: "Noise Complaint",
    description: "Report excessive noise disturbances in the community",
    icon: <Volume2 className="h-5 w-5 text-primary" />,
    priority: "Medium",
    processing: "1-2 business days",
  },
  {
    id: "theft-burglary",
    name: "Theft/Burglary",
    description: "Report stolen items or break-in incidents",
    icon: <Shield className="h-5 w-5 text-primary" />,
    priority: "High",
    processing: "Same day",
  },
  {
    id: "neighbor-dispute",
    name: "Neighbor Dispute",
    description: "Report conflicts or disputes with neighbors",
    icon: <Users className="h-5 w-5 text-primary" />,
    priority: "Medium",
    processing: "2-3 business days",
  },
  {
    id: "traffic-violation",
    name: "Traffic Violation",
    description: "Report traffic violations or parking issues",
    icon: <Car className="h-5 w-5 text-primary" />,
    priority: "Low",
    processing: "3-5 business days",
  },
  {
    id: "property-damage",
    name: "Property Damage",
    description: "Report damage to public or private property",
    icon: <Home className="h-5 w-5 text-primary" />,
    priority: "Medium",
    processing: "2-3 business days",
  },
  {
    id: "others",
    name: "Others",
    description: "Report incidents not covered by other categories",
    icon: <FilePlus className="h-5 w-5 text-primary" />,
    priority: "Varies",
    processing: "To be determined",
  },
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

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending Review";
    case "under_investigation":
      return "Under Investigation";
    case "resolved":
      return "Resolved";
    case "dismissed":
      return "Dismissed";
    default:
      return "Unknown";
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

export default function BlotterPage() {
  const [selectedIncident, setSelectedIncident] = useState("");
  const [formData, setFormData] = useState({
    complainant_name: "",
    contact_number: "",
    email_address: "",
    incident_date: "",
    incident_time: "",
    location: "",
    respondent_name: "",
    description: "",
    witnesses: "",
    agree_terms: false,
  });

  const { toast } = useToast();
  const { user, loading } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: reports = [], isPending, error } = useBlotters();
  const { mutateAsync, isPending: isPendingCreate } = useCreateBlotter();

  const isResident = user && user.profile?.role && ["resident"].includes(user.profile.role);

  // Clear blotters cache when user changes (logout/login)
  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["blotters"] });
  }, [user, queryClient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isResident) {
      toast({
        title: "Only residents can file incident reports",
        variant: "destructive",
      });
      return;
    }

    if (!selectedIncident) {
      toast({
        title: "Please select an incident type",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agree_terms) {
      toast({
        title: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    const selectedType = incidentTypes.find((type) => type.id === selectedIncident);

    try {
      await mutateAsync({
        incident_type: selectedType?.name as IncidentType,
        complainant_name: formData.complainant_name,
        contact_number: formData.contact_number,
        email_address: formData.email_address,
        incident_date: formData.incident_date,
        incident_time: formData.incident_time,
        location: formData.location,
        respondent_name: formData.respondent_name,
        description: formData.description,
        witnesses: formData.witnesses,
        agree_terms: formData.agree_terms,
        priority: selectedType?.priority as Priority,
      });
      toast({
        title: "Incident report submitted successfully",
        description: `Your report has been submitted.`,
      });
      setSelectedIncident("");
      setFormData({
        complainant_name: "",
        contact_number: "",
        email_address: "",
        incident_date: "",
        incident_time: "",
        location: "",
        respondent_name: "",
        description: "",
        witnesses: "",
        agree_terms: false,
      });
    } catch (err) {
      console.error("Submit error:", err);
      toast({
        title: "Error",
        description: "Failed to submit incident report.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Incident Reporting System</h1>
          <p>Your role: {user?.profile?.role || "No role detected"}</p>
          <p className="text-muted-foreground">
            Report incidents and track the status of your complaints
          </p>
        </div>

        {!isResident && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Access Restricted</span>
            </div>
            <p className="text-red-700 mt-2 text-sm">
              You must be logged in as a resident of Barangay Sindalan to file or track incident reports. Please log in or register as a resident.
            </p>
          </div>
        )}

        <Tabs defaultValue="report">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger
              value="report"
              className="flex items-center gap-2"
              disabled={!isResident}
            >
              <FileText className="h-4 w-4" />
              File Report
            </TabsTrigger>
            <TabsTrigger
              value="track"
              className="flex items-center gap-2"
              disabled={!isResident}
            >
              <Package className="h-4 w-4" />
              My Reports ({reports.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="report">
            {isResident ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <h2 className="text-xl font-semibold mb-4">Incident Types</h2>
                  <div className="space-y-4">
                    {incidentTypes.map((incident) => (
                      <Card
                        key={incident.id}
                        className={`cursor-pointer transition-all ${
                          selectedIncident === incident.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setSelectedIncident(incident.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            {incident.icon}
                            <CardTitle className="text-base">{incident.name}</CardTitle>
                          </div>
                          <CardDescription className="text-sm">
                            {incident.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex justify-between items-center text-sm">
                            <Badge className={getPriorityColor(incident.priority)}>
                              {incident.priority} Priority
                            </Badge>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {incident.processing}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Incident Report Form</CardTitle>
                      <CardDescription>
                        Fill out the form below to file your incident report
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="complainant_name">Complainant Name *</Label>
                            <Input
                              id="complainant_name"
                              value={formData.complainant_name}
                              onChange={(e) =>
                                setFormData({ ...formData, complainant_name: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="contact_number">Contact Number *</Label>
                            <Input
                              id="contact_number"
                              type="tel"
                              value={formData.contact_number}
                              onChange={(e) =>
                                setFormData({ ...formData, contact_number: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email_address">Email Address</Label>
                          <Input
                            id="email_address"
                            type="email"
                            value={formData.email_address}
                            onChange={(e) =>
                              setFormData({ ...formData, email_address: e.target.value })
                            }
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="incident_date">Date of Incident *</Label>
                            <Input
                              id="incident_date"
                              type="date"
                              value={formData.incident_date}
                              onChange={(e) =>
                                setFormData({ ...formData, incident_date: e.target.value })
                              }
                              required
                              className="block"
                            />
                          </div>
                          <div>
                            <Label htmlFor="incident_time">Time of Incident *</Label>
                            <Input
                              id="incident_time"
                              type="time"
                              value={formData.incident_time}
                              onChange={(e) =>
                                setFormData({ ...formData, incident_time: e.target.value })
                              }
                              required
                              className="block"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="location">Location of Incident *</Label>
                          <Textarea
                            id="location"
                            placeholder="Please provide the exact location where the incident occurred"
                            value={formData.location}
                            onChange={(e) =>
                              setFormData({ ...formData, location: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="respondent_name">Respondent Name (if applicable)</Label>
                          <Input
                            id="respondent_name"
                            placeholder="Name of the person involved in the incident"
                            value={formData.respondent_name}
                            onChange={(e) =>
                              setFormData({ ...formData, respondent_name: e.target.value })
                            }
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Detailed Description *</Label>
                          <Textarea
                            id="description"
                            placeholder="Please provide a detailed description of what happened"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                            }
                            className="min-h-[100px]"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="witnesses">Witnesses (if any)</Label>
                          <Textarea
                            id="witnesses"
                            placeholder="Names and contact information of witnesses"
                            value={formData.witnesses}
                            onChange={(e) =>
                              setFormData({ ...formData, witnesses: e.target.value })
                            }
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="agree_terms"
                            checked={formData.agree_terms}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, agree_terms: checked as boolean })
                            }
                          />
                          <Label htmlFor="agree_terms" className="text-sm">
                            I hereby certify that the information provided is true and correct to the best of my knowledge and belief.
                          </Label>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={!selectedIncident || isPendingCreate}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {isPendingCreate ? "Submitting..." : "Submit Report"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Please log in as a resident to file an incident report.
              </p>
            )}
          </TabsContent>

          <TabsContent value="track">
            {isResident ? (
              <div className="mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">My Incident Reports</h2>
                  <p className="text-muted-foreground">
                    View all your incident reports and their current status
                  </p>
                </div>

                {isPending && <p>Loading reports...</p>}
                {error && (
                  <p className="text-destructive">Failed to load reports: {error.message}</p>
                )}
                {!isPending && !error && reports.length === 0 && (
                  <p className="text-muted-foreground">No reports found.</p>
                )}

                <div className="space-y-4">
                  {reports.map((report) => (
                    <Card key={report.report_number}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{report.incident_type}</CardTitle>
                            <CardDescription>Reference: {report.report_number}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getPriorityColor(report.priority)}>{report.priority}</Badge>
                            <Badge className={`${getStatusColor(report.status)} flex items-center gap-1`}>
                              {getStatusIcon(report.status)}
                              {getStatusText(report.status)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Date Filed</Label>
                            <p className="font-medium">{new Date(report.created_at).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Incident Date</Label>
                            <p className="font-medium">
                              {new Date(report.incident_date).toLocaleDateString()} at {report.incident_time}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                            <p className="font-medium">{report.location}</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                          <p className="text-sm mt-1">{report.description}</p>
                        </div>
                        {report.status === "resolved" && (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-green-800">
                              <CheckCircle className="h-5 w-5" />
                              <span className="font-medium">This incident has been resolved</span>
                            </div>
                            <p className="text-green-700 mt-2 text-sm">
                              The barangay officials have successfully addressed this incident. If you have any
                              concerns about the resolution, please visit the barangay office.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Please log in as a resident to track your incident reports.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}