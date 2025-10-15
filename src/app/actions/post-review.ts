
"use server"

import { revalidatePath } from "next/cache"
import { uploadImage } from "./upload-image"

// Store submitted reviews in memory for development mode
let devSubmittedReviews: ReviewData[] = []

// Define the review data structure based on your schema
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
 * Server action to post a review
 */
export async function postReview(formData: FormData): Promise<{ success: boolean; message?: string }> {
  try {
    // Extract data from the form
    const userName = formData.get("name") as string
    const email = formData.get("email") as string
    const title = formData.get("title") as string
    const comment = formData.get("comment") as string
    const rating = Number.parseInt(formData.get("rating") as string)
    const productId = formData.get("productId") as string
    const storeId = formData.get("storeId") as string
    const photo = formData.get("photo") as File | null


    // Validate required fields
    if (!userName || !comment || !rating || !productId || !storeId) {
      return {
        success: false,
        message: "Missing required fields",
      }
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return {
        success: false,
        message: "Rating must be between 1 and 5",
      }
    }

    let photoUrl = null
    if (photo && photo.size > 0) {
      try {
        photoUrl = await uploadImage(photo)
      } catch (uploadError) {
        photoUrl = null
      }
    }

    const reviewData = {
      productId,
      storeId,
      userName,
      email: email || null,
      rating,
      title: title || null,
      comment,
      photoUrl, // This will be null if no photo was provided or upload failed
      isApproved: false, // Reviews start as unapproved
    }


    const adminApiUrl = process.env.ADMIN_API_URL || "http://localhost:3000/api"
    const apiUrl = `${adminApiUrl}/${storeId}/reviews`

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.ADMIN_API_KEY && {
            Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
          }),
        },
        body: JSON.stringify(reviewData),
      })


      if (process.env.NODE_ENV === "development") {
        const newReview: ReviewData = {
          id: `dev-review-${Date.now()}`,
          storeId,
          productId,
          userId: `dev-user-${Date.now()}`,
          userName,
          email: email || null,
          rating,
          title: title || null,
          comment,
          photoUrl, // Use the same photoUrl we sent to the API
          isApproved: true, // Auto-approve in development mode
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        devSubmittedReviews.push(newReview)
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        if (process.env.NODE_ENV === "development") {
        } else {
          return {
            success: false,
            message: "Failed to submit review. Please try again later.",
          }
        }
      } else {
        const responseData = await response.json()
      }

      revalidatePath(`/product/${productId}`)
      revalidatePath("/reviews")

      return {
        success: true,
        message:
          process.env.NODE_ENV === "development"
            ? "Review submitted successfully and is now visible (development mode)"
            : "Review submitted successfully and will be visible after approval",
      }
    } catch (fetchError) {
      if (process.env.NODE_ENV === "development" && devSubmittedReviews.length > 0) {
        revalidatePath(`/product/${productId}`)
        revalidatePath("/reviews")

        return {
          success: true,
          message: "Review submitted successfully and is now visible (development mode, but not saved to database)",
        }
      }

      return {
        success: false,
        message: "Failed to connect to the review service. Please try again later.",
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function getProductReviews(productId: string, options?: { countryCode?: string }): Promise<ReviewData[]> {
  try {
    if (!productId) {
      return []
    }


    const adminApiUrl = process.env.ADMIN_API_URL || "http://localhost:3000/api"
    const storeId = process.env.NEXT_PUBLIC_STORE_ID || "7274a6f2-dd25-432e-b99e-74a236319931"
    const apiUrl = options?.countryCode 
      ? `${adminApiUrl}/${storeId}/reviews?productId=${encodeURIComponent(productId)}&cn=${options.countryCode}`
      : `${adminApiUrl}/${storeId}/reviews?productId=${encodeURIComponent(productId)}`

    try {
      const response = await fetch(apiUrl, {
        headers: {
          ...(process.env.ADMIN_API_KEY && {
            Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
          }),
        },
        cache: "no-store",
        next: { revalidate: 0 }, // Disable caching completely for debugging
      })


      let databaseReviews: ReviewData[] = []

      if (response.ok) {
        databaseReviews = await response.json()

        // Log the first review to see its structure
        if (databaseReviews.length > 0) {
        }
        databaseReviews = databaseReviews.filter((review: ReviewData) => review.isApproved)
      } else {
      }
      if (process.env.NODE_ENV === "development") {
        const submittedReviews = devSubmittedReviews.filter((review) => review.productId === productId)
        if (submittedReviews.length > 0) {
        }
        if (databaseReviews.length === 0 && submittedReviews.length === 0) {
          const sampleReviews = getSampleReviews(productId, storeId)
          const allReviews = [...submittedReviews, ...databaseReviews, ...sampleReviews]
          return allReviews
        }
        const combinedReviews = [...submittedReviews, ...databaseReviews]
        return combinedReviews
      }

      return databaseReviews
    } catch (fetchError) {
      if (process.env.NODE_ENV === "development") {
        const submittedReviews = devSubmittedReviews.filter((review) => review.productId === productId)
        const sampleReviews = getSampleReviews(productId, storeId)

        const fallbackReviews = [...submittedReviews, ...sampleReviews]
        return fallbackReviews
      }

      return []
    }
  } catch (error) {
    return []
  }
}

function getSampleReviews(productId: string, storeId: string): ReviewData[] {
  const now = new Date().toISOString()
  const oneDayAgo = new Date(Date.now() - 86400000).toISOString() // 1 day ago
  const twoDaysAgo = new Date(Date.now() - 172800000).toISOString() // 2 days ago

  return [
    {
      id: "sample-review-1",
      storeId,
      productId,
      userId: "sample-user-1",
      userName: "John Doe",
      rating: 5,
      title: "Great product!",
      comment: "This is an amazing product. I love it! The quality is outstanding and it arrived quickly.",
      isApproved: true,
      photoUrl: "/placeholder.svg?key=cr94y",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "sample-review-2",
      storeId,
      productId,
      userId: "sample-user-2",
      userName: "Jane Smith",
      rating: 4,
      title: "Very good",
      comment:
        "I really like this product. Would recommend! The only reason I didn't give 5 stars is the color was slightly different than pictured.",
      isApproved: true,
      photoUrl: null,
      createdAt: oneDayAgo,
      updatedAt: oneDayAgo,
    },
    {
      id: "sample-review-3",
      storeId,
      productId,
      userId: "sample-user-3",
      userName: "Alex Johnson",
      rating: 5,
      title: "Exceeded expectations",
      comment:
        "This product is even better than I expected. The quality is outstanding! I'll definitely be purchasing more items from this store.",
      isApproved: true,
      photoUrl: "/placeholder.svg?key=2b9p4",
      createdAt: twoDaysAgo,
      updatedAt: twoDaysAgo,
    },
  ]
}

export async function clearDevReviews(): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    devSubmittedReviews = []
  }
}
