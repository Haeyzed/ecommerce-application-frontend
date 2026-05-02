"use client"

import { useCentralAuth } from "@/components/providers/central-auth-provider"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

/**
 * Redirects authenticated central users away from auth pages (login, register, etc.)
 */
export function CentralRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useCentralAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/central/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || isAuthenticated) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        Redirecting...
      </div>
    )
  }

  return <>{children}</>
}
