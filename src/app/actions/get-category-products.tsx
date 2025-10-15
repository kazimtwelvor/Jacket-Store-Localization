import type { Product, Category } from "@/types"
import getCategories from "./get-categories"
import { fetchJson } from "./_http"

interface GetCategoryProductsProps {
  categoryId?: string
  slug?: string
  countryCode?: string
}

const getCategoryProducts = async ({ categoryId, slug, countryCode }: GetCategoryProductsProps): Promise<Product[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      return []
    }

    let finalCategoryId = categoryId
    if (slug && !categoryId) {
      const categories = await getCategories({ countryCode })
      const category = categories.find((c: Category) => {
        const categorySlug = c.slug || c.name?.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()
        return categorySlug === slug || c.id === slug
      })
      
      if (!category) {
        return []
      }
      
      finalCategoryId = category.id
    }

    if (!finalCategoryId) {
      return []
    }

    const url = countryCode 
      ? `/categories/${finalCategoryId}/products?cn=${countryCode}` 
      : `/categories/${finalCategoryId}/products`
    
    const products = await fetchJson<Product[]>(url)
    return products
  } catch (error) {
    return []
  }
}

export default getCategoryProducts
