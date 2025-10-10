"use client";

import { Navbar } from "@/components/navbar";
import { useEmergencies } from "@/stores/useEmergency";
import { useAuthStore } from "@/stores/authStore"; // <-- for user login check
import { AlertTriangle, Clock } from "lucide-react";
import { format } from "date-fns";

export default function ModernNotificationPage() {
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

 const { data, isLoading, isError } = useEmergencies(!!user);
 

  // Only in-progress emergency alerts
  const emergencyAlerts = isLoggedIn
    ? data?.filter((e) => e.status === "in_progress") || []
    : [];

  // Format exact date and time
  const formatSubmittedAt = (dateString: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "PPP p");
    // Example: "Aug 14, 2025 4:25 PM"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Notification / Emergency Alert
              </h1>
              {isLoggedIn ? (
                <p className="text-gray-500 text-sm mt-1">
                  You have {emergencyAlerts.length} notification{" "}
                  {emergencyAlerts.length === 1 ? "alert" : "alerts"}.
                </p>
              ) : (
                <p className="text-gray-500 text-sm mt-1">
                  Please log in to view emergency alerts.
                </p>
              )}
            </div>
          </div>

          {isLoggedIn && !isLoading && !isError && emergencyAlerts.length > 0 && (
            <div className="space-y-3 bg-white p-4 rounded-md">
              {emergencyAlerts.map((emergency) => (
                <div
                  key={emergency.id}
                  className="flex items-start gap-4 p-3 bg-red-50 rounded-lg border border-red-100"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">
                      {emergency.alert_message}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      {emergency.location_text}
                    </p>
                  </div>
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatSubmittedAt(emergency.submitted_at)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {isLoggedIn && !isLoading && !isError && emergencyAlerts.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No emergency alerts at the moment</p>
            </div>
          )}

          {isLoggedIn && isLoading && (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">Loading emergency alerts...</p>
            </div>
          )}

          {isLoggedIn && isError && (
            <div className="py-12 text-center">
              <p className="text-red-600 text-sm">Failed to load emergency alerts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
