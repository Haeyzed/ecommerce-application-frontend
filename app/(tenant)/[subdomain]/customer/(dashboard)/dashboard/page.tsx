"use client"

import { useTenantAuth } from "@/components/providers/tenant-auth-provider"
import { TenantMetadata } from "@/components/tenant/tenant-metadata"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ShoppingBag01Icon,
  ShoppingCart01Icon,
  FavouriteIcon,
  User02Icon,
} from "@hugeicons/core-free-icons"

export default function CustomerDashboardPage() {
  const { user, settings } = useTenantAuth()

  return (
    <>
      <TenantMetadata pageTitle="My Account" />
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Account</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.name ?? "Customer"}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Orders</CardTitle>
              <HugeiconsIcon icon={ShoppingBag01Icon} className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Total orders placed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
              <HugeiconsIcon icon={ShoppingCart01Icon} className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Items in your cart</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
              <HugeiconsIcon icon={FavouriteIcon} className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Saved items</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <HugeiconsIcon icon={User02Icon} className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium truncate">{user?.email ?? "—"}</div>
              <p className="text-xs text-muted-foreground">Account email</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
