"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validation/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { centralAuthService } from "@/lib/api/central/auth"
import { ApiError } from "@/lib/api/errors"

/**
 * Loading Spinner Component
 */
function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}

/**
 * Form Alert Component
 */
function FormAlert({ message, variant = "error" }: { message: string; variant?: "error" | "success" }) {
  const isSuccess = variant === "success"
  return (
    <div className={cn(
      "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm",
      isSuccess
        ? "border-green-200 bg-green-50 text-green-700"
        : "border-destructive/20 bg-destructive/5 text-destructive"
    )}>
      <svg className="mt-0.5 size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {isSuccess ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        )}
      </svg>
      <span>{message}</span>
    </div>
  )
}

/**
 * OTP Input Component
 */
function OtpInput({
  value,
  onChange,
  disabled,
  error,
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [localValues, setLocalValues] = useState<string[]>(
    value ? value.split("") : Array(6).fill("")
  )

  useEffect(() => {
    if (value) {
      setLocalValues(value.split("").concat(Array(6 - value.length).fill("")))
    }
  }, [value])

  const handleChange = (index: number, inputValue: string) => {
    if (!/^\d*$/.test(inputValue)) return
    const newValues = [...localValues]
    newValues[index] = inputValue.slice(-1)
    setLocalValues(newValues)
    onChange(newValues.join(""))
    if (inputValue && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !localValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newValues = pastedData.split("").concat(Array(6 - pastedData.length).fill(""))
    setLocalValues(newValues)
    onChange(newValues.join(""))
    const nextEmptyIndex = newValues.findIndex((v) => !v)
    inputRefs.current[nextEmptyIndex === -1 ? 5 : nextEmptyIndex]?.focus()
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={localValues[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "size-12 rounded-lg text-center text-xl font-semibold sm:size-14",
            "border-border bg-card",
            "focus:border-primary focus:ring-1 focus:ring-primary",
            error && "border-destructive focus:border-destructive focus:ring-destructive"
          )}
        />
      ))}
    </div>
  )
}

/**
 * Password Input with visibility toggle
 */
function PasswordInput({
  id,
  error,
  disabled,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        id={id}
        disabled={disabled}
        className={cn(
          "h-12 rounded-lg border-border bg-card pr-11 text-base",
          "placeholder:text-muted-foreground/50",
          "focus:border-primary focus:ring-1 focus:ring-primary",
          error && "border-destructive focus:border-destructive focus:ring-destructive",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
        tabIndex={-1}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        ) : (
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>
    </div>
  )
}

/**
 * Central Reset Password Form Component
 * Mercato-style design matching the reference images
 */
export function CentralResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [useOtpMode] = useState(!searchParams?.get("token"))
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setGlobalError(null)
    setSuccessMessage(null)
    try {
      await centralAuthService.resetPassword(data)
      setSuccessMessage("Password reset successfully! Redirecting to login...")
      setTimeout(() => {
        router.push("/central/login?reset=success")
      }, 2000)
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

  const inputClassName = cn(
    "h-12 rounded-lg border-border bg-card text-base",
    "placeholder:text-muted-foreground/50",
    "focus:border-primary focus:ring-1 focus:ring-primary"
  )

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col", className)}
      {...props}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Reset your password
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Enter your new password below.
        </p>
      </div>

      {/* Messages */}
      {globalError && (
        <div className="mb-6">
          <FormAlert message={globalError} variant="error" />
        </div>
      )}

      {successMessage && (
        <div className="mb-6">
          <FormAlert message={successMessage} variant="success" />
        </div>
      )}

      {/* Hidden token field */}
      {!useOtpMode && <input type="hidden" {...register("reset_token")} />}

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            disabled={!useOtpMode || isSubmitting}
            className={cn(inputClassName, errors.email && "border-destructive")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* OTP Field */}
        {useOtpMode && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Verification code
            </label>
            <OtpInput
              value={otp || ""}
              onChange={(value) => setValue("otp", value)}
              disabled={isSubmitting}
              error={!!errors.otp}
            />
            {errors.otp && (
              <p className="text-center text-sm text-destructive">{errors.otp.message}</p>
            )}
          </div>
        )}

        {/* New Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            New password
          </label>
          <PasswordInput
            {...register("password")}
            id="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            disabled={isSubmitting}
            error={errors.password?.message}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label htmlFor="password_confirmation" className="text-sm font-medium text-foreground">
            Confirm new password
          </label>
          <PasswordInput
            {...register("password_confirmation")}
            id="password_confirmation"
            placeholder="Confirm your password"
            autoComplete="new-password"
            disabled={isSubmitting}
            error={errors.password_confirmation?.message}
          />
          {errors.password_confirmation && (
            <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || (useOtpMode && otp?.length !== 6)}
        className="mt-8 h-12 rounded-lg bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner className="size-5" />
            Resetting...
          </span>
        ) : (
          "Reset password"
        )}
      </Button>

      {/* Back to Sign In Link */}
      <Link
        href="/central/login"
        className="mt-6 flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to sign in
      </Link>
    </form>
  )
}
