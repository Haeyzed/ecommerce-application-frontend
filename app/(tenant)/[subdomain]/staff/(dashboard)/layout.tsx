"use client"

import { TenantAuthGuard } from "@/components/auth/tenant-auth-guard"
import { TenantMetadata } from "@/components/tenant/tenant-metadata"
import { StaffSidebar } from "@/components/tenant/staff/staff-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function StaffDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TenantAuthGuard loginPath="/staff/login">
      <TenantMetadata pageTitle="Staff Panel" />
      <SidebarProvider>
        <StaffSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ms-1" />
              <Separator
                orientation="vertical"
                className="me-2 data-vertical:h-4 data-vertical:self-auto"
              />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TenantAuthGuard>
  )
}
