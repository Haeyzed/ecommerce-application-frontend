export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  email_verified_at: string | null;
  roles: string[] | null;
  permissions: string[] | null;
  created_at: string;
}

export interface LoginData {
  user: User;
  token: string;
  token_type: "Bearer";
}

export type AuthResponse = LoginData;

export interface TenantUser {
  id: number;
  name: string;
  email: string;
  user_type: string;
  email_verified_at: string | null;
  created_at: string;
}

export interface CustomerProfile {
  id: number;
  user_id: number;
  phone: string | null;
  address: string | null;
}

export interface AdminProfile {
  id: number;
  user_id: number;
  department: string | null;
  position: string | null;
}
