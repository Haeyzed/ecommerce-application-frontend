"use client"

import { useTenantAuth } from "@/components/providers/tenant-auth-provider"
import { TenantMetadata } from "@/components/tenant/tenant-metadata"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingBag01Icon,
  Package01Icon,
  UserMultiple02Icon,
  Dollar01Icon,
} from "@hugeicons/core-free-icons"

export default function StaffDashboardPage() {
  const { user, settings } = useTenantAuth()

  return (
    <>
      <TenantMetadata pageTitle="Dashboard" />
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.name ?? "Staff"}
          </p>
          {settings?.tagline && (
            <p className="text-sm text-muted-foreground italic">{settings.tagline}</p>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <HugeiconsIcon icon={ShoppingBag01Icon} className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Pending orders to process</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <HugeiconsIcon icon={Package01Icon} className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Active products in store</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <HugeiconsIcon icon={UserMultiple02Icon} className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Registered customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <HugeiconsIcon icon={Dollar01Icon} className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{settings?.currency ?? "$"}0.00</div>
              <p className="text-xs text-muted-foreground">Total revenue this month</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Store Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Currency</dt>
                  <dd>{settings?.currency ?? "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Timezone</dt>
                  <dd>{settings?.timezone ?? "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Language</dt>
                  <dd>{settings?.language ?? "—"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>{settings?.contact_email ?? "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>{settings?.contact_phone ?? "—"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
