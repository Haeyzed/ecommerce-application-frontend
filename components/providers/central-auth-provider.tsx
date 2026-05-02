"use client"

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  type ReactNode,
} from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { centralAuthService } from "@/lib/api/central/auth"
import { getToken, setToken, removeToken } from "@/lib/api/client"
import type { User } from "@/lib/types/models/auth"
import { ApiError } from "@/lib/api/errors"

export type CentralAuthContextValue = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  loginWithToken: (token: string, user: User) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const CentralAuthContext = createContext<CentralAuthContextValue | null>(null)

const CENTRAL_ME_KEY = ["central", "auth", "me"] as const

async function fetchCentralUser(): Promise<User | null> {
  const token = getToken("central")
  if (!token) return null

  try {
    const response = await centralAuthService.getMe()
    return response.data
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      removeToken("central")
      return null
    }
    throw error
  }
}

export function CentralAuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: CENTRAL_ME_KEY,
    queryFn: fetchCentralUser,
    staleTime: 60_000,
    retry: 1,
  })

  const setUser = useCallback(
    (nextUser: User | null) => {
      queryClient.setQueryData(CENTRAL_ME_KEY, nextUser)
    },
    [queryClient],
  )

  const loginWithToken = useCallback(
    (token: string, nextUser: User) => {
      setToken(token, "central")
      queryClient.setQueryData(CENTRAL_ME_KEY, nextUser)
    },
    [queryClient],
  )

  const logout = useCallback(async () => {
    try {
      await centralAuthService.logout()
    } catch {
      // Ignore errors on logout
    } finally {
      removeToken("central")
      queryClient.setQueryData(CENTRAL_ME_KEY, null)
    }
  }, [queryClient])

  const refreshUser = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: CENTRAL_ME_KEY })
  }, [queryClient])

  const value = useMemo<CentralAuthContextValue>(
    () => ({
      user: user ?? null,
      isLoading,
      isAuthenticated: (user ?? null) !== null,
      setUser,
      loginWithToken,
      logout,
      refreshUser,
    }),
    [user, isLoading, setUser, loginWithToken, logout, refreshUser],
  )

  return (
    <CentralAuthContext.Provider value={value}>
      {children}
    </CentralAuthContext.Provider>
  )
}

export function useCentralAuth(): CentralAuthContextValue {
  const ctx = useContext(CentralAuthContext)
  if (!ctx) {
    throw new Error("useCentralAuth must be used within CentralAuthProvider")
  }
  return ctx
}
