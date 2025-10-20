import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  FileText,
  Users,
  MessageSquare,
  Shield,
  Heart,
  Facebook,
} from "lucide-react"
import images from "@/assets/images"
import { useAuthStore } from "@/stores/authStore" // ✅ Correct store

const quickLinks = [
  { name: "Certificate Requests", href: "/certificates", icon: FileText },
  { name: "Business Permits", href: "/business-permits", icon: Users },
  { name: "File Complaints", href: "/complaints", icon: MessageSquare },
  { name: "Announcements", href: "/announcements", icon: Globe },
]

const contactInfo = [
  { icon: Phone, label: "Phone", details: ["09694735789"] },
  { icon: Mail, label: "Email", details: ["sindalanbarangay@yahoo.com"] },
  { icon: MapPin, label: "Address", details: ["Sindalan Barangay Hall, MAHARLIKA STREET, San Fernando, Pampanga,2000"] },
  { icon: Clock, label: "Office Hours", details: ["Mon-Fri: 8:00 AM - 5:00 PM", "Sat: 8:00 AM - 12:00 PM", "Sun: Closed"] },
]

export function Footer() {
  const { user } = useAuthStore()
  const isResident = user?.profile?.role === "resident" // ✅ Final check

  return (
    <footer className="bg-green-700 text-slate-100">
      {/* Main Footer Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src={images.logo || "/placeholder.svg"} className="h-14 w-14 filter grayscale brightness-200" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">Sindalan Connect</span>
                <span className="text-sm text-slate-200">Barangay Management System</span>
              </div>
            </div>
            <p className="text-sm text-slate-200 mb-6 leading-relaxed">
              Your digital gateway to barangay services. Connecting residents with efficient, accessible, and
              transparent government services.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1baevwAKKB/" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="text-slate-200 hover:text-white hover:bg-slate-800">
                  <Facebook className="h-5 w-5" />
                </Button>
              </a>
              <Button variant="ghost" size="icon" className="text-slate-200 hover:text-white hover:bg-slate-800">
                <Globe className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-200 hover:text-white hover:bg-slate-800">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Services</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  {isResident ? (
                    <Link
                      to={link.href}
                      className="flex items-center space-x-2 text-sm text-slate-200 hover:text-white transition-colors group"
                    >
                      <link.icon className="h-4 w-4 group-hover:text-primary transition-colors" />
                      <span>{link.name}</span>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="flex items-center space-x-2 text-sm text-gray-400 cursor-not-allowed opacity-50"
                      title="Only residents can access this"
                    >
                      <link.icon className="h-4 w-4" />
                      <span>{link.name}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 bg-white/60 rounded-lg">
                    <info.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">{info.label}</h4>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-slate-200">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
              <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Emergency Hotline
              </h4>
              <p className="text-white font-bold text-lg">09694735789</p>
              <p className="text-red-300 text-sm">Available 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-slate-200">
              <p>&copy; 2025 Barangay Sindalan. All rights reserved.</p>
              <div className="flex items-center space-x-4">
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <span>•</span>
                <Link to="/accessibility" className="hover:text-white transition-colors">
                  Accessibility
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-slate-200">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for the community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
