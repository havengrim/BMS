"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  WifiOff,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  RefreshCw,
  AlertTriangle,
  Mail,
  Facebook,
  Globe,
} from "lucide-react"

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = useState(false)
  const navigate = useNavigate()

  const handleRetry = async () => {
    setIsRetrying(true)

    // Check if we're back online
    if (navigator.onLine) {
      const storedPath = sessionStorage.getItem("pathBeforeOffline") || "/"
      sessionStorage.removeItem("pathBeforeOffline")
      navigate(storedPath)
    } else {
      // Still offline, show feedback
      setTimeout(() => {
        setIsRetrying(false)
      }, 2000)
    }
  }

  useEffect(() => {
    const handleOnline = () => {
      const storedPath = sessionStorage.getItem("pathBeforeOffline") || "/"
      sessionStorage.removeItem("pathBeforeOffline")
      navigate(storedPath)
    }

    window.addEventListener("online", handleOnline)
    return () => window.removeEventListener("online", handleOnline)
  }, [navigate])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <WifiOff className="h-16 w-16 text-red-600" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">No Internet Connection</h1>
            <p className="text-xl text-gray-600 mb-4">
              You're currently offline. Please check your internet connection.
            </p>
            <Badge variant="destructive" className="text-sm">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Offline Mode
            </Badge>
          </div>
        </div>

        {/* Retry Button */}
        <div className="text-center">
          <Button onClick={handleRetry} disabled={isRetrying} size="lg" className="px-8">
            <RefreshCw className={`h-5 w-5 mr-2 ${isRetrying ? "animate-spin" : ""}`} />
            {isRetrying ? "Checking Connection..." : "Try Again"}
          </Button>
        </div>

        {/* Emergency Contact Section */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-800 flex items-center justify-center gap-2">
              <Phone className="h-6 w-6" />
              Emergency Contacts
            </CardTitle>
            <CardDescription className="text-red-700">
              For urgent barangay services, contact us directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                className="h-16 bg-white hover:bg-red-50 border-red-200 text-red-800"
                onClick={() => window.open("tel:+6281234567")}
              >
                <Phone className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Call Landline</div>
                  <div className="text-sm">(02) 8123-4567</div>
                </div>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-16 bg-white hover:bg-red-50 border-red-200 text-red-800"
                onClick={() => window.open("tel:+639171234567")}
              >
                <MessageSquare className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Call/Text Mobile</div>
                  <div className="text-sm">0917-123-4567</div>
                </div>
              </Button>
            </div>

            <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
              <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                <AlertTriangle className="h-5 w-5" />
                24/7 Emergency Hotline
              </div>
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600"
                onClick={() => window.open("tel:+639187654321")}
              >
                <Phone className="h-5 w-5 mr-2" />
                0918-765-4321
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Office Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Office Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span className="font-medium">8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span className="font-medium">8:00 AM - 12:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-medium text-red-600">Closed</span>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Visit Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">Barangay Hall, Sindalan</p>
              <p className="text-muted-foreground">123 Main Street</p>
              <p className="text-muted-foreground">City, Province 1234</p>
            </CardContent>
          </Card>

          {/* Email Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="font-medium">General Inquiries:</p>
                <p className="text-muted-foreground">info@sindalan.gov.ph</p>
              </div>
              <div>
                <p className="font-medium">Certificates:</p>
                <p className="text-muted-foreground">certificates@sindalan.gov.ph</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Media & Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Follow Us Online</CardTitle>
              <CardDescription>Stay updated when you're back online</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Facebook className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Facebook</p>
                  <p className="text-sm text-muted-foreground">@SindalanBarangay</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Globe className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Website</p>
                  <p className="text-sm text-muted-foreground">sindalan.gov.ph</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What You Can Do</CardTitle>
              <CardDescription>While waiting for your connection to return</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Call or visit our office for urgent matters</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Check your internet connection settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Try connecting to a different network</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Contact your internet service provider</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Sindalan Connect - Barangay Management System</p>
          <p>This page works offline to help you stay connected with essential services</p>
        </div>
      </div>
    </div>
  )
}
