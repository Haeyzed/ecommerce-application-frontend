import { ApiError } from "./errors"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

/**
 * Token storage helpers.
 * Tokens are stored in localStorage keyed by auth context (central / tenant).
 */
const TOKEN_KEYS = {
  central: "central_auth_token",
  tenant: "tenant_auth_token",
} as const

export type AuthContext = keyof typeof TOKEN_KEYS

export function getToken(context: AuthContext = "central"): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEYS[context])
}

export function setToken(token: string, context: AuthContext = "central"): void {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEYS[context], token)
}

export function removeToken(context: AuthContext = "central"): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEYS[context])
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string>
  /** Which auth context to use for the Bearer token. Defaults to "central". */
  authContext?: AuthContext
}

async function fetchClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, authContext = "central", ...customOptions } = options

  let url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`

  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  const method = (customOptions.method || "GET").toUpperCase()

  const requestHeaders: HeadersInit = {
    Accept: "application/json",
    ...headers,
  }

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    Object.assign(requestHeaders, { "Content-Type": "application/json" })
  }

  // Inject Bearer token when available
  const token = getToken(authContext)
  if (token) {
    Object.assign(requestHeaders, { Authorization: `Bearer ${token}` })
  }

  const config: RequestInit = {
    ...customOptions,
    headers: requestHeaders,
  }

  const response = await fetch(url, config)

  if (response.status === 204) {
    return {} as T
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message || "An unexpected error occurred",
      data.errors,
    )
  }

  return data as T
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    fetchClient<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    fetchClient<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    fetchClient<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchClient<T>(endpoint, { ...options, method: "DELETE" }),
}
