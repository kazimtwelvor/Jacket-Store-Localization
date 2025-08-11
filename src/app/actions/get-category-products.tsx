import type { Product, Category } from "@/types"
import getCategories from "./get-categories"
import { fetchJson } from "./_http"

interface GetCategoryProductsProps {
  categoryId?: string
  slug?: string
}

const getCategoryProducts = async ({ categoryId, slug }: GetCategoryProductsProps): Promise<Product[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("API URL not configured")
      return []
    }

    let finalCategoryId = categoryId

    // If slug is provided, convert it to categoryId
    if (slug && !categoryId) {
      const categories = await getCategories()
      const category = categories.find((c: Category) => {
        const categorySlug = c.slug || c.name?.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()
        return categorySlug === slug || c.id === slug
      })
      
      if (!category) {
        console.error(`Category not found for slug: ${slug}`)
        return []
      }
      
      finalCategoryId = category.id
    }

    if (!finalCategoryId) {
      console.error("No categoryId or slug provided")
      return []
    }

    const products = await fetchJson<Product[]>(`/categories/${finalCategoryId}/products`)
    return products
  } catch (error) {
    console.error("Error fetching category products:", error)
    return []
  }
}

export default getCategoryProducts
