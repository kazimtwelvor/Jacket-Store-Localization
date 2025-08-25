import { sendEmailVerificationEmail, sendWelcomeEmail } from "@/src/app/lib/mail"
import { NextResponse } from "next/server"
import { z } from "zod"
// import { sendWelcomeEmail, sendEmailVerificationEmail } from "@/lib/mail"

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
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }

    const { name, email, password, storeId, phone, address, city, state, zipCode, country } = validationResult.data

    // Get the API URL from environment variable
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || ""

    // Try both relative and absolute URLs
    let adminApiUrl = "/api/auth/register"

    if (apiBaseUrl) {
      // If we have an API base URL, use it to construct an absolute URL
      // Remove /api/storeId if it's included in the base URL
      const baseUrl = apiBaseUrl.replace(/\/api\/[^/]+$/, "")
      adminApiUrl = `${baseUrl}/api/auth/register`
    }


    try {
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


      // Get the raw response text first
      const responseText = await response.text()

      // Try to parse as JSON if possible
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch (parseError) {

        // If we can't parse the response but the status is 201 (Created),
        // assume the registration was successful
        if (response.status === 201) {
          return NextResponse.json({
            message: "User registered successfully. Please check your email to verify your account.",
          })
        }

        return NextResponse.json(
          {
            error: "Failed to parse server response",
            details: responseText.substring(0, 100),
          },
          { status: 500 },
        )
      }

      if (!response.ok) {

        return NextResponse.json(
          {
            error: responseData.error || responseData.message || "Registration failed",
            status: response.status,
          },
          { status: response.status },
        )
      }

      // Send welcome email after successful registration
      try {
        const emailSent = await sendWelcomeEmail(email, name)
        if (emailSent) {
        }
      } catch (emailError) {
        // Don't fail the registration if email fails
      }

      // If email verification is required, send verification email
      if (process.env.REQUIRE_EMAIL_VERIFICATION === "true") {
        try {
          const verificationLink = `https://d1.fineyst.com/auth/verify?token=verification_token_here`
          const verificationEmailSent = await sendEmailVerificationEmail(email, name, verificationLink)
          if (verificationEmailSent) {
          }
        } catch (verificationError) {
        }
      }

      return NextResponse.json({
        message: "User registered successfully. Please check your email to verify your account.",
        user: responseData.user,
      })
    } catch (fetchError) {

      // Provide detailed error information
      return NextResponse.json(
        {
          error: "Failed to connect to authentication service",
          details:
            fetchError instanceof Error
              ? fetchError.message
              : String(fetchError),
        },
        { status: 500 },
      )
    }
  } catch (error) {

    // Return detailed error information
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          error instanceof Error
            ? error.message
            : String(error),
          },
          { status: 500 },
        )
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