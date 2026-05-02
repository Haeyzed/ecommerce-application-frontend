"use client"

import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTenantAuth } from "@/components/providers/tenant-auth-provider"
import { useRouter, usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  ShoppingBag01Icon,
  UserMultiple02Icon,
  Package01Icon,
  Tag01Icon,
  Logout01Icon,
  User02Icon,
  ArrowUp01Icon,
  Settings01Icon,
  BarChartIcon,
  Notification01Icon,
  Store01Icon,
} from "@hugeicons/core-free-icons"

const navItems = [
  { title: "Dashboard", href: "/staff/dashboard", icon: DashboardSquare01Icon },
  { title: "Orders", href: "/staff/orders", icon: ShoppingBag01Icon },
  { title: "Products", href: "/staff/products", icon: Package01Icon },
  { title: "Categories", href: "/staff/categories", icon: Tag01Icon },
  { title: "Customers", href: "/staff/customers", icon: UserMultiple02Icon },
  { title: "Analytics", href: "/staff/analytics", icon: BarChartIcon },
  { title: "Notifications", href: "/staff/notifications", icon: Notification01Icon },
  { title: "Settings", href: "/staff/settings", icon: Settings01Icon },
]

export function StaffSidebar() {
  const { user, settings, logout } = useTenantAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    router.push("/staff/login")
  }

  return (
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" render={<Link href="/staff/dashboard" />}>
                {settings?.logo_url ? (
                    <img
                        src={settings.logo_url}
                        alt={settings.name ?? "Store"}
                        className="size-8 rounded-lg object-contain"
                    />
                ) : (
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <HugeiconsIcon icon={Store01Icon} className="size-4" />
                    </div>
                )}
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{settings?.name ?? "Store"}</span>
                  <span className="text-xs text-muted-foreground">Staff Panel</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                          isActive={pathname === item.href}
                          render={<Link href={item.href} />}
                      >
                        <HugeiconsIcon icon={item.icon} className="size-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={<SidebarMenuButton />}>
                  <HugeiconsIcon icon={User02Icon} className="size-4" />
                  <span className="truncate">{user?.name ?? "Staff"}</span>
                  <HugeiconsIcon icon={ArrowUp01Icon} className="ms-auto size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem onClick={handleLogout}>
                    <HugeiconsIcon icon={Logout01Icon} className="mr-2 size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
  )
}