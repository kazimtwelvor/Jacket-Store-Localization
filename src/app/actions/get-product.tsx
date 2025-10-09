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
      
      if (Array.isArray(colorDetails) && colorDetails.length > 0) {
        // Keep original colorDetails order
        foundProduct.colorDetails = colorDetails
      } else if (baseColor && baseColor.id) {
        // Only use baseColor as fallback if no colorDetails exist
        foundProduct.colorDetails = [baseColor]
      }
    }
    
    return foundProduct || null
  } catch (error) {
    return null
  }
}

export default getProduct

