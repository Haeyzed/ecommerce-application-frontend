"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/api/auth"
import { FieldGroup, Field } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert01Icon, Loading03Icon } from "@hugeicons/core-free-icons"
import Link from "next/link"

interface VerifyEmailProcessorProps {
  verifyUrl: string
}

export function VerifyEmailProcessor({ verifyUrl }: VerifyEmailProcessorProps) {
  const router = useRouter()
  const [status, setStatus] = useState<"verifying" | "error">("verifying")
  const hasAttempted = useRef(false)

  useEffect(() => {
    // Prevent strict mode double-firing
    if (hasAttempted.current) return
    hasAttempted.current = true

    const verify = async () => {
      try {
        await authService.verifyEmail(verifyUrl)
        router.push("/verify-email/success")
      } catch (error) {
        console.error("Verification failed:", error)
        setStatus("error")
      }
    }

    verify()
  }, [verifyUrl, router])

  if (status === "error") {
    return (
      <FieldGroup className="animate-scale-in flex flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <HugeiconsIcon icon={Alert01Icon} strokeWidth={2} className="size-5" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Verification Failed</h1>
          <p className="text-sm text-muted-foreground">
            The verification link is invalid or has expired.
          </p>
        </div>
        <Field className="w-full">
          <Button
            nativeButton={false}
            render={<Link href="/verify-email">Request New Link</Link>}
            className="w-full"
          />
        </Field>
      </FieldGroup>
    )
  }

  return (
    <FieldGroup className="animate-pulse flex flex-col items-center gap-4 text-center">
      <div className="flex size-12 animate-spin items-center justify-center text-primary">
        <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="size-6" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold">Verifying your email...</h1>
        <p className="text-sm text-muted-foreground">
          Please wait while we confirm your email address.
        </p>
      </div>
    </FieldGroup>
  )
}