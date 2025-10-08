import { NextResponse } from "next/server"
import { z } from "zod"

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validationResult = verifyEmailSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }

    const { token } = validationResult.data
    
    const storeId = process.env.NEXT_PUBLIC_STORE_ID;
    if (!storeId) {
      return NextResponse.json(
        { error: "Store ID not configured" },
        { status: 500 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
    
    if (!apiUrl) {
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
      return NextResponse.json(
        { error: "Failed to connect to email verification service" },
        { status: 503 }
      )
    }
  } catch (error) {
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
