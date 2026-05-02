"use client"

import { Suspense } from "react"
import { TenantResetPasswordForm } from "@/components/tenant/auth/tenant-reset-password-form"

export default function StaffResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-svh items-center justify-center"><p className="text-sm text-muted-foreground">Loading...</p></div>}>
      <TenantResetPasswordForm role="staff" />
    </Suspense>
  )
}
