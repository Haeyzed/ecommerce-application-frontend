import { api } from "../client"
import type { ApiResponse } from "@/lib/types/api"
import type { Tenant } from "@/lib/types/models/central"
import type { OnboardTenantFormValues } from "@/lib/validation/central/onboarding"

const PREFIX = "/central"

export const centralOnboardingService = {
  async onboard(data: OnboardTenantFormValues) {
    return api.post<ApiResponse<Tenant>>(`${PREFIX}/onboarding`, data)
  },
}
