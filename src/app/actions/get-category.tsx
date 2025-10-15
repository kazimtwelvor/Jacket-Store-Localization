import type { Category } from "@/types"
import getCategories from "./get-categories"
import { fetchJson } from "./_http"

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`

const getCategory = async (idOrSlug: string, options?: { countryCode?: string }): Promise<Category | null> => {
  try {
    
    // Search in all categories from API to find by slug
    try {
      const categories = await getCategories(options)
      
      const category = categories.find((c: Category) => {
        const match = c.slug === idOrSlug || c.id === idOrSlug
        if (match) {
        }
        return match
      })

      if (category) {
        // If we found the category, fetch its full details including categoryContent
        if (process.env.NEXT_PUBLIC_API_URL) {
          try {
            const fullCategory = await fetchJson<Category>(`/categories/${category.id}`, {
              query: { include: "billboard" },
            })
            return fullCategory
          } catch {}
        }
        return category
      }
    } catch (error) {
    }
    
    return null
  } catch (error) {
    return null
  }
}

export default getCategory
