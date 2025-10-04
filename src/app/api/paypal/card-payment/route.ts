import { decrypt } from "@/src/app/utils/decrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { items, cardDetails, customerInfo, totalAmount, orderId } = await req.json();
    if (!items || !cardDetails || !customerInfo || !orderId) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    // Get PayPal credentials
    const settingsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment-settings`,
      { cache: "no-store" }
    );
    if (!settingsRes.ok) throw new Error("Failed to fetch payment settings");
    const settings = await settingsRes.json();
    
    const clientId = decrypt(settings.paypalClientId, "a7b9c2d4e6f8g1h3j5k7m9n2p4q6r8s0");
    const clientSecret = decrypt(settings.paypalClientSecret, "a7b9c2d4e6f8g1h3j5k7m9n2p4q6r8s0");

    // Get access token
    const tokenResponse = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    const { access_token } = await tokenResponse.json();

    // Create order with card payment source
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const orderResponse = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
        "PayPal-Request-Id": requestId,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        payment_source: {
          card: {
            number: cardDetails.cardNumber.replace(/\s/g, ''),
            expiry: `20${cardDetails.expiryDate.split('/')[1]}-${cardDetails.expiryDate.split('/')[0]}`,
            security_code: cardDetails.cvv,
            name: cardDetails.cardholderName,
            billing_address: {
              address_line_1: customerInfo.address.split(',')[0] || "123 Main St",
              admin_area_2: customerInfo.address.split(',')[1]?.trim() || "City",
              admin_area_1: customerInfo.address.split(',')[2]?.trim() || "CA",
              postal_code: customerInfo.address.split(',')[3]?.trim() || "12345",
              country_code: "US"
            }
          }
        },
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
          },
        }],
      }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.text();
      throw new Error(`PayPal order creation failed: ${errorData}`);
    }

    const orderData = await orderResponse.json();
    const paymentStatus = orderData.purchase_units?.[0]?.payments?.captures?.[0]?.status || 'PENDING';
    
    // Update backend payment status
    if (orderId && process.env.NEXT_PUBLIC_API_URL) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: orderData.id,
            paymentMethod: "paypal_card",
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
      orderId: orderData.id,
      status: orderData.status,
      paymentStatus
    });

  } catch (error: any) {
    console.error("PayPal card payment error:", error);
    return NextResponse.json(
      { error: error.message || "Payment failed" },
      { status: 500 }
    );
  }
}