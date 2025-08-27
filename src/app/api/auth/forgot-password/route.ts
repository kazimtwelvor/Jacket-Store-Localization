import { NextResponse } from "next/server";
import { email, z } from "zod";
import { sendPasswordResetEmail } from "@/src/app/lib/mail";
import crypto from "crypto";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

// In-memory storage for reset tokens (in production, use a database)
const resetTokens = new Map<
  string,
  { token: string; expires: number; email: string }
>();

// Helper function to check if user exists using external API
async function userExists(email: string, storeId: string): Promise<boolean> {
  try {
    const checkUserUrl = `https://d1.fineyst.com/api/users/check-exists?email=${encodeURIComponent(
      email
    )}`;

    const response = await fetch(checkUserUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return Boolean(data);
    }

    return false;
  } catch (error) {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Get store ID from environment variable
    const storeId = process.env.NEXT_PUBLIC_STORE_ID;
    if (!storeId) {
      return NextResponse.json(
        { error: "Store ID not configured" },
        { status: 500 }
      );
    }

    const userExistsResult = await userExists(email, storeId);

    if (!userExistsResult) {
      // Return same message but don't send email
      return NextResponse.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour from now

    // Store the reset token (in production, store this in a database)
    resetTokens.set(resetToken, {
      token: resetToken,
      expires: expiresAt,
      email: email,
    });

    // Create the reset link
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    // process.env.NEXT_PUBLIC_API_URL ||
    // process.env.NEXTAUTH_URL ||
    // "https://d1.fineyst.com";
    const resetLink = `${baseUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(
      email
    )}`;

    try {
      const name = email.split("@")[0];

      const emailSent = await sendPasswordResetEmail(email, name, resetLink);

      if (emailSent) {
        return NextResponse.json({
          message:
            "If an account with that email exists, a password reset link has been sent.",
        });
      } else {
        return NextResponse.json(
          { error: "Failed to send password reset email" },
          { status: 500 }
        );
      }
    } catch (emailError) {
      return NextResponse.json(
        { error: "Failed to send password reset email" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to validate reset token (can be used by reset-password endpoint)
export function validateResetToken(token: string): {
  valid: boolean;
  email?: string;
} {
  const tokenData = resetTokens.get(token);

  if (!tokenData) {
    return { valid: false };
  }

  if (Date.now() > tokenData.expires) {
    resetTokens.delete(token); // Clean up expired token
    return { valid: false };
  }

  return { valid: true, email: tokenData.email };
}

// Helper function to consume reset token (call this after successful password reset)
export function consumeResetToken(token: string): boolean {
  return resetTokens.delete(token);
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
