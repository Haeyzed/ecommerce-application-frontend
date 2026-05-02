import { CentralLoginForm } from "@/components/central/auth/login-form"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Login | Central Admin",
  description: "Access the central administration dashboard.",
}

export default function CentralLoginPage() {
  return (
    <div className="animate-slide-up-fade">
      <Suspense fallback={<div>Loading form...</div>}>
        <CentralLoginForm />
      </Suspense>
    </div>
  )
}
