import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for verification codes (use Redis in production)
const verificationCodes = new Map<string, { code: string; expires: number }>();

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    const stored = verificationCodes.get(email);
    if (!stored) {
      return NextResponse.json({ error: 'No verification code found' }, { status: 400 });
    }

    if (Date.now() > stored.expires) {
      verificationCodes.delete(email);
      return NextResponse.json({ error: 'Verification code expired' }, { status: 400 });
    }

    if (stored.code !== code) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Code is valid, remove it
    verificationCodes.delete(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}

// Store verification code
export async function PUT(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    const expires = Date.now() + 1 * 60 * 1000; // 1 minute
    
    verificationCodes.set(email, { code, expires });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to store code' }, { status: 500 });
  }
}