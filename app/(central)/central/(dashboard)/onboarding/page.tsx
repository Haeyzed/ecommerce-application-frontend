"use client"

import { OnboardingForm } from "@/components/central/onboarding/onboarding-form"

export default function CentralOnboardingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tenant Onboarding</h1>
        <p className="text-muted-foreground">
          Create and configure a new tenant step by step.
        </p>
      </div>
      <OnboardingForm />
    </div>
  )
}
