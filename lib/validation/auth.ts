import { z } from "zod"

/**
 * Shared Password requirements
 * Modern enterprise standards usually require 8+ characters
 */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(50, "Password is too long")

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional().nullable(),
    password: passwordSchema,
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  })

export const verifyOtpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  otp: z.string().min(6, "OTP must be 6 digits").max(6),
  type: z.enum(["email_verification", "password_reset"]),
})

export const resendOtpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email"),
    reset_token: z.string().optional().nullable(),
    otp: z.string().optional().nullable(),
    password: passwordSchema,
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  })

// Types for your forms
export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>
export type ResendOtpFormValues = z.infer<typeof resendOtpSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
