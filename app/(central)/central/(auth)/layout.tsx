"use client"

import React from "react"
import Link from "next/link"
import { CentralRouteGuard } from "@/components/auth/central-route-guard"
import { useCentralAuth } from "@/components/providers/central-auth-provider"

/**
 * Brand Logo Component
 * Displays the application logo with a home icon
 */
function BrandLogo({ name }: { name: string }) {
  return (
    <Link href="/central/login" className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
        <svg
          className="size-5 text-primary-foreground"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6z" />
        </svg>
      </div>
      <span className="text-xl font-semibold text-foreground">{name}</span>
    </Link>
  )
}

/**
 * Admin Badge Component
 * Shows the "Central Admin" badge in header
 */
function AdminBadge() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground">
      <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
      </svg>
      <span>Central Admin</span>
    </div>
  )
}

/**
 * Testimonial Section Component
 * Displays customer testimonial with avatar
 */
function TestimonialSection() {
  return (
    <div className="flex flex-col justify-center px-12 xl:px-20">
      {/* Domain Badge */}
      <div className="mb-6">
        <span className="inline-block rounded-full border border-border bg-card/80 px-4 py-1.5 text-sm text-foreground">
          admin.central.app
        </span>
      </div>

      {/* Quote */}
      <blockquote className="mb-8">
        <p className="text-3xl font-semibold leading-tight tracking-tight text-foreground xl:text-4xl">
          &ldquo;Central gave us the team controls and audit trail we needed to scale.&rdquo;
        </p>
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
          AC
        </div>
        <div>
          <p className="font-semibold text-foreground">Alex Chen</p>
          <p className="text-sm text-muted-foreground">CTO, TechCorp Inc.</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Footer Component
 * Displays copyright and security badge
 */
function AuthFooter({ appName }: { appName: string }) {
  return (
    <footer className="flex items-center justify-between border-t border-border bg-card/50 px-8 py-4 text-sm text-muted-foreground lg:px-12">
      <span>&copy; {new Date().getFullYear()} {appName}</span>
      <div className="flex items-center gap-2">
        <svg className="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <span>Encrypted with TLS 1.3</span>
      </div>
    </footer>
  )
}

/**
 * Central Auth Layout
 * Main layout wrapper for all authentication pages
 * Features a split-screen design with form on left and testimonial on right
 */
export default function CentralAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { settings } = useCentralAuth()
  const appName = settings?.name || "Central"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Panel - Form Section */}
        <div className="flex w-full flex-col lg:w-1/2">
          {/* Header */}
          <header className="flex items-center justify-between px-8 py-6 lg:px-12">
            <BrandLogo name={appName} />
            <AdminBadge />
          </header>

          {/* Form Content */}
          <main className="flex flex-1 flex-col justify-center px-8 pb-8 lg:px-12 xl:px-20">
            <div className="mx-auto w-full max-w-[440px]">
              <CentralRouteGuard>
                {children}
              </CentralRouteGuard>
            </div>
          </main>
        </div>

        {/* Right Panel - Testimonial Section (Desktop Only) */}
        <div className="hidden bg-mercato-gradient lg:flex lg:w-1/2">
          <TestimonialSection />
        </div>
      </div>

      {/* Footer */}
      <AuthFooter appName={appName} />
    </div>
  )
}
