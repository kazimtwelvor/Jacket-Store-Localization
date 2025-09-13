
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  
  if (pathname.startsWith("/api")) {
    const origin = request.headers.get("origin") || "http://localhost:4000"
    const response = NextResponse.next()
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.set("Access-Control-Max-Age", "86400")
    return response
  }

  if (!pathname.startsWith("/_next") && !pathname.startsWith("/api") && !pathname.includes(".")) {
    const countryFromUrl = searchParams.get("country")
    const countryFromCookie = request.cookies.get("userCountry")?.value

    if (!countryFromUrl && countryFromCookie) {
      const url = request.nextUrl.clone()
      url.searchParams.set("country", countryFromCookie)
      return NextResponse.redirect(url)
    }

    if (countryFromUrl && countryFromCookie && countryFromUrl.toLowerCase() !== countryFromCookie.toLowerCase()) {
      const url = request.nextUrl.clone()
      url.searchParams.set("country", countryFromCookie.toLowerCase())
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)"
  ],
}

