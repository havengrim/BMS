"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, AlertTriangle, Users, Volume2, Upload, X, FileImage, FileVideo, Eye } from "lucide-react"
import { Footer } from "@/components/footer"

const complaintTypes = [
  { value: "noise", label: "Noise Complaint", icon: Volume2 },
  { value: "dispute", label: "Neighbor Dispute", icon: Users },
  { value: "safety", label: "Safety Concern", icon: AlertTriangle },
  { value: "property", label: "Property Issue", icon: MessageSquare },
  { value: "other", label: "Other", icon: MessageSquare },
]

interface FileWithPreview extends File {
  preview?: string
}

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

  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [previewFile, setPreviewFile] = useState<FileWithPreview | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    // Validate file types
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/mov", "video/avi"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    const validFiles = selectedFiles.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive",
        })
        return false
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB limit.`,
          variant: "destructive",
        })
        return false
      }

      return true
    })

    // Create preview URLs for valid files
    const filesWithPreview = validFiles.map((file) => {
      const fileWithPreview = file as FileWithPreview
      if (file.type.startsWith("image/")) {
        fileWithPreview.preview = URL.createObjectURL(file)
      }
      return fileWithPreview
    })

    setFiles((prev) => [...prev, ...filesWithPreview])

    if (validFiles.length > 0) {
      toast({
        title: "Files uploaded successfully",
        description: `${validFiles.length} file(s) added as evidence.`,
      })
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      const removedFile = newFiles[index]
      if (removedFile.preview) {
        URL.revokeObjectURL(removedFile.preview)
      }
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agreeToTerms) {
      toast({
        title: "Please agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    // In a real application, you would upload the files to a server here
    console.log("Form data:", formData)
    console.log("Attached files:", files)

    toast({
      title: "Complaint submitted successfully!",
      description: `Your complaint has been recorded with ${files.length} attachment(s). Reference number: CM-2025-001234`,
    })

    // Reset form and files
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

    // Clean up file previews
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
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

                    {/* File Upload Section */}
                    <div className="space-y-4">
                      <div>
                        <Label>Evidence (Photos/Videos)</Label>
                        <p className="text-sm text-muted-foreground mb-3">
                          Upload photos or videos as evidence. Supported formats: JPG, PNG, GIF, MP4, MOV, AVI (Max 10MB
                          each)
                        </p>

                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-3">
                            Drag and drop files here, or click to select
                          </p>
                          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                            Choose Files
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </div>

                        {/* File List */}
                        {files.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <Label>Attached Files ({files.length})</Label>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {files.map((file, index) => (
                                <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
                                  <div className="flex-shrink-0">
                                    {file.type.startsWith("image/") ? (
                                      <FileImage className="h-5 w-5 text-blue-500" />
                                    ) : (
                                      <FileVideo className="h-5 w-5 text-purple-500" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                  </div>
                                  <div className="flex gap-1">
                                    {file.preview && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setPreviewFile(file)}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    )}
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
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

        {/* Image Preview Modal */}
        {previewFile && previewFile.preview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">{previewFile.name}</h3>
                <Button variant="ghost" size="sm" onClick={() => setPreviewFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <img
                  src={previewFile.preview || "/placeholder.svg"}
                  alt={previewFile.name}
                  className="max-w-full max-h-[70vh] object-contain mx-auto"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
