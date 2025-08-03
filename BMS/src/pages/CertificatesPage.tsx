"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
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
} from "lucide-react";
import { Footer } from "@/components/footer";
import {
  useCertificates,
  useCreateCertificate,
  type Certificate,
} from "@/stores/useCertificates";
import { useAuthStore } from "@/stores/authStore";
import { useQueryClient } from "@tanstack/react-query";

const certificateTypes = [
  {
    id: "barangay-clearance",
    name: "Barangay Clearance",
    description: "Required for employment, business permits, and other legal purposes",
    fee: "₱50.00",
    processing: "2-3 business days",
  },
  {
    id: "certificate-of-residency",
    name: "Certificate of Residency",
    description: "Proof of residence in the barangay",
    fee: "₱30.00",
    processing: "1-2 business days",
  },
  {
    id: "indigency-certificate",
    name: "Certificate of Indigency",
    description: "For financial assistance and scholarship applications",
    fee: "Free",
    processing: "3-5 business days",
  },
  {
    id: "business-clearance",
    name: "Business Clearance",
    description: "Required for business permit applications",
    fee: "₱100.00",
    processing: "3-5 business days",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "approved":
      return <Package className="h-4 w-4" />;
    case "rejected":
      return <AlertTriangle className="h-4 w-4" />;
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "approved":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending Review";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "completed":
      return "Ready for Pickup";
    default:
      return "Unknown";
  }
};

export default function CertificatesPage() {
  const [selectedCertificate, setSelectedCertificate] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    complete_address: "",
    contact_number: "",
    email_address: "",
    purpose: "",
    agree_terms: false,
  });

  const { toast } = useToast();
  const { user, loading } = useAuthStore();
  const queryClient = useQueryClient();

  // Clear certificates cache when user changes (logout/login)
