import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { decrypt } from "../../../utils/decrypt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      productIds,
      customerEmail,
      customerName,
      phone,
      address,
      billingAddress,
      shippingAddress,
      zipCode,
      city,
      state,
      country,
      totalAmount,
      discountAmount,
      voucherCode,
    } = body;

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

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        customerEmail,
        customerName,
        phone,
        productIds: JSON.stringify(productIds),
      },
    });

    // Create order in the backend API using existing checkout endpoint
    const orderData = {
      productIds,
      paymentMethod: "stripe",
      customerEmail,
      customerName,
      phone,
      address,
      billingAddress,
      shippingAddress,
      zipCode,
      city,
      state,
      country,
      totalAmount,
      discountAmount,
      voucherCode,
      paymentIntentId: paymentIntent.id,
      embedded: true,
    };

    const orderResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }
    );

    if (!orderResponse.ok) {
      throw new Error("Failed to create order");
    }

    const orderData2 = await orderResponse.json();
    
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: orderData2.orderId || orderData2.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}