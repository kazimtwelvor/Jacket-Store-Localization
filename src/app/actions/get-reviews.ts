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

export async function getProductReviews(productId: string): Promise<ReviewData[]> {
  try {
    if (!productId) {
      return []
    }

    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL
    
    if (!baseApiUrl) {
      return []
    }

    const apiUrl = `${baseApiUrl}/reviews?productId=${encodeURIComponent(productId)}`
    
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      return []
    }

    const reviews = await response.json()
    
    return reviews.filter((review: ReviewData) => review.isApproved)
  } catch (error) {
    return []
  }
}