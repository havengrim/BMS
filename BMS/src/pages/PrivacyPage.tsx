import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: January 2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Privacy Matters</CardTitle>
            <CardDescription>
              Barangay Sindalan is committed to protecting your personal information and privacy rights.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <p>
              This Privacy Policy explains how we collect, use, and protect your information when you use Sindalan
              Connect, our barangay management system.
            </p>

            <h3>Information We Collect</h3>
            <ul>
              <li>Personal identification information (name, address, contact details)</li>
              <li>Service request information</li>
              <li>Usage data and analytics</li>
            </ul>

            <h3>How We Use Your Information</h3>
            <ul>
              <li>To process your service requests</li>
              <li>To communicate with you about barangay services</li>
              <li>To improve our services</li>
            </ul>

            <h3>Contact Us</h3>
            <p>If you have questions about this Privacy Policy, please contact us at info@sindalan.gov.ph</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
