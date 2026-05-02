"use client"

import { useTenantAuth } from "@/components/providers/tenant-auth-provider"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

/**
 * Redirects authenticated tenant users away from auth pages.
 * Staff → /dashboard, Customer → /
 */
export function TenantRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading, role } = useTenantAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(role === "staff" ? "/staff/dashboard" : "/customer/dashboard")
    }
  }, [isAuthenticated, isLoading, role, router])

  if (isLoading || isAuthenticated) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        Redirecting...
      </div>
    )
  }

  return <>{children}</>
}
