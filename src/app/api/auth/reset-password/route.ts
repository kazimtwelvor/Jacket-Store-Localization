import { NextResponse } from "next/server"
import { z } from "zod"
import { validateResetToken, consumeResetToken } from "../forgot-password/route"

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validationResult = resetPasswordSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }

    const { token, password } = validationResult.data
    
    // Get store ID from environment variable
    const storeId = process.env.NEXT_PUBLIC_STORE_ID;
    if (!storeId) {
      return NextResponse.json(
        { error: "Store ID not configured" },
        { status: 500 }
      );
    }

    // Validate the reset token
    const tokenValidation = validateResetToken(token)
    
    if (!tokenValidation.valid) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Hash the new password
    // 2. Update the user's password in your database
    // 3. Invalidate any existing sessions for this user
    
    // For now, we'll simulate a successful password update
    // In production, implement actual password update logic here
    
    try {
      // Example of what you might do:
      // const hashedPassword = await bcrypt.hash(password, 12)
      // await updateUserPassword(tokenValidation.email!, hashedPassword)
      
      // Consume the reset token so it can't be used again
      consumeResetToken(token);
      
      return NextResponse.json({
        message: "Password reset successful",
      });
    } catch (updateError) {
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
  })
}
