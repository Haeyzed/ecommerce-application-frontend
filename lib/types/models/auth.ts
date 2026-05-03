export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
}

export interface TenantUser {
  id: number
  name: string
  email: string
  user_type: string
  email_verified_at: string | null
  created_at: string
}

export interface CustomerProfile {
  id: number
  user_id: number
  phone: string | null
  address: string | null
}

export interface AdminProfile {
  id: number
  user_id: number
  department: string | null
  position: string | null
}
