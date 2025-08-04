"use client"

import type React from "react"
import { useState, useRef, useEffect, Component, type ReactNode } from "react"
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

// Complaint type definition
export type Complaint = {
  id: number
  reference_number: string
  type: string
  fullname: string
  contact_number: string
  address: string
  email_address: string
  subject: string
  detailed_description: string
  respondent_name: string
  respondent_address: string
  latitude: number
  longitude: number
  location: { lat: number; lng: number }
  date_filed: string
  status: string
  priority: string
  evidence: { id: number; file_url: string }[]
}

// Fetch complaints using the provided hook
import { useComplaints, useCreateComplaint } from '@/stores/useComplaints' // Adjust the import path

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

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">An error occurred while displaying complaints. Please try again later.</p>
        </div>
      )
    }
    return this.props.children
  }
}

// Enhanced Leaflet Map Component
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

        if (mapInstanceRef.current) {
          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current)
          }

          import("leaflet").then((L) => {
            markerRef.current = L.marker([latitude, longitude]).addTo(mapInstanceRef.current)
            mapInstanceRef.current.setView([latitude, longitude], 17)
          })

          onLocationSelect(latitude, longitude)
          setIsGettingLocation(false)

          toast({
            title: "Location detected",
            description: `Your current location has been set on the map.`,
          })
        }
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
      }
    )
  }

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !mapInstanceRef.current) {
      const loadLeafletCSS = () => {
        return new Promise<void>((resolve) => {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
          link.onload = () => resolve()
          document.head.appendChild(link)
        })
      }

      loadLeafletCSS().then(() => {
        import("leaflet").then((L) => {
          if (!mapRef.current || mapInstanceRef.current) return

          const defaultLat = 14.5995
          const defaultLng = 120.9842

          mapInstanceRef.current = L.map(mapRef.current, {
            zoomControl: true,
            attributionControl: true,
          }).setView([defaultLat, defaultLng], 15)

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(mapInstanceRef.current)

          mapInstanceRef.current.on("click", (e: any) => {
            const { lat, lng } = e.latlng

            if (markerRef.current) {
              mapInstanceRef.current.removeLayer(markerRef.current)
            }

            markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current)
            onLocationSelect(lat, lng)
          })

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
        try {
          mapInstanceRef.current.off()
          mapInstanceRef.current.remove()
        } catch (error) {
          console.warn("Error during map cleanup:", error)
        }
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current && selectedLocation && mapLoaded) {
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current)
      }

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
          className="w-full h-64 rounded-lg border border-border bg-gray-100 z-0"
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
  const { toast } = useToast()

  const { data: complaints, isLoading, error } = useComplaints()
  const createComplaint = useCreateComplaint()

  const [formData, setFormData] = useState({
    fullname: "",
    contact_number: "",
    email_address: "",
    address: "",
    type: "",
    subject: "",
    detailed_description: "",
    respondent_name: "",
    respondent_address: "",
    request_mediation: false,
    agree_to_terms: false,
  })
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [previewFile, setPreviewFile] = useState<FileWithPreview | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
    toast({
      title: "Location selected",
      description: `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agree_to_terms) {
      toast({
        title: "Please agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    if (!selectedLocation) {
      toast({
        title: "Location required",
        description: "Please select a location for the complaint.",
        variant: "destructive",
      })
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append("type", formData.type)
    formDataToSend.append("fullname", formData.fullname)
    formDataToSend.append("contact_number", formData.contact_number)
    formDataToSend.append("email_address", formData.email_address)
    formDataToSend.append("address", formData.address)
    formDataToSend.append("subject", formData.subject)
    formDataToSend.append("detailed_description", formData.detailed_description)
    formDataToSend.append("respondent_name", formData.respondent_name)
    formDataToSend.append("respondent_address", formData.respondent_address)
    formDataToSend.append("latitude", selectedLocation.lat.toString())
    formDataToSend.append("longitude", selectedLocation.lng.toString())
    formDataToSend.append("request_mediation", formData.request_mediation.toString())

    files.forEach((file, index) => {
      formDataToSend.append(`evidence[${index}]`, file)
    })

    try {
      await createComplaint.mutateAsync(formDataToSend)
      setFormData({
        fullname: "",
        contact_number: "",
        email_address: "",
        address: "",
        type: "",
        subject: "",
        detailed_description: "",
        respondent_name: "",
        respondent_address: "",
        request_mediation: false,
        agree_to_terms: false,
      })
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
      setFiles([])
      setSelectedLocation(null)
    } catch (error) {
      // Error handling is managed by the mutation's onError
    }
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
              My Complaints ({complaints?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold mb-4">Complaint Types</h2>
                <div className="space-y-3">
                  {complaintTypes.map((type) => (
                    <Card
                      key={type.value}
                      className={`cursor-pointer transition-all ${formData.type === type.value ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setFormData({ ...formData, type: type.value })}
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
                          <Label htmlFor="fullname">Full Name *</Label>
                          <Input
                            id="fullname"
                            value={formData.fullname}
                            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
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
                          <div>
                            <Label htmlFor="email_address">Email Address</Label>
                            <Input
                              id="email_address"
                              type="email"
                              value={formData.email_address}
                              onChange={(e) => setFormData({ ...formData, email_address: e.target.value })}
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
                          <Label htmlFor="detailed_description">Detailed Description *</Label>
                          <Textarea
                            id="detailed_description"
                            placeholder="Please provide a detailed description of the incident or issue"
                            className="min-h-[120px]"
                            value={formData.detailed_description}
                            onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                            required
                          />
                        </div>

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

                        <div className="space-y-4">
                          <LocationPicker onLocationSelect={handleLocationSelect} selectedLocation={selectedLocation} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Respondent Information (if applicable)</h3>
                        <div>
                          <Label htmlFor="respondent_name">Respondent Name</Label>
                          <Input
                            id="respondent_name"
                            placeholder="Name of the person/entity involved"
                            value={formData.respondent_name}
                            onChange={(e) => setFormData({ ...formData, respondent_name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="respondent_address">Respondent Address</Label>
                          <Textarea
                            id="respondent_address"
                            placeholder="Address of the respondent (if known)"
                            value={formData.respondent_address}
                            onChange={(e) => setFormData({ ...formData, respondent_address: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mediation"
                          checked={formData.request_mediation}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, request_mediation: checked as boolean })
                          }
                        />
                        <Label htmlFor="mediation">I would like to request mediation services</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.agree_to_terms}
                          onCheckedChange={(checked) => setFormData({ ...formData, agree_to_terms: checked as boolean })}
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I certify that the information provided is true and accurate to the best of my knowledge.
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={!formData.type || createComplaint.isPending}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {createComplaint.isPending ? "Submitting..." : "Submit Complaint"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="track">
            <ErrorBoundary>
              <div className="mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">My Complaints</h2>
                  <p className="text-muted-foreground">Track the progress of your submitted complaints</p>
                </div>

                {isLoading && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading complaints...</p>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">Failed to load complaints: {error.message}</p>
                  </div>
                )}

                {!isLoading && !error && complaints && complaints.length === 0 && (
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <p className="text-muted-foreground">No complaints found.</p>
                  </div>
                )}

                {!isLoading && !error && complaints && complaints.length > 0 && (
                  <div className="space-y-4">
                    {complaints.map((complaint) => (
                      <Card key={complaint.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{complaint.subject}</CardTitle>
                              <CardDescription>
                                {complaint.type} • Reference: {complaint.reference_number}
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
                              <Label className="text-sm font-medium text-muted-foreground">Date Filed</Label>
                              <p className="font-medium">{new Date(complaint.date_filed).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                              <p className="font-medium text-xs">
                                {typeof complaint.latitude === 'number' && !isNaN(complaint.latitude)
                                  ? complaint.latitude.toFixed(4)
                                  : 'N/A'}, 
                                {typeof complaint.longitude === 'number' && !isNaN(complaint.longitude)
                                  ? complaint.longitude.toFixed(4)
                                  : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Evidence Files</Label>
                              <p className="font-medium">{complaint.evidence.length}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                              <p className="text-sm">{complaint.detailed_description}</p>
                            </div>
                            {complaint.respondent_name && (
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Respondent</Label>
                                <p className="text-sm">{complaint.respondent_name}</p>
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

                          {complaint.evidence.length > 0 && (
                            <div className="mt-4">
                              <Label className="text-sm font-medium text-muted-foreground">Evidence</Label>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                {complaint.evidence.map((evidence) => (
                                  <div key={evidence.id} className="relative">
                                    {evidence.file_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                      <img
                                        src={evidence.file_url}
                                        alt="Evidence"
                                        className="h-20 w-full object-cover rounded-lg"
                                      />
                                    ) : (
                                      <video
                                        src={evidence.file_url}
                                        className="h-20 w-full object-cover rounded-lg"
                                        controls
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </ErrorBoundary>
          </TabsContent>
        </Tabs>

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