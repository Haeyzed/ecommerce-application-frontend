"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  registerSchema,
  RegisterFormValues,
} from "@/lib/validation/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authService } from "@/lib/api/auth"
import { ApiError } from "@/lib/api/errors"
import { useAuth } from "@/components/providers/auth-provider"
import { Spinner } from "@/components/ui/spinner"
import { Alert01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function RegisterForm({
                               className,
                               ...props
                             }: React.ComponentProps<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useAuth()

  const [globalError, setGlobalError] = useState<string | null>(null)
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | "github" | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  useEffect(() => {
    if (searchParams?.get("error") === "social_auth_failed") {
      setGlobalError("Social authentication failed. Please try again.")
    }
  }, [searchParams])

  const onSubmit = async (data: RegisterFormValues) => {
    setGlobalError(null)

    try {
      const response = await authService.register(data)
      const { user } = response.data

      if (!user.email_verified_at) {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
      } else {
        router.push("/dashboard")
      }
      router.refresh()
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

  const handleSocialLogin = async (provider: "google" | "facebook" | "github") => {
    try {
      setSocialLoading(provider)
      setGlobalError(null)
      const response = await authService.getSocialRedirect(provider)
      window.location.href = response.data.url
    } catch (error) {
      setGlobalError(`Failed to initialize ${provider} login.`)
      setSocialLoading(null)
    }
  }

  const isFormDisabled = isSubmitting || socialLoading !== null

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Join Acme Inc. to start managing your orders
          </p>
        </div>

        {globalError && (
          <Alert variant="destructive">
            <HugeiconsIcon icon={Alert01Icon} className="size-4" />
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        )}

        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            {...register("name")}
            id="name"
            type="text"
            placeholder="Victor Ugwu"
            disabled={isFormDisabled}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="m@example.com"
            disabled={isFormDisabled}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput
            {...register("password")}
            id="password"
            disabled={isFormDisabled}
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password_confirmation">
            Confirm Password
          </FieldLabel>
          <PasswordInput
            {...register("password_confirmation")}
            id="password_confirmation"
            disabled={isFormDisabled}
          />
          {errors.password_confirmation && (
            <p className="text-xs text-destructive">
              {errors.password_confirmation.message}
            </p>
          )}
        </Field>

        <Field>
          <Button type="submit" className="w-full" disabled={isFormDisabled}>
            {isSubmitting ? (
              <>
                <Spinner className="size-4" />
                Creating account...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            type="button"
            disabled={isFormDisabled}
            onClick={() => handleSocialLogin('google')}
          >
            {socialLoading === 'google' ? <Spinner className="size-4" /> : "Google"}
          </Button>
          <Button
            variant="outline"
            type="button"
            disabled={isFormDisabled}
            onClick={() => handleSocialLogin('github')}
          >
            {socialLoading === 'github' ? <Spinner className="size-4" /> : "GitHub"}
          </Button>
          <Button
            variant="outline"
            type="button"
            disabled={isFormDisabled}
            onClick={() => handleSocialLogin('facebook')}
          >
            {socialLoading === 'facebook' ? <Spinner className="size-4" /> : "Facebook"}
          </Button>
        </div>

        <FieldDescription className="text-center mt-2">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Login
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}