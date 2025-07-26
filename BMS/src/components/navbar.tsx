import { Link, useLocation } from "react-router-dom"
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
import { Menu, FileText, Users, MessageSquare } from "lucide-react"
import images from "@/assets/images"

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

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={images.logo} className="h-14 w-14"/>
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
                    Contact
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            <Button asChild className="hidden md:inline-flex">
              <Link to="/certificates">Sign In</Link>
            </Button>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="p-4 flex flex-col space-y-4 mt-4">
                  <Link to="/" className="text-lg font-medium">
                    Home
                  </Link>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Services</p>
                    {services.map((service) => (
                      <Link key={service.href} to={service.href} className="block pl-4 text-sm">
                        {service.title}
                      </Link>
                    ))}
                  </div>
                  <Link to="/announcements" className="text-lg font-medium">
                    Announcements
                  </Link>
                  <Link to="/contact" className="text-lg font-medium">
                    Contact
                  </Link>
                   <Link to="/certificates" className="text-lg font-medium">
                      Sign In
                    </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
