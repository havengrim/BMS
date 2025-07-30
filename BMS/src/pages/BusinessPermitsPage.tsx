"use client"

import type React from "react"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Building, FileText, Clock, CheckCircle, AlertTriangle, Package, Search } from "lucide-react"
import { Footer } from "@/components/footer"

const businessTypes = [
  "Retail Store",
  "Restaurant/Food Service",
  "Beauty Salon/Barbershop",
  "Repair Shop",
  "Professional Services",
  "Online Business",
  "Other",
]

// Mock business permit applications
const mockApplications = [
  {
    id: "bp-001",
    referenceNumber: "BP-2025-001234",
    businessName: "Juan's Sari-Sari Store",
    businessType: "Retail Store",
    ownerName: "Juan Dela Cruz",
    dateSubmitted: "2025-01-28",
    status: "approved",
    estimatedCompletion: "2025-02-05",
    isRenewal: false,
    businessAddress: "123 Main Street, Barangay Centro",
    description: "General merchandise and convenience store",
    permitNumber: "BP-2025-0001",
  },
  {
    id: "bp-002",
    referenceNumber: "BP-2025-001235",
    businessName: "Maria's Beauty Salon",
    businessType: "Beauty Salon/Barbershop",
    ownerName: "Maria Santos",
    dateSubmitted: "2025-01-26",
    status: "under_review",
    estimatedCompletion: "2025-02-02",
    isRenewal: true,
    businessAddress: "456 Commerce Ave, Barangay Poblacion",
    description: "Hair styling, manicure, pedicure, and beauty services",
    permitNumber: "",
  },
  {
    id: "bp-003",
    referenceNumber: "BP-2025-001236",
    businessName: "Pedro's Auto Repair",
    businessType: "Repair Shop",
    ownerName: "Pedro Garcia",
    dateSubmitted: "2025-01-25",
    status: "requirements_needed",
    estimatedCompletion: "2025-02-08",
    isRenewal: false,
    businessAddress: "789 Industrial Road, Barangay San Jose",
    description: "Automotive repair and maintenance services",
    permitNumber: "",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />
    case "under_review":
      return <Search className="h-4 w-4" />
    case "requirements_needed":
      return <AlertTriangle className="h-4 w-4" />
    case "approved":
      return <CheckCircle className="h-4 w-4" />
    case "rejected":
      return <AlertTriangle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "under_review":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "requirements_needed":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "approved":
      return "bg-green-100 text-green-800 border-green-200"
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending Review"
    case "under_review":
      return "Under Review"
    case "requirements_needed":
      return "Requirements Needed"
    case "approved":
      return "Approved"
    case "rejected":
      return "Rejected"
    default:
      return "Unknown"
  }
}

export default function BusinessPermitsPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    ownerName: "",
    address: "",
    contactNumber: "",
    email: "",
    description: "",
    isRenewal: false,
    agreeToTerms: false,
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agreeToTerms) {
      toast({
        title: "Please agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    // Generate reference number
    const refNumber = `BP-2025-${String(Date.now()).slice(-6)}`

    toast({
      title: "Business permit application submitted!",
      description: `Your application is being reviewed. Reference number: ${refNumber}`,
    })

    // Reset form
    setFormData({
      businessName: "",
      businessType: "",
      ownerName: "",
      address: "",
      contactNumber: "",
      email: "",
      description: "",
      isRenewal: false,
      agreeToTerms: false,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Business Permit Services</h1>
          <p className="text-muted-foreground">Apply for new business permits and track your applications</p>
        </div>

        <Tabs defaultValue="apply">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="apply" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Apply for Permit
            </TabsTrigger>
            <TabsTrigger value="track" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              My Applications ({mockApplications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="apply">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Information Panel */}
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

              {/* Application Form */}
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
                          checked={formData.isRenewal}
                          onCheckedChange={(checked) => setFormData({ ...formData, isRenewal: checked as boolean })}
                        />
                        <Label htmlFor="renewal">This is a renewal application</Label>
                      </div>

                      <div>
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input
                          id="businessName"
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="businessType">Business Type *</Label>
                        <Select
                          value={formData.businessType}
                          onValueChange={(value) => setFormData({ ...formData, businessType: value })}
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
                        <Label htmlFor="ownerName">Business Owner Name *</Label>
                        <Input
                          id="ownerName"
                          value={formData.ownerName}
                          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Business Address *</Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contactNumber">Contact Number *</Label>
                          <Input
                            id="contactNumber"
                            type="tel"
                            value={formData.contactNumber}
                            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Business Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the nature of your business and services offered"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to comply with all barangay regulations and certify that all information is accurate.
                        </Label>
                      </div>

                      <Button type="submit" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Submit Application
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="track">
            <div className=" mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">My Business Permit Applications</h2>
                <p className="text-muted-foreground">Track the status of your business permit applications</p>
              </div>

              <div className="space-y-4">
                {mockApplications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{application.businessName}</CardTitle>
                          <CardDescription>
                            {application.businessType} • Reference: {application.referenceNumber}
                            {application.isRenewal && " • Renewal Application"}
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
                          <p className="font-medium">{new Date(application.dateSubmitted).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Expected Completion</Label>
                          <p className="font-medium">
                            {new Date(application.estimatedCompletion).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Owner</Label>
                          <p className="font-medium">{application.ownerName}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Business Address</Label>
                          <p className="text-sm">{application.businessAddress}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Business Description</Label>
                          <p className="text-sm">{application.description}</p>
                        </div>

                        {application.permitNumber && (
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Permit Number</Label>
                            <p className="text-sm font-mono">{application.permitNumber}</p>
                          </div>
                        )}
                      </div>

                      {application.status === "requirements_needed" && (
                        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-center gap-2 text-orange-800">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="font-medium">Additional Requirements Needed</span>
                          </div>
                          <p className="text-orange-700 mt-2 text-sm">
                            Please submit the following documents to complete your application:
                          </p>
                          <ul className="text-orange-700 mt-2 text-sm list-disc list-inside">
                            <li>Fire safety inspection certificate</li>
                            <li>Updated location sketch</li>
                          </ul>
                        </div>
                      )}

                      {application.status === "approved" && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-800">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">Application Approved!</span>
                          </div>
                          <p className="text-green-700 mt-2 text-sm">
                            Your business permit has been approved. Please visit the barangay office during office hours
                            (8:00 AM - 5:00 PM, Monday to Friday) to claim your permit. Bring a valid ID and your
                            reference number.
                          </p>
                        </div>
                      )}

                      {application.status === "under_review" && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-800">
                            <Search className="h-5 w-5" />
                            <span className="font-medium">Application Under Review</span>
                          </div>
                          <p className="text-blue-700 mt-2 text-sm">
                            Your application is currently being reviewed by our team. We will contact you if any
                            additional information is needed.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}
