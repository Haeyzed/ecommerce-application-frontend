"use client"

import { useTenantSubdomain } from "@/lib/hooks/use-tenant-subdomain"
import { TenantAuthProvider } from "@/components/providers/tenant-auth-provider"
import { usePathname } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

function resolveRole(pathname: string): "customer" | "admin" {
  if (pathname.startsWith("/admin")) {
    return "admin"
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
        <Spinner />
      </div>
    )
  }

  return (
    <TenantAuthProvider subdomain={subdomain} role={role}>
      {children}
    </TenantAuthProvider>
  )
}
