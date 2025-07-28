import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Phone, Mail, MapPin, Clock, MessageSquare, Facebook, Globe, Users, Shield, Calendar } from "lucide-react"
import { Footer } from "@/components/footer"

const contactInfo = [
  {
    icon: Phone,
    title: "Phone Numbers",
    details: ["Landline: (02) 8123-4567", "Mobile: 0917-123-4567", "Emergency: 0918-765-4321"],
  },
  {
    icon: Mail,
    title: "Email Addresses",
    details: [
      "General: info@sindalan.gov.ph",
      "Certificates: certificates@sindalan.gov.ph",
      "Complaints: complaints@sindalan.gov.ph",
    ],
  },
  {
    icon: MapPin,
    title: "Office Address",
    details: ["Barangay Hall, Sindalan", "123 Main Street", "City, Province 1234"],
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: ["Monday - Friday: 8:00 AM - 5:00 PM", "Saturday: 8:00 AM - 12:00 PM", "Sunday: Closed"],
  },
]

const teamMembers = [
  {
    name: "Juan Dela Cruz",
    position: "Barangay Captain",
    contact: "0917-111-1111",
    email: "captain@sindalan.gov.ph",
    initials: "JDC",
    description: "Leading our community with dedication and service for over 8 years.",
    department: "Executive",
    status: "Available",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jameson"
  },
  {
    name: "Maria Santos",
    position: "Barangay Secretary",
    contact: "0917-222-2222",
    email: "secretary@sindalan.gov.ph",
    initials: "MS",
    description: "Managing administrative affairs and ensuring smooth operations.",
    department: "Administration",
    status: "Available",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Leo"
  },
  {
    name: "Pedro Garcia",
    position: "Barangay Treasurer",
    contact: "0917-333-3333",
    email: "treasurer@sindalan.gov.ph",
    initials: "PG",
    description: "Overseeing financial management and budget allocation.",
    department: "Finance",
    status: "In Meeting",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Brian"
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header Section */}
      <div className="border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Phone className="h-4 w-4" />
              Contact Information
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground">
              We're here to serve our community. Reach out to us for any inquiries, assistance, or feedback.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <Card key={index} className="hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <info.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="space-y-16">
          {/* Team Section */}
          <section>
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-muted-foreground" />
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Our Team
                </Badge>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Meet Our Leadership</h2>
              <p className="text-muted-foreground max-w-2xl">
                Dedicated public servants committed to making our barangay a better place for everyone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 group"
                >
                  <CardHeader className=" ">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-14 w-14 ring-2 ring-background shadow-sm">
                        <AvatarImage
                          src={member.image || `/placeholder.svg?height=56&width=56&text=${member.initials}`}
                          alt={member.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {member.name}
                        </CardTitle>
                        <CardDescription className="font-medium">{member.position}</CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {member.department}
                          </Badge>
                          <Badge variant={member.status === "Available" ? "default" : "secondary"} className="text-xs">
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{member.description}</p>
                    <Separator className="mb-4" />
                    <div className="space-y-3">
                      <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-2 hover:bg-muted/50">
                        <Phone className="h-4 w-4 text-muted-foreground mr-3" />
                        <span className="text-sm">{member.contact}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-2 hover:bg-muted/50">
                        <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                        <span className="text-sm truncate">{member.email}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Services Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Emergency Contacts */}
            <Card className="border-destructive/20 hover:shadow-lg transition-all duration-200">
              <CardHeader className="">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <Shield className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-destructive">Emergency Hotline</CardTitle>
                    <CardDescription>24/7 emergency response</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <Button variant="destructive" className="w-full shadow-sm" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  0918-765-4321
                </Button>
                <Button
                  variant="outline"
                  className="w-full hover:bg-destructive/5 border-destructive/20 bg-transparent"
                  size="sm"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Text: 0919-876-5432
                </Button>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-muted rounded-lg">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Stay Connected</CardTitle>
                    <CardDescription>Follow for updates</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <Button variant="outline" className="w-full justify-start hover:bg-muted/50 bg-transparent" size="sm">
                  <Facebook className="h-4 w-4 mr-2" />
                  @SindalanBarangay
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-muted/50 bg-transparent" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  sindalan.gov.ph
                </Button>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-muted rounded-lg">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Office Hours</CardTitle>
                    <CardDescription>Visit us anytime</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded border">
                    <span className="font-medium">Monday - Friday</span>
                    <span className="text-muted-foreground">8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded border">
                    <span className="font-medium">Saturday</span>
                    <span className="text-muted-foreground">8:00 AM - 12:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded border">
                    <span className="font-medium">Sunday</span>
                    <span className="text-destructive font-medium">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Location Map */}
          <section>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
              <CardHeader className=" border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>Our Location</CardTitle>
                    <CardDescription>Barangay Hall, Sindalan - 123 Main Street, City, Province 1234</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 bg-muted/20 flex items-center justify-center border-t relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                  <div className="text-center text-muted-foreground relative z-10">
                    <div className="p-4 bg-background rounded-lg shadow-sm border">
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="font-medium">Interactive Map</p>
                      <p className="text-sm">Map integration would be displayed here</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
