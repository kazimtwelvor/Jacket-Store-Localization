import type { Color } from "@/types"
import { fetchJson } from "./_http"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/colors`

// Updated fallback colors data to match the leather jackets
const fallbackColors: Color[] = [
  { id: "color_black", name: "Black", value: "#000000" },
  { id: "color_white", name: "White", value: "#FFFFFF" },
  { id: "color_yellow", name: "Yellow", value: "#E4B23A" },
  { id: "color_burgundy", name: "Burgundy", value: "#722F37" },
  { id: "color_red", name: "Red", value: "#9B2B2B" },
  { id: "color_brown", name: "Brown", value: "#5D4037" },
  { id: "color_green", name: "Green", value: "#2E4A3B" },
]

const getColors = async (): Promise<Color[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn("API URL not configured. Using fallback colors data.")
      return fallbackColors
    }

    return await fetchJson<Color[]>("/colors")
  } catch (error) {
    return fallbackColors
  }
}

export default getColors
