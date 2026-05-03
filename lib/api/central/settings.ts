import { apiClient } from "../client"

export type CentralSettings = {
  name: string
  favicon_url: string | null
  // Add other central settings here as needed
}

export function createCentralSettingsService() {
  return {
    async getSettings() {
      return apiClient.get<CentralSettings>("/central/settings")
    },
  }
}
