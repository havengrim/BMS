"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, FileText, Users, MessageSquare, User, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import images from "@/assets/images"
import { useAuthStore } from "@/stores/authStore"
import { useLogout } from "@/stores/useAccount"

const services = [
  {
    title: "Certificate Requests",
    href: "/certificates",
    description: "Request barangay clearance, residency certificates, and more",
    icon: FileText,
  },
  {
    title: "Business Permits",
    href: "/business-permits",
    description: "Apply for business permits and renewals",
    icon: Users,
  },
  {
    title: "File Complaints",
    href: "/complaints",
    description: "Submit complaints and incident reports",
    icon: MessageSquare,
  },
]

export function Navbar() {
  const location = useLocation()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const handleLogout = useLogout()

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={images.logo || "/placeholder.svg"} className="h-14 w-14" alt="Sindalan Connect Logo" />
            <div className="flex flex-col">
              <span className="text-lg font-bold">Sindalan Connect</span>
              <span className="text-xs text-muted-foreground">Barangay Management System</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/"
                    className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === "/" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {services.map((service) => (
                      <li key={service.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={service.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <service.icon className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">{service.title}</div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {service.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/announcements"
                    className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === "/announcements" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Announcements
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/contact"
                    className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === "/contact" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    About Us
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            {user && user.profile?.role === "user" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer h-8 w-8 hidden md:flex">
                    <AvatarImage src={user.profile.image || undefined} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="hidden md:inline-flex">
                <Link to="/login">Sign In</Link>
              </Button>
            )}

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  {/* User Profile Section - Mobile */}
                  {user && user.profile?.role === "user" ? (
                    <div className="flex items-center gap-3 p-4 border-b">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.profile.image || undefined} alt={user.username} />
                        <AvatarFallback className="text-lg">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{user.username}</span>
                        <span className="text-xs text-muted-foreground capitalize">{user.profile.role}</span>
                      </div>
                    </div>
                  ) : null}

                  {/* Navigation Links */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    <Link
                      to="/"
                      className={`block py-2 text-lg font-medium transition-colors hover:text-primary ${
                        location.pathname === "/" ? "text-primary" : ""
                      }`}
                    >
                      Home
                    </Link>

                    <div className="space-y-3">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Services</p>
                      <div className="space-y-2 pl-2">
                        {services.map((service) => (
                          <Link
                            key={service.href}
                            to={service.href}
                            className={`flex items-center gap-3 py-2 text-sm transition-colors hover:text-primary ${
                              location.pathname === service.href ? "text-primary" : ""
                            }`}
                          >
                            <service.icon className="h-4 w-4" />
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <Link
                      to="/announcements"
                      className={`block py-2 text-lg font-medium transition-colors hover:text-primary ${
                        location.pathname === "/announcements" ? "text-primary" : ""
                      }`}
                    >
                      Announcements
                    </Link>

                    <Link
                      to="/contact"
                      className={`block py-2 text-lg font-medium transition-colors hover:text-primary ${
                        location.pathname === "/contact" ? "text-primary" : ""
                      }`}
                    >
                      About Us
                    </Link>
                  </div>

                  {/* User Actions - Mobile (at bottom) */}
                  <div className="p-4 border-t space-y-2">
                    {user && user.profile?.role === "user" ? (
                      <>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/profile")}>
                          <User className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      // Show Sign In button at bottom if NOT logged in
                      <Button asChild className="w-full">
                        <Link to="/login">Sign In</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
