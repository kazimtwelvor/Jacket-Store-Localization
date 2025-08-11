import type { Size } from "@/types"
import { fetchJson } from "./_http"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/sizes`

// Fallback sizes data for when the API is not available
const fallbackSizes: Size[] = [
  { id: "size_xs", name: "XS", value: "XS" },
  { id: "size_s", name: "S", value: "S" },
  { id: "size_m", name: "M", value: "M" },
  { id: "size_l", name: "L", value: "L" },
  { id: "size_xl", name: "XL", value: "XL" },
  { id: "size_xxl", name: "XXL", value: "XXL" },
]

const getSizes = async (): Promise<Size[]> => {
  try {
    // Check if API URL is available
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn("API URL not configured. Using fallback sizes data.")
      return fallbackSizes
    }

    return await fetchJson<Size[]>("/sizes")
  } catch (error) {
    console.error("Error fetching sizes:", error)
    // Return fallback data when API call fails
    return fallbackSizes
  }
}

export default getSizes
