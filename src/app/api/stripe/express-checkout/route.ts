import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { decrypt } from "../../../utils/decrypt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, totalAmount } = body;

    // Get Stripe secret key from backend API
    const stripeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment-settings`
    );
    if (!stripeResponse.ok) {
      throw new Error("Failed to fetch Stripe configuration");
    }

    const stripeConfig = await stripeResponse.json();
    const encryptionKey = "a7b9c2d4e6f8g1h3j5k7m9n2p4q6r8s0";
    const stripeSecretKey = decrypt(
      stripeConfig.stripeSecretKey,
      encryptionKey
    );

    const stripe = new Stripe(stripeSecretKey);

    // Create payment intent for express checkout
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        type: "express_checkout",
        items: JSON.stringify(items),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating express checkout:", error);
    return NextResponse.json(
      { error: "Failed to create express checkout", details: error.message },
      { status: 500 }
    );
  }
}
