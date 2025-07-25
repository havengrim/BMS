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
import { useToast } from "@/hooks/use-toast"
import { FileText, Clock, CheckCircle } from "lucide-react"

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

    toast({
      title: "Request submitted successfully!",
      description: "You will receive a confirmation email shortly. Your reference number is: BR-2025-001234",
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
          <h1 className="text-3xl font-bold mb-2">Certificate Requests</h1>
          <p className="text-muted-foreground">Request official barangay certificates online</p>
        </div>

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
                      I agree to the terms and conditions and certify that all information provided is true and correct.
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
      </div>
    </div>
  )
}
