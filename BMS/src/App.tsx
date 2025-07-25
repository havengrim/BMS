import { Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { OfflineDetector } from "@/components/offline-detector"
import { Footer } from "@/components/footer"

// Pages
import HomePage from "@/pages/HomePage"
import CertificatesPage from "@/pages/CertificatesPage"
import BusinessPermitsPage from "@/pages/BusinessPermitsPage"
import ComplaintsPage from "@/pages/ComplaintsPage"
import AnnouncementsPage from "@/pages/AnnouncementsPage"
import ContactPage from "@/pages/ContactPage"
import OfflinePage from "@/pages/OfflinePage"
import PrivacyPage from "@/pages/PrivacyPage"
import TermsPage from "@/pages/TermsPage"
import AccessibilityPage from "@/pages/AccessibilityPage"
import "./index.css"
function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <OfflineDetector />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/business-permits" element={<BusinessPermitsPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

export default App
