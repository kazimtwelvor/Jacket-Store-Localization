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

    let response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }
    })

    if (response.ok) {
      const data = await response.json()
      
      if (data.baseColor || data.colorDetails) {
        const baseColor = data.baseColor
        const colorDetails = data.colorDetails
        
        if (Array.isArray(colorDetails) && colorDetails.length > 0) {
          data.colorDetails = colorDetails
        } else if (baseColor && baseColor.id) {
          data.colorDetails = [baseColor]
        }
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
        
        if (Array.isArray(colorDetails) && colorDetails.length > 0) {
          product.colorDetails = colorDetails
        } else if (baseColor && baseColor.id) {
          product.colorDetails = [baseColor]
        }
      }
      
      return NextResponse.json(product)
    }

    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}