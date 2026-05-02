"use client"

import { useTenantAuth } from "@/components/providers/tenant-auth-provider"
import Head from "next/head"

/**
 * Dynamically sets the page title and favicon based on tenant settings.
 * Place inside any tenant layout to apply tenant-aware metadata.
 */
export function TenantMetadata({ pageTitle }: { pageTitle?: string }) {
  const { settings } = useTenantAuth()

  const appName = settings?.name ?? "Store"
  const title = pageTitle ? `${pageTitle} | ${appName}` : appName

  return (
    <>
      <title>{title}</title>
      {settings?.favicon_url && (
        <link rel="icon" href={settings.favicon_url} />
      )}
    </>
  )
}
