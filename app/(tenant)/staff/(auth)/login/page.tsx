"use client"

import { TenantLoginForm } from "components/tenant/auth/tenant-login-form"
import { TenantMetadata } from "components/tenant/tenant-metadata"
import { TenantRouteGuard } from "components/auth/tenant-route-guard"
import { Suspense } from "react"

export default function StaffLoginPage() {
  return (
    <>
      <TenantMetadata pageTitle="Staff Login" />
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-xs">
          <TenantRouteGuard>
            <Suspense fallback={<div>Loading form...</div>}>
              <TenantLoginForm role="staff" />
            </Suspense>
          </TenantRouteGuard>
        </div>
      </div>
    </>
  )
}
