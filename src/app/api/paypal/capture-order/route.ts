import { NextRequest, NextResponse } from "next/server"
import { decrypt } from "../../../utils/decrypt"

export async function POST(req: NextRequest) {
  try {
    const { orderID, orderId } = await req.json()
    
    if (!orderID) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 })
    }

    // Get PayPal credentials from backend
    const settingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-settings`, {
      cache: "no-store",
    });
    if (!settingsRes.ok) throw new Error("Failed to fetch payment settings");
    const settings = await settingsRes.json();
    if (!settings.paypalClientId || !settings.paypalClientSecret)
      throw new Error("PayPal credentials not available");

    const clientId = decrypt(settings.paypalClientId, "a7b9c2d4e6f8g1h3j5k7m9n2p4q6r8s0");
    const clientSecret = decrypt(settings.paypalClientSecret, "a7b9c2d4e6f8g1h3j5k7m9n2p4q6r8s0");

    // Get PayPal access token
    const tokenResponse = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
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
    const paymentStatus = captureData.status
    
    // Update backend payment status
    if (orderId && process.env.NEXT_PUBLIC_API_URL) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: captureData.id,
            paymentMethod: "paypal_button",
            paymentStatus,
            isPaid: paymentStatus === 'COMPLETED',
            paymentValidation: process.env.IS_SKIP_VALIDATION || ""
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Backend update failed:", {
            status: response.status,
            error: errorText
          });
        }
      } catch (error) {
        console.error("Failed to update backend:", error);
      }
    }
    
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