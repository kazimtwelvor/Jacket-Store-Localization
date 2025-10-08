import ProductService from './product-service'

export async function testApiConnection() {
  console.log('🧪 Testing API Connection...')
  
  try {
    const featuredProducts = await ProductService.getFeaturedProducts(3)
    
    const products = await ProductService.getProducts({
      limit: 5,
      page: 1
    })
    
    return {
      success: true,
      featuredCount: featuredProducts.length,
      productsCount: products.products.length,
      pagination: products.pagination
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

if (typeof window !== 'undefined') {
  (window as any).testApi = testApiConnection
}
