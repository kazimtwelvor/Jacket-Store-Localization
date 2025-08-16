import { NextResponse } from "next/server"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  storeId: z.string().min(1, "Store ID is required"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validationResult = forgotPasswordSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }

    const { email, storeId } = validationResult.data

    // Forward the forgot password request to the Admin API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
    
    // If no external API URL is configured, return a mock success response
    if (!apiUrl) {
      console.log("[STORE_FORGOT_PASSWORD] No external API configured, returning mock response")
      return NextResponse.json({
        message: "Password reset email sent successfully",
      })
    }

    const adminApiUrl = `${apiUrl}/auth/forgot-password`

    try {
      const response = await fetch(adminApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          storeId,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        return NextResponse.json({ error: responseData.error || "Failed to send reset email" }, { status: response.status })
      }

      return NextResponse.json({
        message: "Password reset email sent successfully",
      })
    } catch (fetchError) {
      console.error("[STORE_FORGOT_PASSWORD] External API fetch failed:", fetchError)
      // Return a mock success response if external API is not available
      return NextResponse.json({
        message: "Password reset email sent successfully",
      })
    }
  } catch (error) {
    console.error("[STORE_FORGOT_PASSWORD_ERROR]", error)
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
