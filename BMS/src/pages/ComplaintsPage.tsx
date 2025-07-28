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
import { MessageSquare, AlertTriangle, Users, Volume2 } from "lucide-react"
import { Footer } from "@/components/footer"

const complaintTypes = [
  { value: "noise", label: "Noise Complaint", icon: Volume2 },
  { value: "dispute", label: "Neighbor Dispute", icon: Users },
  { value: "safety", label: "Safety Concern", icon: AlertTriangle },
  { value: "property", label: "Property Issue", icon: MessageSquare },
  { value: "other", label: "Other", icon: MessageSquare },
]

export default function ComplaintsPage() {
  const [formData, setFormData] = useState({
    complainantName: "",
    contactNumber: "",
    email: "",
    address: "",
    complaintType: "",
    subject: "",
    description: "",
    respondentName: "",
    respondentAddress: "",
    requestMediation: false,
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

    toast({
      title: "Complaint submitted successfully!",
      description: "Your complaint has been recorded. Reference number: CM-2025-001234",
    })

    // Reset form
    setFormData({
      complainantName: "",
      contactNumber: "",
      email: "",
      address: "",
      complaintType: "",
      subject: "",
      description: "",
      respondentName: "",
      respondentAddress: "",
      requestMediation: false,
      agreeToTerms: false,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">File a Complaint</h1>
          <p className="text-muted-foreground">Submit complaints and request mediation services</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Complaint Types */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Complaint Types</h2>
            <div className="space-y-3">
              {complaintTypes.map((type) => (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-all ${formData.complaintType === type.value ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setFormData({ ...formData, complaintType: type.value })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <type.icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{type.label}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Important Note</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All complaints are treated confidentially. For urgent matters requiring immediate attention, please
                  contact the barangay hotline directly.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Complaint Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complaint Form</CardTitle>
                <CardDescription>Please provide detailed information about your complaint</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Complainant Information</h3>

                    <div>
                      <Label htmlFor="complainantName">Full Name *</Label>
                      <Input
                        id="complainantName"
                        value={formData.complainantName}
                        onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
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
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Complaint Details</h3>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of the complaint"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Detailed Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Please provide a detailed description of the incident or issue"
                        className="min-h-[120px]"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Respondent Information (if applicable)</h3>

                    <div>
                      <Label htmlFor="respondentName">Respondent Name</Label>
                      <Input
                        id="respondentName"
                        placeholder="Name of the person/entity involved"
                        value={formData.respondentName}
                        onChange={(e) => setFormData({ ...formData, respondentName: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="respondentAddress">Respondent Address</Label>
                      <Textarea
                        id="respondentAddress"
                        placeholder="Address of the respondent (if known)"
                        value={formData.respondentAddress}
                        onChange={(e) => setFormData({ ...formData, respondentAddress: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mediation"
                      checked={formData.requestMediation}
                      onCheckedChange={(checked) => setFormData({ ...formData, requestMediation: checked as boolean })}
                    />
                    <Label htmlFor="mediation">I would like to request mediation services</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I certify that the information provided is true and accurate to the best of my knowledge.
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={!formData.complaintType}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Submit Complaint
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
