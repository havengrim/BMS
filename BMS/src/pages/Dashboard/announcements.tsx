"use client"

import type React from "react"

import { useState, useRef } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Megaphone,
  Calendar,
  Users,
  Upload,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react"

interface Announcement {
  id: string
  title: string
  description: string
  content: string
  type: "event" | "update" | "meeting" | "alert" | "news"
  priority: "low" | "normal" | "high" | "urgent"
  status: "draft" | "published" | "archived"
  image?: string
  date: string
  startTime?: string
  endTime?: string
  location?: string
  targetAudience: string
  createdBy: string
  createdAt: string
  publishedAt?: string
  views: number
}

const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Community Clean-up Drive",
    description: "Join us for our monthly community clean-up drive this Saturday.",
    content:
      "Join us for our monthly community clean-up drive this Saturday. This is a great opportunity for residents to come together and make our barangay cleaner and greener. We will be focusing on the main streets, parks, and common areas. Please bring your own cleaning materials including gloves, trash bags, and brooms. Light refreshments will be provided. This event is part of our ongoing environmental initiative to maintain the beauty and cleanliness of our community.",
    type: "event",
    priority: "high",
    status: "published",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CWf0EnJTMtHxA45ePxxpLxz2S0ovOf.png",
    date: "2025-01-28",
    startTime: "07:00",
    endTime: "12:00",
    location: "Barangay Plaza",
    targetAudience: "All residents welcome",
    createdBy: "Maria Santos",
    createdAt: "2025-01-20",
    publishedAt: "2025-01-20",
    views: 245,
  },
  {
    id: "2",
    title: "New Online Services Available",
    description: "We're excited to announce that you can now request certificates and permits online.",
    content:
      "We're excited to announce that you can now request certificates and permits online through Sindalan Connect. This new digital platform allows residents to submit applications, track their status, and receive notifications without visiting the barangay hall. Available services include barangay clearance, residency certificates, business permits, and more. Visit our website or download our mobile app to get started.",
    type: "update",
    priority: "normal",
    status: "published",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-B6uOUEzQcalbiytKO0QCAdSk2OG1QM.png",
    date: "2025-01-25",
    targetAudience: "All residents",
    createdBy: "Pedro Rodriguez",
    createdAt: "2025-01-24",
    publishedAt: "2025-01-25",
    views: 189,
  },
  {
    id: "3",
    title: "Barangay Assembly Meeting",
    description: "Monthly barangay assembly meeting to discuss community issues and budget updates.",
    content:
      "Monthly barangay assembly meeting to discuss community issues, budget updates, and upcoming projects. All residents are encouraged to attend and participate in the discussion. Agenda items include: infrastructure improvements, health programs, peace and order updates, and community development projects. Your input and feedback are valuable to us.",
    type: "meeting",
    priority: "normal",
    status: "published",
    date: "2025-01-30",
    startTime: "18:00",
    endTime: "20:00",
    location: "Barangay Hall",
    targetAudience: "All residents",
    createdBy: "Juan Dela Cruz",
    createdAt: "2025-01-22",
    publishedAt: "2025-01-22",
    views: 156,
  },
  {
    id: "4",
    title: "Water Service Interruption",
    description: "Scheduled water service interruption for maintenance work.",
    content:
      "There will be a scheduled water service interruption on February 2, 2025, from 8:00 AM to 4:00 PM for maintenance work on the main water lines. Affected areas include Streets 1-5 and the commercial district. We apologize for any inconvenience and recommend storing water in advance. Emergency water supply will be available at the barangay hall.",
    type: "alert",
    priority: "urgent",
    status: "published",
    date: "2025-02-02",
    startTime: "08:00",
    endTime: "16:00",
    location: "Streets 1-5, Commercial District",
    targetAudience: "Affected residents",
    createdBy: "Elena Reyes",
    createdAt: "2025-01-26",
    publishedAt: "2025-01-26",
    views: 312,
  },
  {
    id: "5",
    title: "Senior Citizens Health Program",
    description: "Free health check-up and consultation for senior citizens.",
    content:
      "Free health check-up and consultation for senior citizens aged 60 and above. Services include blood pressure monitoring, blood sugar testing, general consultation, and health education. Please bring your senior citizen ID and any existing medical records. Registration starts at 7:00 AM. Limited slots available, first come first served.",
    type: "event",
    priority: "normal",
    status: "draft",
    date: "2025-02-05",
    startTime: "08:00",
    endTime: "15:00",
    location: "Barangay Health Center",
    targetAudience: "Senior citizens (60+)",
    createdBy: "Rosa Fernandez",
    createdAt: "2025-01-27",
    views: 0,
  },
]

