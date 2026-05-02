"use client"

import { useEffect, useState } from "react"

/**
 * Resolves the tenant subdomain from:
 * 1. `NEXT_PUBLIC_TENANT_SUBDOMAIN` env var (for local dev)
 * 2. The first segment of `window.location.hostname` (production subdomains)
 *
 * Returns `null` while resolving on the server or if no subdomain is found.
 */
export function useTenantSubdomain(): string | null {
  const [subdomain, setSubdomain] = useState<string | null>(null)

  useEffect(() => {
    const envSubdomain = process.env.NEXT_PUBLIC_TENANT_SUBDOMAIN
    if (envSubdomain) {
      setSubdomain(envSubdomain)
      return
    }

    const hostname = window.location.hostname
    const parts = hostname.split(".")

    // Production: subdomain.domain.tld (3+ parts)
    if (parts.length >= 3) {
      setSubdomain(parts[0])
    }
    // Local dev: subdomain.localhost (2 parts)
    else if (parts.length === 2 && parts[1] === "localhost") {
      setSubdomain(parts[0])
    }
  }, [])

  return subdomain
}