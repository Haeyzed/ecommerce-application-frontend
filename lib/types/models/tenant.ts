export interface TenantSettings {
  id: number
  name: string
  tagline: string | null
  currency: string
  timezone: string
  language: string
  primary_color: string | null
  social: Record<string, string> | null
  payment_providers: Record<string, unknown> | null
  contact_email: string | null
  contact_phone: string | null
  address: string | null
  logo_url: string | null
  favicon_url: string | null
}
