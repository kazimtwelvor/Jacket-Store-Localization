import { NextRequest, NextResponse } from "next/server"
import { sendOrderEmails } from "@/src/app/lib/mail"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      customerEmail, 
      customerName, 
      orderNumber, 
      orderTotal, 
      items,
      shippingAddress,
      billingAddress 
    } = body

    if (!customerEmail || !orderNumber) {
      return NextResponse.json(
        { error: "Customer email and order number are required" },
        { status: 400 }
      )
    }

    const trackOrderUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/track-order`
    
    const { customerEmailSent, adminEmailSent } = await sendOrderEmails(
      customerEmail,
      customerName || "Customer",
      orderNumber,
      orderTotal || "0",
      items || [],
      trackOrderUrl
    )

    return NextResponse.json({ 
      success: true, 
      message: "Order emails sent successfully",
      customerEmailSent,
      adminEmailSent,
      details: {
        customerEmail: customerEmailSent ? "✅ Sent" : "❌ Failed",
        adminEmails: adminEmailSent ? "✅ Sent to all admins" : "❌ Failed"
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}