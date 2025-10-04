import { NextResponse } from "next/server";

const AFTERPAY_API_BASE = "https://global-api-sandbox.afterpay.com";

const AFTERPAY_MERCHANT_ID = process.env.AFTERPAY_MERCHANT_ID;
const AFTERPAY_SECRET_KEY = process.env.AFTERPAY_SECRET;

async function getAfterpayAuth() {
  if (!AFTERPAY_MERCHANT_ID || !AFTERPAY_SECRET_KEY) {
    throw new Error("Missing Afterpay configuration");
  }

  return Buffer.from(`${AFTERPAY_MERCHANT_ID}:${AFTERPAY_SECRET_KEY}`).toString(
    "base64"
  );
}

export async function POST(req: Request) {
  try {
    const {
      items,
      amount,
      mode,
      merchant,
      coupon,
      discount_amount = 0,
    } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty items array" },
        { status: 400 }
      );
    }

    if (!amount || !amount.amount || !amount.currency) {
      return NextResponse.json(
        { error: "Invalid amount object" },
        { status: 400 }
      );
    }

    if (mode !== "express") {
      return NextResponse.json(
        { error: "Only express mode is supported" },
        { status: 400 }
      );
    }

    if (!merchant || !merchant.popupOriginUrl) {
      return NextResponse.json(
        { error: "Invalid merchant configuration" },
        { status: 400 }
      );
    }

    const auth = await getAfterpayAuth();

    // Calculate totals
    const itemTotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const finalAmount = Math.max(0, itemTotal - discount_amount);

    // Prepare Afterpay checkout payload for express mode
    const checkoutPayload = {
      amount: {
        amount: finalAmount.toFixed(2),
        currency: amount.currency,
      },
      mode: "express",
      merchant: {
        popupOriginUrl: merchant.popupOriginUrl,
      },
      // No consumer details - Afterpay will collect these
      items: items.map((item: any) => ({
        name: item.name.substring(0, 250), // Afterpay limit
        sku: item.id?.toString() || "",
        quantity: item.quantity,
        price: {
          amount: item.price.toFixed(2),
          currency: amount.currency,
        },
        categories: [["Clothing"]], // Default category
      })),
      // No shipping details - Afterpay will collect these in express mode
      discounts:
        discount_amount > 0
          ? [
              {
                displayName: coupon?.code || "Discount",
                amount: {
                  amount: discount_amount.toFixed(2),
                  currency: amount.currency,
                },
              },
            ]
          : [],
    };

    console.log(
      "Creating Afterpay checkout with payload:",
      JSON.stringify(checkoutPayload, null, 2)
    );

    const response = await fetch(`${AFTERPAY_API_BASE}/v2/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(checkoutPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Afterpay checkout creation failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      return NextResponse.json(
        {
          error: errorData.message || "Failed to create Afterpay checkout",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const checkoutData = await response.json();
    console.log("Afterpay checkout created successfully:", checkoutData.token);

    return NextResponse.json({
      token: checkoutData.token,
      redirectCheckoutUrl: checkoutData.redirectCheckoutUrl,
    });
  } catch (error: any) {
    console.error("Afterpay checkout creation error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
