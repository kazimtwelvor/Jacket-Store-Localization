import { NextResponse } from "next/server"
import { z } from "zod"

const checkUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  storeId: z.string().min(1, "Store ID is required"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validationResult = checkUserSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }

    const { email, storeId } = validationResult.data

    // Check if external API is configured
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    
    if (apiUrl) {
      try {
        // Forward the request to your external API to check if user exists
        const checkUserUrl = `${apiUrl.split("/api/")[0]}/api/users/check-exists`
        const response = await fetch(checkUserUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, storeId }),
        })
        
        if (response.ok) {
          const data = await response.json()
          return NextResponse.json({ exists: data.exists })
        } else {
          // If external API fails, assume user doesn't exist for security
          return NextResponse.json({ exists: false })
        }
      } catch (error) {
        console.error("[CHECK_USER_EXISTS] External API failed:", error)
        // If external API fails, assume user doesn't exist for security
        return NextResponse.json({ exists: false })
      }
    }

    // If no external API is configured, you need to implement local user validation
    // Replace this with your actual user database query
    // For now, return false to prevent any password resets until you implement proper validation
    
    // Example of what you might implement:
    // const user = await db.user.findUnique({ where: { email, storeId } })
    // return NextResponse.json({ exists: !!user })
    
    return NextResponse.json({ exists: false })
    
  } catch (error) {
    console.error("[CHECK_USER_EXISTS_ERROR]", error)
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
