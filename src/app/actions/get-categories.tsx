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

const getCategories = async (): Promise<Category[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn("API URL not configured. Using fallback categories data.")
      return fallbackCategories
    }

    console.log("🔄 Fetching categories from API:", `${process.env.NEXT_PUBLIC_API_URL}/categories`)
    
    const categories = await fetchJson<Category[]>("/categories", { timeoutMs: 1200000 })
    
    console.log("✅ Categories fetched from API:", categories)
    console.log("✅ Categories length:", categories?.length)
    
    if (!categories || categories.length === 0) {
      console.warn("⚠️ No categories returned from API, using fallback")
      return fallbackCategories
    }
    
    return categories
  } catch (error) {
    console.error("❌ Error fetching categories:", error)
    console.log("⚠️ Using fallback categories data")
    return fallbackCategories
  }
}

export default getCategories
