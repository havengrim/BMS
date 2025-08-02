import React, { useState, useRef } from "react"
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
import { Plus, Eye, Edit, Trash2, Search, Megaphone, Calendar, Users, Upload, ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { useAnnouncements, useCreateAnnouncement, useEditAnnouncement, useDeleteAnnouncement } from "@/stores/useAnnouncements"

interface Announcement {
  id: number
  title: string
  description: string
  status: string
  date: string
  endDate: string
  location: string
  targetAudience: string
  image?: string 
  createdAt: string
}

const statuses = ["All", "draft", "published", "archived"]

// Move AnnouncementForm outside as a separate component
interface AnnouncementFormProps {
  formData: Partial<Announcement>
  setFormData: (data: Partial<Announcement>) => void
  imagePreview: string | null
  setImagePreview: (preview: string | null) => void
  imageFile: File | null
  setImageFile: (file: File | null) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  formData,
  setFormData,
  imagePreview,
  setImagePreview,
  setImageFile,
  fileInputRef
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      setFormData({ ...formData, image: undefined })
    }
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">Title</Label>
        <Input
          id="title"
          value={formData.title || ""}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="col-span-3"
          rows={4}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">Status</Label>
        <Select
          value={formData.status || ""}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
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
        <Label className="text-right">Dates</Label>
        <div className="col-span-3 grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="date" className="text-sm">Start Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date || ""}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="block"
            />
          </div>
          <div>
            <Label htmlFor="endDate" className="text-sm">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate || ""}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
               className="block"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="location" className="text-right">Location</Label>
        <Input
          id="location"
          value={formData.location || ""}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="targetAudience" className="text-right">Target Audience</Label>
        <Input
          id="targetAudience"
          value={formData.targetAudience || ""}
          onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="image" className="text-right">Image</Label>
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
              <AvatarImage
                src={
                  imagePreview
                    ? imagePreview // Use blob URL for preview
                    : formData.image
                    ? `${import.meta.env.VITE_API_URL}${formData.image}`
                    : "/placeholder.svg"
                }
                alt="Preview"
                className="object-cover"
              />
              <AvatarFallback>Preview</AvatarFallback>
            </Avatar>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setImagePreview(null)
                  setImageFile(null)
                  setFormData({ ...formData, image: undefined })
                  if (fileInputRef.current) fileInputRef.current.value = ""
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
}

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Announcement>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { data: announcements = [], isLoading } = useAnnouncements()
  const createAnnouncement = useCreateAnnouncement()
  const editAnnouncement = useEditAnnouncement()
  const deleteAnnouncement = useDeleteAnnouncement()

  // Map API data to frontend interface
  const mappedAnnouncements: Announcement[] = announcements.map(ann => ({
    id: ann.id,
    title: ann.title,
    description: ann.description,
    status: ann.status || "draft",
    date: ann.start_date,
    endDate: ann.end_date,
    location: ann.location,
    targetAudience: ann.target_audience,
    image: ann.image,
    createdAt: ann.created_at,
  }))

  // Filter announcements
  const filteredAnnouncements = mappedAnnouncements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "All" || announcement.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Pagination
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
      status: "draft",
      targetAudience: "All residents",
    })
    setImageFile(null)
    setImagePreview(null)
    setIsAddDialogOpen(true)
  }

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setFormData(announcement)
    setImageFile(null)
    setImagePreview(announcement.image || null)
    setIsEditDialogOpen(true)
  }

  const handleView = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setImagePreview(announcement.image || null)
    setIsViewDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    deleteAnnouncement.mutate(id)
  }

  const handleSave = () => {
    const form = new FormData()
    form.append("title", formData.title || "")
    form.append("description", formData.description || "")
    form.append("status", formData.status || "draft")
    form.append("start_date", formData.date || "")
    form.append("end_date", formData.endDate || "")
    form.append("location", formData.location || "")
    form.append("target_audience", formData.targetAudience || "All residents")
    if (imageFile) {
      form.append("image", imageFile)
    }

    if (selectedAnnouncement) {
      editAnnouncement.mutate({ id: selectedAnnouncement.id, data: form })
    } else {
      createAnnouncement.mutate(form)
    }

    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
    setFormData({})
    setSelectedAnnouncement(null)
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800"
      case "draft": return "bg-yellow-100 text-yellow-800"
      case "archived": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

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
                    <AnnouncementForm
                      formData={formData}
                      setFormData={setFormData}
                      imagePreview={imagePreview}
                      setImagePreview={setImagePreview}
                      imageFile={imageFile}
                      setImageFile={setImageFile}
                      fileInputRef={fileInputRef}
                    />
                    <DialogFooter>
                      <Button type="submit" onClick={handleSave} disabled={createAnnouncement.isPending}>
                        Create Announcement
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

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
                  <Label htmlFor="itemsPerPage" className="text-sm whitespace-nowrap">Show:</Label>
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
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : (
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Image</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Start Date</TableHead>
                              <TableHead>End Date</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentAnnouncements.map((announcement) => (
                              <TableRow key={announcement.id}>
                                <TableCell>
                                  <Avatar className="h-12 w-12 rounded-md">
                                    <AvatarImage
                                      src={
                                        announcement.image
                                          ? `${import.meta.env.VITE_API_URL}${announcement.image}`
                                          : "/placeholder.svg"
                                      }
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
                                  <Badge className={getStatusColor(announcement.status)}>
                                    {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>{new Date(announcement.date).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(announcement.endDate).toLocaleDateString()}</TableCell>
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
                                            This action cannot be undone. This will permanently delete "{announcement.title}" from the system.
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
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Announcement</DialogTitle>
                    <DialogDescription>Make changes to the announcement here.</DialogDescription>
                  </DialogHeader>
                  <AnnouncementForm
                    formData={formData}
                    setFormData={setFormData}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    fileInputRef={fileInputRef}
                  />
                  <DialogFooter>
                    <Button type="submit" onClick={handleSave} disabled={editAnnouncement.isPending}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

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
                      {selectedAnnouncement.image && (
                        <div className="w-full h-48 rounded-lg overflow-hidden">
                          <img
                            src={
                              selectedAnnouncement.image
                                ? `${import.meta.env.VITE_API_URL}${selectedAnnouncement.image}`
                                : "/placeholder.svg"
                            }
                            alt={selectedAnnouncement.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(selectedAnnouncement.status)}>
                          {selectedAnnouncement.status.charAt(0).toUpperCase() + selectedAnnouncement.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Start: {new Date(selectedAnnouncement.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>End: {new Date(selectedAnnouncement.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedAnnouncement.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedAnnouncement.targetAudience}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(selectedAnnouncement.createdAt).toLocaleDateString()}
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