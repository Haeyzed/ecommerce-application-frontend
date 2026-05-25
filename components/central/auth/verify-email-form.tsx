"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { verifyOtpSchema, type VerifyOtpFormValues } from "@/lib/validation/auth"
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
 * Central Verify Email Form Component
 * Mercato-style design matching the reference images
 */
export function CentralVerifyEmailForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams?.get("email") || ""
  
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

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

  const otpValue = watch("otp")

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const onSubmit = async (data: VerifyOtpFormValues) => {
    setGlobalError(null)
    setSuccessMessage(null)
    try {
      await centralAuthService.verifyOtp(data)
      setSuccessMessage("Email verified successfully! Redirecting to login...")
      setTimeout(() => {
        router.push("/central/login")
      }, 2000)
    } catch (error) {
      if (error instanceof ApiError) {
        setGlobalError(error.message)
      } else {
        setGlobalError("Verification failed. Please try again.")
      }
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !email) return
    
    setIsResending(true)
    setGlobalError(null)
    setSuccessMessage(null)
    
    try {
      await centralAuthService.resendVerificationOtp({ email })
      setSuccessMessage("A new verification code has been sent to your email.")
      setResendCooldown(60)
    } catch (error) {
      if (error instanceof ApiError) {
        setGlobalError(error.message)
      } else {
        setGlobalError("Failed to resend code. Please try again.")
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col", className)}
      {...props}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Verify your email
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          We sent a 6-digit code to <span className="font-medium text-foreground">{email || "your email"}</span>
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

      {/* OTP Input */}
      <div className="space-y-3">
        <label className="sr-only">Verification code</label>
        <OtpInput
          value={otpValue}
          onChange={(value) => setValue("otp", value)}
          disabled={isSubmitting}
          error={!!errors.otp}
        />
        {errors.otp && (
          <p className="text-center text-sm text-destructive">{errors.otp.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || otpValue.length !== 6}
        className="mt-8 h-12 rounded-lg bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner className="size-5" />
            Verifying...
          </span>
        ) : (
          "Verify email"
        )}
      </Button>

      {/* Resend Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          {resendCooldown > 0 ? (
            <span className="text-muted-foreground">
              Resend in {resendCooldown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending || !email}
              className="font-medium text-primary hover:text-primary/80 disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          )}
        </p>
      </div>

      {/* Back to Registration Link */}
      <Link
        href="/central/register"
        className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to registration
      </Link>
    </form>
  )
}
