"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, AlertTriangle, Clock, CheckCircle, Volume2, VolumeX, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog";
import { useEmergencies, useEditEmergency, useDeleteEmergency, type EmergencyReport } from "@/stores/useEmergency";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface EmergencyStatusPopupProps {
// No props needed
}

export function EmergencyStatusPopup({}: EmergencyStatusPopupProps) {
const [isVisible, setIsVisible] = useState(true);
const [isSoundEnabled, setIsSoundEnabled] = useState(true);
const [selectedReport, setSelectedReport] = useState<EmergencyReport | null>(null);
const { data: reports = [], isLoading, error } = useEmergencies();
const { mutate: editEmergency } = useEditEmergency();
const { mutate: deleteEmergency } = useDeleteEmergency();
const { toast } = useToast();
const audioRef = useRef<HTMLAudioElement | null>(null);
  const queryClient = useQueryClient();
const handleStatusChange = useCallback(
  (id: string, newStatus: string) => {
    const numericId = parseInt(id);
    editEmergency({ id: numericId, data: { status: newStatus } });
  },
  [editEmergency]
);

useEffect(() => {
  const interval = setInterval(() => {
    queryClient.invalidateQueries({ queryKey: ['emergencies'] });
  }, 5000);
  return () => clearInterval(interval);
}, [queryClient]);

const handleDismiss = useCallback(
  (id: string) => {
    const numericId = parseInt(id);
    deleteEmergency(numericId);
  },
  [deleteEmergency]
);

const activeReports = reports.filter((r: EmergencyReport) => {
  const status = r.status?.toLowerCase().trim();
  return status === "pending" || status === "in_progress";
});

const pendingReports = activeReports
  .filter((r: EmergencyReport) => {
    const status = r.status?.toLowerCase().trim();
    return status === "pending";
  })
  .sort(
    (a: EmergencyReport, b: EmergencyReport) =>
      new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
  );

const inProgressReports = activeReports
  .filter((r: EmergencyReport) => r.status?.toLowerCase().trim() === "in_progress")
  .sort(
    (a: EmergencyReport, b: EmergencyReport) =>
      new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
  );

useEffect(() => {
  if (isSoundEnabled && pendingReports.length > 0 && audioRef.current) {
    audioRef.current
      .play()
      .catch((err) => {
        console.error("Audio playback error:", err);
        toast({
          title: "Audio Playback Error",
          description: "Unable to play alarm sound: " + err.message,
          variant: "destructive",
        });
      });
  } else if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
  return () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
}, [pendingReports.length, isSoundEnabled, toast]); // Effects are used to synchronize with external systems like audio playback [^1].

if (!isVisible || (pendingReports.length === 0 && inProgressReports.length === 0)) {
  return null;
}

return (
  <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm">
    <Card className="shadow-lg border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          {'Active Emergencies'}
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="text-muted-foreground hover:text-foreground"
            aria-label={isSoundEnabled ? "Mute Alarm" : "Enable Alarm"}
          >
            {isSoundEnabled ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading emergency reports...</p>
        ) : error ? (
          <p className="text-sm text-destructive">Error loading reports: {error.message}</p>
        ) : pendingReports.length === 0 && inProgressReports.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active emergency reports.</p>
        ) : (
          <ScrollArea className="h-[200px] pr-4">
            {pendingReports.length > 0 && (
              <div className="mb-4">
                <h3 className="text-md font-medium text-foreground mb-2 flex items-center gap-1">
                  <Clock className="h-4 w-4 text-orange-500" /> {'Pending ('}{pendingReports.length}{')'}
                </h3>
                <div className="space-y-2">
                  {pendingReports.map((report: EmergencyReport) => (
                    <div
                      key={report.id}
                      className="bg-secondary/20 p-3 rounded-md border border-border flex items-start justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {report.incident_type.toUpperCase()}: {report.location_text}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {'Reported by '}{report.name}{' at '}{" "}
                          {new Date(report.submitted_at).toLocaleTimeString()}
                        </p>
                        <Select
                          onValueChange={(value: string) => handleStatusChange(report.id, value)}
                          defaultValue={report.status}
                        >
                          <SelectTrigger className="w-[120px] mt-2">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedReport(report)}
                              className="text-blue-500 hover:text-blue-700"
                              aria-label="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Emergency Report Details</DialogTitle>
                            </DialogHeader>
                            {selectedReport && (
                              <div className="space-y-2 text-muted-foreground">
                                <p>
                                  <strong>{'Incident Type:'}</strong>{" "}
                                  {selectedReport.incident_type.toUpperCase()}
                                </p>
                                <p>
                                  <strong>{'Location:'}</strong> {selectedReport.location_text}
                                </p>
                                <p>
                                  <strong>{'Reported By:'}</strong> {selectedReport.name}
                                </p>
                                <p>
                                  <strong>{'Submitted At:'}</strong>{" "}
                                  {new Date(selectedReport.submitted_at).toLocaleString()}
                                </p>
                                <p>
                                  <strong>{'Status:'}</strong> {selectedReport.status}
                                </p>
                                {selectedReport.description && (
                                  <p>
                                    <strong>{'Description:'}</strong> {selectedReport.description}
                                  </p>
                                )}
                                {selectedReport.latitude && selectedReport.longitude && (
                                  <p>
                                    <strong>{'Coordinates:'}</strong> {selectedReport.latitude},{" "}
                                    {selectedReport.longitude}
                                  </p>
                                )}
                                {selectedReport.phone_number && (
                                  <p>
                                    <strong>{'Contact Number:'}</strong> {selectedReport.phone_number}
                                  </p>
                                )}
                                {selectedReport.media_file && (
                                  <img
                                    src={selectedReport.media_file || "/placeholder.svg"}
                                    alt="Emergency related"
                                    className="mt-2 max-h-60 w-full object-contain rounded-md border border-border"
                                  />
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDismiss(report.id)}
                          className="text-destructive hover:text-destructive/80"
                          aria-label="Dismiss report"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {inProgressReports.length > 0 && (
              <div>
                <h3 className="text-md font-medium text-foreground mb-2 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-blue-500" /> {'In Progress ('}{inProgressReports.length}{')'}
                </h3>
                <div className="space-y-2">
                  {inProgressReports.map((report: EmergencyReport) => (
                    <div
                      key={report.id}
                      className="bg-secondary/20 p-3 rounded-md border border-border flex items-start justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {report.incident_type.toUpperCase()}: {report.location_text}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {'Reported by '}{report.name}{' - Action Initiated'}
                        </p>
                        <Select
                          onValueChange={(value: string) => handleStatusChange(report.id, value)}
                          defaultValue={report.status}
                        >
                          <SelectTrigger className="w-[120px] mt-2">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedReport(report)}
                              className="text-blue-500 hover:text-blue-700"
                              aria-label="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Emergency Report Details</DialogTitle>
                            </DialogHeader>
                            {selectedReport && (
                              <div className="space-y-2 text-muted-foreground">
                                <p>
                                  <strong>{'Incident Type:'}</strong>{" "}
                                  {selectedReport.incident_type.toUpperCase()}
                                </p>
                                <p>
                                  <strong>{'Location:'}</strong> {selectedReport.location_text}
                                </p>
                                <p>
                                  <strong>{'Reported By:'}</strong> {selectedReport.name}
                                </p>
                                <p>
                                  <strong>{'Submitted At:'}</strong>{" "}
                                  {new Date(selectedReport.submitted_at).toLocaleString()}
                                </p>
                                <p>
                                  <strong>{'Status:'}</strong> {selectedReport.status}
                                </p>
                                {selectedReport.description && (
                                  <p>
                                    <strong>{'Description:'}</strong> {selectedReport.description}
                                  </p>
                                )}
                                {selectedReport.latitude && selectedReport.longitude && (
                                  <p>
                                    <strong>{'Coordinates:'}</strong> {selectedReport.latitude},{" "}
                                    {selectedReport.longitude}
                                  </p>
                                )}
                                {selectedReport.phone_number && (
                                  <p>
                                    <strong>{'Contact Number:'}</strong> {selectedReport.phone_number}
                                  </p>
                                )}
                                {selectedReport.media_file && (
                                  <img
                                    src={selectedReport.media_file || "/placeholder.svg"}
                                    alt="Emergency related"
                                    className="mt-2 max-h-60 w-full object-contain rounded-md border border-border"
                                  />
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDismiss(report.id)}
                          className="text-destructive hover:text-destructive/80"
                          aria-label="Dismiss report"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
    <audio
      ref={audioRef}
      src="/sound.mp3"
      loop
      hidden
      onError={() => {
        console.error("Audio element failed to load /sound.mp3");
        toast({
          title: "Audio Load Error",
          description: "Failed to load /sound.mp3. Please check the file path.",
          variant: "destructive",
        });
      }}
      onCanPlay={() => console.log("Audio file is ready to play")}
    />
  </div>
);
}


