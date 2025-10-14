import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!API_BASE_URL) {
    return NextResponse.json({ error: 'API_BASE_URL not configured' }, { status: 500 })
  }

  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const cn = searchParams.get('cn')
    
    // Include country parameter if provided
    const productUrl = `${API_BASE_URL}/products/${id}${cn ? `?cn=${cn}` : ''}`
    console.log('[PRODUCT_DETAIL_API] Fetching product:', id, 'country:', cn || 'none')

    let response = await fetch(productUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }
    })

    if (response.ok) {
      const data = await response.json()
      
      if (data.baseColor || data.colorDetails) {
        const baseColor = data.baseColor
        const colorDetails = data.colorDetails
        
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
        
        data.colorDetails = combinedColorDetails
      }
      
      return NextResponse.json(data)
    }

    const searchResponse = await fetch(`${API_BASE_URL}/products?limit=500`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }
    })

    if (!searchResponse.ok) {
      return NextResponse.json({ error: 'Failed to search products' }, { status: 500 })
    }

    const searchData = await searchResponse.json()
    const products = searchData.products || []

    const product = products.find((p: any) => {
      const nameSlug = p.name?.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
      return p.id === id || p.slug === id || nameSlug === id
    })

    if (product) {
      if (product.baseColor || product.colorDetails) {
        const baseColor = product.baseColor
        const colorDetails = product.colorDetails
        
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
        
        product.colorDetails = combinedColorDetails
      }
      
      return NextResponse.json(product)
    }

    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}