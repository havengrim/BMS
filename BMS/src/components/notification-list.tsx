"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NotificationItem {
  id: string
  user: {
    name: string
    avatar: string
    initials: string
  }
  action: string
  description: string
  timestamp: string
  isRead: boolean
}

const notifications: NotificationItem[] = [
  {
    id: "1",
    user: {
      name: "Maria Santos",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MS",
    },
    action: "Submitted certificate request",
    description: "Barangay Clearance for employment purposes",
    timestamp: "5 mins ago",
    isRead: false,
  },
  {
    id: "2",
    user: {
      name: "Juan Dela Cruz",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
    },
    action: "Completed residency verification",
    description: "Certificate of Residency approved and ready",
    timestamp: "21 mins ago",
    isRead: false,
  },
  {
    id: "3",
    user: {
      name: "Ana Reyes",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AR",
    },
    action: "Updated business permit application",
    description: "Additional documents submitted for review",
    timestamp: "2hrs ago",
    isRead: true,
  },
  {
    id: "4",
    user: {
      name: "Carlos Mendoza",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "CM",
    },
    action: "Requested barangay ID renewal",
    description: "Senior citizen discount application included",
    timestamp: "3hrs ago",
    isRead: true,
  },
  {
    id: "5",
    user: {
      name: "Rosa Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RG",
    },
    action: "Submitted indigency certificate request",
    description: "Medical assistance program application",
    timestamp: "1 day ago",
    isRead: true,
  },
]

export function NotificationList() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full l mx-auto">
        <div className="overflow-hidden relative">
          <div className="px-3 sm:px-6">
            <div className="space-y-2 sm:space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-colors hover:bg-gray-50 ${
                    !notification.isRead ? "bg-cyan-50/50" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8 sm:h-12 sm:w-12 flex-shrink-0">
                    <AvatarImage src={notification.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-medium text-xs sm:text-sm">
                      {notification.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-cyan-600 text-xs sm:text-sm truncate">
                          {notification.user.name}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5 line-clamp-1 sm:line-clamp-none">
                          {notification.action}
                        </p>
                        <p className="text-gray-900 text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
                          {notification.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 sm:ml-2 flex-shrink-0">
                        <span className="text-gray-400 text-xs whitespace-nowrap">{notification.timestamp}</span>
                        {!notification.isRead && <div className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0"></div>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationList
