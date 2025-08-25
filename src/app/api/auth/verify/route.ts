import { NextResponse } from "next/server"
import { z } from "zod"

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
  storeId: z.string().min(1, "Store ID is required"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validationResult = verifyEmailSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }

    const { token, storeId } = validationResult.data

    // Forward the email verification request to the Admin API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
    
    // If no external API URL is configured, return error
    if (!apiUrl) {
      console.log("[STORE_VERIFY] No external API configured")
      return NextResponse.json(
        { error: "Email verification service not configured" },
        { status: 503 }
      )
    }

    const adminApiUrl = `${apiUrl}/auth/verify`

    try {
      const response = await fetch(adminApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          storeId,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        return NextResponse.json({ error: responseData.error || "Email verification failed" }, { status: response.status })
      }

      return NextResponse.json({
        message: "Email verification successful",
      })
    } catch (fetchError) {
      console.error("[STORE_VERIFY] External API fetch failed:", fetchError)
      return NextResponse.json(
        { error: "Failed to connect to email verification service" },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error("[STORE_VERIFY_EMAIL_ERROR]", error)
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
