import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { orderID } = await req.json()
    
    if (!orderID) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 })
    }

    // Get PayPal access token
    const tokenResponse = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to get PayPal access token")
    }

    const { access_token } = await tokenResponse.json()

    // Capture the PayPal order
    const captureResponse = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    if (!captureResponse.ok) {
      const errorData = await captureResponse.text()
      throw new Error(`PayPal capture failed: ${errorData}`)
    }

    const captureData = await captureResponse.json()
    
    return NextResponse.json({ 
      success: true, 
      captureId: captureData.id,
      status: captureData.status 
    })

  } catch (error: any) {
    console.error("PayPal capture order error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to capture PayPal order" },
      { status: 500 }
    )
  }
}