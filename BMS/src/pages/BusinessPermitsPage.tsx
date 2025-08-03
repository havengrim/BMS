"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Building, FileText, Clock, CheckCircle, AlertTriangle, Package } from "lucide-react";
import { Footer } from "@/components/footer";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useBusinessPermits, useCreateBusinessPermit } from "@/stores/useBusinessPermits";
import { type BusinessPermit } from "@/types/business-permit";

const businessTypes = [
  "Retail Store",
  "Restaurant/Food Service",
  "Beauty Salon/Barbershop",
  "Repair Shop",
  "Professional Services",
  "Online Business",
  "Other",
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "approved":
      return <CheckCircle className="h-4 w-4" />;
    case "rejected":
      return <AlertTriangle className="h-4 w-4" />;
    case "completed":
      return <Package className="h-4 w-4" />;
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

export default function BusinessPermitsPage() {
  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "",
    owner_name: "",
    business_address: "",
    contact_number: "",
    owner_address: "",
    business_description: "",
    is_renewal: false,
    agree_to_terms: false,
  });

  const { toast } = useToast();
  const { user, loading } = useAuthStore();
  const queryClient = useQueryClient();
  const { data: permits, isLoading, error } = useBusinessPermits();
  const createBusinessPermit = useCreateBusinessPermit();

  // Clear permits cache when user changes (logout/login)
  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["business-permits"] });
  }, [user, queryClient]);

  const isResident = user && user.profile?.role && ["resident"].includes(user.profile.role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isResident) {
      toast({
        title: "Only residents can apply for business permits",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agree_to_terms) {
      toast({
        title: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    const permitData = {
      business_name: formData.business_name,
      business_type: formData.business_type,
      owner_name: formData.owner_name,
      business_address: formData.business_address,
      contact_number: formData.contact_number,
      owner_address: formData.owner_address,
      business_description: formData.business_description,
      is_renewal: formData.is_renewal,
    };

    try {
      await createBusinessPermit.mutateAsync(permitData);
      setFormData({
        business_name: "",
        business_type: "",
        owner_name: "",
        business_address: "",
        contact_number: "",
        owner_address: "",
        business_description: "",
        is_renewal: false,
        agree_to_terms: false,
      });
    } catch (err) {
      console.error("Submit error:", err);
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
          <h1 className="text-3xl font-bold mb-2">Business Permit Services</h1>
          <p>Your role: {user?.profile?.role || "No role detected"}</p>
          <p className="text-muted-foreground">Apply for new business permits and track your applications</p>
        </div>

        {!isResident && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Access Restricted</span>
            </div>
            <p className="text-red-700 mt-2 text-sm">
              You must be logged in as a resident of Barangay Sindalan to apply for or track business permits. Please log in or register as a resident.
            </p>
          </div>
        )}

        <Tabs defaultValue="apply">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="apply" className="flex items-center gap-2" disabled={!isResident}>
              <FileText className="h-4 w-4" />
              Apply for Permit
            </TabsTrigger>
            <TabsTrigger value="track" className="flex items-center gap-2" disabled={!isResident}>
              <Package className="h-4 w-4" />
              My Applications ({permits?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="apply">
            {isResident ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Valid ID of business owner</li>
                        <li>• Barangay clearance</li>
                        <li>• Location sketch/map</li>
                        <li>• Business registration (if applicable)</li>
                        <li>• Fire safety inspection (for certain businesses)</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Processing Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        New applications: 5-7 business days
                        <br />
                        Renewals: 2-3 business days
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Permit Application</CardTitle>
                      <CardDescription>Complete the form below to apply for your business permit</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="renewal"
                            checked={formData.is_renewal}
                            onCheckedChange={(checked) => setFormData({ ...formData, is_renewal: checked as boolean })}
                          />
                          <Label htmlFor="renewal">This is a renewal application</Label>
                        </div>

                        <div>
                          <Label htmlFor="business_name">Business Name *</Label>
                          <Input
                            id="business_name"
                            value={formData.business_name}
                            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="business_type">Business Type *</Label>
                          <Select
                            value={formData.business_type}
                            onValueChange={(value) => setFormData({ ...formData, business_type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                            <SelectContent>
                              {businessTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="owner_name">Business Owner Name *</Label>
                          <Input
                            id="owner_name"
                            value={formData.owner_name}
                            onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="business_address">Business Address *</Label>
                          <Textarea
                            id="business_address"
                            value={formData.business_address}
                            onChange={(e) => setFormData({ ...formData, business_address: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="owner_address">Owner Address *</Label>
                          <Textarea
                            id="owner_address"
                            value={formData.owner_address}
                            onChange={(e) => setFormData({ ...formData, owner_address: e.target.value })}
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
                              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="business_description">Business Description *</Label>
                          <Textarea
                            id="business_description"
                            placeholder="Describe the nature of your business and services offered"
                            value={formData.business_description}
                            onChange={(e) => setFormData({ ...formData, business_description: e.target.value })}
                            required
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="terms"
                            checked={formData.agree_to_terms}
                            onCheckedChange={(checked) => setFormData({ ...formData, agree_to_terms: checked as boolean })}
                          />
                          <Label htmlFor="terms" className="text-sm">
                            I agree to comply with all barangay regulations and certify that all information is accurate.
                          </Label>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={createBusinessPermit.isPending}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          {createBusinessPermit.isPending ? "Submitting..." : "Submit Application"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Please log in as a resident to apply for a business permit.
              </p>
            )}
          </TabsContent>

          <TabsContent value="track">
            {isResident ? (
              <div className="mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">My Business Permit Applications</h2>
                  <p className="text-muted-foreground">Track the status of your business permit applications</p>
                </div>

                {isLoading && <p>Loading applications...</p>}
                {error && (
                  <p className="text-destructive">Failed to load applications: {error.message}</p>
                )}
                {!isLoading && !error && permits?.length === 0 && (
                  <p className="text-muted-foreground">No business permit applications found.</p>
                )}

                <div className="space-y-4">
                  {permits?.map((application: BusinessPermit) => (
                    <Card key={application.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{application.business_name}</CardTitle>
                            <CardDescription>
                              {application.business_type} • ID: {application.id}
                              {application.is_renewal && " • Renewal Application"}
                            </CardDescription>
                          </div>
                          <Badge className={`${getStatusColor(application.status)} flex items-center gap-1`}>
                            {getStatusIcon(application.status)}
                            {getStatusText(application.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Date Submitted</Label>
                            <p className="font-medium">{new Date(application.created_at).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Owner</Label>
                            <p className="font-medium">{application.owner_name}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Business Address</Label>
                            <p className="text-sm">{application.business_address}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Owner Address</Label>
                            <p className="text-sm">{application.owner_address}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Business Description</Label>
                            <p className="text-sm">{application.business_description}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Contact Number</Label>
                            <p className="text-sm">{application.contact_number}</p>
                          </div>
                        </div>

                        {application.status === "rejected" && (
                          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 text-red-800">
                              <AlertTriangle className="h-5 w-5" />
                              <span className="font-medium">Application Rejected</span>
                            </div>
                            <p className="text-red-700 mt-2 text-sm">
                              Your application was rejected. Please contact the barangay office for more details.
                            </p>
                          </div>
                        )}

                        {application.status === "approved" && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-800">
                              <CheckCircle className="h-5 w-5" />
                              <span className="font-medium">Application Approved</span>
                            </div>
                            <p className="text-blue-700 mt-2 text-sm">
                              Your application has been approved and is being processed. You will be notified when the permit is ready for pickup.
                            </p>
                          </div>
                        )}

                        {application.status === "completed" && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 text-green-800">
                              <Package className="h-5 w-5" />
                              <span className="font-medium">Permit Ready for Pickup</span>
                            </div>
                            <p className="text-green-700 mt-2 text-sm">
                              Your business permit is ready. Please visit the barangay office during office hours
                              (8:00 AM - 5:00 PM, Monday to Friday) to claim your permit. Bring a valid ID and your
                              application ID.
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
                Please log in as a resident to track your business permit applications.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}