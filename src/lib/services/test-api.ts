import ProductService from './product-service'

export async function testApiConnection() {
  console.log('🧪 Testing API Connection...')
  
  try {
    console.log('📦 Testing getFeaturedProducts...')
    const featuredProducts = await ProductService.getFeaturedProducts(3)
    console.log('✅ Featured products fetched:', featuredProducts.length)
    
    console.log('🔍 Testing getProducts with filters...')
    const products = await ProductService.getProducts({
      limit: 5,
      page: 1
    })
    console.log('✅ Products fetched:', products.products.length)
    console.log('📊 Pagination info:', products.pagination)
    
    return {
      success: true,
      featuredCount: featuredProducts.length,
      productsCount: products.products.length,
      pagination: products.pagination
    }
  } catch (error) {
    console.error('❌ API Test Failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

if (typeof window !== 'undefined') {
  (window as any).testApi = testApiConnection
}
