import type { Billboard } from "@/types"
import { fetchJson } from "./_http"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`

// Fallback billboard data in case of errors
const fallbackBillboard: Billboard = {
  id: "fallback-billboard",
  label: "Our Collection",
  imageUrl: "/placeholder.svg?height=600&width=1600",
}

const getBillboard = async (id: string): Promise<Billboard> => {
  try {
    // Check if API URL is available
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn("API URL not configured. Using fallback billboard data.")
      return fallbackBillboard
    }

    // Fetch the billboard with proper caching disabled to get fresh data
    const billboard = await fetchJson<Billboard>(`/billboards/${id}`)

    // Validate the billboard data
    if (!billboard || !billboard.imageUrl) {
      console.warn("Invalid billboard data received, using fallback")
      return fallbackBillboard
    }

    return billboard
  } catch (error) {
    console.error("Error fetching billboard:", error)
    return fallbackBillboard
  }
}

export default getBillboard
