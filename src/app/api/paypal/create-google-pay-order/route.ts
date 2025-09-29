import { filterPayPalResponse } from "@/src/app/lib/paypal-filter";
import { NextResponse } from "next/server";
// import { filterPayPalResponse } from "@/src/app/lib/paypal-filter";
import { decrypt } from "@/src/app/utils/decrypt";

async function getAccessToken() {
  // Get PayPal credentials from backend
  const settingsRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/payment-settings`,
    {
      cache: "no-store",
    }
  );
  if (!settingsRes.ok) throw new Error("Failed to fetch payment settings");
  const settings = await settingsRes.json();
  if (!settings.paypalClientId || !settings.paypalClientSecret)
    throw new Error("PayPal credentials not available");

  const clientId = decrypt(
    settings.paypalClientId,
    "a7b9c2d4e6f8g1h3j5k7m9n2p4q6r8s0"
  );
  const clientSecret = decrypt(
    settings.paypalClientSecret,
    "a7b9c2d4e6f8g1h3j5k7m9n2p4q6r8s0"
  );

  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const resp = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({}));
    console.error("PayPal auth failed:", errorData);
    throw new Error(
      `PayPal authentication failed: ${resp.status} ${resp.statusText}`
    );
  }

  const data = await resp.json();
  return data.access_token as string;
}

export async function POST(req: Request) {
  try {
    const {
      items,
      total_amount,
      invoice_id,
      coupon,
      discount_amount,
      sca_method = "SCA_WHEN_REQUIRED", // Allow configurable SCA method
    }: {
      items: Array<{
        name: string;
        price: number;
        quantity: number;
        id?: string;
      }>;
      total_amount: number;
      invoice_id?: string;
      coupon?: { code: string; id: number; description?: string };
      discount_amount?: number;
      sca_method?: "SCA_ALWAYS" | "SCA_WHEN_REQUIRED";
    } = await req.json();

    // CRITICAL: Validate payload structure
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty items array" },
        { status: 400 }
      );
    }

    // CRITICAL: Validate total amount
    if (!total_amount || total_amount <= 0) {
      return NextResponse.json(
        { error: "Valid total amount is required" },
        { status: 400 }
      );
    }

    // CRITICAL: Validate items
    let calculatedTotal = 0;
    for (const item of items) {
      if (
        !item.name ||
        typeof item.price !== "number" ||
        typeof item.quantity !== "number"
      ) {
        return NextResponse.json(
          { error: "Invalid item data" },
          { status: 400 }
        );
      }
      if (item.price <= 0 || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Item price and quantity must be greater than 0" },
          { status: 400 }
        );
      }
      if (item.quantity > 50) {
        return NextResponse.json(
          { error: "Quantity per item cannot exceed 50" },
          { status: 400 }
        );
      }
      calculatedTotal += item.price * item.quantity;
    }

    // Calculate discount amount
    const discountAmount = discount_amount || 0;
    const expectedTotal = calculatedTotal - discountAmount;

    // Validate total matches calculated total after discount (within small tolerance for rounding)
    const totalDiff = Math.abs(total_amount - expectedTotal);
    if (totalDiff > 0.01) {
      return NextResponse.json(
        {
          error: "Total amount does not match calculated total",
          details: {
            provided_total: total_amount,
            calculated_total: calculatedTotal,
            discount_amount: discountAmount,
            expected_total: expectedTotal,
            difference: totalDiff,
          },
        },
        { status: 400 }
      );
    }

    const token = await getAccessToken();

    // Create line items for PayPal
    const lineItems = items.map((item) => ({
      name: item.name,
      quantity: item.quantity.toString(),
      unit_amount: {
        currency_code: "USD",
        value: item.price.toFixed(2),
      },
      category: "PHYSICAL_GOODS",
    }));

    const itemTotal = calculatedTotal;

    // Create PayPal order with Google Pay specific configuration
    const orderResp = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              invoice_id: invoice_id,
              amount: {
                currency_code: "USD",
                value: total_amount.toFixed(2),
                breakdown:
                  discountAmount > 0
                    ? {
                        item_total: {
                          currency_code: "USD",
                          value: itemTotal.toFixed(2),
                        },
                        discount: {
                          currency_code: "USD",
                          value: discountAmount.toFixed(2),
                        },
                      }
                    : {
                        item_total: {
                          currency_code: "USD",
                          value: total_amount.toFixed(2),
                        },
                      },
              },
              items: lineItems,
            },
          ],
          // Google Pay specific configuration with configurable 3DS
          payment_source: {
            google_pay: {
              attributes: {
                verification: {
                  method: sca_method, // Use configurable SCA method (SCA_ALWAYS or SCA_WHEN_REQUIRED)
                },
              },
              experience_context: {
                payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
                brand_name: "PP Store",
                locale: "en-US",
                landing_page: "NO_PREFERENCE",
                shipping_preference: "GET_FROM_FILE",
                user_action: "PAY_NOW",
                return_url: `${
                  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
                }/3ds-return`,
                cancel_url: `${
                  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
                }/checkout`,
              },
            },
          },
          application_context: {
            brand_name: "PP Store",
            locale: "en-US",
            landing_page: "NO_PREFERENCE",
            shipping_preference: "GET_FROM_FILE",
            user_action: "PAY_NOW",
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/3ds-return`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
          },
        }),
      }
    );

    if (!orderResp.ok) {
      const errorData = await orderResp.json().catch(() => ({}));
      console.error("PayPal Google Pay order creation failed:", {
        status: orderResp.status,
        statusText: orderResp.statusText,
        error: errorData,
        total: total_amount,
        invoiceId: invoice_id,
      });

      // Check for specific PayPal errors and provide user-friendly messages
      const paypalError = errorData?.details?.[0] || errorData;
      const errorDescription = paypalError?.description?.toLowerCase() || "";
      let userMessage = "Unable to process payment";

      if (
        paypalError?.issue === "INVALID_REQUEST" ||
        paypalError?.issue === "VALIDATION_ERROR"
      ) {
        userMessage = "Invalid payment information - please check your details";
      } else if (paypalError?.issue === "PERMISSION_DENIED") {
        userMessage =
          "Payment method not accepted - please try a different payment method";
      } else if (
        paypalError?.issue === "UNPROCESSABLE_ENTITY" ||
        errorDescription.includes("insufficient") ||
        errorDescription.includes("declined")
      ) {
        userMessage = "Payment failed. Please try again.";
      } else if (paypalError?.issue === "INSTRUMENT_DECLINED") {
        userMessage =
          "Payment method declined - please try a different card or payment method";
      } else if (errorDescription.includes("limit")) {
        userMessage =
          "Payment limit exceeded - please contact your bank or try a smaller amount";
      } else if (orderResp.status === 422) {
        userMessage =
          "Payment cannot be processed - please check your payment method";
      }

      return NextResponse.json(
        {
          error: userMessage,
          paypalError: true,
          paypalErrorDetails: {
            status: orderResp.status,
            statusText: orderResp.statusText,
            fullError: errorData,
            filteredError: paypalError,
            orderId: invoice_id,
          },
        },
        { status: 400 }
      );
    }

    const rawPp = await orderResp.json();
    const pp = filterPayPalResponse(rawPp);

    // CRITICAL: Validate PayPal response
    if (!pp?.id || !pp?.status) {
      console.error("PayPal returned invalid order response:", pp);
      return NextResponse.json(
        { error: "Invalid payment order response" },
        { status: 500 }
      );
    }

    // Log successful order creation for monitoring
    console.log("PayPal Google Pay order created successfully:", {
      orderId: pp.id,
      status: pp.status,
      total: total_amount,
      invoiceId: invoice_id,
    });

    return NextResponse.json({
      id: pp.id,
      status: pp.status,
      links: pp.links,
      invoice_id: invoice_id,
    });
  } catch (e) {
    console.error("PayPal Google Pay order creation error:", e);
    const errorMessage =
      e instanceof Error ? e.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Failed to create PayPal order",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
