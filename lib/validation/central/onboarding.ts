import { z } from "zod"

const RESERVED_SUBDOMAINS = [
  "www", "api", "admin", "app", "mail", "ftp",
  "support", "docs", "help", "status", "dashboard", "localhost",
]

export const onboardTenantSchema = z.object({
  // Step 1 — Store Info
  name: z.string().min(1, "Store name is required").max(255),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(63)
    .regex(
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
      "Only lowercase letters, numbers, and hyphens allowed",
    )
    .refine((val) => !RESERVED_SUBDOMAINS.includes(val), {
      message: "This subdomain is reserved",
    }),
  tagline: z.string().max(255).optional().or(z.literal("")),

  // Step 2 — Owner
  owner_name: z.string().max(255).optional().or(z.literal("")),
  owner_email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  owner_password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),

  // Step 3 — Plan & Settings
  plan_id: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  trial_days: z.coerce.number().int().min(1).max(90).optional().or(z.literal("").transform(() => undefined)),
  currency: z.string().length(3, "Currency must be a 3-letter code").optional().or(z.literal("")),
  timezone: z.string().optional().or(z.literal("")),
  language: z.string().length(2, "Language must be a 2-letter code").optional().or(z.literal("")),

  // Step 4 — Storage Provider
  storage_provider: z.enum(["public", "s3", "digitalocean"]).optional(),
  storage_settings: z
    .object({
      public: z.object({ enabled: z.boolean().optional() }).optional(),
      s3: z
        .object({
          enabled: z.boolean().optional(),
          key: z.string().optional().or(z.literal("")),
          secret: z.string().optional().or(z.literal("")),
          region: z.string().optional().or(z.literal("")),
          bucket: z.string().optional().or(z.literal("")),
          url: z.string().optional().or(z.literal("")).nullable(),
          endpoint: z.string().optional().or(z.literal("")).nullable(),
          use_path_style_endpoint: z.boolean().optional(),
        })
        .optional(),
      digitalocean: z
        .object({
          enabled: z.boolean().optional(),
          key: z.string().optional().or(z.literal("")),
          secret: z.string().optional().or(z.literal("")),
          region: z.string().optional().or(z.literal("")),
          bucket: z.string().optional().or(z.literal("")),
          url: z.string().optional().or(z.literal("")).nullable(),
          endpoint: z.string().optional().or(z.literal("")).nullable(),
          use_path_style_endpoint: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),

  // Step 5 — Payment Providers
  payment_providers: z
    .record(
      z.string(),
      z.object({
        enabled: z.boolean().optional(),
        test_mode: z.boolean().optional(),
        test: z.record(z.string(), z.unknown()).optional(),
        live: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .optional(),
})

export type OnboardTenantFormValues = z.infer<typeof onboardTenantSchema>
