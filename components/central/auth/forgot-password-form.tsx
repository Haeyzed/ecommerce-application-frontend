"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validation/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import Link from "next/link"
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
 * Form Error Alert Component
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
 * Info Box Component (like in Mercato design)
 */
function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
      <svg className="mt-0.5 size-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
      <span>{children}</span>
    </div>
  )
}

/**
 * Central Forgot Password Form Component
 * Mercato-style design matching the reference images
 */
export function CentralForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setGlobalError(null)
    setSuccessMessage(null)
    try {
      await centralAuthService.forgotPassword(data)
      setSuccessMessage("Password reset instructions have been sent to your email address.")
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422 && error.errors) {
          Object.entries(error.errors).forEach(([key, messages]) => {
            setError(key as keyof ForgotPasswordFormValues, {
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
      className={cn("flex flex-col", className)}
      {...props}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Forgot password?
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Enter your email and we&apos;ll send a reset link.
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
            disabled={isSubmitting}
            className={cn(
              "h-12 rounded-lg border-border bg-card text-base",
              "placeholder:text-muted-foreground/50",
              "focus:border-primary focus:ring-1 focus:ring-primary",
              errors.email && "border-destructive focus:border-destructive focus:ring-destructive"
            )}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 h-12 rounded-lg bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner className="size-5" />
            Sending...
          </span>
        ) : (
          "Send reset link"
        )}
      </Button>

      {/* Info Box */}
      <div className="mt-6">
        <InfoBox>
          We&apos;ll send a one-time link valid for <strong>15 minutes</strong>. Check your spam folder if it doesn&apos;t arrive.
        </InfoBox>
      </div>

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
