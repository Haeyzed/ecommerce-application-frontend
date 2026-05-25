"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validation/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState } from "react"
import Link from "next/link"
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

// Input styles helper
const inputStyles = cn(
  "h-12 rounded-xl border-border/50 bg-background/50 text-base transition-all",
  "placeholder:text-muted-foreground/60",
  "focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20",
  "disabled:cursor-not-allowed disabled:opacity-50"
)

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
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Forgot your password?
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you reset instructions
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

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email address
          </Label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="name@company.com"
            autoComplete="email"
            disabled={isFormDisabled}
            className={cn(inputStyles, errors.email && "border-destructive/50 focus:border-destructive focus:ring-destructive/20")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isFormDisabled}
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
            Sending instructions...
          </span>
        ) : (
          "Send reset instructions"
        )}
      </Button>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-4 text-muted-foreground">
            Remember your password?
          </span>
        </div>
      </div>

      {/* Back to Login */}
      <Link
        href="/central/login"
        className={cn(
          "flex h-12 items-center justify-center rounded-xl border border-border/50 text-base font-medium",
          "text-foreground transition-all duration-300",
          "hover:border-border hover:bg-accent/50"
        )}
      >
        Back to sign in
      </Link>
    </form>
  )
}
