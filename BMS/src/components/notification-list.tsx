"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Notification {
  id: string
  user: {
    name: string
    avatar: string
    initials: string
  }
  type: "request" | "approval" | "message"
  title: string
  description?: string
  timestamp: string
  isRead: boolean
}

const notifications: Notification[] = [
  {
    id: "1",
    user: { name: "Maria Santos", avatar: "/placeholder.svg", initials: "MS" },
    type: "request",
    title: "Submitted Certificate Request",
    description: "Barangay Clearance for employment purposes",
    timestamp: "5 mins ago",
    isRead: false,
  },
  {
    id: "2",
    user: { name: "Juan Dela Cruz", avatar: "/placeholder.svg", initials: "JD" },
    type: "approval",
    title: "Approved Residency Verification",
    description: "Certificate of Residency is ready for pickup",
    timestamp: "21 mins ago",
    isRead: false,
  },
  {
    id: "3",
    user: { name: "Ana Reyes", avatar: "/placeholder.svg", initials: "AR" },
    type: "message",
    title: "Meeting Scheduled",
    description: "Meeting with Barangay officials next Tuesday at 10 AM.",
    timestamp: "2 hrs ago",
    isRead: true,
  },
  {
    id: "4",
    user: { name: "Carlos Mendoza", avatar: "/placeholder.svg", initials: "CM" },
    type: "request",
    title: "Requested Barangay ID Renewal",
    description: "Senior citizen discount application included",
    timestamp: "3 hrs ago",
    isRead: true,
  },
]

export function NotificationList() {
  const [tab, setTab] = useState<"All" | "Unread">("All")

  const filteredNotifications =
    tab === "Unread" ? notifications.filter((n) => !n.isRead) : notifications

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={() => setTab(tab === "All" ? "Unread" : "All")}
          className="text-sm text-cyan-600 hover:underline"
        >
          {tab === "All" ? "Show Unread" : "Show All"}
        </button>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredNotifications.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
            No notifications here.
          </p>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-4 cursor-pointer ${
                !n.isRead ? "bg-cyan-50 dark:bg-cyan-900/30 rounded-md" : "hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              }`}
            >
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={n.user.avatar} alt={n.user.name} />
                <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-semibold">
                  {n.user.initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400 truncate">
                  {n.user.name}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                  {n.title}
                </p>
                {n.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{n.description}</p>
                )}
              </div>

              <div className="flex flex-col items-end min-w-max">
                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{n.timestamp}</span>
                {!n.isRead && <span className="mt-1 h-2 w-2 rounded-full bg-cyan-600" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default NotificationList
