import { api } from "../client"
import type {
  LoginFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
} from "@/lib/validation/auth"
import type { ApiResponse } from "@/lib/types/api"
import type { User } from "@/lib/types/models/auth"

const PREFIX = "/central"

export const centralAuthService = {
  async getMe() {
    return api.get<ApiResponse<User>>(`${PREFIX}/me`)
  },

  async login(data: LoginFormValues) {
    return api.post<ApiResponse<{ user: User; token: string }>>(`${PREFIX}/login`, data)
  },

  async register(data: RegisterFormValues) {
    return api.post<ApiResponse<{ user: User; token: string }>>(`${PREFIX}/register`, data)
  },

  async forgotPassword(data: ForgotPasswordFormValues) {
    return api.post<ApiResponse<{ status: string }>>(`${PREFIX}/forgot-password`, data)
  },

  async resetPassword(data: ResetPasswordFormValues) {
    return api.post<ApiResponse<{ status: string }>>(`${PREFIX}/reset-password`, data)
  },

  async logout() {
    return api.post(`${PREFIX}/logout`)
  },

  async resendVerification() {
    return api.post<ApiResponse<{ status: string }>>(`${PREFIX}/email/verification-notification`)
  },

  async getSocialRedirect(provider: "google" | "facebook" | "github") {
    return api.get<ApiResponse<{ url: string }>>(`${PREFIX}/auth/${provider}/redirect`)
  },
}
