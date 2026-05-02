"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, ForgotPasswordFormValues } from "lib/validation/auth"
import { Button } from "components/ui/button"
import { Field, FieldGroup, FieldLabel } from "components/ui/field"
import { Input } from "components/ui/input"
import { Alert, AlertDescription } from "components/ui/alert"
import { useState } from "react"
import Link from "next/link"
import { useTenantAuth } from "components/providers/tenant-auth-provider"
import { createStaffAuthService } from "lib/api/tenant/auth"
import { ApiError } from "lib/api/errors"
import { Spinner } from "components/ui/spinner"
import { TenantMetadata } from "components/tenant/tenant-metadata"
import { Alert01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function StaffForgotPasswordPage() {
  const { subdomain, settings } = useTenantAuth()
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
      const service = createStaffAuthService(subdomain)
      await service.forgotPassword(data)
      setSuccessMessage("Password reset link sent! Check your email.")
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422 && error.errors) {
          Object.entries(error.errors).forEach(([key, messages]) => {
            setError(key as keyof ForgotPasswordFormValues, { type: "server", message: messages[0] })
          })
        } else {
          setGlobalError(error.message)
        }
      } else {
        setGlobalError("An unexpected error occurred.")
      }
    }
  }

  return (
    <>
      <TenantMetadata pageTitle="Forgot Password" />
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="w-full max-w-xs">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FieldGroup>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">{settings?.name ?? "Store"}</h1>
                <p className="text-sm text-muted-foreground">Staff password reset</p>
              </div>

              {globalError && (
                <Alert variant="destructive">
                  <HugeiconsIcon icon={Alert01Icon} className="size-4" />
                  <AlertDescription>{globalError}</AlertDescription>
                </Alert>
              )}
              {successMessage && <Alert><AlertDescription>{successMessage}</AlertDescription></Alert>}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input {...register("email")} id="email" type="email" disabled={isSubmitting} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </Field>

              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <><Spinner className="size-4" /> Sending...</> : "Send Reset Link"}
                </Button>
              </Field>

              <div className="text-center text-sm">
                <Link href="/staff/login" className="underline underline-offset-4">Back to login</Link>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
    </>
  )
}
