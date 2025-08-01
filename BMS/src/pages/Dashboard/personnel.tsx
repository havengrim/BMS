"use client"

import React, { useState, useRef, useCallback, useMemo } from "react"
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
import { Eye, Edit, Trash2, Search, Users, Upload, ChevronLeft, ChevronRight } from "lucide-react"
import { useUsers, useUpdateUser, useDeleteUser } from "@/stores/useUsers"

interface User {
  id: number
  username: string
  email: string
  profile: {
    name: string
    contact_number: string
    address: string
    civil_status: string
    birthdate: string
    role: string
    image: string | null
  }
}

interface Personnel {
  id: string
  name: string
  email: string
  contactNumber: string
  dateOfBirth: string
  civilStatus: string
  address: string
  image?: string
  position?: string
}

const mapUserToPersonnel = (user: User): Personnel => ({
  id: user.id.toString(),
  name: user.profile?.name || "Unknown",
  email: user.email || "",
  contactNumber: user.profile?.contact_number || "",
  dateOfBirth: user.profile?.birthdate || "1970-01-01",
  civilStatus: user.profile?.civil_status
    ? user.profile.civil_status.charAt(0).toUpperCase() + user.profile.civil_status.slice(1).toLowerCase()
    : "Single",
  address: user.profile?.address || "Unknown",
  image: user.profile?.image || "/placeholder.svg?height=100&width=100",
  position: user.profile?.role || "Staff",
})

const PersonnelForm = React.memo(
  ({
    formData,
    setFormData,
    imagePreview,
    setImagePreview,
    setImageFile,
    fileInputRef,
    nameInputRef,
  }: {
    formData: Partial<Personnel>
    setFormData: React.Dispatch<React.SetStateAction<Partial<Personnel>>>
    imagePreview: string | null
    setImagePreview: React.Dispatch<React.SetStateAction<string | null>>
    imageFile: File | null
    setImageFile: React.Dispatch<React.SetStateAction<File | null>>
    fileInputRef: React.RefObject<HTMLInputElement | null>
    nameInputRef: React.RefObject<HTMLInputElement | null>
  }) => {
    console.log("PersonnelForm rendered")
    return (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            ref={nameInputRef}
            value={formData.name || ""}
            onChange={(e) => {
              console.log("Name input changed, focused:", document.activeElement === nameInputRef.current)
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }}
            onFocus={() => console.log("Name input focused")}
            onBlur={() => console.log("Name input blurred")}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="contactNumber" className="text-left">
            Contact Number
          </Label>
          <Input
            id="contactNumber"
            value={formData.contactNumber || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contactNumber: e.target.value }))}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="dateOfBirth" className="text-right">
            Date of Birth
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
            className="col-span-3 block"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="civilStatus" className="text-right">
            Civil Status
          </Label>
          <div>

            <Select
              value={formData.civilStatus || ""}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, civilStatus: value }))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select civil status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="position" className="text-right">
            Role
          </Label>
          <Select
            value={formData.position || ""}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, position: value }))}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Barangay Official</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="address" className="text-right">
            Address
          </Label>
          <Textarea
            id="address"
            value={formData.address || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="image" className="text-right">
            Photo
          </Label>
          <div className="col-span-3 space-y-2">
            <div className="flex items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setImageFile(file)
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setImagePreview(reader.result as string)
                    }
                    reader.readAsDataURL(file)
                  }
                }}
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
                Upload Photo
              </Button>
            </div>
            {imagePreview && (
              <div className="flex items-center gap-2">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={imagePreview || "/placeholder.svg"} alt="Preview" />
                  <AvatarFallback>Preview</AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setImagePreview(null)
                    setImageFile(null)
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
  },
)

