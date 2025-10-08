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

    
    const urlParts = productUrl.split('/')
    const productSlug = urlParts[urlParts.length - 1]

    let productData = null
    let products: any[] = []
    
    try {
      const directResponse = await fetch(`${apiUrl}/products/${productSlug}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      })
      
      if (directResponse.ok) {
        productData = await directResponse.json()
      }
    } catch (directError) {
    }
    
    if (!productData) {
      const searchResponse = await fetch(`${apiUrl}/products?limit=500`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      })
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json()
        products = searchData.products || searchData
        
        
        productData = products.find((p: any) => p.slug === productSlug)
        if (productData) {
        }
        
        if (!productData) {
          productData = products.find((p: any) => p.id === productSlug)
          if (productData) {
          }
        }
        
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
          }
        }
        
        if (!productData) {
          const searchTerms = productSlug.split('-').filter(term => term.length > 2)
          productData = products.find((p: any) => {
            if (!p.name) return false
            const productName = p.name.toLowerCase()
            return searchTerms.some(term => productName.includes(term))
          })
          if (productData) {
          }
        }
        
        if (!productData) {
          const keywords = productSlug.split('-').filter(term => term.length > 3)
          productData = products.find((p: any) => {
            if (!p.name) return false
            const productName = p.name.toLowerCase()
            return keywords.every(keyword => productName.includes(keyword))
          })
          if (productData) {
          }
        }
      }
    }

    if (!productData) {
      console.error('❌ Product not found for slug:', productSlug)
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
