import type { Category } from "@/types"
import { fetchJson } from "./_http"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`

// Fallback categories data for when the API is not available
const fallbackCategories: Category[] = [
  {
    id: "category_jackets",
    name: "Jackets",
    materials: ["Leather", "Denim", "Cotton"],
    styles: ["Bomber", "Biker", "Varsity"],
    genders: ["Men", "Women"],
    billboard: {
      id: "billboard_1",
      label: "Premium Jackets Collection",
      imageUrl: "/placeholder.svg?height=800&width=1200",
    },
  },
  {
    id: "category_coats",
    name: "Coats",
    materials: ["Wool", "Cashmere", "Polyester"],
    styles: ["Trench", "Pea Coat", "Overcoat"],
    genders: ["Men", "Women", "Unisex"],
    billboard: {
      id: "billboard_2",
      label: "Luxury Coats",
      imageUrl: "/placeholder.svg?height=800&width=1200",
    },
  },
  {
    id: "category_leather",
    name: "Leather",
    materials: ["Genuine Leather", "Faux Leather", "Suede"],
    styles: ["Classic", "Vintage", "Modern"],
    genders: ["Men", "Women"],
    billboard: {
      id: "billboard_3",
      label: "Finest Leather Collection",
      imageUrl: "/placeholder.svg?height=800&width=1200",
    },
  },
]

const getCategories = async (options?: { countryCode?: string }): Promise<Category[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn("API URL not configured. Using fallback categories data.")
      return fallbackCategories
    }

    const url = options?.countryCode 
      ? `/categories?cn=${options.countryCode}` 
      : "/categories"
    const categories = await fetchJson<Category[]>(url, { timeoutMs: 1200000 })
    if (!categories || categories.length === 0) {
      console.warn("⚠️ No categories returned from API, using fallback")
      return fallbackCategories
    }
    
    return categories
  } catch (error) {
    return fallbackCategories
  }
}

export default getCategories
