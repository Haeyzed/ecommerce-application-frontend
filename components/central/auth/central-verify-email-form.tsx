"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { HugeiconsIcon } from "@hugeicons/react"
import { Mail01Icon } from "@hugeicons/core-free-icons"
import React, { useState, useEffect } from "react"
import { centralAuthService } from "@/lib/api/central/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { verifyOtpSchema, VerifyOtpFormValues } from "@/lib/validation/auth"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { ApiError } from "@/lib/api/errors"
import { Alert01Icon } from "@hugeicons/core-free-icons"

interface CentralVerifyEmailFormProps extends React.ComponentProps<"div"> {
  email?: string
}

export function CentralVerifyEmailForm({ className, email: propEmail, ...props }: CentralVerifyEmailFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(propEmail || searchParams?.get("email") || "")
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [resendCountdown, setResendCountdown] = useState(0)

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email,
      otp: "",
      type: "email_verification",
    },
  })

  const otp = watch("otp")

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  const onSubmit = async (data: VerifyOtpFormValues) => {
    setGlobalError(null)
    try {
      await centralAuthService.verifyOtp(data)
      router.push("/central/login")
    } catch (error) {
      if (error instanceof ApiError) {
        setGlobalError(error.message)
      } else {
        setGlobalError("An unexpected error occurred. Please try again.")
      }
    }
  }

  const handleResend = async () => {
    if (!email) {
      setGlobalError("Email is required")
      return
    }

    setGlobalError(null)
    try {
      await centralAuthService.resendVerificationOtp({ email })
      setResendCountdown(60)
    } catch (error) {
      if (error instanceof ApiError) {
        setGlobalError(error.message)
      } else {
        setGlobalError("Failed to resend OTP. Please try again.")
      }
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
              We&apos;ve sent a 6-digit OTP to <span className="font-semibold text-foreground">{email || "your email"}</span>.
            </p>
          </div>
        </div>

        {globalError && (
          <Alert variant="destructive">
            <HugeiconsIcon icon={Alert01Icon} className="size-4" />
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="otp">Enter OTP</FieldLabel>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setValue("otp", value)}
              disabled={isSubmitting}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {errors.otp && (
              <p className="text-xs text-destructive">{errors.otp.message}</p>
            )}
          </Field>

          <Button type="submit" disabled={isSubmitting || otp.length !== 6} className="w-full">
            {isSubmitting ? (
              <>
                <Spinner className="size-4" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>

        <Button
          type="button"
          variant="outline"
          onClick={handleResend}
          disabled={resendCountdown > 0}
          className="w-full"
        >
          {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Didn't receive OTP? Resend"}
        </Button>

        <FieldDescription className="text-center">
          <button
            type="button"
            className="font-medium text-primary underline underline-offset-4"
            onClick={() => router.back()}
          >
            Go back
          </button>
        </FieldDescription>
      </FieldGroup>
    </div>
  )
}
