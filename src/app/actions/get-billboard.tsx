import type { Billboard } from "@/types"

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

    // Use direct external API call with proper error handling and caching
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billboards/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      cache: "force-cache",
      headers: {
        "Accept": "application/json",
        "User-Agent": "Fineyst-App",
      },
    })

    if (!response.ok) {
      console.warn("Failed to fetch billboard:", response.status);
      return fallbackBillboard;
    }

    const billboard = await response.json();

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
