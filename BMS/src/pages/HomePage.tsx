import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { FileText, Users, MessageSquare, Phone, MapPin, ArrowRight } from "lucide-react"
import { AnnouncementGallery } from "@/components/announcement-gallery"
import { announcements } from "@/lib/announcements-data"
import images from "@/assets/images"

const services = [
  {
    title: "Certificate Requests",
    description: "Request barangay clearance, residency certificates, indigency certificates, and more",
    icon: FileText,
    href: "/certificates",
    color: "bg-blue-500",
  },
  {
    title: "Business Permits",
    description: "Apply for new business permits or renew existing ones",
    icon: Users,
    href: "/business-permits",
    color: "bg-green-500",
  },
  {
    title: "File Complaints",
    description: "Submit complaints, incident reports, and request mediation services",
    icon: MessageSquare,
    href: "/complaints",
    color: "bg-orange-500",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
<section
  className="relative py-24 text-white"
  style={{
    backgroundImage: `url(${images.bg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  {/* Dark overlay */}
    <div className="absolute inset-0 bg-black/70 pointer-events-none z-0"></div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-4xl mx-auto">
      <Badge variant="secondary" className="mb-4 uppercase tracking-wide text-sm">
        Barangay Sindalan Digital Services
      </Badge>

      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
        Welcome to <span className="text-white/80">Sindalan Connect</span>
      </h1>

        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-white/85">
        Access barangay services with ease — request certificates, apply for permits, and stay informed in one place.
      </p>


      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button asChild size="lg" className="text-lg px-8 font-medium text-black bg-white hover:bg-gray-200" variant="outline">
          <Link to="/certificates">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button variant="ghost" size="lg" className="text-lg px-8 text-white border-white/50 hover:bg-white/10" asChild>
          <Link to="/contact">Contact Us</Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
        <div className="text-center">
          <div className="text-3xl font-bold text-white/75">24/7</div>
          <div className="text-sm text-white/50">Online Availability</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white/75">5,000+</div>
          <div className="text-sm text-white/50">Residents Served</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white/75">48 Hours</div>
          <div className="text-sm text-white/50">Average Processing Time</div>
        </div>
      </div>
    </div>
  </div>
</section>



      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access essential barangay services online, anytime, anywhere
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.href} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <Link to={service.href}>
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Gallery Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Announcements</h2>
              <p className="text-muted-foreground">Stay updated with community news and events</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/announcements">View All</Link>
            </Button>
          </div>

          <AnnouncementGallery announcements={announcements.slice(0, 6)} />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
                  <CardTitle>Call Us</CardTitle>
                  <CardDescription>
                    For urgent matters or assistance
                    <br />
                    <strong>(02) 8123-4567</strong>
                    <br />
                    <strong>0917-123-4567</strong>
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                  <CardTitle>Visit Us</CardTitle>
                  <CardDescription>
                    Barangay Hall, Sindalang
                    <br />
                    Monday - Friday: 8:00 AM - 5:00 PM
                    <br />
                    Saturday: 8:00 AM - 12:00 PM
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
