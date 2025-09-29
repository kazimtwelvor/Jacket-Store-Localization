import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { decrypt } from "../../../utils/decrypt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentIntentId } = body;

    if (!orderId || !paymentIntentId) {
      return NextResponse.json(
        { error: "Missing orderId or paymentIntentId" },
        { status: 400 }
      );
    }

    // Fetch Stripe secret key from backend API
    const stripeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe-secret-key`
    );
    
    if (!stripeResponse.ok) {
      throw new Error("Failed to fetch Stripe configuration");
    }
    
    const stripeConfig = await stripeResponse.json();
    const encryptionKey = "a7b9c2d4e6f8g1h3j5k7m9n2p4q6r8s0";
    const stripeSecretKey = decrypt(stripeConfig.secretKey, encryptionKey);
    
    const stripe = new Stripe(stripeSecretKey);

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment not successful");
    }

    // Update order status in the backend API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId,
          paymentMethod: "stripe",
          status: "paid",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to confirm payment");
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      order: data,
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}