
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only apply to /api routes
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // Get the origin from the request headers or default to localhost:3000
  const origin = request.headers.get("origin") || "http://localhost:3000"

  // Clone the response and add CORS headers
  const response = NextResponse.next()

  response.headers.set("Access-Control-Allow-Origin", origin)
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  response.headers.set("Access-Control-Max-Age", "86400")

  return response
}

export const config = {
  matcher: "/api/:path*",
}

