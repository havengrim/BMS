"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
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
import {
  MessageSquare,
  AlertTriangle,
  Users,
  Volume2,
  Upload,
  X,
  FileImage,
  FileVideo,
  Eye,
  Clock,
  CheckCircle,
  Package,
  Search,
  MapPin,
  Navigation,
} from "lucide-react"
import { Footer } from "@/components/footer"

const complaintTypes = [
  { value: "noise", label: "Noise Complaint", icon: Volume2 },
  { value: "dispute", label: "Neighbor Dispute", icon: Users },
  { value: "safety", label: "Safety Concern", icon: AlertTriangle },
  { value: "property", label: "Property Issue", icon: MessageSquare },
  { value: "other", label: "Other", icon: MessageSquare },
]

// Mock complaints data
const mockComplaints = [
  {
    id: "comp-001",
    referenceNumber: "CM-2025-001234",
    complaintType: "Noise Complaint",
    subject: "Loud music during late hours",
    complainantName: "Juan Dela Cruz",
    dateSubmitted: "2025-01-28",
    status: "investigating",
    estimatedResolution: "2025-02-05",
    priority: "medium",
    description: "Neighbor playing loud music every night past 10 PM",
    respondentName: "Maria Santos",
    mediationRequested: true,
    location: { lat: 14.5995, lng: 120.9842 },
  },
  {
    id: "comp-002",
    referenceNumber: "CM-2025-001235",
    complaintType: "Neighbor Dispute",
    subject: "Property boundary dispute",
    complainantName: "Pedro Garcia",
    dateSubmitted: "2025-01-26",
    status: "mediation",
    estimatedResolution: "2025-02-10",
    priority: "high",
    description: "Disagreement about fence placement and property boundaries",
    respondentName: "Ana Reyes",
    mediationRequested: true,
    location: { lat: 14.6042, lng: 120.9822 },
  },
  {
    id: "comp-003",
    referenceNumber: "CM-2025-001236",
    complaintType: "Safety Concern",
    subject: "Broken streetlight causing safety hazard",
    complainantName: "Lisa Torres",
    dateSubmitted: "2025-01-25",
    status: "resolved",
    estimatedResolution: "2025-01-30",
    priority: "high",
    description: "Streetlight has been broken for weeks, creating dangerous conditions at night",
    respondentName: "",
    mediationRequested: false,
    location: { lat: 14.601, lng: 120.986 },
  },
]

interface FileWithPreview extends File {
  preview?: string
}

