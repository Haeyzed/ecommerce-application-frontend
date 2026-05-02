"use client"

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createCustomerAuthService, createStaffAuthService } from "@/lib/api/tenant/auth"
import { createTenantSettingsService } from "@/lib/api/tenant/settings"
import { getToken, setToken, removeToken } from "@/lib/api/client"
import type { TenantUser } from "@/lib/types/models/auth"
import type { TenantSettings } from "@/lib/types/models/tenant"
import { ApiError } from "@/lib/api/errors"

export type TenantRole = "customer" | "staff"

export type TenantAuthContextValue = {
  user: TenantUser | null
  role: TenantRole
  subdomain: string
  settings: TenantSettings | null
  isLoading: boolean
  isAuthenticated: boolean
  loginWithToken: (token: string, user: TenantUser) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const TenantAuthContext = createContext<TenantAuthContextValue | null>(null)

function tenantMeKey(subdomain: string, role: TenantRole) {
  return ["tenant", subdomain, role, "me"] as const
}

function tenantSettingsKey(subdomain: string) {
  return ["tenant", subdomain, "settings"] as const
}

export function TenantAuthProvider({
  children,
  subdomain,
  role,
}: {
  children: ReactNode
  subdomain: string
  role: TenantRole
}) {
  const queryClient = useQueryClient()
  const meKey = tenantMeKey(subdomain, role)
  const settingsKey = tenantSettingsKey(subdomain)

  const authService =
    role === "customer"
      ? createCustomerAuthService(subdomain)
      : createStaffAuthService(subdomain)

  const settingsService = createTenantSettingsService(subdomain)

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: meKey,
    queryFn: async (): Promise<TenantUser | null> => {
      const token = getToken("tenant")
      if (!token) return null
      try {
        const response = await authService.getMe()
        return response.data.user
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          removeToken("tenant")
          return null
        }
        throw error
      }
    },
    staleTime: 60_000,
    retry: 1,
  })

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: settingsKey,
    queryFn: async (): Promise<TenantSettings | null> => {
      try {
        const response = await settingsService.getSettings()
        return response.data
      } catch {
        return null
      }
    },
    staleTime: 300_000,
    retry: 1,
  })

  const loginWithToken = useCallback(
    (token: string, nextUser: TenantUser) => {
      setToken(token, "tenant")
      queryClient.setQueryData(meKey, nextUser)
    },
    [queryClient, meKey],
  )

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Ignore errors on logout
    } finally {
      removeToken("tenant")
      queryClient.setQueryData(meKey, null)
    }
  }, [queryClient, meKey, authService])

  const refreshUser = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: meKey })
  }, [queryClient, meKey])

  const value = useMemo<TenantAuthContextValue>(
    () => ({
      user: user ?? null,
      role,
      subdomain,
      settings: settings ?? null,
      isLoading: userLoading || settingsLoading,
      isAuthenticated: (user ?? null) !== null,
      loginWithToken,
      logout,
      refreshUser,
    }),
    [user, role, subdomain, settings, userLoading, settingsLoading, loginWithToken, logout, refreshUser],
  )

  return (
    <TenantAuthContext.Provider value={value}>
      {children}
    </TenantAuthContext.Provider>
  )
}

export function useTenantAuth(): TenantAuthContextValue {
  const ctx = useContext(TenantAuthContext)
  if (!ctx) {
    throw new Error("useTenantAuth must be used within TenantAuthProvider")
  }
  return ctx
}
