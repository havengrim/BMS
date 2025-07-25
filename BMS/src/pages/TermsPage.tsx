import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: January 2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
            <CardDescription>Please read these terms carefully before using Sindalan Connect.</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <h3>Acceptance of Terms</h3>
            <p>
              By accessing and using Sindalan Connect, you accept and agree to be bound by the terms and provision of
              this agreement.
            </p>

            <h3>Use License</h3>
            <p>
              Permission is granted to temporarily use Sindalan Connect for personal, non-commercial transitory viewing
              only.
            </p>

            <h3>User Responsibilities</h3>
            <ul>
              <li>Provide accurate and truthful information</li>
              <li>Use the service only for legitimate barangay business</li>
              <li>Respect the privacy and rights of other users</li>
            </ul>

            <h3>Contact Information</h3>
            <p>Questions about the Terms of Service should be sent to us at info@sindalan.gov.ph</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
