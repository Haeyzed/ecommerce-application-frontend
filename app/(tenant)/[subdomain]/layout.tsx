"use client"

import { useTenantSubdomain } from "@/lib/hooks/use-tenant-subdomain"
import { TenantAuthProvider } from "@/components/providers/tenant-auth-provider"
import { usePathname } from "next/navigation"

function resolveRole(pathname: string): "customer" | "staff" {
  if (pathname.startsWith("/staff")) {
    return "staff"
  }
  return "customer"
}

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const subdomain = useTenantSubdomain()
  const pathname = usePathname()
  const role = resolveRole(pathname)

  if (!subdomain) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Resolving tenant...</p>
      </div>
    )
  }

  return (
    <TenantAuthProvider subdomain={subdomain} role={role}>
      {children}
    </TenantAuthProvider>
  )
}
