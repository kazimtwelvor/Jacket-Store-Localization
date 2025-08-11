import type { Category } from "@/types"
import { fetchJson } from "./_http"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`

// Fallback categories data for when the API is not available
const fallbackCategories: Category[] = [
  {
    id: "category_jackets",
    name: "Jackets",
    billboard: {
      id: "billboard_1",
      label: "Premium Jackets Collection",
      imageUrl: "/placeholder.svg?height=800&width=1200",
    },
  },
  {
    id: "category_coats",
    name: "Coats",
    billboard: {
      id: "billboard_2",
      label: "Luxury Coats",
      imageUrl: "/placeholder.svg?height=800&width=1200",
    },
  },
  {
    id: "category_leather",
    name: "Leather",
    billboard: {
      id: "billboard_3",
      label: "Finest Leather Collection",
      imageUrl: "/placeholder.svg?height=800&width=1200",
    },
  },
]

const getCategories = async (): Promise<Category[]> => {
  try {
    // Check if API URL is available
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn("API URL not configured. Using fallback categories data.")
      return fallbackCategories
    }

    return await fetchJson<Category[]>("/categories", {
      query: { include: "billboard" },
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Return fallback data when API call fails
    return fallbackCategories
  }
}

export default getCategories
