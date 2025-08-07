"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Download, Save, Settings, Upload, Camera, IdCard } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { useUser, useUpdateUser } from "@/stores/useUsers";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

// Define the UserProfile interface to match the expected API data structure
interface UserProfile {
  id: number;
  username: string;
  email: string;
  profile: {
    name: string;
    contact_number: string;
    address: string;
    civil_status: string;
    birthdate: string;
    role: string;
    image: string | null;
  };
}

export default function SettingsPage() {
  const userId = 3;
  const { data: userData, isLoading } = useUser(userId); // Removed unused 'error'
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { toast } = useToast();
  const [isGeneratingId, setIsGeneratingId] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [barangayId, setBarangayId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const idCardRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (userData) {
      setFormData(userData as UserProfile);
      setSelectedDate(userData.profile.birthdate ? new Date(userData.profile.birthdate) : undefined);
    }
  }, [userData]);

  const handleInputChange = (field: string, value: string, isProfile = false) => {
    if (!formData) return;
    if (isProfile) {
      setFormData((prev) => ({
        ...prev!,
        profile: {
          ...prev!.profile,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date && formData) {
      setSelectedDate(date);
      handleInputChange("birthdate", format(date, "yyyy-MM-dd"), true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSaveSettings = () => {
    if (!formData) return;
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("profile.name", formData.profile.name);
    data.append("profile.contact_number", formData.profile.contact_number);
    data.append("profile.address", formData.profile.address);
    data.append("profile.civil_status", formData.profile.civil_status);
    data.append("profile.birthdate", formData.profile.birthdate);
    data.append("profile.role", formData.profile.role);
    if (imageFile) {
      data.append("image", imageFile);
    }

    updateUser(
      { id: userId, data },
      {
        onSuccess: () => {
          toast({ title: "Success", description: "Profile updated successfully." });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to update profile.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const generateBarangayId = async () => {
    setIsGeneratingId(true);
    toast({
      title: "Generating ID",
      description: "Creating your barangay identification card...",
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const generatedId = `BRG-${userId.toString().padStart(6, "0")}-${new Date().getFullYear()}`;
    setBarangayId(generatedId);
    setIsGeneratingId(false);

    toast({
      title: "ID Generated Successfully",
      description: "Your barangay ID is ready for download.",
    });
  };

  const downloadIdAsPDF = async () => {
    if (!idCardRef.current) return;

    setIsDownloading(true);
    toast({
      title: "Preparing Download",
      description: "Generating PDF of your ID...",
    });

    try {
      const width = 480;
      const height = 300;
      const scale = 2; // For higher resolution

      // Create a canvas element
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      // Draw background with gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#065f46");
      gradient.addColorStop(1, "#4b5563");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw header background
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(0, 0, canvas.width, 48 * scale);

      // Draw header border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      ctx.moveTo(0, 48 * scale);
      ctx.lineTo(canvas.width, 48 * scale);
      ctx.stroke();

      // Draw header text
      ctx.fillStyle = "white";
      ctx.font = `${14 * scale}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText("REPUBLIC OF THE PHILIPPINES", canvas.width / 2, 20 * scale);
      ctx.font = `${12 * scale}px Arial`;
      ctx.fillText("BARANGAY IDENTIFICATION CARD", canvas.width / 2, 32 * scale);
      ctx.font = `${10 * scale}px Arial`;
      ctx.globalAlpha = 0.8;
      ctx.fillText("SINDALAN SANFERNANDO, PAMPANGA", canvas.width / 2, 42 * scale);
      ctx.globalAlpha = 1.0;

      // Draw photo container
      ctx.fillStyle = "white";
      ctx.fillRect(16 * scale, 64 * scale, 80 * scale, 96 * scale);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 2 * scale;
      ctx.strokeRect(16 * scale, 64 * scale, 80 * scale, 96 * scale);

      // Load and draw profile image
      let imageSrc = formData?.profile.image || "/placeholder.svg";
      try {
        const response = await fetch(imageSrc, { method: "HEAD" });
        if (!response.ok) {
          console.warn("Profile image inaccessible, using placeholder");
          imageSrc = "/placeholder.svg";
        }
      } catch {
        console.warn("Profile image fetch failed, using placeholder");
        imageSrc = "/placeholder.svg";
      }

      const photo = new Image();
      photo.crossOrigin = "anonymous";
      await new Promise((resolve) => {
        photo.onload = () => resolve(photo);
        photo.onerror = () => {
          console.warn("Failed to load profile image, skipping");
          resolve(new Image()); // Continue without photo
        };
        photo.src = imageSrc;
      });

      if (photo.width > 0) {
        ctx.drawImage(photo, 16 * scale, 64 * scale, 80 * scale, 96 * scale);
      }

      // Draw info section with extra spacing
      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.font = `${12 * scale}px Arial`;
      let x = 112 * scale;
      let y = 64 * scale;

      // ID Number
      ctx.globalAlpha = 0.75;
      ctx.fillText("ID NO:", x, y);
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = "#fef08a"; // Yellow-300
      ctx.font = `${12 * scale}px Arial bold`;
      ctx.fillText(barangayId || "N/A", x, y + 12 * scale);
      ctx.fillStyle = "white";
      ctx.font = `${12 * scale}px Arial`;

      // Name with extra 8px spacing
      y += 24 * scale + 8 * scale;
      ctx.globalAlpha = 0.75;
      ctx.fillText("NAME:", x, y);
      ctx.globalAlpha = 1.0;
      ctx.font = `${14 * scale}px Arial bold`;
      const name = formData?.profile.name ? formData.profile.name.toUpperCase() : "N/A";
      ctx.fillText(name, x, y + 12 * scale);
      ctx.font = `${12 * scale}px Arial`;

      // Address with extra 8px spacing
      y += 24 * scale + 8 * scale;
      ctx.globalAlpha = 0.75;
      ctx.fillText("ADDRESS:", x, y);
      ctx.globalAlpha = 1.0;
      ctx.font = `${10 * scale}px Arial`;
      const address = formData?.profile.address || "N/A";
      const addressLines = splitText(address, ctx, 300 * scale);
      addressLines.forEach((line, index) => {
        ctx.fillText(line, x, y + 12 * scale + index * 12 * scale);
      });

      // Grid section, adjusted for spacing
      y = 192 * scale; // Adjusted due to extra spacing
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      ctx.moveTo(16 * scale, y);
      ctx.lineTo(canvas.width - 16 * scale, y);
      ctx.stroke();

      y += 12 * scale;
      ctx.font = `${10 * scale}px Arial`;
      const gridItems = [
        {
          label: "BIRTHDATE:",
          value: formData?.profile.birthdate ? format(new Date(formData.profile.birthdate), "MM/dd/yyyy") : "N/A",
        },
        { label: "CIVIL STATUS:", value: formData?.profile.civil_status || "N/A" },
        { label: "CONTACT:", value: formData?.profile.contact_number || "N/A" },
        { label: "ROLE:", value: formData?.profile.role || "N/A" },
      ];

      gridItems.forEach((item, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const xPos = 16 * scale + col * (canvas.width / 2);
        const yPos = y + row * 24 * scale;
        ctx.globalAlpha = 0.75;
        ctx.fillText(item.label, xPos, yPos);
        ctx.globalAlpha = 1.0;
        ctx.font = `${10 * scale}px Arial bold`;
        ctx.fillText(item.value, xPos, yPos + 12 * scale);
        ctx.font = `${10 * scale}px Arial`;
      });

      // Footer section, adjusted for spacing
      y = 264 * scale; // Adjusted due to extra spacing
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.beginPath();
      ctx.moveTo(16 * scale, y);
      ctx.lineTo(canvas.width - 16 * scale, y);
      ctx.stroke();

      y += 12 * scale;
      ctx.font = `${10 * scale}px Arial`;
      ctx.globalAlpha = 0.75;
      ctx.fillText("ISSUED:", 16 * scale, y);
      ctx.globalAlpha = 1.0;
      ctx.fillText(format(new Date(), "MM/dd/yyyy"), 16 * scale, y + 12 * scale);
      ctx.globalAlpha = 0.75;
      ctx.textAlign = "right";
      ctx.fillText("VALID UNTIL:", canvas.width - 16 * scale, y);
      ctx.globalAlpha = 1.0;
      ctx.fillText(format(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), "MM/dd/yyyy"), canvas.width - 16 * scale, y + 12 * scale);

      // Bottom bar
      const bottomGradient = ctx.createLinearGradient(0, canvas.height - 8 * scale, canvas.width, canvas.height - 8 * scale);
      bottomGradient.addColorStop(0, "#facc15");
      bottomGradient.addColorStop(0.5, "#f59e0b");
      bottomGradient.addColorStop(1, "#facc15");
      ctx.fillStyle = bottomGradient;
      ctx.fillRect(0, canvas.height - 8 * scale, canvas.width, 8 * scale);

      // Generate PNG data URL from canvas
      const dataUrl = canvas.toDataURL("image/png", 1.0);

      // Create PDF using jsPDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [86, 54], // Standard ID card size (ISO/IEC 7810 ID-1)
      });

      // Convert canvas dimensions to mm (1 px = 0.264583 mm at 96 DPI)
      const pdfWidth = 86;
      const pdfHeight = 54;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Save the PDF
      pdf.save(`barangay-id-${barangayId || "unknown"}.pdf`);

      toast({
        title: "Download Complete",
        description: "Your barangay ID has been saved as a PDF in your downloads folder.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download Failed",
        description: "Unable to generate PDF. Ensure your profile image is accessible or try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to split text for address
  const splitText = (text: string, ctx: CanvasRenderingContext2D, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.slice(0, 2); // Limit to 2 lines
  };

  const BarangayIdCard = () => (
    <div
      className="w-100"
      style={{ aspectRatio: "1.6/1" }}
    >
      <div
        ref={idCardRef}
        className="w-full h-auto rounded-xl shadow-2xl overflow-hidden"
        style={{
          background: "linear-gradient(to bottom right, #065f46, #4b5563)",
        }}
      >
        <div className="bg-white/10 backdrop-blur-sm p-3 text-center border-b border-white/20">
          <div className="text-white">
            <h2 className="text-sm font-bold tracking-wide">REPUBLIC OF THE PHILIPPINES</h2>
            <h3 className="text-xs opacity-90">BARANGAY IDENTIFICATION CARD</h3>
            <div className="text-xs opacity-80 mt-1">MAIMPIS, PAMPANGA</div>
          </div>
        </div>
        <div className="p-4 text-white">
          <div className="flex gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-20 h-24 bg-white rounded border-2 border-white/50 overflow-hidden">
                <img
                  src={formData?.profile.image || "/placeholder.svg"}
                  alt="ID Photo"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
            <div className="flex-1 space-y-1 text-sm overflow-hidden">
              <div>
                <div className="text-xs opacity-75">ID NO:</div>
                <div className="font-bold text-yellow-300">{barangayId}</div>
              </div>
              <div>
                <div className="text-xs opacity-75">NAME:</div>
                <div className="font-semibold text-sm leading-tight truncate">
                  {formData?.profile.name.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="text-xs opacity-75">ADDRESS:</div>
                <div className="text-xs leading-tight line-clamp-2">{formData?.profile.address}</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs border-t border-white/20 pt-3">
            <div>
              <div className="opacity-75">BIRTHDATE:</div>
              <div className="font-medium">
                {formData?.profile.birthdate
                  ? format(new Date(formData.profile.birthdate), "MM/dd/yyyy")
                  : ""}
              </div>
            </div>
            <div>
              <div className="opacity-75">CIVIL STATUS:</div>
              <div className="font-medium capitalize">{formData?.profile.civil_status}</div>
            </div>
            <div>
              <div className="opacity-75">CONTACT:</div>
              <div className="font-medium">{formData?.profile.contact_number}</div>
            </div>
            <div>
              <div className="opacity-75">ROLE:</div>
              <div className="font-medium capitalize">{formData?.profile.role}</div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center text-xs">
            <div>
              <div className="opacity-75">ISSUED:</div>
              <div>{format(new Date(), "MM/dd/yyyy")}</div>
            </div>
            <div className="text-right">
              <div className="opacity-75">VALID UNTIL:</div>
              <div>{format(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), "MM/dd/yyyy")}</div>
            </div>
          </div>
        </div>
        <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <div>Loading user data...</div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>No user data available.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and barangay ID</p>
        </div>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Profile Settings
            </TabsTrigger>
            <TabsTrigger value="barangay-id" className="flex items-center gap-2">
              <IdCard className="h-4 w-4" />
              Barangay ID
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={formData.profile.image || "/placeholder.svg"} alt={formData.profile.name} />
                    <AvatarFallback>{formData.profile.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <div>
                          <Upload className="h-4 w-4 mr-2" />
                          Change Photo
                        </div>
                      </Button>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <p className="text-sm text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.profile.name}
                        onChange={(e) => handleInputChange("name", e.target.value, true)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Number</Label>
                      <Input
                        id="contact"
                        value={formData.profile.contact_number}
                        onChange={(e) => handleInputChange("contact_number", e.target.value, true)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.profile.address}
                      onChange={(e) => handleInputChange("address", e.target.value, true)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 w-full">
                      <Label htmlFor="civil-status">Civil Status</Label>
                      <Select
                        value={formData.profile.civil_status}
                        onValueChange={(value) => handleInputChange("civil_status", value, true)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Birthdate</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div>
                      <Badge variant="secondary" className="capitalize">
                        {formData.profile.role}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">Role cannot be modified</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings} disabled={isUpdating}>
                    <Save className="h-4 w-4 mr-2" />
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="barangay-id">
            <div className="space-y-6 h-full">
              <Card>
                <CardHeader>
                  <CardTitle>Barangay ID Issuance</CardTitle>
                  <CardDescription>Generate and download your official barangay identification card as a PDF</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!barangayId ? (
                    <div className="text-center space-y-4">
                      <div className="bg-muted/50 p-6 rounded-lg">
                        <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-medium mb-2">Ready to Generate Your ID</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Make sure all your profile information is accurate before generating your barangay ID.
                        </p>
                        <Button onClick={generateBarangayId} disabled={isGeneratingId} size="lg">
                          {isGeneratingId ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Generating ID...
                            </>
                          ) : (
                            <>
                              <IdCard className="h-4 w-4 mr-2" />
                              Generate Barangay ID
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">Your Barangay ID</h3>
                        <p className="text-sm text-muted-foreground">
                          Generated on {format(new Date(), "MMMM dd, yyyy")}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-dashed border-gray-200">
                        <div className="text-center mb-4">
                          <h4 className="font-medium text-gray-700 mb-1">ID Preview</h4>
                          <p className="text-sm text-gray-500">High-quality PDF version will be downloaded</p>
                        </div>
                        <div className="flex justify-center">
                          <BarangayIdCard />
                        </div>
                      </div>
                      <div className="flex justify-center gap-4">
                        <Button
                          onClick={downloadIdAsPDF}
                          size="lg"
                          disabled={isDownloading}
                          className="min-w-[200px]"
                        >
                          {isDownloading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Preparing PDF...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setBarangayId(null)}
                          size="lg"
                          disabled={isDownloading}
                        >
                          Generate New ID
                        </Button>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">📋 Next Steps</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Download your ID as a PDF for digital use</li>
                          <li>• Print the PDF on quality cardstock for physical use</li>
                          <li>• Visit the barangay office for official validation and lamination</li>
                          <li>• Keep both digital and physical copies for your records</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}