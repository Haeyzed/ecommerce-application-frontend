"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginFormValues } from "@/lib/validation/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { centralAuthService } from "@/lib/api/central/auth"
import { ApiError } from "@/lib/api/errors"
import { useCentralAuth } from "@/components/providers/central-auth-provider"
import { Spinner } from "@/components/ui/spinner"
import { Alert01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { setToken } from "@/lib/api/client"

export function CentralLoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginWithToken } = useCentralAuth()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | "github" | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (searchParams?.get("error") === "social_auth_failed") {
      setGlobalError("Social authentication failed. Please try again.")
    }
    const accessToken = window.location.hash.match(/access_token=([^&]+)/)?.[1]
    if (accessToken) {
      setToken(decodeURIComponent(accessToken), "central")
      window.location.hash = ""
      router.push("/central/dashboard")
    }
  }, [searchParams, router])

  const onSubmit = async (data: LoginFormValues) => {
    setGlobalError(null)
    try {
      const response = await centralAuthService.login(data)
      const { user, token } = response.data
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

  const handleSocialLogin = async (provider: "google" | "facebook" | "github") => {
    try {
      setSocialLoading(provider)
      setGlobalError(null)
      const response = await centralAuthService.getSocialRedirect(provider)
      window.location.href = response.data.url
    } catch {
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
          <h1 className="text-2xl font-bold">Central Admin Login</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to access the admin dashboard
          </p>
        </div>

        {globalError && (
          <Alert variant="destructive">
            <HugeiconsIcon icon={Alert01Icon} className="size-4" />
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="admin@example.com"
            disabled={isFormDisabled}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/central/forgot-password"
              className="ms-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <PasswordInput
            {...register("password")}
            id="password"
            disabled={isFormDisabled}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isFormDisabled}>
            {isSubmitting ? (
              <>
                <Spinner className="size-4" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" type="button" disabled={isFormDisabled} onClick={() => handleSocialLogin("google")}>
            {socialLoading === "google" ? <Spinner className="size-4" /> : "Google"}
          </Button>
          <Button variant="outline" type="button" disabled={isFormDisabled} onClick={() => handleSocialLogin("github")}>
            {socialLoading === "github" ? <Spinner className="size-4" /> : "GitHub"}
          </Button>
          <Button variant="outline" type="button" disabled={isFormDisabled} onClick={() => handleSocialLogin("facebook")}>
            {socialLoading === "facebook" ? <Spinner className="size-4" /> : "Facebook"}
          </Button>
        </div>

        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/central/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
