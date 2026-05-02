"use client"

import { useCentralAuth } from "@/components/providers/central-auth-provider"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

export function CentralAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useCentralAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/central/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return <>{children}</>
}
