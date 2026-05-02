import { createTenantApi } from "./client"
import type { ApiResponse } from "@/lib/types/api"
import type { TenantSettings } from "@/lib/types/models/tenant"

export function createTenantSettingsService(subdomain: string) {
  const api = createTenantApi(subdomain)

  return {
    async getSettings() {
      return api.get<ApiResponse<TenantSettings>>("/settings")
    },
  }
}
