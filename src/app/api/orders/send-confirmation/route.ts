import { NextRequest, NextResponse } from "next/server"
import { sendOrderConfirmationEmail } from "@/src/app/lib/mail"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, orderNumber, orderTotal, items } = body

    if (!email || !orderNumber) {
      return NextResponse.json(
        { error: "Email and order number are required" },
        { status: 400 }
      )
    }

    const trackOrderUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/track-order`
    
    const emailSent = await sendOrderConfirmationEmail(
      email,
      name || "Customer",
      orderNumber,
      orderTotal || "0",
      items || [],
      trackOrderUrl
    )

    if (emailSent) {
      return NextResponse.json({ success: true, message: "Order confirmation email sent" })
    } else {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}