import { Navbar } from "@/components/navbar"
import { AnnouncementGallery } from "@/components/announcement-gallery"
import { announcements } from "@/lib/announcements-data"

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Announcements</h1>
          <p className="text-muted-foreground">Stay updated with the latest news and events in our barangay</p>
        </div>

        <AnnouncementGallery announcements={announcements} showAll={true} />
      </div>
    </div>
  )
}
