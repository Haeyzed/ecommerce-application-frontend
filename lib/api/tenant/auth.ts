import { createTenantApi } from "./client"
import type { ApiResponse } from "@/lib/types/api"
import type { TenantUser, CustomerProfile, StaffProfile } from "@/lib/types/models/auth"
import type {
  LoginFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
} from "@/lib/validation/auth"

export function createCustomerAuthService(subdomain: string) {
  const api = createTenantApi(subdomain)

  return {
    async login(data: LoginFormValues) {
      return api.post<ApiResponse<{ user: TenantUser; profile: CustomerProfile; token: string }>>(
        "/customer/login",
        data,
      )
    },

    async register(data: RegisterFormValues) {
      return api.post<ApiResponse<{ user: TenantUser; profile: CustomerProfile; token: string }>>(
        "/customer/register",
        data,
      )
    },

    async getMe() {
      return api.get<ApiResponse<{ user: TenantUser }>>("/customer/me")
    },

    async logout() {
      return api.post("/customer/logout")
    },

    async forgotPassword(data: ForgotPasswordFormValues) {
      return api.post<ApiResponse<{ status: string }>>("/customer/forgot-password", data)
    },

    async resetPassword(data: ResetPasswordFormValues) {
      return api.post<ApiResponse<{ status: string }>>("/customer/reset-password", data)
    },

    async resendVerification() {
      return api.post<ApiResponse<{ status: string }>>("/customer/email/verification-notification")
    },

    async getSocialRedirect(provider: "google" | "facebook" | "github") {
      return api.get<ApiResponse<{ url: string }>>(`/customer/auth/${provider}/redirect`)
    },
  }
}

export function createStaffAuthService(subdomain: string) {
  const api = createTenantApi(subdomain)

  return {
    async login(data: LoginFormValues) {
      return api.post<ApiResponse<{ user: TenantUser; profile: StaffProfile; token: string }>>(
        "/staff/login",
        data,
      )
    },

    async register(data: RegisterFormValues) {
      return api.post<ApiResponse<{ user: TenantUser; profile: StaffProfile; token: string }>>(
        "/staff/register",
        data,
      )
    },

    async getMe() {
      return api.get<ApiResponse<{ user: TenantUser }>>("/staff/me")
    },

    async logout() {
      return api.post("/staff/logout")
    },

    async forgotPassword(data: ForgotPasswordFormValues) {
      return api.post<ApiResponse<{ status: string }>>("/staff/forgot-password", data)
    },

    async resetPassword(data: ResetPasswordFormValues) {
      return api.post<ApiResponse<{ status: string }>>("/staff/reset-password", data)
    },

    async resendVerification() {
      return api.post<ApiResponse<{ status: string }>>("/staff/email/verification-notification")
    },
  }
}
