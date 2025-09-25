import type { Product } from "@/types"
import ProductService from "../../lib/services/product-service"
import { unstable_cache } from "next/cache"

const getCachedProduct = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    try {
      
      const product = await ProductService.getProduct(slug)
      if (product) {
        return product
      }
      
      const { products } = await ProductService.getProducts({ 
        limit: 10000 
      })
      
      const foundProduct = products.find(p => {
        const nameSlug = p.name?.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
        return p.id === slug || p.slug === slug || nameSlug === slug
      })
      
      if (foundProduct) {
        return foundProduct
      }
      
      return null
    } catch (error) {
      return null
    }
  },
  ['product'],
  { 
    revalidate: 3600, // Cache for 1 hour
    tags: ['products', 'product-details'] 
  }
)

const getProduct = (slug: string): Promise<Product | null> => getCachedProduct(slug)

export default getProduct




// import type { Product } from "@/types"
// import ProductService from "../../lib/services/product-service"
// import { unstable_cache } from "next/cache"

// const getCachedProduct = unstable_cache(
//   async (slug: string): Promise<Product | null> => {
//     try {
      
//       const product = await ProductService.getProduct(slug)
//       if (product) {
//         return product
//       }
      
//       const { products } = await ProductService.getProducts({ 
//         limit: 10000 
//       })
      
      
//       const foundProduct = products.find(p => {
//         const nameSlug = p.name?.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
//         const matches = p.id === slug || p.slug === slug || nameSlug === slug
       
//         return matches
//       })
      
//       if (!foundProduct) {
//         return null
//       }
//       return foundProduct
//     } catch (error) {
//       return null
//     }
//   },
//   ['product'],
//   { revalidate: 60, tags: ['products'] }
// )

// const getProduct = (slug: string): Promise<Product | null> => getCachedProduct(slug)

// export default getProduct
