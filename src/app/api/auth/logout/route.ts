import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
    
    // If no external API URL is configured, return error
    if (!apiUrl) {
      return NextResponse.json(
        { error: "Logout service not configured" },
        { status: 503 }
      )
    }

    const adminApiUrl = `${apiUrl}/auth/logout`

    try {
      const response = await fetch(adminApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const responseData = await response.json()

      if (!response.ok) {
        return NextResponse.json({ error: responseData.error || "Logout failed" }, { status: response.status })
      }

      return NextResponse.json({
        message: "Logout successful",
      })
    } catch (fetchError) {
      console.error("[STORE_LOGOUT] External API fetch failed:", fetchError)
      return NextResponse.json(
        { error: "Failed to connect to logout service" },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error("[STORE_LOGOUT_ERROR]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
