
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

async function getCountryFromIp(ip: string): Promise<string | null> {
  if (!ip || ip === "unknown" || ip.startsWith("::1") || ip.startsWith("127.") || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return null
  }
  
  try {
    const services = [
      `https://ipapi.co/${ip}/country/`,
      `https://ip-api.com/json/${ip}?fields=countryCode`,
      `https://ipinfo.io/${ip}/country`
    ]
    
    for (const service of services) {
      try {
        const response = await fetch(service, {
          headers: { "User-Agent": "NextJS-Middleware" },
          signal: AbortSignal.timeout(3000) 
        })
        
        if (response.ok) {
          const data = await response.text()
          let countryCode = data.trim().toUpperCase()
          
          if (service.includes("ip-api.com")) {
            const json = JSON.parse(data)
            countryCode = json.countryCode?.toUpperCase()
          }
          
          if (countryCode && countryCode.length === 2) {
            return countryCode
          }
        }
      } catch (err) {
        continue
      }
    }
  } catch (err) {
  }
  
  return null
}

async function detectCountryCode(request: NextRequest): Promise<string> {
  const candidates = [
    request.headers.get("cf-ipcountry"),           
    request.headers.get("x-vercel-ip-country"),      
    request.headers.get("x-geo-country"),            
    request.headers.get("x-country-code"),          
    (request as any).geo?.country,                           
  ]
  const headerCode = candidates.find(Boolean)?.toString().toUpperCase()
  
  if (headerCode && headerCode.length === 2) {
    return headerCode
  }
  
  const clientIp = getClientIp(request)
  const ipCountry = await getCountryFromIp(clientIp)
  
  if (ipCountry) {
    return ipCountry
  }
  
  return "US"
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

  if (pathname === "/") {
    if (debugEnabled) {
      console.log(`[GEO-PASS] method=${method} host=${host} ip=${ip} - letting client handle redirect`)
    }
    const pass = NextResponse.next()
    if (debugEnabled) {
      pass.headers.set("x-geo-ip", ip)
      pass.headers.set("x-geo-supported", Array.from(supportedCountries).join(","))
      pass.headers.set("x-geo-cf-ipcountry", request.headers.get("cf-ipcountry") || "")
      pass.headers.set("x-geo-vercel-country", request.headers.get("x-vercel-ip-country") || "")
      pass.headers.set("x-geo-raw-xff", request.headers.get("x-forwarded-for") || "")
    }
    return pass
  }

  if (!alreadyLocalized) {
    const countryIso = await detectCountryCode(request)

    const mapToSegment = (cc: string): string => {
      const lower = cc.toLowerCase()
      
      if (supportedCountries.has(lower)) return lower
      
      if (cc === "GB" && supportedCountries.has("uk")) return "uk"
      if (cc === "US" && supportedCountries.has("us")) return "us"
      if (cc === "CA" && supportedCountries.has("ca")) return "ca"
      if (cc === "AU" && supportedCountries.has("au")) return "au"
      
      if (cc === "GB" && !supportedCountries.has("uk")) {
        return supportedCountries.has("us") ? "us" : Array.from(supportedCountries)[0] || "us"
      }
      
      return supportedCountries.has("us") ? "us" : Array.from(supportedCountries)[0] || "us"
    }

    const segment = mapToSegment(countryIso)
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
    "/api/:path*"
  ],
}
// 
