"use client"

import { Suspense } from "react"
import { TenantResetPasswordForm } from "components/tenant/auth/tenant-reset-password-form"
import { TenantMetadata } from "components/tenant/tenant-metadata" // Added
import { TenantRouteGuard } from "components/auth/tenant-route-guard" // Added

export default function AdminResetPasswordPage() {
  return (
    <>
      <TenantMetadata pageTitle="Admin Reset Password" />
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-xs">
          <TenantRouteGuard>
            <Suspense fallback={<div>Loading form...</div>}>
              <TenantResetPasswordForm userType="admin" />
            </Suspense>
          </TenantRouteGuard>
        </div>
      </div>
    </>
  )
}
