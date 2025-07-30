import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  FileText,
  Users,
  MessageSquare,
  Phone,
  MapPin,
  ArrowRight,
  Award,
  TrendingUp,
  Heart,
  Shield,
  Mail,
} from "lucide-react"
import { AnnouncementGallery } from "@/components/announcement-gallery"
import { announcements } from "@/lib/announcements-data"
import images from "@/assets/images"
import { Footer } from "@/components/footer"

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

const achievements = [
  {
    title: "Outstanding Barangay Award",
    description: "Recognized as the Most Improved Barangay in San Fernando City for 2023",
    icon: Award,
    year: "2023",
    color: "bg-yellow-500",
  },
  {
    title: "Digital Transformation Leader",
    description: "First barangay in the region to implement comprehensive digital services",
    icon: TrendingUp,
    year: "2024",
    color: "bg-blue-500",
  },
  {
    title: "Community Health Champion",
    description: "Achieved 98% vaccination rate and zero malnutrition cases",
    icon: Heart,
    year: "2023",
    color: "bg-red-500",
  },
  {
    title: "Peace & Order Excellence",
    description: "Maintained zero crime rate for 18 consecutive months",
    icon: Shield,
    year: "2024",
    color: "bg-green-500",
  },
]

const contactMethods = [
  {
    title: "Call Us",
    description: "For urgent matters or immediate assistance",
    icon: Phone,
    details: ["(02) 8123-4567", "0917-123-4567"],
    action: "Call Now",
    href: "tel:+6321234567",
    color: "bg-blue-500",
  },
  {
    title: "Email Support",
    description: "Send us your questions and we'll respond within 24 hours",
    icon: Mail,
    details: ["sindalan.barangay@gmail.com", "Response time: 24 hours"],
    action: "Send Email",
    href: "mailto:sindalan.barangay@gmail.com",
    color: "bg-green-500",
  },
  {
    title: "Visit Our Office",
    description: "Come to our barangay hall for in-person assistance",
    icon: MapPin,
    details: ["Barangay Hall, Sindalan", "Mon-Fri: 8:00 AM - 5:00 PM", "Sat: 8:00 AM - 12:00 PM"],
    action: "Get Directions",
    href: "/contact",
    color: "bg-orange-500",
  },
]

const faqs = [
  {
    question: "How long does it take to process certificates?",
    answer: "Most certificates are processed within 24-48 hours. Rush processing is available for urgent requests.",
  },
  {
    question: "What documents do I need for barangay clearance?",
    answer:
      "You'll need a valid ID, proof of residency, and completed application form. Additional requirements may apply for specific purposes.",
  },
  {
    question: "Can I track my application status?",
    answer: "Yes! You can track your application status online using your reference number or by calling our office.",
  },
  {
    question: "What are the office hours for in-person visits?",
    answer: "Our office is open Monday to Friday from 8:00 AM to 5:00 PM, and Saturday from 8:00 AM to 12:00 PM.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative py-20 sm:py-24 text-white"
        style={{
          backgroundImage: `url(${images.bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 pointer-events-none z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-4 uppercase tracking-wide text-sm sm:text-base text-white/75">
              Barangay Sindalan Digital Services
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Welcome to <span className="text-white/80">Sindalan Connect</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto text-white/85">
              Access barangay services with ease — request certificates, apply for permits, and stay informed in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 font-medium text-black bg-white hover:bg-gray-200 w-full sm:w-auto"
                variant="outline"
              >
                <Link to="/certificates">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-lg px-8 text-white border-white/50 hover:bg-white/10 w-full sm:w-auto"
                asChild
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white/75">24/7</div>
                <div className="text-sm sm:text-base text-white/50">Online Availability</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white/75">5,000+</div>
                <div className="text-sm sm:text-base text-white/50">Residents Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white/75">48 Hours</div>
                <div className="text-sm sm:text-base text-white/50">Average Processing Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
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
                    <CardTitle className="group-hover:text-primary transition-colors text-lg sm:text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all text-sm sm:text-base">
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
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Announcements</h2>
              <p className="text-muted-foreground max-w-md">Stay updated with community news and events</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/announcements">View All</Link>
            </Button>
          </div>
          <AnnouncementGallery announcements={announcements.slice(0, 6)} />
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Image */}
            <div className="relative">
              <img
                src="https://i.pinimg.com/736x/c6/a5/93/c6a5935292ba497248c8a860b17e5fc9.jpg"
                alt="Barangay officials working together"
                className="rounded-lg shadow-lg w-full h-[400px] object-cover"
              />
            </div>

            {/* Right side - Content */}
            <div>
              <Badge variant="outline" className="mb-4 uppercase tracking-wide text-sm">
                Our Achievements
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Building a stronger community through excellence
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
                We are committed to serving our community with dedication and innovation. Our achievements reflect our continuous efforts to improve the lives of Sindalan residents through quality service delivery and community development.
              </p>

              <h3 className="text-xl font-semibold mb-6">Our Key Accomplishments</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full ${achievement.color} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <achievement.icon className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.year}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/about">Learn our approach</Link>
                </Button>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link to="/achievements">View all achievements</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact/Help Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Need Help?</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              We're here to assist you. Choose the best way to reach us.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 text-center">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <method.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                  <CardDescription className="mb-4">{method.description}</CardDescription>
                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    {method.details.map((detail, idx) => (
                      <div key={idx}>{detail}</div>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full bg-transparent" variant="outline">
                    <Link to={method.href}>{method.action}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                Frequently Asked Questions
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">Quick answers to common questions</p>
            </div>
           <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base sm:text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link to="/faq">
                  View All FAQs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-16 max-w-7xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-red-800">Emergency Hotline</CardTitle>
                <CardDescription className="text-red-600">
                  For urgent matters requiring immediate attention
                </CardDescription>
                <div className="text-2xl font-bold text-red-800 mt-2">0917-EMERGENCY (0917-363-7436)</div>
                <div className="text-sm text-red-600 mt-2">Available 24/7 for emergencies only</div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
