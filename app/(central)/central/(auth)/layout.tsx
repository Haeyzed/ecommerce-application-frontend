import { HugeiconsIcon } from "@hugeicons/react"
import { LayoutBottomIcon } from "@hugeicons/core-free-icons"
import React from "react"
import { CentralRouteGuard } from "@/components/auth/central-route-guard"

export default function CentralAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/central/login" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <HugeiconsIcon icon={LayoutBottomIcon} strokeWidth={2} className="size-4" />
            </div>
            Central Admin
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <CentralRouteGuard>{children}</CentralRouteGuard>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/illustrations/auth.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
