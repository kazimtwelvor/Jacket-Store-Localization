import { NextRequest, NextResponse } from "next/server"
import { sendOrderEmails } from "@/src/app/lib/mail"

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
    
    const { customerEmailSent, adminEmailSent } = await sendOrderEmails(
      email,
      name || "Customer",
      orderNumber,
      orderTotal || "0",
      items || [],
      trackOrderUrl
    )

    if (customerEmailSent) {
      return NextResponse.json({ 
        success: true, 
        message: "Order confirmation emails sent",
        customerEmailSent,
        adminEmailSent
      })
    } else {
      return NextResponse.json(
        { error: "Failed to send customer email" },
        { status: 500 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}