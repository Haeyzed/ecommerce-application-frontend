export interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  billing_cycle: string;
  trial_days: number;
  features: Record<string, unknown> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  owner_name: string | null;
  owner_email: string | null;
  plan_id: number | null;
  created_at: string;
  updated_at: string;
  domains?: Domain[];
  plan?: Plan | null;
}

export interface Domain {
  id: number;
  domain: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  tenant_id: string;
  plan_id: number;
  status: string;
  trial_ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  tenant?: Tenant;
  plan?: Plan;
}

export interface Invoice {
  id: number;
  tenant_id: string;
  subscription_id: number;
  number: string;
  amount: number;
  currency: string;
  status: string;
  issued_at: string;
  created_at: string;
  updated_at: string;
}

export interface DropdownOption {
  value: string | number;
  label: string;
}

export interface PaymentProvider {
  name: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface CentralSettings {
  id?: number;
  name: string;
  description?: string;
  favicon_url: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  email_from?: string;
  email_from_name?: string;
  phone?: string;
  address?: string;
  website_url?: string;
  payment_providers?: PaymentProvider[];
  social_links?: SocialLink[];
  maintenance_mode?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}
