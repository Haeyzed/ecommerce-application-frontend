import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password | Acme Inc.",
  description: "Recover your account access.",
}

export default function ForgotPasswordPage() {
  return (
    <div className="animate-slide-up-fade">
      <ForgotPasswordForm />
    </div>
  )
}