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
      orderToken,
      orderInfo,
      items,
      coupon,
      discount_amount = 0,
      orderDetails,
    } = await req.json();

    if (!orderToken) {
      return NextResponse.json(
        { error: "Order token is required" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty items array" },
        { status: 400 }
      );
    }

    const auth = await getAfterpayAuth();

    // Use the amount from orderDetails (from Afterpay checkout)
    const checkoutAmount = orderDetails?.amount || {
      amount: items.reduce(
        (sum: number, item: any) =>
          sum + (item.price || 0) * (item.quantity || 1),
        0
      ),
      currency: "USD",
    };

    const capturePayload = {
      token: orderToken,
      amount: {
        amount:
          typeof checkoutAmount.amount === "string"
            ? checkoutAmount.amount
            : checkoutAmount.amount.toFixed(2),
        currency: checkoutAmount.currency || "USD",
      },
    };

    const response = await fetch(`${AFTERPAY_API_BASE}/v2/payments/capture`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(capturePayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: errorData.message || "Failed to capture Afterpay payment",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const captureData = await response.json();
    const customer = {
      first_name: orderInfo?.consumer?.givenNames || "Guest",
      last_name: orderInfo?.consumer?.surname || "User",
      email: orderInfo?.consumer?.email || "guest@example.com",
    };

    const shippingAddress = orderInfo?.shippingAddress || {};
    const billing = {
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      address_1: shippingAddress.line1 || "",
      address_2: shippingAddress.line2 || "",
      city: shippingAddress.area1 || shippingAddress.city || "",
      state: shippingAddress.region || shippingAddress.state || "",
      postcode: shippingAddress.postcode || "",
      country: shippingAddress.countryCode || "US",
      phone: shippingAddress.phoneNumber || "",
    };

    const shipping = { ...billing };

    try {
      const orderPayload = {
        productIds: items.map((item: any) => item.product?.id || item.id),
        paymentMethod: "stripe",
        customerEmail: customer.email,
        customerName: `${customer.first_name} ${customer.last_name}`,
        phone: billing.phone,
        address: `${billing.address_1}, ${billing.city}, ${billing.state}, ${billing.postcode}, ${billing.country}`,
        billingAddress: `${billing.address_1}, ${billing.city}, ${billing.state}, ${billing.postcode}, ${billing.country}`,
        shippingAddress: `${shipping.address_1}, ${shipping.city}, ${shipping.state}, ${shipping.postcode}, ${shipping.country}`,
        zipCode: billing.postcode,
        city: billing.city,
        state: billing.state,
        country: billing.country,
        totalAmount: parseFloat(
          typeof checkoutAmount.amount === "string"
            ? checkoutAmount.amount
            : checkoutAmount.amount.toFixed(2)
        ),
        discountAmount: discount_amount,
        voucherCode: coupon?.code || null,
        embedded: true,
      };

      
      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderPayload),
        }
      );

      
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create order");
      }
      const orderResult = await orderResponse.json();
      return NextResponse.json({
        success: true,
        orderId: orderResult.orderId,
        afterpay_payment_id: captureData.id,
        amount_captured:
          captureData.totalResults?.totalCapturedAmount ||
          parseFloat(
            typeof checkoutAmount.amount === "string"
              ? checkoutAmount.amount
              : checkoutAmount.amount.toFixed(2)
          ),
      });
    } catch (orderError) {
      return NextResponse.json(
        {
          error:
            "Payment processed but order creation failed. Please contact support.",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
