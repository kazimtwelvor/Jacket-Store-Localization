import { decrypt } from "@/src/app/utils/decrypt";
import { NextRequest, NextResponse } from "next/server";
// import { decrypt } from "../../utils/decrypt"

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

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

    // Get PayPal access token
    const tokenResponse = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to get PayPal access token");
    }

    const { access_token } = await tokenResponse.json();

    // Fetch product details for each item
    const productPromises = items.map(
      async (item: { id: string; quantity: number }) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${item.id}`
        );
        if (!response.ok) throw new Error(`Product ${item.id} not found`);
        const product = await response.json();
        return { ...product, quantity: item.quantity };
      }
    );

    const products = await Promise.all(productPromises);

    // Calculate total amount
    const totalAmount = products.reduce((sum, product) => {
      return sum + parseFloat(product.price) * product.quantity;
    }, 0);

    // Create PayPal order
    const orderResponse = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: totalAmount.toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: totalAmount.toFixed(2),
                  },
                },
              },
              items: products.map((product) => ({
                name: product.name,
                unit_amount: {
                  currency_code: "USD",
                  value: parseFloat(product.price).toFixed(2),
                },
                quantity: product.quantity.toString(),
              })),
            },
          ],
        }),
      }
    );

    if (!orderResponse.ok) {
      const errorData = await orderResponse.text();
      throw new Error(`PayPal order creation failed: ${errorData}`);
    }

    const orderData = await orderResponse.json();
    return NextResponse.json({ orderId: orderData.id });
  } catch (error: any) {
    console.error("PayPal create order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create PayPal order" },
      { status: 500 }
    );
  }
}
