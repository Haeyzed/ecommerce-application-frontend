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
import { useCentralAuth } from "@/components/providers/central-auth-provider"
import { useRouter, usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare01Icon,
  CreditCardIcon,
  Building02Icon,
  UserAdd01Icon,
  ArrowUp01Icon,
  Logout01Icon,
  User02Icon,
} from "@hugeicons/core-free-icons"

const navItems = [
  { title: "Dashboard", href: "/central/dashboard", icon: DashboardSquare01Icon },
  { title: "Tenants", href: "/central/tenants", icon: Building02Icon },
  { title: "Plans", href: "/central/plans", icon: CreditCardIcon },
  { title: "Subscriptions", href: "/central/subscriptions", icon: CreditCardIcon },
  { title: "Onboarding", href: "/central/onboarding", icon: UserAdd01Icon },
]

export function CentralSidebar() {
  const { user, logout } = useCentralAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    router.push("/central/login")
  }

  return (
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" render={<Link href="/central/dashboard" />}>
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <HugeiconsIcon icon={Building02Icon} className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Central Admin</span>
                  <span className="text-xs text-muted-foreground">Management</span>
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
                      <SidebarMenuButton isActive={pathname === item.href} render={<Link href={item.href} />}>
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
                  <span className="truncate">{user?.name ?? "Admin"}</span>
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