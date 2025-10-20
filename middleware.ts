
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

function getClientIp(request: NextRequest): string {
  const candidates = [
    request.headers.get("x-forwarded-for"),
    request.headers.get("x-real-ip"),
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-client-ip"),
    request.headers.get("fastly-client-ip"),
    (request as any).ip,
  ].filter(Boolean) as string[]
  const first = candidates[0]
  if (!first) return "unknown"
  const ip = first.includes(",") ? first.split(",")[0].trim() : first.trim()
  return ip || "unknown"
}

function detectCountryCode(request: NextRequest): string {
  const candidates = [
    request.headers.get("cf-ipcountry"),           
    request.headers.get("x-vercel-ip-country"),      
    request.headers.get("x-geo-country"),            
    request.headers.get("x-country-code"),          
    (request as any).geo?.country,                  
  ]
  const code = candidates.find(Boolean)?.toString().toUpperCase()
  if (!code) return "US"
  return code
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const method = request.method
  const host = request.headers.get("host") || request.nextUrl.host || "unknown-host"
  const ip = getClientIp(request)
  const debugEnabled = process.env.NODE_ENV !== "production" || request.nextUrl.searchParams.has("__geo_debug") || process.env.GEO_DEBUG === "1"
  
  if (pathname.startsWith("/api")) {
    const origin = request.headers.get("origin") || "http://localhost:4000"
    const response = NextResponse.next()
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.set("Access-Control-Max-Age", "86400")
    if (debugEnabled) {
      response.headers.set("x-geo-ip", ip)
      response.headers.set("x-geo-cf-ipcountry", request.headers.get("cf-ipcountry") || "")
      response.headers.set("x-geo-vercel-country", request.headers.get("x-vercel-ip-country") || "")
      response.headers.set("x-geo-country", request.headers.get("x-geo-country") || "")
    }
    return response
  }

  // Build supported countries dynamically from Countries API, fallback to defaults
  const getSupportedCountryCodes = async (): Promise<Set<string>> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) return new Set(["us", "uk", "ca", "au"]) // fallback
      const baseUrl = apiUrl.replace(/\/api\/[a-f0-9-]+$/i, "")
      const res = await fetch(`${baseUrl}/api/countries?isActive=true&sortBy=sortOrder&sortOrder=asc&limit=100`, {
        headers: { "Accept": "application/json", "User-Agent": "NextJS-Middleware" },
        cache: "no-store",
      })
      if (!res.ok) return new Set(["us", "uk", "ca", "au"]) // fallback
      const data = await res.json()
      const codes: string[] = Array.isArray(data?.countries)
        ? data.countries.map((c: any) => (c?.countryCode || "").toString().toLowerCase()).filter(Boolean)
        : []
      return codes.length ? new Set(codes) : new Set(["us", "uk", "ca", "au"]) // fallback
    } catch (err) {
      if (debugEnabled) {
        console.error(`[GEO-COUNTRIES] Failed to fetch active countries host=${host} ip=${ip} err=${(err as Error)?.message}`)
      }
      return new Set(["us", "uk", "ca", "au"]) // fallback
    }
  }

  const supportedCountries = await getSupportedCountryCodes()
  const alreadyLocalized = new RegExp(`^/(${Array.from(supportedCountries).join("|")})(/?|$)`, "i").test(pathname)

  if (!alreadyLocalized) {
    const countryIso = detectCountryCode(request)

    // Map ISO 3166-1 Alpha-2 -> our country segments
    const mapToSegment = (cc: string): string => {
      const lower = cc.toLowerCase()
      // Prefer direct match if API provided that code
      if (supportedCountries.has(lower)) return lower
      // Common normalization
      if (cc === "GB" && supportedCountries.has("uk")) return "uk"
      if (cc === "US" && supportedCountries.has("us")) return "us"
      if (cc === "CA" && supportedCountries.has("ca")) return "ca"
      if (cc === "AU" && supportedCountries.has("au")) return "au"
      // Fallback to first active (or us)
      return supportedCountries.has("us") ? "us" : Array.from(supportedCountries)[0] || "us"
    }

    const segment = mapToSegment(countryIso)

    // Only redirect the homepage "/" or naked paths to a localized root
    if (pathname === "/") {
      const url = request.nextUrl.clone()
      url.pathname = `/${segment}/`
      url.search = searchParams.toString()

      // Log host and decision for observability (appears in edge logs)
      if (debugEnabled) {
        console.log(`[GEO-REDIRECT] method=${method} host=${host} ip=${ip} countryIso=${countryIso} segment=${segment} to=${url.pathname}${url.search ? `?${url.search}` : ''}`)
      }

      const res = NextResponse.redirect(url)
      res.headers.set("x-geo-redirect", `${host}; country=${countryIso}; segment=${segment}`)
      if (debugEnabled) {
        res.headers.set("x-geo-ip", ip)
        res.headers.set("x-geo-country-iso", countryIso)
        res.headers.set("x-geo-segment", segment)
        res.headers.set("x-geo-supported", Array.from(supportedCountries).join(","))
        res.headers.set("x-geo-cf-ipcountry", request.headers.get("cf-ipcountry") || "")
        res.headers.set("x-geo-vercel-country", request.headers.get("x-vercel-ip-country") || "")
        res.headers.set("x-geo-raw-xff", request.headers.get("x-forwarded-for") || "")
      }
      return res
    }
    if (debugEnabled) {
      console.log(`[GEO-PASS] method=${method} host=${host} ip=${ip} path=${pathname} countryIso=${countryIso} alreadyLocalized=${alreadyLocalized}`)
    }
  }
  const pass = NextResponse.next()
  if (debugEnabled) {
    pass.headers.set("x-geo-ip", ip)
    pass.headers.set("x-geo-supported", Array.from(supportedCountries).join(","))
    pass.headers.set("x-geo-cf-ipcountry", request.headers.get("cf-ipcountry") || "")
    pass.headers.set("x-geo-vercel-country", request.headers.get("x-vercel-ip-country") || "")
    pass.headers.set("x-geo-country", request.headers.get("x-geo-country") || "")
  }
  return pass
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)"
  ],
}