useEffect(() => {
  queryClient.removeQueries({ queryKey: ["certificates"] });
}, [user, queryClient]);

  const { data: certificates, isLoading, error } = useCertificates();
  const createCertificate = useCreateCertificate();

  const isResident = user && user.profile?.role && ["resident"].includes(user.profile.role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isResident) {
      toast({
        title: "Only residents can request certificates",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCertificate) {
      toast({
        title: "Please select a certificate type",
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

    const certificateData = {
      certificate_type:
        certificateTypes.find((cert) => cert.id === selectedCertificate)?.name || "",
      first_name: formData.first_name,
      last_name: formData.last_name,
      middle_name: formData.middle_name,
      complete_address: formData.complete_address,
      contact_number: formData.contact_number,
      email_address: formData.email_address,
      purpose: formData.purpose,
      agree_terms: formData.agree_terms,
    };

    try {
      await createCertificate.mutateAsync(certificateData);
      toast({
        title: "Certificate request submitted successfully",
      });
      setSelectedCertificate("");
      setFormData({
        first_name: "",
        last_name: "",
        middle_name: "",
        complete_address: "",
        contact_number: "",
        email_address: "",
        purpose: "",
        agree_terms: false,
      });
    } catch (err) {
      console.error("Submit error:", err);
      toast({
        title: "Error",
        description: "Failed to submit certificate request.",
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
          <h1 className="text-3xl font-bold mb-2">Certificate Services</h1>
          <p>Your role: {user?.profile?.role || "No role detected"}</p>
          <p className="text-muted-foreground">
            Request and track your barangay certificates online
          </p>
        </div>

        {!isResident && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Access Restricted</span>
            </div>
            <p className="text-red-700 mt-2 text-sm">
              You must be logged in as a resident of Barangay Sindalan to
              request or track certificates. Please log in or register as a
              resident.
            </p>
          </div>
        )}

        <Tabs defaultValue="request">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger
              value="request"
              className="flex items-center gap-2"
              disabled={!isResident}
            >
              <FileText className="h-4 w-4" />
              Request Certificate
            </TabsTrigger>
            <TabsTrigger
              value="track"
              className="flex items-center gap-2"
              disabled={!isResident}
            >
              <Package className="h-4 w-4" />
              My Requests ({certificates?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="request">
            {isResident ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <h2 className="text-xl font-semibold mb-4">Available Certificates</h2>
                  <div className="space-y-4">
                    {certificateTypes.map((cert) => (
                      <Card
                        key={cert.id}
                        className={`cursor-pointer transition-all ${
                          selectedCertificate === cert.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setSelectedCertificate(cert.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">{cert.name}</CardTitle>
                          </div>
                          <CardDescription className="text-sm">{cert.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-primary">{cert.fee}</span>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {cert.processing}
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
                      <CardTitle>Request Form</CardTitle>
                      <CardDescription>
                        Fill out the form below to request your certificate
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="first_name">First Name *</Label>
                            <Input
                              id="first_name"
                              value={formData.first_name}
                              onChange={(e) =>
                                setFormData({ ...formData, first_name: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="last_name">Last Name *</Label>
                            <Input
                              id="last_name"
                              value={formData.last_name}
                              onChange={(e) =>
                                setFormData({ ...formData, last_name: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="middle_name">Middle Name</Label>
                          <Input
                            id="middle_name"
                            value={formData.middle_name}
                            onChange={(e) =>
                              setFormData({ ...formData, middle_name: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="complete_address">Complete Address *</Label>
                          <Textarea
                            id="complete_address"
                            value={formData.complete_address}
                            onChange={(e) =>
                              setFormData({ ...formData, complete_address: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <div>
                            <Label htmlFor="email_address">Email Address *</Label>
                            <Input
                              id="email_address"
                              type="email"
                              value={formData.email_address}
                              onChange={(e) =>
                                setFormData({ ...formData, email_address: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="purpose">Purpose *</Label>
                          <Textarea
                            id="purpose"
                            placeholder="Please specify the purpose of this certificate request"
                            value={formData.purpose}
                            onChange={(e) =>
                              setFormData({ ...formData, purpose: e.target.value })
                            }
                            required
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
                            I agree to the terms and conditions and certify that all
                            information provided is true and correct.
                          </Label>
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={!selectedCertificate || createCertificate.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {createCertificate.isPending ? "Submitting..." : "Submit Request"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Please log in as a resident to request a certificate.
              </p>
            )}
          </TabsContent>

          <TabsContent value="track">
            {isResident ? (
              <div className="mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">My Certificate Requests</h2>
                  <p className="text-muted-foreground">
                    View all your certificate requests and their current status
                  </p>
                </div>

                {isLoading && <p>Loading requests...</p>}
                {error && (
                  <p className="text-destructive">Failed to load requests: {error.message}</p>
                )}
                {!isLoading && !error && certificates?.length === 0 && (
                  <p className="text-muted-foreground">No certificate requests found.</p>
                )}

                <div className="space-y-4">
                  {certificates?.map((request: Certificate) => (
                    <Card key={request.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{request.certificate_type}</CardTitle>
                            <CardDescription>Reference: {request.request_number}</CardDescription>
                          </div>
                          <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                            {getStatusIcon(request.status)}
                            {getStatusText(request.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              Date Submitted
                            </Label>
                            <p className="font-medium">
                              {new Date(request.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              Estimated Completion
                            </Label>
                            <p className="font-medium">
                              {
                                certificateTypes.find(
                                  (cert) => cert.name === request.certificate_type
                                )?.processing || "Unknown"
                              }
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              Fee
                            </Label>
                            <p className="font-medium">
                              {
                                certificateTypes.find(
                                  (cert) => cert.name === request.certificate_type
                                )?.fee || "Unknown"
                              }
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label className="text-sm font-medium text-muted-foreground">
                            Purpose
                          </Label>
                          <p className="text-sm">{request.purpose}</p>
                        </div>

                        {request.status === "completed" && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-green-800">
                              <CheckCircle className="h-5 w-5" />
                              <span className="font-medium">
                                Your certificate is ready for pickup!
                              </span>
                            </div>
                            <p className="text-green-700 mt-2 text-sm">
                              Please visit the barangay office during office hours (8:00 AM
                              - 5:00 PM, Monday to Friday) to claim your certificate. Bring a
                              valid ID and your reference number.
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
                Please log in as a resident to track your certificate requests.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
