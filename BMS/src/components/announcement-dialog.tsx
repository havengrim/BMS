"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Announcement {
  id: number
  title: string
  date: string
  time?: string
  location?: string
  type: string
  priority: string
  description: string
  attendees?: string
  image: string
  fullDescription?: string
}

interface AnnouncementDialogProps {
  announcement: Announcement | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "Event":
      return "bg-blue-100 text-blue-800"
    case "Meeting":
      return "bg-purple-100 text-purple-800"
    case "Notice":
      return "bg-orange-100 text-orange-800"
    case "Health":
      return "bg-green-100 text-green-800"
    case "Sports":
      return "bg-indigo-100 text-indigo-800"
    case "Update":
      return "bg-cyan-100 text-cyan-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function AnnouncementDialog({ announcement, open, onOpenChange }: AnnouncementDialogProps) {
  if (!announcement) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getTypeColor(announcement.type)}>{announcement.type}</Badge>
                <Badge variant="outline" className={getPriorityColor(announcement.priority)}>
                  {announcement.priority} priority
                </Badge>
              </div>
              <DialogTitle className="text-2xl leading-tight pr-8">{announcement.title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <img
              src={announcement.image || "/placeholder.svg"}
              alt={announcement.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{announcement.date}</span>
            </div>
            {announcement.time && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{announcement.time}</span>
              </div>
            )}
            {announcement.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{announcement.location}</span>
              </div>
            )}
            {announcement.attendees && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{announcement.attendees}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Details</h3>
            <p className="text-muted-foreground leading-relaxed">
              {announcement.fullDescription || announcement.description}
            </p>
          </div>

          {/* Additional Information */}
          {announcement.type === "Event" && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Event Information</h4>
              <p className="text-sm text-blue-700">
                Please bring your own materials and arrive on time. For more information, contact the barangay office.
              </p>
            </div>
          )}

          {announcement.type === "Notice" && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">Important Notice</h4>
              <p className="text-sm text-orange-700">
                This notice affects all residents in the specified areas. Please plan accordingly.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button className="flex-1">Contact for More Info</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
