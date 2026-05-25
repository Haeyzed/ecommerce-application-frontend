"use client"

import React from "react"
import Link from "next/link"
import { CentralRouteGuard } from "@/components/auth/central-route-guard"
import { useCentralAuth } from "@/components/providers/central-auth-provider"

function AuthBrandLogo() {
  return (
    <Link
      href="/central/login"
      className="group flex items-center gap-3 transition-all duration-300"
    >
      <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-primary/40 group-hover:scale-105">
        <svg
          className="size-5 text-primary-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/0 to-white/20" />
      </div>
      <span className="text-xl font-semibold tracking-tight text-foreground">
        Central
      </span>
    </Link>
  )
}

function AuthBackgroundPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute -top-1/4 -right-1/4 size-[600px] rounded-full bg-primary/10 blur-[100px] animate-pulse-subtle" />
      <div className="absolute -bottom-1/4 -left-1/4 size-[500px] rounded-full bg-primary/8 blur-[80px] animate-pulse-subtle" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] rounded-full bg-accent/10 blur-[60px] animate-pulse-subtle" style={{ animationDelay: "2s" }} />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Noise Texture */}
      <div className="absolute inset-0 noise opacity-30" />
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="group relative flex items-start gap-4 rounded-2xl border border-border/50 bg-card/30 p-5 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/50">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/15">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export default function CentralAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { settings } = useCentralAuth()
  const appName = settings?.name || "Central Admin"

  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Background Effects */}
      <AuthBackgroundPattern />

      {/* Left Panel - Branding & Features */}
      <div className="relative hidden w-[55%] flex-col justify-between p-10 lg:flex xl:p-16">
        {/* Logo */}
        <AuthBrandLogo />

        {/* Center Content - Hero Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground xl:text-5xl">
              <span className="text-gradient-premium">Powerful tools</span>
              <br />
              for modern teams
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
              Streamline your operations with our comprehensive admin platform. 
              Built for scale, designed for simplicity.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-4 max-w-lg">
            <FeatureCard
              icon={
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              }
              title="Enterprise Security"
              description="Bank-level encryption and compliance-ready infrastructure"
            />
            <FeatureCard
              icon={
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              }
              title="Lightning Fast"
              description="Optimized performance with real-time data synchronization"
            />
            <FeatureCard
              icon={
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              }
              title="Team Collaboration"
              description="Built-in tools for seamless team coordination"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} {appName}</span>
          <span className="size-1 rounded-full bg-border" />
          <Link href="#" className="transition-colors hover:text-foreground">Privacy</Link>
          <Link href="#" className="transition-colors hover:text-foreground">Terms</Link>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="relative flex flex-1 flex-col items-center justify-center p-6 md:p-10 lg:p-16">
        {/* Mobile Logo */}
        <div className="mb-8 lg:hidden">
          <AuthBrandLogo />
        </div>

        {/* Auth Card */}
        <div className="relative w-full max-w-[420px]">
          {/* Card Glow Effect */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/20 via-transparent to-primary/10 blur-xl opacity-60" />
          
          {/* Main Card */}
          <div className="relative rounded-2xl border border-border/50 bg-card/80 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl md:p-10">
            <CentralRouteGuard>
              {children}
            </CentralRouteGuard>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground lg:hidden">
          <span>&copy; {new Date().getFullYear()} {appName}</span>
          <Link href="#" className="hover:text-foreground">Privacy</Link>
          <Link href="#" className="hover:text-foreground">Terms</Link>
        </div>
      </div>
    </div>
  )
}
