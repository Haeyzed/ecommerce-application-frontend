"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema, ResetPasswordFormValues } from "@/lib/validation/auth"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import React, { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useTenantAuth } from "@/components/providers/tenant-auth-provider"
import { createCustomerAuthService, createAdminAuthService } from "@/lib/api/tenant/auth"
import { ApiError } from "@/lib/api/errors"
import { Spinner } from "@/components/ui/spinner"
import { TenantMetadata } from "@/components/tenant/tenant-metadata"
import { Alert01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface TenantResetPasswordFormProps {
  userType: "customer" | "admin" // Changed from role to userType
}

export function TenantResetPasswordForm({ userType }: TenantResetPasswordFormProps) { // Changed from role to userType
  const router = useRouter()
  const searchParams = useSearchParams()
  const { subdomain, settings } = useTenantAuth()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
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

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setGlobalError(null)
    try {
      const service =
        userType === "customer" // Changed from role to userType
          ? createCustomerAuthService(subdomain)
          : createAdminAuthService(subdomain)
      await service.resetPassword(data)
      setIsSuccess(true)
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

  const loginPath = userType === "customer" ? "/customer/login" : "/admin/login" // Changed from role to userType
  const roleLabel = userType === "customer" ? "Customer" : "Admin" // Changed from role to userType

  if (isSuccess) {
    return (
      <>
        <TenantMetadata pageTitle="Password Reset" />
        <div className="flex min-h-svh items-center justify-center p-6">
          <div className="w-full max-w-xs text-center">
            <h1 className="text-2xl font-bold">Password Reset!</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your password has been successfully reset.
            </p>
            <Link
              href={loginPath}
              className="mt-4 inline-block text-sm underline underline-offset-4"
            >
              Back to login
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <TenantMetadata pageTitle="Reset Password" />
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-xs">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FieldGroup>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">{settings?.name ?? "Store"}</h1>
                <p className="text-sm text-muted-foreground">
                  {roleLabel} — Set your new password
                </p>
              </div>
              {globalError && (
                <Alert variant="destructive">
                  <HugeiconsIcon icon={Alert01Icon} className="size-4" />
                  <AlertDescription>{globalError}</AlertDescription>
                </Alert>
              )}
              <input type="hidden" {...register("reset_token")} />
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input {...register("email")} id="email" type="email" disabled />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <PasswordInput
                  {...register("password")}
                  id="password"
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password_confirmation">Confirm Password</FieldLabel>
                <PasswordInput
                  {...register("password_confirmation")}
                  id="password_confirmation"
                  disabled={isSubmitting}
                />
                {errors.password_confirmation && (
                  <p className="text-xs text-destructive">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner className="size-4" /> Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </Field>
              <div className="text-center text-sm">
                <Link href={loginPath} className="underline underline-offset-4">
                  Back to login
                </Link>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
    </>
  )
}
