"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, RegisterFormValues } from "@/lib/validation/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTenantAuth, type TenantUserType } from "@/components/providers/tenant-auth-provider" // Changed import
import { createCustomerAuthService, createAdminAuthService } from "@/lib/api/tenant/auth"
import { ApiError } from "@/lib/api/errors"
import { Spinner } from "@/components/ui/spinner"
import { Alert01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface TenantRegisterFormProps extends React.ComponentProps<"form"> {
  userType: TenantUserType // Changed from role to userType
}

export function TenantRegisterForm({
  userType, // Changed from role to userType
  className,
  ...props
}: TenantRegisterFormProps) {
  const router = useRouter()
  const { subdomain, loginWithToken, settings } = useTenantAuth()
  const [globalError, setGlobalError] = useState<string | null>(null)

  const authService =
    userType === "customer" // Changed from role to userType
      ? createCustomerAuthService(subdomain)
      : createAdminAuthService(subdomain)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setGlobalError(null)
    try {
      const response = await authService.register(data)
      const { user, token } = response.data
      loginWithToken(token, user)
      router.push(userType === "admin" ? "/admin/dashboard" : "/customer/dashboard") // Changed from role to userType
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

  const appName = settings?.name ?? "Store"
  const roleLabel = userType === "admin" ? "Admin" : "Customer" // Changed from role to userType
  const loginPath = userType === "admin" ? "/admin/login" : "/customer/login" // Changed from role to userType

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
            Create an {roleLabel.toLowerCase()} account
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
          <Input {...register("name")} id="name" placeholder="John Doe" disabled={isSubmitting} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input {...register("email")} id="email" type="email" placeholder="you@example.com" disabled={isSubmitting} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput {...register("password")} id="password" disabled={isSubmitting} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </Field>

        <Field>
          <FieldLabel htmlFor="password_confirmation">Confirm Password</FieldLabel>
          <PasswordInput {...register("password_confirmation")} id="password_confirmation" disabled={isSubmitting} />
          {errors.password_confirmation && <p className="text-xs text-destructive">{errors.password_confirmation.message}</p>}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner className="size-4" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link href={loginPath} className="underline underline-offset-4">
              Login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
