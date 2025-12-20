// Base API client with error handling

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

function buildUrl(baseUrl: string, params?: Record<string, string | number | boolean>): string {
  if (!params) return baseUrl

  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, String(value))
  }

  return `${baseUrl}?${searchParams.toString()}`
}

export async function fetcher<T>(url: string, options?: FetchOptions): Promise<T> {
  const { params, ...fetchOptions } = options || {}
  const fullUrl = buildUrl(url, params)

  const res = await fetch(fullUrl, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions?.headers,
    },
  })

  if (!res.ok) {
    const errorBody = await res.text()
    throw new ApiError(
      errorBody || res.statusText,
      res.status
    )
  }

  return res.json()
}

export async function post<T>(url: string, body: unknown, options?: FetchOptions): Promise<T> {
  return fetcher<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function get<T>(url: string, options?: FetchOptions): Promise<T> {
  return fetcher<T>(url, {
    ...options,
    method: 'GET',
  })
}
