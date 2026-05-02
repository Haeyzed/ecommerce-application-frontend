"use client"

import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {
  onboardTenantSchema,
  OnboardTenantFormValues,
} from "@/lib/validation/central/onboarding"
import { centralOnboardingService } from "@/lib/api/central/onboarding"
import { centralDropdownService } from "@/lib/api/central/dropdowns"
import { ApiError } from "@/lib/api/errors"
import { Stepper, StepperContent, type StepperStep } from "@/components/ui/stepper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { PasswordInput } from "@/components/ui/password-input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { DropdownOption } from "@/lib/types/models/central"

const STEPS: StepperStep[] = [
  { label: "Store Info", description: "Basic details" },
  { label: "Owner", description: "Owner account" },
  { label: "Plan & Settings", description: "Subscription" },
  { label: "Storage", description: "File storage" },
  { label: "Payment", description: "Payment providers" },
]

export function OnboardingForm() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    setError,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OnboardTenantFormValues>({
    resolver: zodResolver(onboardTenantSchema),
    defaultValues: {
      storage_provider: "public",
      storage_settings: { public: { enabled: true } },
    },
  })

  const { data: plansData } = useQuery({
    queryKey: ["central", "dropdowns", "plans"],
    queryFn: () => centralDropdownService.plans(),
  })

  const plans: DropdownOption[] = plansData?.data ?? []

  const stepFields: (keyof OnboardTenantFormValues)[][] = [
    ["name", "subdomain", "tagline"],
    ["owner_name", "owner_email", "owner_password"],
    ["plan_id", "trial_days", "currency", "timezone", "language"],
    ["storage_provider"],
    [],
  ]

  const handleNext = async () => {
    const fieldsToValidate = stepFields[activeStep]
    const isValid = fieldsToValidate.length === 0 || await trigger(fieldsToValidate)
    if (isValid) {
      setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  const onSubmit = async (data: OnboardTenantFormValues) => {
    setGlobalError(null)
    try {
      await centralOnboardingService.onboard(data)
      setIsSuccess(true)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422 && error.errors) {
          Object.entries(error.errors).forEach(([key, messages]) => {
            setError(key as keyof OnboardTenantFormValues, {
              type: "server",
              message: messages[0],
            })
          })
          // Jump to the step with the first error
          const errorKey = Object.keys(error.errors)[0] as keyof OnboardTenantFormValues
          const stepIndex = stepFields.findIndex((fields) =>
              fields.includes(errorKey),
          )
          if (stepIndex >= 0) setActiveStep(stepIndex)
        } else {
          setGlobalError(error.message)
        }
      } else {
        setGlobalError("An unexpected error occurred. Please try again.")
      }
    }
  }

  if (isSuccess) {
    return (
        <Card className="mx-auto max-w-lg">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-16 text-green-500" />
            <h2 className="text-2xl font-bold">Tenant Onboarded!</h2>
            <p className="text-center text-muted-foreground">
              The tenant has been successfully created and configured.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setIsSuccess(false); setActiveStep(0) }}>
                Onboard Another
              </Button>
              <Button onClick={() => router.push("/central/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
    )
  }

  const storageProvider = watch("storage_provider")

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stepper steps={STEPS} activeStep={activeStep} onStepChange={setActiveStep}>
          {globalError && (
              <Alert variant="destructive">
                <HugeiconsIcon icon={Alert01Icon} className="size-4" />
                <AlertDescription>{globalError}</AlertDescription>
              </Alert>
          )}

          {/* Step 1: Store Info */}
          <StepperContent step={0}>
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup className="space-y-4">
                  <Field>
                    <FieldLabel htmlFor="name">Store Name *</FieldLabel>
                    <Input {...register("name")} id="name" placeholder="My Awesome Store" />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="subdomain">Subdomain *</FieldLabel>
                    <Input {...register("subdomain")} id="subdomain" placeholder="my-awesome-store" />
                    <p className="text-xs text-muted-foreground">
                      Your store will be accessible at: <strong>{watch("subdomain") || "subdomain"}.ecommerce-application-backend.test</strong>
                    </p>
                    {errors.subdomain && <p className="text-xs text-destructive">{errors.subdomain.message}</p>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="tagline">Tagline</FieldLabel>
                    <Input {...register("tagline")} id="tagline" placeholder="Your trusted online store" />
                    {errors.tagline && <p className="text-xs text-destructive">{errors.tagline.message}</p>}
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>
          </StepperContent>

          {/* Step 2: Owner */}
          <StepperContent step={1}>
            <Card>
              <CardHeader>
                <CardTitle>Owner Account</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup className="space-y-4">
                  <Field>
                    <FieldLabel htmlFor="owner_name">Owner Name</FieldLabel>
                    <Input {...register("owner_name")} id="owner_name" placeholder="Jane Doe" />
                    {errors.owner_name && <p className="text-xs text-destructive">{errors.owner_name.message}</p>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="owner_email">Owner Email</FieldLabel>
                    <Input {...register("owner_email")} id="owner_email" type="email" placeholder="jane@example.com" />
                    {errors.owner_email && <p className="text-xs text-destructive">{errors.owner_email.message}</p>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="owner_password">Owner Password</FieldLabel>
                    <PasswordInput {...register("owner_password")} id="owner_password" />
                    {errors.owner_password && <p className="text-xs text-destructive">{errors.owner_password.message}</p>}
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>
          </StepperContent>

          {/* Step 3: Plan & Settings */}
          <StepperContent step={2}>
            <Card>
              <CardHeader>
                <CardTitle>Plan & Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup className="space-y-4">
                  <Field>
                    <FieldLabel>Subscription Plan</FieldLabel>
                    <Controller
                        control={control}
                        name="plan_id"
                        render={({ field }) => (
                            <Select
                                value={field.value?.toString() ?? ""}
                                onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a plan" />
                              </SelectTrigger>
                              <SelectContent>
                                {plans.map((plan) => (
                                    <SelectItem key={plan.value} value={plan.value.toString()}>
                                      {plan.label}
                                    </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.plan_id && <p className="text-xs text-destructive">{errors.plan_id.message}</p>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="trial_days">Trial Days</FieldLabel>
                    <Input {...register("trial_days")} id="trial_days" type="number" placeholder="14" />
                    {errors.trial_days && <p className="text-xs text-destructive">{errors.trial_days.message}</p>}
                  </Field>
                  <div className="grid grid-cols-3 gap-4">
                    <Field>
                      <FieldLabel htmlFor="currency">Currency</FieldLabel>
                      <Input {...register("currency")} id="currency" placeholder="USD" maxLength={3} />
                      {errors.currency && <p className="text-xs text-destructive">{errors.currency.message}</p>}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                      <Input {...register("timezone")} id="timezone" placeholder="UTC" />
                      {errors.timezone && <p className="text-xs text-destructive">{errors.timezone.message}</p>}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="language">Language</FieldLabel>
                      <Input {...register("language")} id="language" placeholder="en" maxLength={2} />
                      {errors.language && <p className="text-xs text-destructive">{errors.language.message}</p>}
                    </Field>
                  </div>
                </FieldGroup>
              </CardContent>
            </Card>
          </StepperContent>

          {/* Step 4: Storage */}
          <StepperContent step={3}>
            <Card>
              <CardHeader>
                <CardTitle>Storage Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldGroup className="space-y-4">
                  <Field>
                    <FieldLabel>Provider</FieldLabel>
                    <Controller
                        control={control}
                        name="storage_provider"
                        render={({ field }) => (
                            <Select value={field.value ?? "public"} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="public">Public (Local)</SelectItem>
                                <SelectItem value="s3">Amazon S3</SelectItem>
                                <SelectItem value="digitalocean">DigitalOcean Spaces</SelectItem>
                              </SelectContent>
                            </Select>
                        )}
                    />
                  </Field>

                  {(storageProvider === "s3" || storageProvider === "digitalocean") && (
                      <div className="space-y-4 rounded-lg border p-4">
                        <h4 className="text-sm font-medium">
                          {storageProvider === "s3" ? "S3" : "DigitalOcean"} Configuration
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <Field>
                            <FieldLabel>Access Key</FieldLabel>
                            <Input {...register(`storage_settings.${storageProvider}.key`)} placeholder="Access key" />
                          </Field>
                          <Field>
                            <FieldLabel>Secret Key</FieldLabel>
                            <PasswordInput {...register(`storage_settings.${storageProvider}.secret`)} />
                          </Field>
                          <Field>
                            <FieldLabel>Region</FieldLabel>
                            <Input {...register(`storage_settings.${storageProvider}.region`)} placeholder="us-east-1" />
                          </Field>
                          <Field>
                            <FieldLabel>Bucket</FieldLabel>
                            <Input {...register(`storage_settings.${storageProvider}.bucket`)} placeholder="my-bucket" />
                          </Field>
                        </div>
                        {storageProvider === "digitalocean" && (
                            <Field>
                              <FieldLabel>Endpoint</FieldLabel>
                              <Input {...register("storage_settings.digitalocean.endpoint")} placeholder="https://nyc3.digitaloceanspaces.com" />
                            </Field>
                        )}
                      </div>
                  )}
                </FieldGroup>
              </CardContent>
            </Card>
          </StepperContent>

          {/* Step 5: Payment Providers */}
          <StepperContent step={4}>
            <Card>
              <CardHeader>
                <CardTitle>Payment Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Configure payment providers for this tenant. These can also be configured later from the tenant settings.
                </p>
                <div className="space-y-4">
                  {["stripe", "paystack", "flutterwave", "paypal"].map((provider) => (
                      <div key={provider} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium capitalize">{provider}</Label>
                          <Controller
                              control={control}
                              name={`payment_providers.${provider}.enabled`}
                              render={({ field }) => (
                                  <Switch
                                      checked={field.value ?? false}
                                      onCheckedChange={field.onChange}
                                  />
                              )}
                          />
                        </div>
                        {watch(`payment_providers.${provider}.enabled`) && (
                            <div className="mt-4 space-y-3">
                              <div className="flex items-center gap-2">
                                <Label className="text-xs">Test Mode</Label>
                                <Controller
                                    control={control}
                                    name={`payment_providers.${provider}.test_mode`}
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value ?? true}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Configure API keys in tenant settings after onboarding.
                              </p>
                            </div>
                        )}
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </StepperContent>

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={activeStep === 0}
            >
              Back
            </Button>

            {activeStep < STEPS.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
            ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                      <>
                        <Spinner className="size-4" />
                        Creating Tenant...
                      </>
                  ) : (
                      "Create Tenant"
                  )}
                </Button>
            )}
          </div>
        </Stepper>
      </form>
  )
}