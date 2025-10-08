import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function GET(request: NextRequest) {

  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: 'API_BASE_URL is not configured' },
      { status: 500 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    const apiUrl = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NextJS-App',
      },
      signal: AbortSignal.timeout(1200000), 
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
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