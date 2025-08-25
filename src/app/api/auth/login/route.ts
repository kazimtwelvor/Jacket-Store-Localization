import { sendLoginNotificationEmail } from "@/src/app/lib/mail";
import { NextResponse } from "next/server";
import { z } from "zod";
// import { sendLoginNotificationEmail } from "@/lib/mail";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  storeId: z.string().min(1, "Store ID is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, storeId } = validationResult.data;

    // Forward the login request to the Admin API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    // Use the correct endpoint: /api/auth/login instead of /api/{storeId}/auth/login
    const adminApiUrl = `${apiUrl.split("/api/")[0]}/api/auth/login`;

    try {
      const response = await fetch(adminApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          storeId,
        }),
      });

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await response.json();
            return NextResponse.json(
              {
                error: errorData.error || "Login failed",
              },
              { status: response.status }
            );
          } catch (parseError) {
            return NextResponse.json(
              {
                error: `Login failed with status ${response.status}`,
              },
              { status: response.status }
            );
          }
        } else {
          const textResponse = await response.text();
          return NextResponse.json(
            {
              error: `Login failed with status ${response.status}`,
            },
            { status: response.status }
          );
        }
      }

      // For successful responses, try to parse JSON
      try {
        const responseData = await response.json();


        if (process.env.SEND_LOGIN_NOTIFICATIONS === "true") {
          try {
            const loginTime = new Date();
            const emailSent = await sendLoginNotificationEmail(
              email,
              email.split("@")[0],
              loginTime
            );
            if (emailSent) {
            } else {
            }
          } catch (emailError) {
            // Don't fail the login if email fails
          }
        }

        return NextResponse.json({
          message: "Login successful",
          user: responseData.user,
          token: responseData.token,
        });
      } catch (parseError) {
        // If we can't parse JSON but the status was OK, still return success
        if (response.status >= 200 && response.status < 300) {
          return NextResponse.json({
            message: "Login successful",
            user: { email },
            token: "fallback-token", // This is a fallback and won't work for authentication
          });
        } else {
          return NextResponse.json(
            {
              error: "Error processing login response",
            },
            { status: 500 }
          );
        }
      }
    } catch (fetchError) {
      return NextResponse.json(
        {
          error: "Could not connect to authentication service",
        },
        { status: 503 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
