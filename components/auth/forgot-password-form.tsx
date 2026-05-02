"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "@/lib/validation/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import React, { useState } from "react"
import { authService } from "@/lib/api/auth"
import { ApiError } from "@/lib/api/errors"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert01Icon } from "@hugeicons/core-free-icons"

export function ForgotPasswordForm({
                                     className,
                                     ...props
                                   }: React.ComponentProps<"form">) {
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

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

    try {
      await authService.forgotPassword(data)
      setIsSuccess(true)
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

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6 text-center", className)}>
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-sm text-balance text-muted-foreground">
          If an account exists with that email, we have sent password reset instructions.
        </p>
        <Link href="/login" className="text-sm underline underline-offset-4 mt-4">
          Return to login
        </Link>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Forgot Password?</h1>
          <p className="text-sm text-balance text-muted-foreground">
            No worries, we&#39;ll send you reset instructions.
          </p>
        </div>

        {globalError && (
          <Alert variant="destructive">
            <HugeiconsIcon icon={Alert01Icon} className="size-4" />
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="m@example.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </Field>
        <Field>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner className="size-4" />
                Sending link...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </Field>
        <FieldDescription className="text-center">
          <Link href="/login" className="underline underline-offset-4">
            Back to login
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}