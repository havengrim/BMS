import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Accessibility Statement</h1>
          <p className="text-muted-foreground">Our commitment to digital accessibility</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Accessibility Commitment</CardTitle>
            <CardDescription>
              Barangay  is committed to ensuring digital accessibility for all residents.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <h3>Our Efforts</h3>
            <p>
              We continually improve the user experience for everyone and apply the relevant accessibility standards to
              ensure we provide equal access to all users.
            </p>

            <h3>Accessibility Features</h3>
            <ul>
              <li>Keyboard navigation support</li>
              <li>Screen reader compatibility</li>
              <li>High contrast mode support</li>
              <li>Responsive design for all devices</li>
              <li>Clear and simple language</li>
            </ul>

            <h3>Feedback</h3>
            <p>
              We welcome your feedback on the accessibility of Sindalan Connect. Please let us know if you encounter
              accessibility barriers by contacting us at info@sindalan.gov.ph
            </p>

            <h3>Alternative Access</h3>
            <p>
              If you have difficulty using our online services, you can also visit our office or call us at (02)
              8123-4567 for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
