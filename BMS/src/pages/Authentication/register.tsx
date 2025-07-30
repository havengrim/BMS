import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { RegisterForm } from "@/components/register-form"


export default function RegisterPage() {
  return (
    <div>
        <Navbar />
        <div className="bg-muted flex flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <RegisterForm />
            </div>
        </div>
        <Footer />
    </div>
  )
}
