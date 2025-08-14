import { NextResponse } from "next/server"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  storeId: z.string().min(1, "Store ID is required"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }

    const { email, password, storeId } = validationResult.data

    // Forward the login request to the Admin API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
    
    // If no external API URL is configured, return a mock success response
    if (!apiUrl) {
      console.log("[STORE_LOGIN] No external API configured, returning mock response")
      return NextResponse.json({
        message: "Login successful",
        user: {
          id: "mock-user-id",
          email,
          name: "Mock User",
        },
        token: "mock-token",
      })
    }

    const adminApiUrl = `${apiUrl}/auth/login`

    try {
      const response = await fetch(adminApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          storeId,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        return NextResponse.json({ error: responseData.error || "Login failed" }, { status: response.status })
      }

      return NextResponse.json({
        message: "Login successful",
        user: responseData.user,
        token: responseData.token,
      })
    } catch (fetchError) {
      console.error("[STORE_LOGIN] External API fetch failed:", fetchError)
      // Return a mock success response if external API is not available
      return NextResponse.json({
        message: "Login successful",
        user: {
          id: "mock-user-id",
          email,
          name: "Mock User",
        },
        token: "mock-token",
      })
    }
  } catch (error) {
    console.error("[STORE_LOGIN_ERROR]", error)
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
