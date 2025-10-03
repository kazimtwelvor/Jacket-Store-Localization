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

    // Get Stripe secret key
    let stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey && process.env.NEXT_PUBLIC_API_URL) {
      try {
        const stripeResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stripe-secret-key`
        );
        
        if (stripeResponse.ok) {
          const stripeConfig = await stripeResponse.json();
          const encryptionKey = "a7b9c2d4e6f8g1h3j5k7m9n2p4q6r8s0";
          stripeSecretKey = decrypt(stripeConfig.secretKey, encryptionKey);
        }
      } catch (error) {
        console.error("Failed to fetch Stripe config:", error);
      }
    }

    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeSecretKey);

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not successful" },
        { status: 400 }
      );
    }

    // Update backend order status
    if (process.env.NEXT_PUBLIC_API_URL) {
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
            status: paymentIntent.status,
            paidAt: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to update backend order status");
      }
    }

    return NextResponse.json({
      success: true,
      paymentStatus: paymentIntent.status,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}