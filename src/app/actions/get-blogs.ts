import type { BlogDetail } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID

export async function getBlogs(): Promise<BlogDetail[]> {
  try {
    if (!API_URL) throw new Error("API_URL is not defined")
    if (!STORE_ID) throw new Error("STORE_ID is not defined")

    const res = await fetch(`${API_URL}/blog`, {
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
    console.error("Error fetching blogs:", error)
    return []
  }
}