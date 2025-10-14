import type { Size } from "@/types"
import { fetchJson } from "./_http"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/sizes`

const fallbackSizes: Size[] = [
  { id: "size_xs", name: "XS", value: "XS" },
  { id: "size_s", name: "S", value: "S" },
  { id: "size_m", name: "M", value: "M" },
  { id: "size_l", name: "L", value: "L" },
  { id: "size_xl", name: "XL", value: "XL" },
  { id: "size_xxl", name: "XXL", value: "XXL" },
]

const getSizes = async (options?: { countryCode?: string }): Promise<Size[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn("API URL not configured. Using fallback sizes data.")
      return fallbackSizes
    }

    const url = options?.countryCode 
      ? `/sizes?cn=${options.countryCode}` 
      : "/sizes"
    return await fetchJson<Size[]>(url)
  } catch (error) {
    return fallbackSizes
  }
}

export default getSizes
