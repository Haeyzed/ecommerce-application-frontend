import { api } from "../client"
import {CentralSettings} from "@/lib/types/models/central";


export function createCentralSettingsService() {
  return {
    async getSettings() {
      return api.get<CentralSettings>("/central/settings")
    },
  }
}
