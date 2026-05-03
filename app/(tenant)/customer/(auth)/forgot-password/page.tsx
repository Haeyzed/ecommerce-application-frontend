"use client"

import { Suspense } from "react"
import { TenantForgotPasswordForm } from "components/tenant/auth/tenant-forgot-password-form"
import { TenantMetadata } from "components/tenant/tenant-metadata"
import { TenantRouteGuard } from "components/auth/tenant-route-guard"

export default function CustomerForgotPasswordPage() {
  return (
    <>
      <TenantMetadata pageTitle="Customer Forgot Password" />
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-xs">
          <TenantRouteGuard>
            <Suspense fallback={<div>Loading form...</div>}>
              <TenantForgotPasswordForm userType="customer" />
            </Suspense>
          </TenantRouteGuard>
        </div>
      </div>
    </>
  )
}
