import { api } from "../client"
import type { ApiResponse } from "@/lib/types/api"
import type { CentralSettings } from "@/lib/types/models/central"

export function createCentralSettingsService() {
  return {
    async getSettings() {
      return api.get<ApiResponse<CentralSettings>>("/central/settings")
    },

    async getPublicSettings() {
      return api.get<ApiResponse<CentralSettings>>("/central/settings/public")
    },

    async updateSettings(data: Partial<CentralSettings>) {
      return api.patch<ApiResponse<CentralSettings>>("/central/settings", data)
    },

    async toggleMaintenance(enabled: boolean) {
      return api.post<ApiResponse<{ maintenance_mode: boolean }>>("/central/settings/toggle-maintenance", {
        enabled,
      })
    },
  }
}
