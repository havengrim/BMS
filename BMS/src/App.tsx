
import { Routes, Route, useLocation } from "react-router-dom";
import { OfflineDetector } from "@/components/offline-detector";
import { Toaster } from "@/components/ui/toaster";

import HomePage from "@/pages/HomePage";
import CertificatesPage from "@/pages/CertificatesPage";
import BusinessPermitsPage from "@/pages/BusinessPermitsPage";
import ComplaintsPage from "@/pages/ComplaintsPage";
import AnnouncementsPage from "@/pages/AnnouncementsPage";
import ContactPage from "@/pages/ContactPage";
import OfflinePage from "@/pages/OfflinePage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import AccessibilityPage from "@/pages/AccessibilityPage";
import LoginPage from "./pages/Authentication/login";
import RegisterPage from "./pages/Authentication/register";

import Page from "./pages/Dashboard/page";
import Personnel from "./pages/Dashboard/personnel";
import Certificates from "./pages/Dashboard/certificates";
import Announcements from "./pages/Dashboard/announcements";
import ComplaintsDashboard from "./pages/Dashboard/complaints";
import Notification from "./pages/Dashboard/notification";
import BusinessPermitDashboard from "./pages/Dashboard/business";

import { useLoadCurrentUser } from "@/stores/useAccount";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import "./index.css";
import SindalanConnectChatbot from "./components/Chatbot";
import BlotterPage from "./pages/BlotterPage";
import BlotterAdminDashboard from "./pages/Dashboard/blotter";
import SettingsPage from "./pages/SettingsPage";
import { EmergencyStatusPopup } from "./components/emergency-status-popup";


function App() {
  useLoadCurrentUser();
  const location = useLocation();

  // Paths where EmergencyStatusPopup should appear
  const protectedPaths = [
    "/dashboard",
    "/manage-blotter",
    "/manage-business",
    "/personnel",
    "/certificates-list",
    "/announcements-manager",
    "/manage-complaints",
    "/notification",
  ];

  const showEmergencyPopup = protectedPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <OfflineDetector />

      {showEmergencyPopup && (
        <EmergencyStatusPopup />
      )}

      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/business-permits" element={<BusinessPermitsPage />} />
          <Route path="/blotter" element={<BlotterPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Page />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-blotter"
            element={
              <ProtectedRoute>
                <BlotterAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-business"
            element={
              <ProtectedRoute>
                <BusinessPermitDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/personnel"
            element={
              <ProtectedRoute>
                <Personnel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates-list"
            element={
              <ProtectedRoute>
                <Certificates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements-manager"
            element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-complaints"
            element={
              <ProtectedRoute>
                <ComplaintsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notification"
            element={
              <ProtectedRoute>
                <Notification />
              </ProtectedRoute>
            }
          />
        </Routes>

        <SindalanConnectChatbot />
      </main>

      <Toaster />
    </div>
  );
}

export default App;
