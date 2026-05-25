"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema, ResetPasswordFormValues } from "@/lib/validation/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import React, { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { centralAuthService } from "@/lib/api/central/auth"
import { ApiError } from "@/lib/api/errors"
import { Spinner } from "@/components/ui/spinner"
import { Alert01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export function CentralResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [useOtpMode, setUseOtpMode] = useState(!searchParams?.get("token"))
  const [globalError, setGlobalError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      reset_token: searchParams?.get("token") ?? "",
      email: searchParams?.get("email") ?? "",
      password: "",
      password_confirmation: "",
    },
  })

  const otp = watch("otp")
  const email = watch("email")

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setGlobalError(null)
    try {
      await centralAuthService.resetPassword(data)
      router.push("/central/login?reset=success")
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422 && error.errors) {
          Object.entries(error.errors).forEach(([key, messages]) => {
            setError(key as keyof ResetPasswordFormValues, {
              type: "server",
              message: messages[0],
            })
          })
        } else {
          setGlobalError(error.message)
        }
      } else {
        setGlobalError("An unexpected error occurred. Please try again.")
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        {globalError && (
          <Alert variant="destructive">
            <HugeiconsIcon icon={Alert01Icon} className="size-4" />
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        )}

        {!useOtpMode && (
          <input type="hidden" {...register("reset_token")} />
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="admin@example.com"
            disabled={!useOtpMode || isSubmitting}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </Field>

        {useOtpMode && (
          <Field>
            <FieldLabel htmlFor="otp">Enter OTP</FieldLabel>
            <InputOTP
              maxLength={6}
              value={otp || ""}
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
        )}

        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
          <PasswordInput
            {...register("password")}
            id="password"
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password_confirmation">Confirm Password</FieldLabel>
          <PasswordInput
            {...register("password_confirmation")}
            id="password_confirmation"
            disabled={isSubmitting}
          />
          {errors.password_confirmation && (
            <p className="text-xs text-destructive">{errors.password_confirmation.message}</p>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting || (useOtpMode && otp?.length !== 6)}>
            {isSubmitting ? (
              <>
                <Spinner className="size-4" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </Field>

        <div className="text-center text-sm">
          <Link href="/central/login" className="underline underline-offset-4">
            Back to login
          </Link>
        </div>
      </FieldGroup>
    </form>
  )
}
