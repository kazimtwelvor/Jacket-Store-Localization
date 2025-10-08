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
      }
    }
    
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }
    
    const stripe = new Stripe(stripeSecretKey);
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

    const orderId = `stripe_${paymentIntent.id}`;
    
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}