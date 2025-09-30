import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productUrl = searchParams.get('url')

  if (!productUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      return NextResponse.json({ error: 'API URL not configured' }, { status: 500 })
    }

    console.log('🔗 Fetching product from URL:', productUrl)
    
    // Extract product slug/ID from URL
    const urlParts = productUrl.split('/')
    const productSlug = urlParts[urlParts.length - 1]
    console.log('📦 Extracted product slug:', productSlug)

    // Try different API endpoints to find the product
    let productData = null
    let products: any[] = []
    
    // First try direct product fetch by ID
    try {
      const directResponse = await fetch(`${apiUrl}/products/${productSlug}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      })
      
      if (directResponse.ok) {
        productData = await directResponse.json()
        console.log('✅ Found product via direct API:', productData.name)
      }
    } catch (directError) {
      console.log('⚠️ Direct fetch failed, trying search...')
    }
    
    // If direct fetch failed, search through products with multiple strategies
    if (!productData) {
      const searchResponse = await fetch(`${apiUrl}/products?limit=500`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      })
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json()
        products = searchData.products || searchData
        
        console.log(`🔍 Searching through ${products.length} products...`)
        
        // Strategy 1: Exact slug match
        productData = products.find((p: any) => p.slug === productSlug)
        if (productData) {
          console.log('✅ Found product via exact slug match:', productData.name)
        }
        
        // Strategy 2: ID match
        if (!productData) {
          productData = products.find((p: any) => p.id === productSlug)
          if (productData) {
            console.log('✅ Found product via ID match:', productData.name)
          }
        }
        
        // Strategy 3: Name-based slug match
        if (!productData) {
          productData = products.find((p: any) => {
            if (!p.name) return false
            const generatedSlug = p.name.toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim()
            return generatedSlug === productSlug
          })
          if (productData) {
            console.log('✅ Found product via name-based slug match:', productData.name)
          }
        }
        
        // Strategy 4: Partial name match (for similar products)
        if (!productData) {
          const searchTerms = productSlug.split('-').filter(term => term.length > 2)
          productData = products.find((p: any) => {
            if (!p.name) return false
            const productName = p.name.toLowerCase()
            return searchTerms.some(term => productName.includes(term))
          })
          if (productData) {
            console.log('✅ Found similar product via partial match:', productData.name)
          }
        }
        
        // Strategy 5: Search by keywords in the slug
        if (!productData) {
          const keywords = productSlug.split('-').filter(term => term.length > 3)
          productData = products.find((p: any) => {
            if (!p.name) return false
            const productName = p.name.toLowerCase()
            return keywords.every(keyword => productName.includes(keyword))
          })
          if (productData) {
            console.log('✅ Found product via keyword match:', productData.name)
          }
        }
      }
    }

    if (!productData) {
      console.error('❌ Product not found for slug:', productSlug)
      console.error('🔍 Available product slugs:', products?.slice(0, 10).map((p: any) => p.slug || p.name?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')).filter(Boolean))
      return NextResponse.json({ 
        error: 'Product not found', 
        searchedSlug: productSlug,
        suggestion: 'The color link may be pointing to a product that doesn\'t exist in your database. Please check if the product exists or update the color link.'
      }, { status: 404 })
    }

    if (productData.baseColor || productData.colorDetails) {
      const baseColor = productData.baseColor
      const colorDetails = productData.colorDetails
      
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
      
      productData.colorDetails = combinedColorDetails
    }

    return NextResponse.json(productData)
  } catch (error) {
    console.error('❌ Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