// Enhanced Leaflet Map Component with proper CSS loading
const LocationPicker = ({
  onLocationSelect,
  selectedLocation,
}: {
  onLocationSelect: (lat: number, lng: number) => void
  selectedLocation: { lat: number; lng: number } | null
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const { toast } = useToast()

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      })
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        // Update the map view and add marker
        if (mapInstanceRef.current) {
          // Remove existing marker
          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current)
          }

          // Add new marker at current location
          import("leaflet").then((L) => {
            markerRef.current = L.marker([latitude, longitude]).addTo(mapInstanceRef.current)
            mapInstanceRef.current.setView([latitude, longitude], 17)
          })
        }

        // Call the callback to update parent component
        onLocationSelect(latitude, longitude)
        setIsGettingLocation(false)

        toast({
          title: "Location detected",
          description: `Your current location has been set on the map.`,
        })
      },
      (error) => {
        setIsGettingLocation(false)
        let errorMessage = "Unable to retrieve your location."

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            break
        }

        toast({
          title: "Location error",
          description: errorMessage,
          variant: "destructive",
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !mapInstanceRef.current) {
      // Load Leaflet CSS first
      const loadLeafletCSS = () => {
        return new Promise<void>((resolve) => {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
          link.onload = () => resolve()
          document.head.appendChild(link)
        })
      }

      // Load CSS then initialize map
      loadLeafletCSS().then(() => {
        // Dynamically import Leaflet
        import("leaflet").then((L) => {
          // Add null check here to satisfy TypeScript
          if (!mapRef.current) return

          // Default location (Manila, Philippines)
          const defaultLat = 14.5995
          const defaultLng = 120.9842

          // Initialize map - now TypeScript knows mapRef.current is not null
          mapInstanceRef.current = L.map(mapRef.current).setView([defaultLat, defaultLng], 15)

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(mapInstanceRef.current)

          // Add click event listener
          mapInstanceRef.current.on("click", (e: any) => {
            const { lat, lng } = e.latlng

            // Remove existing marker
            if (markerRef.current) {
              mapInstanceRef.current.removeLayer(markerRef.current)
            }

            // Add new marker
            markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current)

            // Call callback with coordinates
            onLocationSelect(lat, lng)
          })

          // Set initial marker if location is provided
          if (selectedLocation) {
            markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(mapInstanceRef.current)
            mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], 15)
          }

          setMapLoaded(true)
        })
      })
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update marker when selectedLocation changes
  useEffect(() => {
    if (mapInstanceRef.current && selectedLocation && mapLoaded) {
      // Remove existing marker
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current)
      }

      // Add new marker
      import("leaflet").then((L) => {
        markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(mapInstanceRef.current)
        mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], 15)
      })
    }
  }, [selectedLocation, mapLoaded])

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Incident Location
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isGettingLocation || !mapLoaded}
          className="flex items-center gap-2 bg-transparent"
        >
          {isGettingLocation ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Getting Location...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" />
              Use My Location
            </>
          )}
        </Button>
      </div>
      
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-lg border border-border bg-gray-100" 
          style={{ minHeight: "256px" }} 
        />
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg border border-border">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        Click on the map to select the location of your complaint, or use the "Use My Location" button to automatically
        detect your current position
      </p>
      {selectedLocation && (
        <div className="mt-2 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium">Selected Location:</p>
          <p className="text-sm text-muted-foreground">Latitude: {selectedLocation.lat.toFixed(6)}</p>
          <p className="text-sm text-muted-foreground">Longitude: {selectedLocation.lng.toFixed(6)}</p>
        </div>
      )}
    </div>
  )
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />
    case "investigating":
      return <Search className="h-4 w-4" />
    case "mediation":
      return <Users className="h-4 w-4" />
    case "resolved":
      return <CheckCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "investigating":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "mediation":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending Review"
    case "investigating":
      return "Under Investigation"
    case "mediation":
      return "In Mediation"
    case "resolved":
      return "Resolved"
    default:
      return "Unknown"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "bg-gray-100 text-gray-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "high":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
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
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
    toast({
      title: "Location selected",
      description: `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    })
  }

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

    // Generate reference number
    const refNumber = `CM-2025-${String(Date.now()).slice(-6)}`

    // Include location data in submission
    const submissionData = {
      ...formData,
      location: selectedLocation,
      files: files.length,
      referenceNumber: refNumber,
    }

    console.log("Complaint submission data:", submissionData)

    toast({
      title: "Complaint submitted successfully!",
      description: `Your complaint has been recorded with ${files.length} attachment(s) and location data. Reference number: ${refNumber}`,
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
    setSelectedLocation(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Complaint Services</h1>
          <p className="text-muted-foreground">File complaints and track their resolution progress</p>
        </div>

        <Tabs defaultValue="file">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              File Complaint
            </TabsTrigger>
            <TabsTrigger value="track" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              My Complaints ({mockComplaints.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file">
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
                      All complaints are treated confidentially. For urgent matters requiring immediate attention,
                      please contact the barangay hotline directly.
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
                              Upload photos or videos as evidence. Supported formats: JPG, PNG, GIF, MP4, MOV, AVI (Max
                              10MB each)
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
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeFile(index)}
                                        >
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

                        {/* Location Picker Section */}
                        <div className="space-y-4">
                          <LocationPicker onLocationSelect={handleLocationSelect} selectedLocation={selectedLocation} />
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
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, requestMediation: checked as boolean })
                          }
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
          </TabsContent>

          <TabsContent value="track">
            <div className="mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">My Complaints</h2>
                <p className="text-muted-foreground">Track the progress of your submitted complaints</p>
              </div>

              <div className="space-y-4">
                {mockComplaints.map((complaint) => (
                  <Card key={complaint.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{complaint.subject}</CardTitle>
                          <CardDescription>
                            {complaint.complaintType} • Reference: {complaint.referenceNumber}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={`${getPriorityColor(complaint.priority)} text-xs`}>
                            {complaint.priority.toUpperCase()}
                          </Badge>
                          <Badge className={`${getStatusColor(complaint.status)} flex items-center gap-1`}>
                            {getStatusIcon(complaint.status)}
                            {getStatusText(complaint.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Date Submitted</Label>
                          <p className="font-medium">{new Date(complaint.dateSubmitted).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Expected Resolution</Label>
                          <p className="font-medium">{new Date(complaint.estimatedResolution).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                          <p className="font-medium text-xs">
                            {complaint.location.lat.toFixed(4)}, {complaint.location.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                          <p className="text-sm">{complaint.description}</p>
                        </div>
                        {complaint.respondentName && (
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Respondent</Label>
                            <p className="text-sm">{complaint.respondentName}</p>
                          </div>
                        )}
                      </div>

                      {complaint.status === "mediation" && (
                        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center gap-2 text-purple-800">
                            <Users className="h-5 w-5" />
                            <span className="font-medium">Mediation in Progress</span>
                          </div>
                          <p className="text-purple-700 mt-2 text-sm">
                            A mediation session has been scheduled. You will be contacted with the date and time. Please
                            prepare any additional evidence or documentation.
                          </p>
                        </div>
                      )}

                      {complaint.status === "resolved" && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-800">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">Complaint Resolved</span>
                          </div>
                          <p className="text-green-700 mt-2 text-sm">
                            Your complaint has been successfully resolved. If you have any concerns about the
                            resolution, please contact the barangay office.
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

        {/* Image Preview Modal */}
        {previewFile && previewFile.preview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
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