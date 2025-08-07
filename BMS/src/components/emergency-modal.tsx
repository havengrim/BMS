"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCreateEmergency } from "@/stores/useEmergency"; // Import the hook

interface EmergencyModalProps {
  children: React.ReactNode;
}

const INCIDENT_TYPES = [
  { value: "fire", label: "Fire" },
  { value: "medical", label: "Medical Emergency" },
  { value: "security", label: "Security/Crime" },
  { value: "flood", label: "Flood" },
  { value: "earthquake", label: "Earthquake" },
  { value: "other", label: "Other" },
];

export function EmergencyModal({ children }: EmergencyModalProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createEmergency, isPending: isSubmitting } = useCreateEmergency();
  const [formData, setFormData] = useState({
    name: "",
    incident_type: "",
    description: "",
    location_text: "",
    phone_number: "",
    media_file: null as File | null,
    latitude: 0,
    longitude: 0,
  });
  const [locationError, setLocationError] = useState<string | null>(null);

  // Attempt to get user's geolocation on modal open
  useEffect(() => {
    if (open && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          setLocationError(null);
        },
        (error) => {
          setLocationError("Unable to retrieve location. Please enter manually.");
          console.error("Geolocation error:", error);
        }
      );
    }
  }, [open]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, media_file: file }));
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, media_file: null }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Ensure proper rounding before submitting
  const roundedLatitude = parseFloat(formData.latitude.toFixed(6));
  const roundedLongitude = parseFloat(formData.longitude.toFixed(6));

  const cleanedFormData = {
    ...formData,
    latitude: roundedLatitude,
    longitude: roundedLongitude,
  };

  createEmergency(cleanedFormData, {
    onSuccess: () => {
      setFormData({
        name: "",
        incident_type: "",
        description: "",
        location_text: "",
        phone_number: "",
        media_file: null,
        latitude: 0,
        longitude: 0,
      });
      setOpen(false);
    },
  });
};


  const isFormValid =
    formData.name &&
    formData.incident_type &&
    formData.description &&
    formData.location_text &&
    formData.phone_number &&
    formData.latitude !== 0 &&
    formData.longitude !== 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Emergency Report
          </DialogTitle>
          <DialogDescription>
            Submit an emergency report. For life-threatening emergencies, please
            call 911 or our emergency hotline immediately.
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>For immediate life-threatening emergencies:</strong> Call 911
            or our 24/7 emergency hotline: 0917-EMERGENCY (0917-363-7436)
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                maxLength={100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number *</Label>
              <Input
                id="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={(e) => handleInputChange("phone_number", e.target.value)}
                placeholder="e.g., 09171234567"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="incident_type">Incident Type *</Label>
            <Select
              value={formData.incident_type}
              onValueChange={(value) => handleInputChange("incident_type", value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                {INCIDENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location_text">Location *</Label>
            <Input
              id="location_text"
              value={formData.location_text}
              onChange={(e) => handleInputChange("location_text", e.target.value)}
              placeholder="e.g., 123 Main St, Near City Park, Barangay Hall"
              maxLength={255}
              required
            />
            {locationError && (
              <p className="text-sm text-red-600">{locationError}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude || ""}
                onChange={(e) =>
                  handleInputChange("latitude", parseFloat(e.target.value) || 0)
                }
                placeholder="e.g., 14.5995"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude || ""}
                onChange={(e) =>
                  handleInputChange("longitude", parseFloat(e.target.value) || 0)
                }
                placeholder="e.g., 120.9842"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Provide detailed information about the emergency..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="media_file">Attach Media (Optional)</Label>
            <div className="space-y-2">
              {!formData.media_file ? (
                <div className="border-2 border-dashed border-gray-300 flex flex-col justify-center items-center rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <Label htmlFor="media_file" className="cursor-pointer">
                    <span className="text-sm text-gray-600">
                      Click to upload image, audio, or video
                    </span>
                    <Input
                      id="media_file"
                      type="file"
                      accept="image/*,audio/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: Images, Audio, Video (Max 10MB)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700 truncate">
                      {formData.media_file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({(formData.media_file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Emergency Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}