"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

export function AuthRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard")
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
