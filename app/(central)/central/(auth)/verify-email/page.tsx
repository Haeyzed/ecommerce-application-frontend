"use client"

import { Suspense } from "react"
import { VerifyEmailProcessor } from "components/auth/verify-email-processor"
import { useSearchParams } from "next/navigation"
import { CentralMetadata } from "components/central/central-metadata" // Assuming a CentralMetadata component exists

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const expires = searchParams?.get("expires")
  const signature = searchParams?.get("signature")
  const email = searchParams?.get("email")

  if (!expires || !signature || !email) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-xs text-center">
          <h1 className="text-2xl font-bold">Invalid Verification Link</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The verification link is missing required parameters.
          </p>
        </div>
      </div>
    )
  }

  // Construct the verifyUrl as expected by the backend
  const verifyUrl = `/api/central/email/verify?expires=${expires}&signature=${signature}&email=${email}`

  return (
    <>
      <CentralMetadata pageTitle="Verify Email" />
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-xs">
          <VerifyEmailProcessor verifyUrl={verifyUrl} />
        </div>
      </div>
    </>
  )
}

export default function CentralVerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
