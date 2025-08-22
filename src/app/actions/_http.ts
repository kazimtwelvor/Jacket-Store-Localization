export const API_BASE_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL

export type FetchJsonInit = RequestInit & {
  timeoutMs?: number
  query?: URLSearchParams | Record<string, unknown>
  next?: { revalidate?: number | 0 }
}

export function toURLSearchParams(
  params?: URLSearchParams | Record<string, unknown>
): URLSearchParams | undefined {
  if (!params) return undefined
  if (params instanceof URLSearchParams) return params

  const usp = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (Array.isArray(value)) {
      if (value.length === 0) return
      usp.append(key, value.join(","))
      return
    }

    usp.append(key, String(value))
  })
  return usp
}

export async function fetchJson<T>(
  path: string,
  init: FetchJsonInit = {}
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined")
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), init.timeoutMs ?? 1000)

  try {
    const query = toURLSearchParams(init.query)
    // Use direct external API calls with proper error handling
    const url = query && query.toString()
      ? `${API_BASE_URL}${path}?${query.toString()}`
      : `${API_BASE_URL}${path}`

    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
      cache: init.cache ?? "force-cache",
      next: init.next ?? { revalidate: 1800 },
      signal: controller.signal,
    } as RequestInit)

    if (!res.ok) {
      const body = await res.text().catch(() => "")
      throw new Error(`HTTP ${res.status}: ${res.statusText} ${body}`)
    }

    // Content-Type guard
    const contentType = res.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      throw new Error(`Expected JSON but received: ${contentType}`)
    }

    return (await res.json()) as T
  } finally {
    clearTimeout(timeout)
  }
}


