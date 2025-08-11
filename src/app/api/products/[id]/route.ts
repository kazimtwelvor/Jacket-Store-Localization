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
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}