const types = ["All", "event", "update", "meeting", "alert", "news"]
const priorities = ["All", "low", "normal", "high", "urgent"]
const statuses = ["All", "draft", "published", "archived"]

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Announcement>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "All" || announcement.type === selectedType
    const matchesPriority = selectedPriority === "All" || announcement.priority === selectedPriority
    const matchesStatus = selectedStatus === "All" || announcement.status === selectedStatus
    return matchesSearch && matchesType && matchesPriority && matchesStatus
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAnnouncements = filteredAnnouncements.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }

  const handleAdd = () => {
    setFormData({
      type: "update",
      priority: "normal",
      status: "draft",
      targetAudience: "All residents",
    })
    setImagePreview(null)
    setIsAddDialogOpen(true)
  }

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setFormData(announcement)
    setImagePreview(announcement.image || null)
    setIsEditDialogOpen(true)
  }

  const handleView = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setIsViewDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter((announcement) => announcement.id !== id))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData({ ...formData, image: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (selectedAnnouncement) {
      // Edit existing announcement
      setAnnouncements(
        announcements.map((announcement) =>
          announcement.id === selectedAnnouncement.id ? { ...announcement, ...formData } : announcement,
        ),
      )
      setIsEditDialogOpen(false)
    } else {
      // Add new announcement
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: formData.title || "",
        description: formData.description || "",
        content: formData.content || "",
        type: (formData.type as Announcement["type"]) || "update",
        priority: (formData.priority as Announcement["priority"]) || "normal",
        status: (formData.status as Announcement["status"]) || "draft",
        image: formData.image,
        date: formData.date || "",
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        targetAudience: formData.targetAudience || "All residents",
        createdBy: "Current User",
        createdAt: new Date().toISOString().split("T")[0],
        publishedAt: formData.status === "published" ? new Date().toISOString().split("T")[0] : undefined,
        views: 0,
      }
      setAnnouncements([...announcements, newAnnouncement])
      setIsAddDialogOpen(false)
    }
    setFormData({})
    setSelectedAnnouncement(null)
    setImagePreview(null)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "event":
        return "bg-blue-100 text-blue-800"
      case "update":
        return "bg-green-100 text-green-800"
      case "meeting":
        return "bg-purple-100 text-purple-800"
      case "alert":
        return "bg-red-100 text-red-800"
      case "news":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const AnnouncementForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="col-span-3"
          rows={2}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="content" className="text-right">
          Content
        </Label>
        <Textarea
          id="content"
          value={formData.content || ""}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="col-span-3"
          rows={4}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
          Type
        </Label>
        <Select
          value={formData.type || ""}
          onValueChange={(value) => setFormData({ ...formData, type: value as Announcement["type"] })}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="event">Event</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="alert">Alert</SelectItem>
            <SelectItem value="news">News</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="priority" className="text-right">
          Priority
        </Label>
        <Select
          value={formData.priority || ""}
          onValueChange={(value) => setFormData({ ...formData, priority: value as Announcement["priority"] })}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">
          Status
        </Label>
        <Select
          value={formData.status || ""}
          onValueChange={(value) => setFormData({ ...formData, status: value as Announcement["status"] })}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Date & Time</Label>
        <div className="col-span-3 grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="date" className="text-sm">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date || ""}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="startTime" className="text-sm">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime || ""}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endTime" className="text-sm">
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime || ""}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="location" className="text-right">
          Location
        </Label>
        <Input
          id="location"
          value={formData.location || ""}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="targetAudience" className="text-right">
          Target Audience
        </Label>
        <Input
          id="targetAudience"
          value={formData.targetAudience || ""}
          onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="image" className="text-right">
          Image
        </Label>
        <div className="col-span-3 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
          </div>
          {imagePreview && (
            <div className="flex items-center gap-2">
              <Avatar className="h-16 w-16 rounded-md">
                <AvatarImage src={imagePreview || "/placeholder.svg"} alt="Preview" className="object-cover" />
                <AvatarFallback>Preview</AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setImagePreview(null)
                  setFormData({ ...formData, image: "" })
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Header */}
              <div className="flex items-center justify-between px-6">
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Announcements Management</h1>
                  <p className="text-muted-foreground text-md">Create and manage barangay announcements and events</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAdd}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Announcement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Announcement</DialogTitle>
                      <DialogDescription>Create a new announcement for the barangay community.</DialogDescription>
                    </DialogHeader>
                    <AnnouncementForm />
                    <DialogFooter>
                      <Button type="submit" onClick={handleSave}>
                        Create Announcement
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-3 px-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
                    <Megaphone className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{announcements.length}</div>
                    <p className="text-xs text-muted-foreground">All announcements</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Published</CardTitle>
                    <Eye className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {announcements.filter((a) => a.status === "published").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Live announcements</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Events</CardTitle>
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{announcements.filter((a) => a.type === "event").length}</div>
                    <p className="text-xs text-muted-foreground">Upcoming events</p>
                  </CardContent>
                </Card>

              </div>

              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 px-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full lg:w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "All" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-full lg:w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority === "All" ? "All Priority" : priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full lg:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "All" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Label htmlFor="itemsPerPage" className="text-sm whitespace-nowrap">
                    Show:
                  </Label>
                  <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Announcements Table */}
              <div>
                <Card className="!p-0 border-none shadow-none">
                  <CardHeader>
                    <CardTitle>Announcements List</CardTitle>
                    <CardDescription>
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredAnnouncements.length)} of{" "}
                      {filteredAnnouncements.length} announcements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentAnnouncements.map((announcement) => (
                          <TableRow key={announcement.id}>
                            <TableCell>
                              <Avatar className="h-12 w-12 rounded-md">
                                <AvatarImage
                                  src={announcement.image || "/placeholder.svg"}
                                  alt={announcement.title}
                                  className="object-cover"
                                />
                                <AvatarFallback>
                                  {announcement.title
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{announcement.title}</div>
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {announcement.description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getTypeColor(announcement.type)}>
                                {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityColor(announcement.priority)}>
                                {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(announcement.status)}>
                                {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(announcement.date).toLocaleDateString()}</TableCell>
                            <TableCell>{announcement.views}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleView(announcement)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleEdit(announcement)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete "{announcement.title}
                                        " from the system.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(announcement.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          )
                        })}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Edit Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Announcement</DialogTitle>
                    <DialogDescription>Make changes to the announcement here.</DialogDescription>
                  </DialogHeader>
                  <AnnouncementForm />
                  <DialogFooter>
                    <Button type="submit" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* View Dialog */}
              <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Megaphone className="h-5 w-5" />
                      {selectedAnnouncement?.title}
                    </DialogTitle>
                    <DialogDescription>{selectedAnnouncement?.description}</DialogDescription>
                  </DialogHeader>
                  {selectedAnnouncement && (
                    <div className="grid gap-6 py-4">
                      {/* Image */}
                      {selectedAnnouncement.image && (
                        <div className="w-full h-48 rounded-lg overflow-hidden">
                          <img
                            src={selectedAnnouncement.image || "/placeholder.svg"}
                            alt={selectedAnnouncement.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getTypeColor(selectedAnnouncement.type)}>
                          {selectedAnnouncement.type.charAt(0).toUpperCase() + selectedAnnouncement.type.slice(1)}
                        </Badge>
                        <Badge className={getPriorityColor(selectedAnnouncement.priority)}>
                          {selectedAnnouncement.priority.charAt(0).toUpperCase() +
                            selectedAnnouncement.priority.slice(1)}
                        </Badge>
                        <Badge className={getStatusColor(selectedAnnouncement.status)}>
                          {selectedAnnouncement.status.charAt(0).toUpperCase() + selectedAnnouncement.status.slice(1)}
                        </Badge>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(selectedAnnouncement.date).toLocaleDateString()}</span>
                        </div>
                        {selectedAnnouncement.startTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {selectedAnnouncement.startTime}
                              {selectedAnnouncement.endTime && ` - ${selectedAnnouncement.endTime}`}
                            </span>
                          </div>
                        )}
                        {selectedAnnouncement.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedAnnouncement.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedAnnouncement.targetAudience}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <h4 className="font-semibold mb-2">Content</h4>
                        <p className="text-sm leading-relaxed">{selectedAnnouncement.content}</p>
                      </div>

                      {/* Meta Information */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Created by:</span> {selectedAnnouncement.createdBy}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(selectedAnnouncement.createdAt).toLocaleDateString()}
                        </div>
                        {selectedAnnouncement.publishedAt && (
                          <div>
                            <span className="font-medium">Published:</span>{" "}
                            {new Date(selectedAnnouncement.publishedAt).toLocaleDateString()}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Views:</span> {selectedAnnouncement.views}
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                      Close
                    </Button>
                    <Button onClick={() => handleEdit(selectedAnnouncement!)}>Edit Announcement</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
