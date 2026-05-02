"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { authService } from "@/lib/api/auth"
import { useRouter } from "next/navigation"

export function DashboardContent() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, setUser, refreshUser } = useAuth()

  const handleLogout = async () => {
    try {
      await authService.logout()
      setUser(null)
      router.push("/login")
      router.refresh()
    } catch {
      // Still clear local user and send to login
      setUser(null)
      router.push("/login")
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading session…</p>
  }

  if (!isAuthenticated || !user) {
    return (
      <p className="text-sm text-muted-foreground">
        You are not signed in.{" "}
        <Button nativeButton={false} render={<a href="/login">Log in</a>} variant="link" className="p-0" />
      </p>
    )
  }

  return (
    <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
      <div>
        <h1 className="font-medium">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Email verified:{" "}
          {user.email_verified_at ? (
            <span className="text-foreground">{new Date(user.email_verified_at).toLocaleString()}</span>
          ) : (
            <span className="text-amber-600">Not yet</span>
          )}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => void refreshUser()}>
          Refresh session
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => void handleLogout()}>
          Log out
        </Button>
      </div>
    </div>
  )
}
