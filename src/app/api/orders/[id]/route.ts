import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!API_BASE_URL) {
    return NextResponse.json({ error: "API_BASE_URL not configured" }, { status: 500 })
  }

  try {
    const { id } = await params
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      // Cache lightly to avoid hammering origin but keep data fresh
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      const message = await response.text()
      return NextResponse.json(
        { error: message || "Order not found" },
        { status: response.status === 404 ? 404 : response.status || 500 },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}


