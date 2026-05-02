import { ApiError } from "../errors"
import { getToken } from "../client"

/**
 * Build the tenant API base URL from a subdomain.
 * In local dev: http://{subdomain}.ecommerce-application-backend.test/api
 */
export function getTenantApiBaseUrl(subdomain: string): string {
  const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST || "ecommerce-application-backend.test"
  const protocol = process.env.NEXT_PUBLIC_BACKEND_PROTOCOL || "http"
  return `${protocol}://${subdomain}.${backendHost}/api`
}

interface TenantFetchOptions extends RequestInit {
  params?: Record<string, string>
}

export async function tenantFetchClient<T>(
  subdomain: string,
  endpoint: string,
  options: TenantFetchOptions = {},
): Promise<T> {
  const { params, headers, ...customOptions } = options
  const baseUrl = getTenantApiBaseUrl(subdomain)

  let url = `${baseUrl}${endpoint}`

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

  const token = getToken("tenant")
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

export function createTenantApi(subdomain: string) {
  return {
    get: <T>(endpoint: string, options?: TenantFetchOptions) =>
      tenantFetchClient<T>(subdomain, endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, body?: unknown, options?: TenantFetchOptions) =>
      tenantFetchClient<T>(subdomain, endpoint, {
        ...options,
        method: "POST",
        body: JSON.stringify(body),
      }),

    put: <T>(endpoint: string, body?: unknown, options?: TenantFetchOptions) =>
      tenantFetchClient<T>(subdomain, endpoint, {
        ...options,
        method: "PUT",
        body: JSON.stringify(body),
      }),

    patch: <T>(endpoint: string, body?: unknown, options?: TenantFetchOptions) =>
      tenantFetchClient<T>(subdomain, endpoint, {
        ...options,
        method: "PATCH",
        body: JSON.stringify(body),
      }),

    delete: <T>(endpoint: string, options?: TenantFetchOptions) =>
      tenantFetchClient<T>(subdomain, endpoint, { ...options, method: "DELETE" }),
  }
}
