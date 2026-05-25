"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterFormValues } from "@/lib/validation/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
function FormAlert({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      <svg className="mt-0.5 size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      <span>{message}</span>
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
 * Central Register Form Component
 * Mercato-style design matching the reference images
 */
export function CentralRegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    if (!agreedToTerms) {
      setGlobalError("Please agree to the Terms and Privacy Policy")
      return
    }
    setGlobalError(null)
    try {
      await centralAuthService.register(data)
      router.push(`/central/verify-email?email=${encodeURIComponent(data.email)}`)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422 && error.errors) {
          Object.entries(error.errors).forEach(([key, messages]) => {
            setError(key as keyof RegisterFormValues, {
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
          Join your team
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          You&apos;ll need an invite from your organization admin.
        </p>
      </div>

      {/* Error Alert */}
      {globalError && (
        <div className="mb-6">
          <FormAlert message={globalError} />
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Name Fields Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="first_name" className="text-sm font-medium text-foreground">
              First name
            </label>
            <Input
              {...register("name")}
              id="first_name"
              type="text"
              placeholder="John"
              autoComplete="given-name"
              disabled={isSubmitting}
              className={cn(inputClassName, errors.name && "border-destructive")}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="last_name" className="text-sm font-medium text-foreground">
              Last name
            </label>
            <Input
              id="last_name"
              type="text"
              placeholder="Doe"
              autoComplete="family-name"
              disabled={isSubmitting}
              className={inputClassName}
            />
          </div>
        </div>
        {errors.name && (
          <p className="-mt-3 text-sm text-destructive">{errors.name.message}</p>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Work email
          </label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            disabled={isSubmitting}
            className={cn(inputClassName, errors.email && "border-destructive")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Invite code
          </label>
          <Input
            {...register("phone")}
            id="phone"
            type="text"
            placeholder="STAFF-XXXX-XXXX"
            disabled={isSubmitting}
            className={cn(inputClassName, errors.phone && "border-destructive")}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
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
            Confirm password
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

        {/* Terms Agreement */}
        <div className="flex items-center gap-2.5">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            disabled={isSubmitting}
            className="size-[18px] rounded-full border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer select-none">
            I agree to the{" "}
            <Link href="#" className="text-primary hover:underline">Terms</Link>
            {" "}and{" "}
            <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
          </label>
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
            Creating account...
          </span>
        ) : (
          "Create account"
        )}
      </Button>

      {/* Login Link */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have one?{" "}
        <Link href="/central/login" className="font-medium text-primary hover:text-primary/80">
          Sign in
        </Link>
      </p>
    </form>
  )
}