export default function Personnel() {
  const { data: users, isLoading, isError } = useUsers()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const [personnel, setPersonnel] = useState<Personnel[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Personnel>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  React.useEffect(() => {
    if (users && !isLoading && !isError) {
      const mappedPersonnel = users.map(mapUserToPersonnel)
      setPersonnel(mappedPersonnel)
    }
  }, [users, isLoading, isError])

  const filteredPersonnel = useMemo(
    () =>
      personnel.filter(
        (person) =>
          person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.position?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [personnel, searchTerm],
  )

  const totalPages = Math.ceil(filteredPersonnel.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPersonnel = useMemo(
    () => filteredPersonnel.slice(startIndex, endIndex),
    [filteredPersonnel, startIndex, endIndex],
  )

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }, [])

  const handleEdit = useCallback((person: Personnel) => {
    setSelectedPersonnel(person)
    setFormData(person)
    setImagePreview(person.image || null)
    setImageFile(null)
    setIsEditDialogOpen(true)
    setTimeout(() => nameInputRef.current?.focus(), 0)
  }, [])

  const handleView = useCallback((person: Personnel) => {
    setSelectedPersonnel(person)
    setIsViewDialogOpen(true)
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteUser.mutateAsync(Number(id))
        setPersonnel((prev) => prev.filter((person) => person.id !== id))
        const newFilteredLength = filteredPersonnel.length - 1
        const newTotalPages = Math.ceil(newFilteredLength / itemsPerPage)
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages)
        }
      } catch (error) {
        console.error("Failed to delete user:", error)
      }
    },
    [deleteUser, filteredPersonnel, currentPage, itemsPerPage],
  )

  const handleSave = useCallback(
    async () => {
      if (!selectedPersonnel) return

      const formPayload = new FormData()
      formPayload.append("email", formData.email || "")
      formPayload.append("profile.name", formData.name || "")
      formPayload.append("profile.contact_number", formData.contactNumber || "")
      formPayload.append("profile.address", formData.address || "")
      formPayload.append("profile.civil_status", (formData.civilStatus || "").toLowerCase())
      formPayload.append("profile.birthdate", formData.dateOfBirth || "")
      formPayload.append("profile.role", formData.position || "")
      if (imageFile) {
        formPayload.append("profile.image", imageFile)
      }

      try {
        await updateUser.mutateAsync({ id: Number(selectedPersonnel.id), data: formPayload })
        setPersonnel((prev) =>
          prev.map((person) =>
            person.id === selectedPersonnel.id
              ? { ...person, ...formData, image: imageFile ? URL.createObjectURL(imageFile) : person.image }
              : person,
          ),
        )
        setIsEditDialogOpen(false)
      } catch (error) {
        console.error("Failed to update user:", error)
      }

      setFormData({})
      setSelectedPersonnel(null)
      setImagePreview(null)
      setImageFile(null)
    },
    [selectedPersonnel, formData, imageFile, updateUser],
  )

  const formProps = useMemo(
    () => ({
      formData,
      setFormData,
      imagePreview,
      setImagePreview,
      imageFile,
      setImageFile,
      fileInputRef,
      nameInputRef,
    }),
    [formData, imagePreview, imageFile],
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading personnel data...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>
          Unauthorized access. <a href="/login">Please log in</a>.
        </p>
      </div>
    )
  }

  if (personnel.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No personnel data available.</p>
      </div>
    )
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
              {/* Header */}
              <div className="flex items-center justify-between px-6">
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Personnel Management</h1>
                  <p className="text-muted-foreground text-md">Manage barangay personnel information and access</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-3 px-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Personnel</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{personnel.length}</div>
                    <p className="text-xs text-muted-foreground">Active personnel members</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Barangay Official</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {personnel.filter((p) => !p.position?.includes("Admin")).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Support staff</p>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Items Per Page */}
              <div className="flex items-center justify-between px-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search personnel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="itemsPerPage" className="text-sm">
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

              <div>
                <Card className="!p-0 border-none shadow-none">
                  <CardHeader>
                    <CardTitle>Personnel List</CardTitle>
                    <CardDescription>
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredPersonnel.length)} of{" "}
                      {filteredPersonnel.length} personnel members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Photo</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Civil Status</TableHead>
                          <TableHead>Contact Number</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentPersonnel.map((person) => (
                          <TableRow key={person.id}>
                            <TableCell>
                              <Avatar>
                                <AvatarImage src={person.image || "/placeholder.svg"} alt={person.name} />
                                <AvatarFallback>
                                  {person.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{person.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{person.position}</Badge>
                            </TableCell>
                            <TableCell>{person.email}</TableCell>
                            <TableCell>{person.civilStatus}</TableCell>
                            <TableCell>{person.contactNumber}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleView(person)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleEdit(person)}>
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
                                        This action cannot be undone. This will permanently delete {person.name}'s
                                        record from the system.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(person.id)}
                                        disabled={deleteUser.isPending}
                                      >
                                        {deleteUser.isPending ? "Deleting..." : "Delete"}
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
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
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
                <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Personnel</DialogTitle>
                    <DialogDescription>Make changes to the personnel information here.</DialogDescription>
                  </DialogHeader>
                  <PersonnelForm {...formProps} />
                  <DialogFooter>
                    <Button type="submit" onClick={handleSave} disabled={updateUser.isPending}>
                      {updateUser.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* View Dialog */}
              <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Personnel Details</DialogTitle>
                    <DialogDescription>View detailed information about this personnel member.</DialogDescription>
                  </DialogHeader>
                  {selectedPersonnel && (
                    <div className="grid gap-4 py-4">
                      <div className="flex items-center justify-center">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={selectedPersonnel.image || "/placeholder.svg"} alt={selectedPersonnel.name} />
                          <AvatarFallback className="text-lg">
                            {selectedPersonnel.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label className="font-semibold">Name:</Label>
                        <span className="col-span-2">{selectedPersonnel.name}</span>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label className="font-semibold">Position:</Label>
                        <span className="col-span-2">
                          <Badge variant="secondary">{selectedPersonnel.position}</Badge>
                        </span>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label className="font-semibold">Email:</Label>
                        <span className="col-span-2">{selectedPersonnel.email}</span>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label className="font-semibold">Contact Number:</Label>
                        <span className="col-span-2">{selectedPersonnel.contactNumber}</span>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label className="font-semibold">Date of Birth:</Label>
                        <span className="col-span-2">{new Date(selectedPersonnel.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label className="font-semibold">Civil Status:</Label>
                        <span className="col-span-2">{selectedPersonnel.civilStatus}</span>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label className="font-semibold">Address:</Label>
                        <span className="col-span-2">{selectedPersonnel.address}</span>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}