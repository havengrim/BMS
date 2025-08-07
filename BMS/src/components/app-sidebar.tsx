import * as React from "react"
import {
  IconCamera,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import { IoDocumentTextOutline } from "react-icons/io5";
import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { FiAlertOctagon } from "react-icons/fi";
import { useAuthStore } from "@/stores/authStore"
import { CiAlignBottom } from "react-icons/ci";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import images from "@/assets/images"
import { BiPhotoAlbum } from "react-icons/bi";
const data = {

  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Certificates",
      url: "/certificates-list",
      icon: IoDocumentTextOutline,
    },
    {
      title: "Business Permit",
      url: "/manage-business",
      icon: CiAlignBottom,
    },
    {
      title: "Announcements",
      url: "/announcements-manager",
      icon: BiPhotoAlbum,
    },
    {
      title: "Complaints",
      url: "/manage-complaints",
      icon: FiAlertOctagon,
    },
    {
      title: "Personnel",
      url: "/personnel",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Blotter Reports",
      url: "/manage-blotter",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const BASE_URL = import.meta.env.VITE_API_URL;
   const user = useAuthStore((state) => state.user);
   console.log(user)

    const userData = {
    name: user?.profile?.name || user?.username || "Unknown User",
    email: user?.email || "no-email@example.com",
    image: user?.profile?.image
    ? `${BASE_URL}${user.profile.image}`
    : "https://github.com/leerob.png",
  }
  console.log("User image:", user?.profile?.image);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                 <img src={images.logo} className="h-6 w-6"/>
                <span className="text-base font-semibold">Sindalan Connect</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
