"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
import { AlertTriangle, Upload, X, MapPin, Navigation } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
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

interface MapPosition {
  lat: number;
  lng: number;
}

// LocationPicker Component adapted from reference
const LocationPicker = ({
  onLocationSelect,
  selectedLocation,
  locationText,
  onLocationTextChange,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation: MapPosition | null;
  locationText: string;
  onLocationTextChange: (text: string) => void;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (mapInstanceRef.current) {
          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
          }

          import("leaflet").then((L) => {
            markerRef.current = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
            mapInstanceRef.current.setView([latitude, longitude], 17);
          });

          onLocationSelect(latitude, longitude);
          if (!locationText) {
            onLocationTextChange(`Selected location on map (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          }
          setIsGettingLocation(false);

          toast({
            title: "Location detected",
            description: `Your current location has been set on the map.`,
          });
        }
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = "Unable to retrieve your location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        toast({
          title: "Location error",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !mapInstanceRef.current) {
      const loadLeafletCSS = () => {
        return new Promise<void>((resolve) => {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
          link.onload = () => resolve();
          document.head.appendChild(link);
        });
      };

      loadLeafletCSS().then(() => {
        import("leaflet").then((L) => {
          if (!mapRef.current || mapInstanceRef.current) return;

          const defaultLat = 14.5995;
          const defaultLng = 120.9842;

          mapInstanceRef.current = L.map(mapRef.current, {
            zoomControl: true,
            attributionControl: true,
          }).setView([defaultLat, defaultLng], 15);

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(mapInstanceRef.current);

          mapInstanceRef.current.on("click", (e: any) => {
            const { lat, lng } = e.latlng;

            if (markerRef.current) {
              mapInstanceRef.current.removeLayer(markerRef.current);
            }

            markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
            onLocationSelect(lat, lng);
            if (!locationText) {
              onLocationTextChange(`Selected location on map (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
            }
          });

          if (selectedLocation) {
            markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(mapInstanceRef.current);
            mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], 15);
          }

          setMapLoaded(true);
        });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
        } catch (error) {
          console.warn("Error during map cleanup:", error);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [onLocationSelect, locationText]);

  useEffect(() => {
    if (mapInstanceRef.current && selectedLocation && mapLoaded) {
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }

      import("leaflet").then((L) => {
        markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(mapInstanceRef.current);
        mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], 15);
      });
    }
  }, [selectedLocation, mapLoaded]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-3">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Location *
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
          className="w-full h-48 rounded-lg border border-border bg-gray-100 z-0"
          style={{ minHeight: "192px" }}
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

      <p className="text-xs text-muted-foreground">
        Click on the map to select the exact location, or use the "Use My Location" button to automatically detect your current position
      </p>
      {selectedLocation && (
        <div className="mt-2 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium">Selected Location:</p>
          <p className="text-sm text-muted-foreground">Latitude: {selectedLocation.lat.toFixed(6)}</p>
          <p className="text-sm text-muted-foreground">Longitude: {selectedLocation.lng.toFixed(6)}</p>
        </div>
      )}
    </div>
  );
};

export function EmergencyModal({ children }: EmergencyModalProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createEmergency, isPending: isSubmitting } = useCreateEmergency();
  const { toast } = useToast();
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

  const handleInputChange = useCallback((field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleLocationTextChange = useCallback((text: string) => {
    handleInputChange("location_text", text);
  }, [handleInputChange]);

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    handleInputChange("latitude", parseFloat(lat.toFixed(6)));
    handleInputChange("longitude", parseFloat(lng.toFixed(6)));
  }, [handleInputChange]);

  const currentPosition: MapPosition | null = formData.latitude !== 0 && formData.longitude !== 0
    ? { lat: formData.latitude, lng: formData.longitude }
    : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Basic validation (adapt as needed)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB limit.`,
          variant: "destructive",
        });
        e.target.value = ''; // Reset input
        return;
      }
      console.log('File selected:', { name: file.name, size: file.size, type: file.type, isFile: file instanceof File }); // Debug log
      setFormData((prev) => ({ ...prev, media_file: file }));
      e.target.value = ''; // Reset input to prevent re-selection issues
    } else {
      setFormData((prev) => ({ ...prev, media_file: null }));
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, media_file: null }));
    // If you have a ref to the input, reset it too: document.getElementById('media_file')?.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Debug: Log full formData before submit
    console.log('Submitting formData:', formData);
    if (formData.media_file) {
      console.log('Media file details:', {
        name: formData.media_file.name,
        size: formData.media_file.size,
        type: formData.media_file.type,
        isFile: formData.media_file instanceof File,
      });
    }

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("incident_type", formData.incident_type);
    submissionData.append("description", formData.description);
    submissionData.append("location_text", formData.location_text);
    submissionData.append("latitude", formData.latitude.toString());
    submissionData.append("longitude", formData.longitude.toString());
    submissionData.append("phone_number", formData.phone_number);
    if (formData.media_file instanceof File) { // Defensive: only append if valid File
      submissionData.append("media_file", formData.media_file);
      console.log('Appended media_file to FormData'); // Debug
    } else {
      console.error('Invalid media_file - skipping append:', formData.media_file);
      toast({
        title: "Invalid media file",
        description: "Please select a valid file and try again.",
        variant: "destructive",
      });
      return; // Abort submit
    }

    createEmergency(submissionData, {
      onSuccess: () => {
        setFormData({
          name: "",
          incident_type: "",
          description: "",
          location_text: "",
          phone_number: "",
          media_file: null, // Explicit null
          latitude: 0,
          longitude: 0,
        });
        setOpen(false);
        toast({
          title: "Emergency reported",
          description: "Your emergency report has been submitted successfully.",
        });
      },
      onError: (error) => { // Enhanced: log error details
        console.error('Submission error:', error);
        toast({
          title: "Submission failed",
          description: "An error occurred while submitting your report. Please try again.",
          variant: "destructive",
        });
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
    formData.longitude !== 0 &&
    formData.media_file instanceof File; // Changed: explicit File check

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

          <LocationPicker
            onLocationSelect={handleLocationSelect}
            selectedLocation={currentPosition}
            locationText={formData.location_text}
            onLocationTextChange={handleLocationTextChange}
          />

          <div className="space-y-2">
            <Label htmlFor="media_file">Attach Media (Required)</Label>
            <div className="space-y-2">
              {!formData.media_file ? (
                <div className="border-2 border-dashed border-gray-300 flex flex-col justify-center items-center rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <Label htmlFor="media_file" className="cursor-pointer">
                    <span className="text-sm text-gray-600">
                      Click to upload image, audio, or video
                    </span>
                    {/* Changed: Use native <input> for file handling */}
                    <input
                      id="media_file"
                      type="file"
                      accept="image/*,audio/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required
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