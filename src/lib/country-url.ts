/**
 * Utility functions for building country-aware URLs
 * Use these helpers to avoid hardcoding country codes in links
 */

/**
 * Build a URL with country code prefix
 * @param path - The path without country (e.g., '/collections', 'about-us')
 * @param country - Country code (e.g., 'us', 'uk') - optional if using hook
 * @returns Full path with country (e.g., '/us/collections')
 */
export function withCountry(path: string, country?: string): string {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  
  // If country is provided, use it
  if (country) {
    return `/${country}${cleanPath}`
  }
  
  // Otherwise, try to get from localStorage (client-side only)
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('country-storage')
      if (stored) {
        const parsed = JSON.parse(stored)
        const countryCode = parsed.state?.selectedCountry?.countryCode || 'us'
        return `/${countryCode}${cleanPath}`
      }
    } catch (e) {
      console.warn('Failed to get country from storage:', e)
    }
  }
  
  // Fallback to 'us'
  return `/us${cleanPath}`
}

/**
 * Get current country code from URL
 * @returns Country code from current URL or 'us' as fallback
 */
export function getCurrentCountryFromUrl(): string {
  if (typeof window === 'undefined') return 'us'
  
  const pathParts = window.location.pathname.split('/').filter(Boolean)
  const firstPart = pathParts[0]?.toLowerCase()
  
  // Check if first part looks like a country code (2 letters)
  if (firstPart && firstPart.length === 2 && /^[a-z]{2}$/.test(firstPart)) {
    return firstPart
  }
  
  return 'us'
}

/**
 * Build API URL with country parameter
 * @param endpoint - API endpoint (e.g., '/api/products')
 * @param params - Additional query parameters
 * @param country - Country code (optional)
 * @returns Full API URL with country parameter
 */
export function buildApiUrl(
  endpoint: string,
  params: Record<string, any> = {},
  country?: string
): string {
  const cn = country || getCurrentCountryFromUrl()
  
  const queryParams = new URLSearchParams({
    ...params,
    cn
  }).toString()
  
  return `${endpoint}?${queryParams}`
}

/**
 * React hook-compatible URL builder
 * Use this in components with useCountryCode()
 */
export function createUrlBuilder(countryCode: string) {
  return (path: string) => withCountry(path, countryCode)
}

/**
 * Update links in metadata/static content
 * @param content - HTML or string content with links
 * @param country - Country code
 * @returns Updated content with country-prefixed links
 */
export function updateLinksWithCountry(content: string, country: string): string {
  // Update /us/ to /{country}/
  return content.replace(/\/us\//g, `/${country}/`)
}





