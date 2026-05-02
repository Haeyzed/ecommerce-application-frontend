"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkBadgeIcon } from "@hugeicons/core-free-icons"
import Link from "next/link"

export function VerificationSuccess() {
  return (
    <FieldGroup className="animate-scale-in">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <HugeiconsIcon
            icon={CheckmarkBadgeIcon}
            strokeWidth={2}
            className="size-4"
          />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Email Verified</h1>
          <p className="text-sm text-muted-foreground">
            Your account is now fully activated. You can now access the
            dashboard.
          </p>
        </div>
      </div>

      <Field>
        <Button
          nativeButton={false}
          render={<Link href="/dashboard">Go to Dashboard</Link>}
          className="w-full"
        />
      </Field>
    </FieldGroup>
  )
}
