import type { Product } from "@/types"
import { fetchJson } from "./_http"
import { unstable_cache } from "next/cache"

const getCachedProduct = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    try {
      return await fetchJson<Product>(`/api/products/${slug}`, {
        next: { revalidate: 3600 },
        timeoutMs: 10000
      })
    } catch (error) {
      const { products } = await fetchJson<{ products: Product[] }>("/products", {
        query: { search: slug, limit: 100 },
        next: { revalidate: 3600 },
        timeoutMs: 10000
      })
      
      const product = products.find(p => 
        p.id === slug || 
        p.slug === slug || 
        p.name?.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") === slug
      )
      
      if (!product) {
        console.warn(`Product '${slug}' not found`)
        return null
      }
      return product
    }
  },
  ['product'],
  { revalidate: 3600, tags: ['products'] }
)

const getProduct = (slug: string): Promise<Product | null> => getCachedProduct(slug)

export default getProduct
