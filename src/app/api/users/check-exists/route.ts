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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    
    if (apiUrl) {
      try {
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
          return NextResponse.json({ exists: false })
        }
      } catch (error) {
        return NextResponse.json({ exists: false })
      }
    }
    return NextResponse.json({ exists: false })
    
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
