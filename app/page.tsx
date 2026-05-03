import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "E-Commerce Platform",
  description: "Multi-tenant e-commerce platform",
}

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">E-Commerce Platform</h1>
        <p className="text-muted-foreground">
          Multi-tenant e-commerce management system
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/central/login"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
        >
          Central Admin
        </Link>
        <Link
          href="/admin/login"
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Admin Login
        </Link>
        <Link
          href="/customer/login"
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Customer Login
        </Link>
      </div>
    </div>
  )
}
