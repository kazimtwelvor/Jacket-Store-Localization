import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DEFAULT_COUNTRY = 'us'

// Valid country codes - update this list based on your active countries from database
// You can also fetch this dynamically from your API
const VALID_COUNTRIES = ['us', 'uk', 'ca', 'au', 'de', 'fr', 'es', 'it']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip API routes, static files, special Next.js routes, and files with extensions
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname.startsWith('/auth/') // Skip auth routes if you have them
  ) {
    return NextResponse.next()
  }
  
  // Parse pathname
  const pathParts = pathname.split('/').filter(Boolean)
  const firstPart = pathParts[0]?.toLowerCase()
  
  // If first part is a valid country code, allow it
  if (firstPart && VALID_COUNTRIES.includes(firstPart)) {
    console.log(`[MIDDLEWARE] Valid country in path: ${firstPart}`)
    return NextResponse.next()
  }
  
  if (pathname === '/') {
    console.log(`[MIDDLEWARE] Root path - letting client handle redirect`)
    return NextResponse.next()
  }
  
  // No country in path - redirect to default country
  // Try to get saved country from cookie
  const savedCountry = request.cookies.get('selected-country')?.value
  const targetCountry = (savedCountry && VALID_COUNTRIES.includes(savedCountry)) 
    ? savedCountry 
    : DEFAULT_COUNTRY
  
  const newUrl = request.nextUrl.clone()
  newUrl.pathname = `/${targetCountry}${pathname === '/' ? '' : pathname}`
  
  console.log(`[MIDDLEWARE] Redirecting ${pathname} -> ${newUrl.pathname}`)
  
  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}





