import { api } from "./client"
import type {
  LoginFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
} from "@/lib/validation/auth"
import type { ApiResponse } from "@/lib/types/api"
import type { User } from "@/lib/types/models/auth"

/**
 * Legacy auth service — kept for backward compatibility with existing pages.
 * New code should use centralAuthService or tenant auth services instead.
 */
export const authService = {
  async getMe() {
    return api.get<ApiResponse<{ user: User }>>("/me")
  },

  async login(data: LoginFormValues) {
    return api.post<ApiResponse<{ user: User; token?: string }>>("/login", data)
  },

  async register(data: RegisterFormValues) {
    return api.post<ApiResponse<{ user: User; token?: string }>>("/register", data)
  },

  async forgotPassword(data: ForgotPasswordFormValues) {
    return api.post<ApiResponse<{ status: string }>>("/forgot-password", data)
  },

  async resetPassword(data: ResetPasswordFormValues) {
    return api.post<ApiResponse<{ status: string }>>("/reset-password", data)
  },

  async logout() {
    await api.post("/logout")
  },

  async resendVerification() {
    return api.post<ApiResponse<{ status: string }>>("/email/verification-notification")
  },

  async verifyEmail(verifyUrl: string) {
    return api.get<ApiResponse<{ status: string }>>(verifyUrl)
  },

  async getSocialRedirect(provider: "google" | "facebook" | "github") {
    return api.get<ApiResponse<{ url: string }>>(`/auth/${provider}/redirect`)
  },
}
