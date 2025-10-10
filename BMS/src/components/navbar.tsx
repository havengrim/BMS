"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEmergencies } from "@/stores/useEmergency";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, FileText, Users, MessageSquare, User, LogOut, Notebook, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import images from "@/assets/images";
import { useAuthStore } from "@/stores/authStore";
import { useLogout } from "@/stores/useAccount";

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
  {
    title: "Blotter Reports",
    href: "/blotter",
    description: "Log incidents and generate blotter reports",
    icon: Notebook,
  },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = useLogout();

const { user } = useAuthStore();
const isLoggedIn = !!user;

const { data: emergencies } = useEmergencies(isLoggedIn);
const emergencyList = Array.isArray(emergencies) ? emergencies : [];
const hasInProgress = emergencyList.some((e) => e.status === "in_progress");

  const isResidentOrUser =
    user && (user.profile?.role === "user" || user.profile?.role === "resident");

  const isResident = user?.profile?.role === "resident";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={images.logo || "/placeholder.svg"}
              className="h-14 w-14"
              alt="Sindalan Connect Logo"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold">Sindalan Connect</span>
              <span className="text-xs text-muted-foreground">
                Barangay Management System
              </span>
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

            {isResident && (
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
            )}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/announcements"
                    className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === "/announcements"
                        ? "text-primary"
                        : "text-muted-foreground"
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
            {isResidentOrUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative">
                    {/* Desktop Avatar */}
                    <Avatar className="cursor-pointer h-8 w-8 hidden md:flex">
                      <AvatarImage
                        src={
                          user?.profile?.image
                            ? `${import.meta.env.VITE_API_URL}${user.profile.image}`
                            : undefined
                        }
                        alt={user?.username}
                      />
                      <AvatarFallback className="font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {hasInProgress && (
                      <span className="absolute -top-[-1px] -right-[-1px] h-2 w-2 rounded-full bg-red-500 ring-1 ring-white animate-pulse hidden sm:block"></span>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/resident-notification")}>
                    <Bell className="mr-2 h-4 w-4" />
                    Notification
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
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

              <SheetContent
                side="right"
                accessibilityTitle="Mobile Navigation Menu"
                accessibilityDescription="Navigate through the mobile menu options"
                className="w-[300px] sm:w-[400px]"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Avatar */}
                  {isResidentOrUser && (
                    <div className="flex items-center gap-3 p-4 border-b">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={
                              user?.profile?.image
                                ? `${import.meta.env.VITE_API_URL}${user.profile.image}`
                                : undefined
                            }
                          />
                          <AvatarFallback className="font-semibold">
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        {hasInProgress && (
                          <span className="absolute -top-0.5 -right-[-1px] h-3 w-3 rounded-full bg-red-500 ring-1 ring-white animate-pulse"></span>
                        )}
                      </div>

                      <div className="flex flex-col ml-3">
                        <span className="font-medium text-sm">{user.username}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {user.profile.role}
                        </span>
                      </div>
                    </div>
                  )}

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
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Services
                      </p>
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

                  {/* User Actions - Mobile */}
                 <div className="p-4 border-t space-y-2">
                      {isResidentOrUser ? (
                        <>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => navigate("/resident-notification")}
                          >
                            <Bell className="mr-2 h-4 w-4" />
                            Notifications
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => navigate("/settings")}
                          >
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
  );
}
