"use server"

export interface ReviewData {
  id: string
  storeId: string
  productId: string
  userId: string
  userName: string
  email?: string | null
  rating: number
  title?: string | null
  comment: string
  isApproved: boolean
  photoUrl?: string | null
  createdAt: string | Date
  updatedAt: string | Date
}

/**
 * Get all approved reviews for a specific product from the backend
 */
export async function getProductReviews(productId: string): Promise<ReviewData[]> {
  try {
    if (!productId) {
      return []
    }

    // Use the existing API URL structure from environment
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL
    
    if (!baseApiUrl) {
      console.error("Missing NEXT_PUBLIC_API_URL environment variable")
      return []
    }

    // Fetch reviews from the API
    const apiUrl = `${baseApiUrl}/reviews?productId=${encodeURIComponent(productId)}`
    
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      console.error(`Error fetching reviews: ${response.status} ${response.statusText}`)
      return []
    }

    const reviews = await response.json()
    
    // Filter to only show approved reviews
    return reviews.filter((review: ReviewData) => review.isApproved)
  } catch (error) {
    console.error("Error fetching product reviews:", error)
    return []
  }
}