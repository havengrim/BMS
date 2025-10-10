import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Clock, MessageSquare, Facebook, Globe, Users, Shield, Calendar } from "lucide-react"
import { Footer } from "@/components/footer"

const contactInfo = [
  {
    icon: Phone,
    title: "Phone Numbers",
    details: ["Landline: (045) 123-4567", "Mobile: 0917-123-4567", "Emergency: 0918-765-4321"],
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
    details: ["Barangay Hall, Sindalan", "San Fernando City, Pampanga", "Philippines 2000"],
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: ["Monday - Friday: 8:00 AM - 5:00 PM", "Saturday: 8:00 AM - 12:00 PM", "Sunday: Closed"],
  },
]

const officials = [
  {
    name: 'Dr. Benjamin "Doc Benjie" F. Angeles',
    position: "Punong Barangay",
    contact: "0917-111-1111",
    email: "punongbarangay@sindalan.gov.ph",
    initials: "BA",
    description:
      "Leading our community with dedication and service, committed to the welfare and development of Barangay Sindalan.",
    department: "Executive",
    status: "Available",
    committees: ["Chief Executive"],
    isCapitan: true,
    image: "/placeholder.svg?height=56&width=56&text=BA",
  },
  {
    name: "Kgwd. Jonel L. Antonio",
    position: "Kagawad",
    contact: "0917-222-2222",
    email: "antonio@sindalan.gov.ph",
    initials: "JA",
    description: "Dedicated to environmental protection and promoting livelihood opportunities for our residents.",
    department: "Legislative",
    status: "Available",
    committees: ["Environmental Protection", "Livelihood and Entrepreneurship"],
    image: "/placeholder.svg?height=56&width=56&text=JA",
  },
  {
    name: "Kgwd. Pacifico M. Datu",
    position: "Kagawad",
    contact: "0917-333-3333",
    email: "datu@sindalan.gov.ph",
    initials: "PD",
    description: "Focused on improving health services and social welfare programs for the community.",
    department: "Legislative",
    status: "Available",
    committees: ["Health and Social Welfare"],
    image: "/placeholder.svg?height=56&width=56&text=PD",
  },
  {
    name: "Kgwd. Emilio P. Sicat",
    position: "Kagawad",
    contact: "0917-444-4444",
    email: "sicat@sindalan.gov.ph",
    initials: "ES",
    description: "Ensuring peace and order while promoting cooperative development and employment opportunities.",
    department: "Legislative",
    status: "Available",
    committees: ["Peace and Order, Public Safety and Human Rights", "Cooperatives and Labor & Employment"],
    image: "/placeholder.svg?height=56&width=56&text=ES",
  },
  {
    name: "Kgwd. Alfredo S. Dizon, Jr.",
    position: "Kagawad",
    contact: "0917-555-5555",
    email: "dizon@sindalan.gov.ph",
    initials: "AD",
    description: "Championing education, cultural preservation, and maintaining high ethical standards in governance.",
    department: "Legislative",
    status: "Available",
    committees: ["Education", "Cultural Preservation", "Ethics"],
    image: "/placeholder.svg?height=56&width=56&text=AD",
  },
  {
    name: "Kgwd. Alicia I. Dumlao",
    position: "Kagawad",
    contact: "0917-666-6666",
    email: "dumlao@sindalan.gov.ph",
    initials: "AD",
    description: "Overseeing infrastructure development and advocating for women and family welfare programs.",
    department: "Legislative",
    status: "Available",
    committees: ["Public Works and Infrastructure Development", "Women & Family"],
    image: "/placeholder.svg?height=56&width=56&text=AD",
  },
  {
    name: "Kgwd. Dexter M. Francisco",
    position: "Kagawad",
    contact: "0917-777-7777",
    email: "francisco@sindalan.gov.ph",
    initials: "DF",
    description: "Managing financial affairs and ensuring services for senior citizens and persons with disabilities.",
    department: "Legislative",
    status: "Available",
    committees: ["Finance, Budget and Appropriation", "Senior Citizen & PWD"],
    image: "/placeholder.svg?height=56&width=56&text=DF",
  },
  {
    name: "Kgwd. Rommel M. Serrano",
    position: "Kagawad",
    contact: "0917-888-8888",
    email: "serrano@sindalan.gov.ph",
    initials: "RS",
    description: "Promoting agricultural development and supporting solo parents and LGBTQ+ community members.",
    department: "Legislative",
    status: "Available",
    committees: ["Agriculture", "Solo Parents and LGBTQ+"],
    image: "/placeholder.svg?height=56&width=56&text=RS",
  },
  {
    name: "Christian Jon P. Gampoy",
    position: "SK Chairperson",
    contact: "0917-999-9999",
    email: "sk@sindalan.gov.ph",
    initials: "CG",
    description: "Leading youth initiatives and sports development programs for the young people of our barangay.",
    department: "Youth",
    status: "Available",
    committees: ["Youth and Sports Development"],
    image: "/placeholder.svg?height=56&width=56&text=CG",
  },
  {
    name: "Angelyn M. Torno",
    position: "Barangay Secretary",
    contact: "0917-101-1010",
    email: "secretary@sindalan.gov.ph",
    initials: "AT",
    description: "Managing administrative affairs and ensuring smooth operations of barangay services.",
    department: "Administration",
    status: "Available",
    committees: ["Administrative Affairs"],
    image: "/placeholder.svg?height=56&width=56&text=AT",
  },
  {
    name: "Jerome Y. Alconga",
    position: "Barangay Treasurer",
    contact: "0917-111-0101",
    email: "treasurer@sindalan.gov.ph",
    initials: "JA",
    description: "Overseeing financial management, budget allocation, and ensuring fiscal responsibility.",
    department: "Finance",
    status: "Available",
    committees: ["Financial Management"],
    image: "/placeholder.svg?height=56&width=56&text=JA",
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header Section */}
      <div className="border-b bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Phone className="h-4 w-4" />
              Contact Information
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch with Barangay Sindalan</h1>
            <p className="text-lg text-muted-foreground">
              We're here to serve our community. Reach out to us for any inquiries, assistance, or feedback. Your local
              government is committed to providing excellent public service.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <Card key={index} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <info.icon className="h-5 w-5 text-primary" />
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
          {/* Sangguniang Barangay Section */}
          <section>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-muted-foreground" />
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Sangguniang Barangay
                </Badge>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Barangay Sindalan Officials</h2>
              <p className="text-muted-foreground max-w-2xl">
                Meet our dedicated public servants committed to serving our community.
              </p>
            </div>

            {/* Punong Barangay - Featured */}
            <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                    <AvatarImage src="/placeholder.svg?height=64&width=64&text=BA" alt="Dr. Benjamin Angeles" />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">BA</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl text-primary">Dr. Benjamin "Doc Benjie" F. Angeles</CardTitle>
                    <CardDescription className="text-lg font-medium">Punong Barangay</CardDescription>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        0917-111-1111
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        punongbarangay@sindalan.gov.ph
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Officials Table */}
            <Card>
              <CardHeader>
                <CardTitle>Sangguniang Barangay Members</CardTitle>
                <CardDescription>Complete list of barangay officials and their responsibilities</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/30">
                      <tr>
                        <th className="text-left p-4 font-medium">Official</th>
                        <th className="text-left p-4 font-medium">Position</th>
                        <th className="text-left p-4 font-medium">Committees</th>
                        <th className="text-left p-4 font-medium">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {officials.slice(1, 8).map((official, index) => (
                        <tr key={index} className="hover:bg-muted/20">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                  {official.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{official.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">{official.position}</td>
                          <td className="p-4">
                            <div className="space-y-1">
                              {official.committees.map((committee, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs mr-1">
                                  {committee}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{official.contact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Other Key Personnel */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {officials.slice(8).map((official, index) => (
                <Card key={index} className="hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback
                          className={`${
                            official.position === "SK Chairperson"
                              ? "bg-blue-100 text-blue-700"
                              : official.position === "Barangay Secretary"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                          } font-medium`}
                        >
                          {official.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{official.name}</h4>
                        <p className="text-sm text-muted-foreground">{official.position}</p>
                        <p className="text-xs text-muted-foreground">{official.committees[0]}</p>
                      </div>
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
              <CardHeader>
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
              <CardHeader>
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
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-blue-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Our Location</CardTitle>
                    <CardDescription>
                      Barangay Hall, Sindalan - San Fernando City, Pampanga, Philippines 2000
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 bg-gradient-to-br from-muted/20 to-primary/5 flex items-center justify-center border-t relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                  <div className="text-center text-muted-foreground relative z-10">
                    <div className="p-6 bg-background rounded-lg shadow-lg border border-primary/20">
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <p className="font-medium text-primary">Interactive Map</p>
                      <p className="text-sm">Map integration would be displayed here</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Barangay Hall, Sindalan
                        <br />
                        San Fernando City, Pampanga
                      </p>
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
