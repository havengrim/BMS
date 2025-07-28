import { Footer } from "@/components/footer"
import { LoginForm } from "@/components/login-form"
import { Navbar } from "@/components/navbar"

export default function LoginPage() {
  return (
    <div>
        <Navbar />
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <LoginForm />
            </div>
        </div>
        <Footer />
    </div>
  )
}
