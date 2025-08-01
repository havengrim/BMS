"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnnouncementDialog } from "@/components/announcement-dialog"
import { Calendar, Clock, MapPin, Users, Eye } from "lucide-react"
import { useAnnouncements } from "@/stores/useAnnouncements"
import type { Announcement } from "@/stores/useAnnouncements"

interface AnnouncementGalleryProps {
  showAll?: boolean
}

export function AnnouncementGallery({ showAll = false }: AnnouncementGalleryProps) {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: announcements = [], isLoading, error } = useAnnouncements()

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setDialogOpen(true)
  }

  if (isLoading) return <div>Loading announcements...</div>
  if (error) return <div>Error loading announcements.</div>

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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements
          .filter((announcement) => announcement.status === "published")
          .map((announcement, index) => {
          const isLarge = !showAll && index === 0
          const isMedium = !showAll && (index === 1 || index === 2)

          return (
            <Card
              key={announcement.id}
              className={`group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden !p-0 ${
                isLarge
                  ? "md:col-span-2 md:row-span-2"
                  : isMedium
                  ? "md:col-span-1"
                  : ""
              }`}
              onClick={() => handleAnnouncementClick(announcement)}
            >
              {isLarge ? (
                <div className="relative h-full min-h-[360px]">
                 <img
                    src={
                      announcement.image
                        ? `${import.meta.env.VITE_API_URL}${announcement.image}`
                        : "/placeholder.svg"
                    }
                    alt={announcement.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10" />

                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                    <Badge className={`${getStatusColor(announcement.status)} shadow-lg`}>
                      {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                    </Badge>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2 shadow-lg">
                      <Eye className="h-4 w-4 text-gray-700" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(announcement.start_date).toLocaleDateString()}</span>
                        </div>
                        {announcement.end_date && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(announcement.end_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight group-hover:text-primary-foreground transition-colors">
                        {announcement.title}
                      </h3>

                      <p className="text-white/90 text-base md:text-lg leading-snug line-clamp-2 max-w-2xl">
                        {announcement.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                        {announcement.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">{announcement.location}</span>
                          </div>
                        )}
                        {announcement.target_audience && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="line-clamp-1">{announcement.target_audience}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-white/70 text-sm">
                          Click to view full details
                        </span>
                        <div className="w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={`relative overflow-hidden ${
                      isLarge ? "h-56" : "h-44"
                    }`}
                  >
                    <img
                      src={
                      announcement.image
                        ? `${import.meta.env.VITE_API_URL}${announcement.image}`
                          : "/placeholder.svg"
                      }
                      alt={announcement.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <Badge className={getStatusColor(announcement.status)}>
                        {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                      </Badge>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                        <Eye className="h-4 w-4 text-gray-700" />
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(announcement.start_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <CardHeader className={isLarge ? "pb-1.5" : "pb-1"}>
                    <CardTitle
                      className={`group-hover:text-primary transition-colors ${
                        isLarge ? "text-xl" : "text-lg"
                      } line-clamp-2`}
                    >
                      {announcement.title}
                    </CardTitle>
                    <CardDescription
                      className={`line-clamp-2 ${isLarge ? "text-base" : "text-sm"}`}
                    >
                      {announcement.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-1">
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {announcement.end_date && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(announcement.end_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {announcement.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">{announcement.location}</span>
                        </div>
                      )}
                      {announcement.target_audience && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="line-clamp-1">{announcement.target_audience}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Click to view details
                      </span>
                      <div className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          )
        })}
      </div>

      <AnnouncementDialog
        announcement={selectedAnnouncement}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}