import type { Product } from "@/types"
import ProductService from "../../lib/services/product-service"

const getProduct = async (slug: string): Promise<Product | null> => {
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
    
    if (foundProduct && (foundProduct.baseColor || foundProduct.colorDetails)) {
      const baseColor = foundProduct.baseColor
      const colorDetails = foundProduct.colorDetails
      
      let combinedColorDetails = []
      
      if (baseColor && baseColor.id) {
        combinedColorDetails.push(baseColor)
      }
      
      if (Array.isArray(colorDetails)) {
        colorDetails.forEach(color => {
          if (color && color.id && (!baseColor || color.id !== baseColor.id)) {
            combinedColorDetails.push(color)
          }
        })
      }
      
      foundProduct.colorDetails = combinedColorDetails
    }
    
    return foundProduct || null
  } catch (error) {
    console.error("❌ Error fetching product:", error)
    return null
  }
}

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
//         return p.id === slug || p.slug === slug || nameSlug === slug
//       })
      
//       return foundProduct || null
//     } catch (error) {
//       console.error("❌ Error fetching product:", error)
//       return null
//     }
//   },
//   ['product'],
//   { 
//     revalidate: false, // No revalidation for pure static
//     tags: ['products', 'product-detail'] 
//   }
// )

// const getProduct = async (slug: string): Promise<Product | null> => {
//   return getCachedProduct(slug)
// }

// export default getProduct


