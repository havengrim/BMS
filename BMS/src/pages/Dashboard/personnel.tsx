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
import { Plus, Eye, Edit, Trash2, Search, Users, Upload, ChevronLeft, ChevronRight } from "lucide-react"

interface Personnel {
  id: string
  name: string
  email: string
  password: string
  dateOfBirth: string
  civilStatus: string
  address: string
  image?: string
  position?: string
}

const initialPersonnel: Personnel[] = [
  {
    id: "1",
    name: "Juan Dela Cruz",
    email: "juan.delacruz@sindalan.gov.ph",
    password: "password123",
    dateOfBirth: "1980-05-15",
    civilStatus: "Married",
    address: "123 Main Street, Sindalan, San Fernando, Pampanga",
    image: "/placeholder.svg?height=100&width=100",
    position: "Barangay Captain",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@sindalan.gov.ph",
    password: "password123",
    dateOfBirth: "1985-08-22",
    civilStatus: "Single",
    address: "456 Oak Avenue, Sindalan, San Fernando, Pampanga",
    image: "/placeholder.svg?height=100&width=100",
    position: "Barangay Secretary",
  },
  {
    id: "3",
    name: "Pedro Rodriguez",
    email: "pedro.rodriguez@sindalan.gov.ph",
    password: "password123",
    dateOfBirth: "1978-12-10",
    civilStatus: "Married",
    address: "789 Pine Road, Sindalan, San Fernando, Pampanga",
    image: "/placeholder.svg?height=100&width=100",
    position: "Barangay Treasurer",
  },
  {
    id: "4",
    name: "Ana Garcia",
    email: "ana.garcia@sindalan.gov.ph",
    password: "password123",
    dateOfBirth: "1990-03-18",
    civilStatus: "Single",
    address: "321 Elm Street, Sindalan, San Fernando, Pampanga",
    image: "/placeholder.svg?height=100&width=100",
    position: "Barangay Clerk",
  },
  {
    id: "5",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@sindalan.gov.ph",
    password: "password123",
    dateOfBirth: "1982-07-25",
    civilStatus: "Married",
    address: "654 Maple Drive, Sindalan, San Fernando, Pampanga",
    image: "/placeholder.svg?height=100&width=100",
    position: "Barangay Councilor",
  },
  {
    id: "6",
    name: "Rosa Fernandez",
    email: "rosa.fernandez@sindalan.gov.ph",
    password: "password123",
    dateOfBirth: "1987-11-12",
    civilStatus: "Divorced",
    address: "987 Cedar Lane, Sindalan, San Fernando, Pampanga",
    image: "/placeholder.svg?height=100&width=100",
    position: "Health Worker",
  },
  {
    id: "7",
    name: "Miguel Torres",
    email: "miguel.torres@sindalan.gov.ph",
    password: "password123",
    dateOfBirth: "1975-09-30",
    civilStatus: "Married",
    address: "147 Birch Avenue, Sindalan, San Fernando, Pampanga",
    image: "/placeholder.svg?height=100&width=100",
    position: "Security Officer",
  },
  {
    id: "8",
    name: "Elena Reyes",
    email: "elena.reyes@sindalan.gov.ph",
    password: "password123",
    dateOfBirth: "1992-01-08",
    civilStatus: "Single",
    address: "258 Willow Street, Sindalan, San Fernando, Pampanga",
    image: "/placeholder.svg?height=100&width=100",
    position: "Social Worker",
  },
]

export default function Personnel() {
  const [personnel, setPersonnel] = useState<Personnel[]>(initialPersonnel)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Personnel>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const filteredPersonnel = personnel.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.position?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination calculations
  const totalPages = Math.ceil(filteredPersonnel.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPersonnel = filteredPersonnel.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const handleAdd = () => {
    setFormData({})
    setImagePreview(null)
    setIsAddDialogOpen(true)
  }

  const handleEdit = (person: Personnel) => {
    setSelectedPersonnel(person)
    setFormData(person)
    setImagePreview(person.image || null)
    setIsEditDialogOpen(true)
  }

  const handleView = (person: Personnel) => {
    setSelectedPersonnel(person)
    setIsViewDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setPersonnel(personnel.filter((person) => person.id !== id))
    // Adjust current page if necessary
    const newFilteredLength = personnel.filter((person) => person.id !== id).length
    const newTotalPages = Math.ceil(newFilteredLength / itemsPerPage)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    }
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
    if (selectedPersonnel) {
      // Edit existing personnel
      setPersonnel(
        personnel.map((person) => (person.id === selectedPersonnel.id ? { ...person, ...formData } : person)),
      )
      setIsEditDialogOpen(false)
    } else {
      // Add new personnel
      const newPersonnel: Personnel = {
        id: Date.now().toString(),
        name: formData.name || "",
        email: formData.email || "",
        password: formData.password || "",
        dateOfBirth: formData.dateOfBirth || "",
        civilStatus: formData.civilStatus || "",
        address: formData.address || "",
        image: formData.image || "/placeholder.svg?height=100&width=100",
        position: formData.position || "",
      }
      setPersonnel([...personnel, newPersonnel])
      setIsAddDialogOpen(false)
    }
    setFormData({})
    setSelectedPersonnel(null)
    setImagePreview(null)
  }

  const PersonnelForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-right">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password || ""}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="civilStatus" className="text-right">
          Civil Status
        </Label>
        <Select
          value={formData.civilStatus || ""}
          onValueChange={(value) => setFormData({ ...formData, civilStatus: value })}
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
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="position" className="text-right">
          Position
        </Label>
        <Input
          id="position"
          value={formData.position || ""}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="address" className="text-right">
          Address
        </Label>
        <Textarea
          id="address"
          value={formData.address || ""}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  <h1 className="text-xl font-bold tracking-tight">Personnel Management</h1>
                  <p className="text-muted-foreground text-md">Manage barangay personnel information and access</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAdd}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Personnel
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Personnel</DialogTitle>
                      <DialogDescription>Add a new personnel member to the barangay system.</DialogDescription>
                    </DialogHeader>
                    <PersonnelForm />
                    <DialogFooter>
                      <Button type="submit" onClick={handleSave}>
                        Add Personnel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                    <CardTitle className="text-sm font-medium">Officials</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {personnel.filter((p) => p.position?.includes("Barangay")).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Barangay officials</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Staff</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {personnel.filter((p) => !p.position?.includes("Barangay")).length}
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

              <div className="">
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
                          <TableHead>Position</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Civil Status</TableHead>
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
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleView(person)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(person)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-4 w-4" />
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
                                      <AlertDialogAction onClick={() => handleDelete(person.id)}>
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
                  <PersonnelForm />
                  <DialogFooter>
                    <Button type="submit" onClick={handleSave}>
                      Save Changes
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
                          <AvatarImage
                            src={selectedPersonnel.image || "/placeholder.svg"}
                            alt={selectedPersonnel.name}
                          />
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
                        <Label className="font-semibold">Date of Birth:</Label>
                        <span className="col-span-2">
                          {new Date(selectedPersonnel.dateOfBirth).toLocaleDateString()}
                        </span>
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
