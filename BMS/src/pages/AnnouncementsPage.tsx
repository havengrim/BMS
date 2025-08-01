import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnnouncementGallery } from "@/components/announcement-gallery"
import { useAnnouncements } from "@/stores/useAnnouncements"

export default function AnnouncementsPage() {
  const { isLoading, error } = useAnnouncements()

  if (isLoading) return <div>Loading announcements...</div>
  if (error) return <div>Error loading announcements: {error.message}</div>

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Announcements</h1>
          <p className="text-muted-foreground">Stay updated with the latest news and events in our barangay</p>
        </div>
        <AnnouncementGallery showAll={true} />
      </div>
      <Footer />
    </div>
  )
}