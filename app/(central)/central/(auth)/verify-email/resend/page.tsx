"use client"

import { Suspense } from "react"
import { CentralVerifyEmailForm } from "components/central/auth/central-verify-email-form"
import { CentralMetadata } from "components/central/central-metadata"
import { useSearchParams } from "next/navigation"

function ResendVerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams?.get("email")

  return (
    <>
      <CentralMetadata pageTitle="Resend Verification Email" />
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-xs">
          <CentralVerifyEmailForm email={email || undefined} />
        </div>
      </div>
    </>
  )
}

export default function CentralResendVerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResendVerifyEmailContent />
    </Suspense>
  )
}
