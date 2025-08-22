import { NextRequest, NextResponse } from 'next/server'

// Use Edge Runtime for better external API compatibility
export const runtime = 'edge'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function GET(request: NextRequest) {
  // Add CORS headers for Vercel
  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (!API_BASE_URL) {
    console.error('API_BASE_URL is not configured:', process.env.NEXT_PUBLIC_API_URL)
    return NextResponse.json(
      { error: 'API_BASE_URL is not configured' },
      { status: 500 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    const apiUrl = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`
    
    console.log('Calling external API:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextJS-App',
      },
      // Add timeout for Vercel
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      console.error('External API error:', response.status, response.statusText)
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log('External API response received, products count:', data.products?.length || 0)
    return NextResponse.json(data)
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { 
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          productsPerPage: 28,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      },
      { status: 200 }
    )
  }
}