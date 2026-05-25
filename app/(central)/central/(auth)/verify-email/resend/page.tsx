import { CentralVerifyEmailForm } from "@/components/central/auth/verify-email-form"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Resend Verification | Central Admin",
  description: "Resend your email verification code.",
}

function ResendLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
    </div>
  )
}

export default function CentralResendVerifyEmailPage() {
  return (
    <Suspense fallback={<ResendLoading />}>
      <CentralVerifyEmailForm />
    </Suspense>
  )
}
