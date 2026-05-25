import { api } from "../client"
import type {
  LoginFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
  VerifyOtpFormValues,
  ResendOtpFormValues,
} from "@/lib/validation/auth"
import type { ApiResponse } from "@/lib/types/api"
import type { User, AuthResponse } from "@/lib/types/models/auth"

const PREFIX = "/central"

export const centralAuthService = {
  async getMe() {
    return api.get<ApiResponse<User>>(`${PREFIX}/me`)
  },

  async login(data: LoginFormValues) {
    return api.post<ApiResponse<AuthResponse>>(`${PREFIX}/auth/login`, data)
  },

  async register(data: RegisterFormValues) {
    return api.post<ApiResponse<User>>(`${PREFIX}/auth/register`, data)
  },

  async verifyOtp(data: VerifyOtpFormValues) {
    return api.post<ApiResponse<{ message: string }>>(`${PREFIX}/auth/verify-otp`, data)
  },

  async resendVerificationOtp(data: ResendOtpFormValues) {
    return api.post<ApiResponse<{ message: string }>>(`${PREFIX}/auth/resend-verification-otp`, data)
  },

  async forgotPassword(data: ForgotPasswordFormValues) {
    return api.post<ApiResponse<null>>(`${PREFIX}/auth/forgot-password`, data)
  },

  async resetPassword(data: ResetPasswordFormValues) {
    return api.post<ApiResponse<null>>(`${PREFIX}/auth/reset-password`, data)
  },

  async logout() {
    return api.post(`${PREFIX}/auth/logout`)
  },
}
