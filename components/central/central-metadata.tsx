"use client"

import { useCentralAuth } from "@/components/providers/central-auth-provider"
import Head from "next/head"

/**
 * Dynamically sets the page title and favicon for the central application.
 */
export function CentralMetadata({ pageTitle }: { pageTitle?: string }) {
  const { settings } = useCentralAuth()

  const appName = settings?.name ?? "Central Admin"
  const title = pageTitle ? `${pageTitle} | ${appName}` : appName

  return (
    <>
      <title>{title}</title>
      {/* Assuming central settings might also have a favicon_url */}
      {settings?.favicon_url && (
        <link rel="icon" href={settings.favicon_url} />
      )}
    </>
  )
}
