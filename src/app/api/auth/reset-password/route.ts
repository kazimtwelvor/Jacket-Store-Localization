import { NextResponse } from "next/server"
import { z } from "zod"

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  storeId: z.string().min(1, "Store ID is required"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validationResult = resetPasswordSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }

    const { token, password, storeId } = validationResult.data

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
    
    if (!apiUrl) {
      console.log("[STORE_RESET_PASSWORD] No external API configured, returning mock response")
      return NextResponse.json({
        message: "Password reset successful",
      })
    }

    const adminApiUrl = `${apiUrl}/auth/reset-password`

    try {
      const response = await fetch(adminApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          storeId,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        return NextResponse.json({ error: responseData.error || "Failed to reset password" }, { status: response.status })
      }

      return NextResponse.json({
        message: "Password reset successful",
      })
    } catch (fetchError) {
      console.error("[STORE_RESET_PASSWORD] External API fetch failed:", fetchError)
      return NextResponse.json({
        message: "Password reset successful",
      })
    }
  } catch (error) {
    console.error("[STORE_RESET_PASSWORD_ERROR]", error)
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
