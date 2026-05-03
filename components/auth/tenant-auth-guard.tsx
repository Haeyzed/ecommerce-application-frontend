"use client"

import { useTenantAuth } from "@/components/providers/tenant-auth-provider"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

/**
 * Protects tenant dashboard routes — redirects unauthenticated users to login.
 */
export function TenantAuthGuard({
  children,
  loginPath = "/admin/login",
}: {
  children: React.ReactNode
  loginPath?: string
}) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useTenantAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(loginPath)
    }
  }, [isAuthenticated, isLoading, router, loginPath])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return <>{children}</>
}
