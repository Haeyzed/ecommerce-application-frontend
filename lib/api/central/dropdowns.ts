import { api } from "../client"
import type { ApiResponse } from "@/lib/types/api"
import type { DropdownOption } from "@/lib/types/models/central"

const PREFIX = "/central"

export const centralDropdownService = {
  async plans() {
    return api.get<ApiResponse<DropdownOption[]>>(`${PREFIX}/plans/dropdown`)
  },

  async tenants() {
    return api.get<ApiResponse<DropdownOption[]>>(`${PREFIX}/tenants/dropdown`)
  },

  async subscriptionStatuses() {
    return api.get<ApiResponse<DropdownOption[]>>(`${PREFIX}/subscriptions/statuses/dropdown`)
  },

  async roles() {
    return api.get<ApiResponse<DropdownOption[]>>(`${PREFIX}/subscriptions/roles/dropdown`)
  },

  async notificationTemplates() {
    return api.get<ApiResponse<DropdownOption[]>>(`${PREFIX}/notification-templates/dropdown`)
  },
}
