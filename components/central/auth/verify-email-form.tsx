"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { verifyOtpSchema, resendOtpSchema, type VerifyOtpFormValues } from "@/lib/validation/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { centralAuthService } from "@/lib/api/central/auth"
import { ApiError } from "@/lib/api/errors"

// Custom Spinner Component
function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

// Alert Component
function FormAlert({ 
  message, 
  variant = "error" 
}: { 
  message: string
  variant?: "error" | "success" 
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm",
        variant === "error" 
          ? "border-destructive/30 bg-destructive/10 text-destructive" 
          : "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
      )}
    >
      {variant === "error" ? (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      ) : (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <span>{message}</span>
    </div>
  )
}

// OTP Input Component
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

    // Auto-focus next input
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
    
    // Focus the next empty input or the last input
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
            "size-12 sm:size-14 rounded-xl text-center text-xl font-semibold",
            "border-border/50 bg-background/50 transition-all",
            "focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
          )}
        />
      ))}
    </div>
  )
}

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

  const isFormDisabled = isSubmitting

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col", className)}
      {...props}
    >
      {/* Header */}
      <div className="mb-8 space-y-2 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <svg className="size-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Verify your email
        </h1>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to
        </p>
        <p className="text-sm font-medium text-foreground">
          {email || "your email address"}
        </p>
      </div>

      {/* Messages */}
      {globalError && (
        <div className="mb-6 animate-in">
          <FormAlert message={globalError} variant="error" />
        </div>
      )}

      {successMessage && (
        <div className="mb-6 animate-in">
          <FormAlert message={successMessage} variant="success" />
        </div>
      )}

      {/* OTP Input */}
      <div className="space-y-3">
        <Label className="sr-only">Verification code</Label>
        <OtpInput
          value={otpValue}
          onChange={(value) => setValue("otp", value)}
          disabled={isFormDisabled}
          error={!!errors.otp}
        />
        {errors.otp && (
          <p className="text-center text-xs text-destructive">{errors.otp.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isFormDisabled || otpValue.length !== 6}
        className={cn(
          "mt-8 h-12 rounded-xl text-base font-medium transition-all duration-300",
          "bg-primary hover:bg-primary/90",
          "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
          "disabled:opacity-50 disabled:shadow-none"
        )}
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
              className="font-medium text-primary transition-colors hover:text-primary/80 disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          )}
        </p>
      </div>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-4 text-muted-foreground">
            Wrong email?
          </span>
        </div>
      </div>

      {/* Back to Register */}
      <Link
        href="/central/register"
        className={cn(
          "flex h-12 items-center justify-center rounded-xl border border-border/50 text-base font-medium",
          "text-foreground transition-all duration-300",
          "hover:border-border hover:bg-accent/50"
        )}
      >
        Back to registration
      </Link>
    </form>
  )
}
