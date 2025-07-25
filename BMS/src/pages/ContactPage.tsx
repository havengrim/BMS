import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock, MessageSquare, Facebook, Globe } from "lucide-react"

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

const officials = [
  {
    name: "Juan Dela Cruz",
    position: "Barangay Captain",
    contact: "0917-111-1111",
    email: "captain@sindalan.gov.ph",
  },
  {
    name: "Maria Santos",
    position: "Barangay Secretary",
    contact: "0917-222-2222",
    email: "secretary@sindalan.gov.ph",
  },
  {
    name: "Pedro Garcia",
    position: "Barangay Treasurer",
    contact: "0917-333-3333",
    email: "treasurer@sindalan.gov.ph",
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground">Get in touch with us for any inquiries or assistance</p>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <Card key={index}>
              <CardHeader>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Barangay Officials */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Barangay Officials</h2>
            <div className="space-y-4">
              {officials.map((official, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{official.name}</CardTitle>
                    <CardDescription>{official.position}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {official.contact}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {official.email}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Emergency Contacts & Social Media */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Emergency Contacts</h2>
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800">24/7 Emergency Hotline</CardTitle>
                  <CardDescription>For urgent matters requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                      <Phone className="h-4 w-4 mr-2" />
                      0918-765-4321
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Text: 0919-876-5432
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Follow Us</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Stay Connected</CardTitle>
                  <CardDescription>Follow our social media for updates and announcements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook: @SindalanBarangay
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Globe className="h-4 w-4 mr-2" />
                      Website: sindalan.gov.ph
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Location Map</h2>
              <Card className="!p-0">
                <CardContent className="!p-0">
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-2" />
                      <p>Interactive map would be displayed here</p>
                      <p className="text-sm">Barangay Hall, Sindalan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
