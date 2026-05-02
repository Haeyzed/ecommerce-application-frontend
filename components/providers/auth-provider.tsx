"use client"

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { authService } from "@/lib/api/auth"
import type { User } from "@/lib/types/models/auth"
import { ApiError } from "@/lib/api/errors"

export type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const AUTH_ME_QUERY_KEY = ["auth", "me"] as const

async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await authService.getMe()
    const { user } = response.data
    return user
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null
    }
    throw error
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const { data: user, isLoading } = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: fetchCurrentUser,
    staleTime: 60_000,
    retry: 1,
  })

  const setUser = (nextUser: User | null) => {
    queryClient.setQueryData(AUTH_ME_QUERY_KEY, nextUser)
  }

  const refreshUser = async () => {
    await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY })
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isLoading,
      isAuthenticated: (user ?? null) !== null,
      setUser,
      refreshUser,
    }),
    [user, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}
