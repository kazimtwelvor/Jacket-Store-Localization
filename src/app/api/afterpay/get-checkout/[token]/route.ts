import { NextRequest, NextResponse } from "next/server";

const AFTERPAY_API_BASE =
  process.env.AFTERPAY_API_BASE || "https://global-api-sandbox.afterpay.com";

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

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const auth = await getAfterpayAuth();

    console.log(`Retrieving Afterpay checkout details for token: ${token}`);

    const response = await fetch(`${AFTERPAY_API_BASE}/v2/checkouts/${token}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Afterpay get checkout failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      return NextResponse.json(
        {
          error: errorData.message || "Failed to retrieve Afterpay checkout",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const checkoutData = await response.json();
    console.log("Afterpay checkout details retrieved successfully");

    return NextResponse.json(checkoutData);
  } catch (error: any) {
    console.error("Afterpay get checkout error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
