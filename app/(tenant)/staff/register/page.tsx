"use client"

import { TenantRegisterForm } from "@/components/tenant/auth/tenant-register-form"
import { TenantMetadata } from "@/components/tenant/tenant-metadata"
import { TenantRouteGuard } from "@/components/auth/tenant-route-guard"
import { Suspense } from "react"

export default function StaffRegisterPage() {
  return (
    <>
      <TenantMetadata pageTitle="Staff Register" />
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-xs">
          <TenantRouteGuard>
            <Suspense fallback={<div>Loading form...</div>}>
              <TenantRegisterForm role="staff" />
            </Suspense>
          </TenantRouteGuard>
        </div>
      </div>
    </>
  )
}
