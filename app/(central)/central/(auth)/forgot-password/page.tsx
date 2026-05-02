import { CentralForgotPasswordForm } from "@/components/central/auth/forgot-password-form"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Forgot Password | Central Admin",
  description: "Reset your central admin password.",
}

export default function CentralForgotPasswordPage() {
  return (
    <div className="animate-slide-up-fade">
      <Suspense fallback={<div>Loading form...</div>}>
        <CentralForgotPasswordForm />
      </Suspense>
    </div>
  )
}
