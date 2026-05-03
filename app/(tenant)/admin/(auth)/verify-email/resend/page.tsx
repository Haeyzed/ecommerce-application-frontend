"use client"

import { Suspense } from "react"
import { TenantVerifyEmailForm } from "components/tenant/auth/tenant-verify-email-form"
import { TenantMetadata } from "components/tenant/tenant-metadata"
import { useSearchParams } from "next/navigation"

function ResendVerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams?.get("email")

  return (
    <>
      <TenantMetadata pageTitle="Admin Resend Verification Email" />
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-xs">
          <TenantVerifyEmailForm email={email || undefined} userType="admin" />
        </div>
      </div>
    </>
  )
}

export default function AdminResendVerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResendVerifyEmailContent />
    </Suspense>
  )
}
