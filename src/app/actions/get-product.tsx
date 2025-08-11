import type { Product } from "@/types"
import { fetchJson } from "./_http"
import { unstable_cache } from "next/cache"

const getCachedProduct = unstable_cache(
  async (slug: string): Promise<Product> => {
    // Try direct product fetch first
    try {
      return await fetchJson<Product>(`/products/${slug}`, {
        next: { revalidate: 3600 }
      })
    } catch {
      // Fallback: search by slug in products list
      const { products } = await fetchJson<{ products: Product[] }>("/products", {
        query: { search: slug, limit: 100 },
        next: { revalidate: 3600 }
      })
      
      const product = products.find(p => 
        p.id === slug || 
        p.slug === slug || 
        p.name?.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") === slug
      )
      
      if (!product) throw new Error(`Product '${slug}' not found`)
      return product
    }
  },
  ['product'],
  { revalidate: 3600, tags: ['products'] }
)

const getProduct = (slug: string) => getCachedProduct(slug)

export default getProduct
