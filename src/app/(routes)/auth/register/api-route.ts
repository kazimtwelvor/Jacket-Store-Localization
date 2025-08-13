import { NextResponse } from "next/server"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  storeId: z.string().min(1, "Store ID is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors[0].message }, { status: 400 })
    }

    const { name, email, password, storeId, phone, address, city, state, zipCode, country } = validationResult.data

    // Forward the registration request to the Admin API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
    const adminApiUrl = `${apiUrl}/auth/register`

    const response = await fetch(adminApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        storeId,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
      }),
    })

    const responseData = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: responseData.error || "Registration failed" }, { status: response.status })
    }

    return NextResponse.json({
      message: "User registered successfully. Please check your email to verify your account.",
      user: responseData.user,
    })
  } catch (error) {
    console.error("[STORE_REGISTER_ERROR]", error)
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