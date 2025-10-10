import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"



import { Link } from "react-router-dom" // ✅ Added Link

// nav-main.tsx

import type { Icon as TablerIcon } from "@tabler/icons-react"
import type { IconType } from "react-icons"

type IconCompatible = TablerIcon | IconType

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: IconCompatible
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link to={item.url} className="w-full">
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
