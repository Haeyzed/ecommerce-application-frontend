"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldDescription } from "@/components/ui/field"
import { HugeiconsIcon } from "@hugeicons/react"
import { Mail01Icon } from "@hugeicons/core-free-icons"
import React, { useEffect, useState } from "react"
import { authService } from "@/lib/api/auth"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Spinner } from "@/components/ui/spinner"

interface VerifyEmailFormProps extends React.ComponentProps<"div"> {
  email?: string
}

export function VerifyEmailForm({ className, email, ...props }: VerifyEmailFormProps) {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    if (user?.email_verified_at) {
      router.push("/dashboard")
    }
  }, [user?.email_verified_at, router])

  useEffect(() => {
    let isMounted = true

    const poll = async () => {
      try {
        await refreshUser()
      } catch {
        // Ignore polling errors (e.g. temporary network/session issues)
      }
    }

    void poll()
    const intervalId = window.setInterval(() => {
      if (isMounted) {
        void poll()
      }
    }, 5000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [refreshUser])

  const handleResend = async () => {
    setIsLoading(true)
    setStatus("idle")

    try {
      await authService.resendVerification()
      setStatus("success")
    } catch (error) {
      console.error("Resend failed", error)
      setStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("animate-slide-up-fade flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} className="size-4" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Verify your email</h1>
            <p className="text-sm text-balance text-muted-foreground">
              We&apos;ve sent a verification link to <span className="font-semibold text-foreground">{email || "your email"}</span>.
            </p>
          </div>
        </div>

        <Field>
          <Button
            onClick={handleResend}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Spinner className="size-4" />
                Sending...
              </>
            ) : (
              "Resend Verification Email"
            )}
          </Button>

          {status === "success" && (
            <p className="mt-2 text-center text-xs text-green-600 font-medium">
              A new link has been sent to your inbox.
            </p>
          )}
          {status === "error" && (
            <p className="mt-2 text-center text-xs text-destructive font-medium">
              Failed to resend. Please try again later.
            </p>
          )}
        </Field>

        <FieldDescription className="text-center">
          Wrong email address?{" "}
          <button className="font-medium text-primary underline underline-offset-4">
            Edit profile
          </button>
        </FieldDescription>
      </FieldGroup>
    </div>
  )
}