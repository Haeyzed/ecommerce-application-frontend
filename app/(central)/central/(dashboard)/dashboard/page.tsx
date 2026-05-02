"use client"

import { useCentralAuth } from "@/components/providers/central-auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Building02Icon,
  CreditCardIcon,
  UserMultiple02Icon,
  UserAdd01Icon
} from "@hugeicons/core-free-icons"
import Link from "next/link"

export default function CentralDashboardPage() {
  const { user } = useCentralAuth()

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name ?? "Admin"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/central/tenants">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tenants</CardTitle>
                <HugeiconsIcon icon={Building02Icon} className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Manage all tenants</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/central/plans">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plans</CardTitle>
                <HugeiconsIcon icon={CreditCardIcon} className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Subscription plans</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/central/subscriptions">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                <HugeiconsIcon icon={UserMultiple02Icon} className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Active subscriptions</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/central/onboarding">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Onboarding</CardTitle>
                <HugeiconsIcon icon={UserAdd01Icon} className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Onboard a new tenant</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
  )
}