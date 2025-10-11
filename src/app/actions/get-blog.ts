import type { BlogDetail } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID

export async function getBlog(slug: string): Promise<BlogDetail | null> {
  try {
    if (!API_URL) throw new Error("API_URL is not defined")
    if (!STORE_ID) throw new Error("STORE_ID is not defined")

    // First, get all blogs to find the one with the matching slug
    const res = await fetch(`${API_URL}/blog`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch blogs: ${res.status}`)
    }

    const blogs = await res.json()

    // Find the blog with the matching slug
    const blog = blogs.find((blog: any) => blog.content?.metadata?.slug === slug || blog.slug === slug)

    if (!blog) {
      return null
    }

    // Now fetch the specific blog by ID to get full details
    const blogRes = await fetch(`${API_URL}/blog/${blog.id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!blogRes.ok) {
      throw new Error(`Failed to fetch blog details: ${blogRes.status}`)
    }

    const blogDetail = await blogRes.json()
    return blogDetail
  } catch (error) {
    return null
  }
}