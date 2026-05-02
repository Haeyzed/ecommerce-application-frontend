import { CentralResetPasswordForm } from "@/components/central/auth/reset-password-form"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Reset Password | Central Admin",
  description: "Set a new password for your central admin account.",
}

export default function CentralResetPasswordPage() {
  return (
    <div className="animate-slide-up-fade">
      <Suspense fallback={<div>Loading form...</div>}>
        <CentralResetPasswordForm />
      </Suspense>
    </div>
  )
}
