import type { BlogDetail } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID

export async function getBlogs(options?: { countryCode?: string }): Promise<BlogDetail[]> {
  try {
    if (!API_URL) throw new Error("API_URL is not defined")
    if (!STORE_ID) throw new Error("STORE_ID is not defined")

    // Build URL with country parameter if provided
    const url = options?.countryCode 
      ? `${API_URL}/blog?cn=${options.countryCode}` 
      : `${API_URL}/blog`

    console.log('[GET_BLOGS] Fetching blogs with country:', options?.countryCode || 'none')

    const res = await fetch(url, {
      next: { revalidate: 3600 }, 
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch blogs: ${res.status}`)
    }

    const blogs = await res.json()
    return blogs || []
  } catch (error) {
    console.error('[GET_BLOGS] Error:', error)
    return []
  }
}