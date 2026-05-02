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
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTenantAuth, type TenantRole } from "@/components/providers/tenant-auth-provider"
import { createCustomerAuthService, createStaffAuthService } from "@/lib/api/tenant/auth"
import { ApiError } from "@/lib/api/errors"
import { Spinner } from "@/components/ui/spinner"
import { Alert01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface TenantLoginFormProps extends React.ComponentProps<"form"> {
  role: TenantRole
}

export function TenantLoginForm({
  role,
  className,
  ...props
}: TenantLoginFormProps) {
  const router = useRouter()
  const { subdomain, loginWithToken, settings } = useTenantAuth()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | "github" | null>(null)

  const authService =
    role === "customer"
      ? createCustomerAuthService(subdomain)
      : createStaffAuthService(subdomain)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setGlobalError(null)
    try {
      const response = await authService.login(data)
      const { user, token } = response.data
      loginWithToken(token, user)
      router.push(role === "staff" ? "/staff/dashboard" : "/customer/dashboard")
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
    if (role !== "customer") return
    try {
      setSocialLoading(provider)
      setGlobalError(null)
      const customerService = createCustomerAuthService(subdomain)
      const response = await customerService.getSocialRedirect(provider)
      window.location.href = response.data.url
    } catch {
      setGlobalError(`Failed to initialize ${provider} login.`)
      setSocialLoading(null)
    }
  }

  const isFormDisabled = isSubmitting || socialLoading !== null
  const appName = settings?.name ?? "Store"
  const roleLabel = role === "staff" ? "Staff" : "Customer"
  const registerPath = role === "staff" ? "/staff/register" : "/customer/register"
  const forgotPath = role === "staff" ? "/staff/forgot-password" : "/customer/forgot-password"

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{appName}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {roleLabel} login
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
            placeholder="you@example.com"
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
              href={forgotPath}
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

        {role === "customer" && (
          <>
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
          </>
        )}

        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href={registerPath} className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
