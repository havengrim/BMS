"use client"

import type React from "react"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { FileText, Clock, CheckCircle, Package, AlertCircle } from "lucide-react"
import { Footer } from "@/components/footer"

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
]

// Mock user requests
const mockRequests = [
  {
    id: "req-001",
    referenceNumber: "BR-2025-001234",
    certificateType: "Barangay Clearance",
    dateSubmitted: "2025-01-28",
    status: "ready",
    estimatedCompletion: "2025-01-30",
    fee: "₱50.00",
    purpose: "Employment requirement",
  },
  {
    id: "req-002",
    referenceNumber: "BR-2025-001237",
    certificateType: "Business Clearance",
    dateSubmitted: "2025-01-26",
    status: "processing",
    estimatedCompletion: "2025-02-01",
    fee: "₱100.00",
    purpose: "Business permit application",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />
    case "processing":
      return <Package className="h-4 w-4" />
    case "ready":
      return <AlertCircle className="h-4 w-4" />
    case "completed":
      return <CheckCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "ready":
      return "bg-green-100 text-green-800 border-green-200"
    case "completed":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending Review"
    case "processing":
      return "Processing"
    case "ready":
      return "Ready for Pickup"
    case "completed":
      return "Completed"
    default:
      return "Unknown"
  }
}

export default function CertificatesPage() {
  const [selectedCertificate, setSelectedCertificate] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    address: "",
    contactNumber: "",
    email: "",
    purpose: "",
    agreeToTerms: false,
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCertificate) {
      toast({
        title: "Please select a certificate type",
        variant: "destructive",
      })
      return
    }
    if (!formData.agreeToTerms) {
      toast({
        title: "Please agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    // Generate new reference number
    const newRefNumber = `BR-2025-${String(Date.now()).slice(-6)}`

    toast({
      title: "Request submitted successfully!",
      description: `Your reference number is: ${newRefNumber}`,
    })

    // Reset form
    setSelectedCertificate("")
    setFormData({
      firstName: "",
      lastName: "",
      middleName: "",
      address: "",
      contactNumber: "",
      email: "",
      purpose: "",
      agreeToTerms: false,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Certificate Services</h1>
          <p className="text-muted-foreground">Request and track your barangay certificates online</p>
        </div>

        <Tabs defaultValue="request">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="request" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Request Certificate
            </TabsTrigger>
            <TabsTrigger value="track" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              My Requests ({mockRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="request">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Certificate Types */}
              <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold mb-4">Available Certificates</h2>
                <div className="space-y-4">
                  {certificateTypes.map((cert) => (
                    <Card
                      key={cert.id}
                      className={`cursor-pointer transition-all ${selectedCertificate === cert.id ? "ring-2 ring-primary" : ""}`}
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

              {/* Request Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Request Form</CardTitle>
                    <CardDescription>Fill out the form below to request your certificate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="middleName">Middle Name</Label>
                        <Input
                          id="middleName"
                          value={formData.middleName}
                          onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Complete Address *</Label>
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
                        <Label htmlFor="purpose">Purpose *</Label>
                        <Textarea
                          id="purpose"
                          placeholder="Please specify the purpose of this certificate request"
                          value={formData.purpose}
                          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
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
                          I agree to the terms and conditions and certify that all information provided is true and
                          correct.
                        </Label>
                      </div>
                      <Button type="submit" className="w-full" disabled={!selectedCertificate}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit Request
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
                <h2 className="text-2xl font-bold mb-2">My Certificate Requests</h2>
                <p className="text-muted-foreground">View all your certificate requests and their current status</p>
              </div>

              <div className="space-y-4">
                {mockRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{request.certificateType}</CardTitle>
                          <CardDescription>Reference: {request.referenceNumber}</CardDescription>
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
                          <Label className="text-sm font-medium text-muted-foreground">Date Submitted</Label>
                          <p className="font-medium">{new Date(request.dateSubmitted).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Estimated Completion</Label>
                          <p className="font-medium">{new Date(request.estimatedCompletion).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Fee</Label>
                          <p className="font-medium">{request.fee}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label className="text-sm font-medium text-muted-foreground">Purpose</Label>
                        <p className="text-sm">{request.purpose}</p>
                      </div>

                      {request.status === "ready" && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-800">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">Your certificate is ready for pickup!</span>
                          </div>
                          <p className="text-green-700 mt-2 text-sm">
                            Please visit the barangay office during office hours (8:00 AM - 5:00 PM, Monday to Friday)
                            to claim your certificate. Bring a valid ID and your reference number.
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
