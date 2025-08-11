
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

    // Validate rating
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return {
        success: false,
        message: "Rating must be between 1 and 5",
      }
    }

    // Process photo if provided
    let photoUrl = null
    if (photo && photo.size > 0) {
      try {
        // Upload the image and get the URL
        photoUrl = await uploadImage(photo)
      } catch (uploadError) {
        console.error("Server Action: Error uploading image:", uploadError)
        // Continue without the image if upload fails
        photoUrl = null
      }
    }

    // Prepare the review data to send directly to the Admin API
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


    // Get the admin API URL
    const adminApiUrl = process.env.ADMIN_API_URL || "http://localhost:3000/api"

    // Send the review data directly to the Admin API
    const apiUrl = `${adminApiUrl}/${storeId}/reviews`

    try {
      // Always attempt to send the review to the database
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authentication header if available
          ...(process.env.ADMIN_API_KEY && {
            Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
          }),
        },
        body: JSON.stringify(reviewData),
      })


      // For development mode, also add to in-memory store regardless of API response
      if (process.env.NODE_ENV === "development") {

        // Create a new review object for development mode
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

        // Add to our in-memory store of submitted reviews
        devSubmittedReviews.push(newReview)
      }

      // Check if the API call was successful
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error("Server Action: Error posting review to API:", errorData || response.statusText)

        // In development mode, we still consider it a success because we've added it to our in-memory store
        if (process.env.NODE_ENV === "development") {
        } else {
          // In production, return an error
          return {
            success: false,
            message: "Failed to submit review. Please try again later.",
          }
        }
      } else {
        // API call was successful
        const responseData = await response.json()
      }

      // Revalidate the product page and reviews page
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
      console.error("Server Action: Fetch error:", fetchError)

      // In development mode, we still consider it a success if we've added it to our in-memory store
      if (process.env.NODE_ENV === "development" && devSubmittedReviews.length > 0) {

        // Revalidate the product page and reviews page
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
    console.error("Server Action: Error posting review:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

/**
 * Get all reviews for a specific product
 * For development, this returns sample data plus any submitted reviews
 * In production, this would fetch from the Admin API with proper authentication
 */
export async function getProductReviews(productId: string): Promise<ReviewData[]> {
  try {
    if (!productId) {
      return []
    }


    // Get the admin API URL
    const adminApiUrl = process.env.ADMIN_API_URL || "http://localhost:3000/api"

    // Get the store ID
    const storeId = process.env.NEXT_PUBLIC_STORE_ID || "7274a6f2-dd25-432e-b99e-74a236319931"

    // Fetch reviews directly from the Admin API
    const apiUrl = `${adminApiUrl}/${storeId}/reviews?productId=${encodeURIComponent(productId)}`

    try {
      const response = await fetch(apiUrl, {
        headers: {
          // Add authentication header if available
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

        // Filter to only show approved reviews from the database
        databaseReviews = databaseReviews.filter((review: ReviewData) => review.isApproved)
      } else {
      }

      // For development mode, also include in-memory submitted reviews and sample data if needed
      if (process.env.NODE_ENV === "development") {
        // Filter submitted reviews for this product
        const submittedReviews = devSubmittedReviews.filter((review) => review.productId === productId)

        // Log the first submitted review to see its structure
        if (submittedReviews.length > 0) {
        }

        // If we have no reviews from either source, add sample data
        if (databaseReviews.length === 0 && submittedReviews.length === 0) {
          const sampleReviews = getSampleReviews(productId, storeId)

          // Combine all reviews, with submitted reviews first, then database reviews, then sample reviews
          const allReviews = [...submittedReviews, ...databaseReviews, ...sampleReviews]
          return allReviews
        }

        // Combine submitted reviews and database reviews
        const combinedReviews = [...submittedReviews, ...databaseReviews]
        return combinedReviews
      }

      // In production, just return the database reviews
      return databaseReviews
    } catch (fetchError) {
      console.error("Server Action: Fetch error:", fetchError)

      // For development purposes, return in-memory reviews plus sample data
      if (process.env.NODE_ENV === "development") {

        // Filter submitted reviews for this product
        const submittedReviews = devSubmittedReviews.filter((review) => review.productId === productId)
        const sampleReviews = getSampleReviews(productId, storeId)

        const fallbackReviews = [...submittedReviews, ...sampleReviews]
        return fallbackReviews
      }

      return []
    }
  } catch (error) {
    console.error("Server Action: Error fetching product reviews:", error)
    return []
  }
}

// Helper function to generate sample reviews for development
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

// For development purposes only - clear the submitted reviews
export async function clearDevReviews(): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    devSubmittedReviews = []
  }
}
