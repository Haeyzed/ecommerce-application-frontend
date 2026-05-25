"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormValues } from "@/lib/validation/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { centralAuthService } from "@/lib/api/central/auth"
import { ApiError } from "@/lib/api/errors"
import { useCentralAuth } from "@/components/providers/central-auth-provider"
import type { User } from "@/lib/types/models/auth"

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
          : "border-green-500/30 bg-green-500/10 text-green-500"
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

// Password Input with Toggle
function PasswordInput({
  id,
  error,
  disabled,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        id={id}
        disabled={disabled}
        className={cn(
          "h-12 rounded-xl border-border/50 bg-background/50 pr-12 text-base transition-all",
          "placeholder:text-muted-foreground/60",
          "focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none"
        tabIndex={-1}
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

export function CentralLoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginWithToken } = useCentralAuth()
  const [globalError, setGlobalError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember: false,
    },
  })

  useEffect(() => {
    if (searchParams?.get("error") === "auth_failed") {
      setGlobalError("Authentication failed. Please try again.")
    }
  }, [searchParams])

  const onSubmit = async (data: LoginFormValues) => {
    setGlobalError(null)
    try {
      const response = await centralAuthService.login(data)
      const { user, token } = response.data as unknown as { user: User; token: string }
      loginWithToken(token, user)
      router.push("/central/dashboard")
      router.refresh()
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422 && error.errors) {
          Object.entries(error.errors).forEach(([key, messages]) => {
            setError(key as keyof LoginFormValues, {
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
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      {/* Error Alert */}
      {globalError && (
        <div className="mb-6 animate-in">
          <FormAlert message={globalError} variant="error" />
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label 
            htmlFor="email" 
            className="text-sm font-medium text-foreground"
          >
            Email address
          </Label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="name@company.com"
            autoComplete="email"
            disabled={isFormDisabled}
            className={cn(
              "h-12 rounded-xl border-border/50 bg-background/50 text-base transition-all",
              "placeholder:text-muted-foreground/60",
              "focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              errors.email && "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
            )}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label 
              htmlFor="password" 
              className="text-sm font-medium text-foreground"
            >
              Password
            </Label>
            <Link
              href="/central/forgot-password"
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
              tabIndex={-1}
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            {...register("password")}
            id="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isFormDisabled}
            error={errors.password?.message}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-3">
          <Checkbox
            id="remember"
            {...register("remember")}
            disabled={isFormDisabled}
            className="size-4 rounded border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label
            htmlFor="remember"
            className="text-sm font-normal text-muted-foreground cursor-pointer"
          >
            Keep me signed in
          </Label>
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
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </Button>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-4 text-muted-foreground">
            New to Central?
          </span>
        </div>
      </div>

      {/* Register Link */}
      <Link
        href="/central/register"
        className={cn(
          "flex h-12 items-center justify-center rounded-xl border border-border/50 text-base font-medium",
          "text-foreground transition-all duration-300",
          "hover:border-border hover:bg-accent/50"
        )}
      >
        Create an account
      </Link>
    </form>
  )
}
