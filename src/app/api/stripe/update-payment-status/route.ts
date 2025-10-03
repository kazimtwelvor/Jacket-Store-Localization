import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { decrypt } from "../../../utils/decrypt";
import { is } from "date-fns/locale";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentIntentId, paymentMethod } = body;

    if (!orderId || !paymentIntentId) {
      return NextResponse.json(
        { error: "Missing orderId or paymentIntentId" },
        { status: 400 }
      );
    }

      const stripeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment-settings`
    );
    console.log("Stripe response status:", stripeResponse);
    if (!stripeResponse.ok) {
      throw new Error("Failed to fetch Stripe configuration");
    }

    const stripeConfig = await stripeResponse.json();
    console.log("Fetched Stripe config:", stripeConfig);
    const encryptionKey = "a7b9c2d4e6f8g1h3j5k7m9n2p4q6r8s0";
    const stripeSecretKey = decrypt(
      stripeConfig.stripeSecretKey,
      encryptionKey
    );

    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeSecretKey);

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log("Retrieved payment intent:", paymentIntent);
    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not successful" },
        { status: 400 }
      );
    }


    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
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
              paymentStatus: paymentIntent.status   ,
              isPaid: true,
              paymentValidation: process.env.IS_SKIP_VALIDATION || "",
            }),
          }
        );
        
        console.log("Backend update response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Backend API error:", {
            status: response.status,
            statusText: response.statusText,
            error: errorText,
            url: response.url
          });
        } else {
          const result = await response.json();
          console.log("Backend update successful:", result);
        }
      } catch (fetchError) {
        console.error("Network error updating backend:", fetchError);
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