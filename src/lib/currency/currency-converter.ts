/**
 * Currency Converter Utility
 * Handles currency conversion with caching and fallback rates
 */

export interface ExchangeRates {
  [currency: string]: number
}

export interface CurrencyConfig {
  code: string
  symbol: string
  name: string
}

// Currency configurations for each country
export const CURRENCY_MAP: Record<string, CurrencyConfig> = {
  us: { code: 'USD', symbol: '$', name: 'US Dollar' },
  uk: { code: 'GBP', symbol: '£', name: 'British Pound' },
  ca: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  au: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  eu: { code: 'EUR', symbol: '€', name: 'Euro' },
}

// Fallback exchange rates (updated periodically)
// These are used if the API fails
const FALLBACK_RATES: ExchangeRates = {
  USD: 1.0,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.52,
  EUR: 0.92,
}

// Cache configuration
const CACHE_KEY = 'exchange_rates'
const CACHE_DURATION = 3600000 // 1 hour in milliseconds

interface CachedRates {
  rates: ExchangeRates
  timestamp: number
}

/**
 * Get cached exchange rates from localStorage
 */
function getCachedRates(): CachedRates | null {
  if (typeof window === 'undefined') return null
  
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const data: CachedRates = JSON.parse(cached)
    const now = Date.now()
    
    // Check if cache is still valid
    if (now - data.timestamp < CACHE_DURATION) {
      return data
    }
    
    // Cache expired, remove it
    localStorage.removeItem(CACHE_KEY)
    return null
  } catch (error) {
    console.error('[CURRENCY] Error reading cached rates:', error)
    return null
  }
}

/**
 * Save exchange rates to localStorage
 */
function setCachedRates(rates: ExchangeRates): void {
  if (typeof window === 'undefined') return
  
  try {
    const data: CachedRates = {
      rates,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('[CURRENCY] Error caching rates:', error)
  }
}

/**
 * Fetch exchange rates from API
 * Using exchangerate-api.com (free tier: 1,500 requests/month)
 * Alternative: fixer.io, currencyapi.com, or exchangeratesapi.io
 */
async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    // Check cache first
    const cached = getCachedRates()
    if (cached) {
      console.log('[CURRENCY] Using cached exchange rates')
      return cached.rates
    }
    
    console.log('[CURRENCY] Fetching fresh exchange rates from API')
    
    // Using exchangerate-api.com (free tier, no API key required)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data?.rates) {
      const rates: ExchangeRates = data.rates
      setCachedRates(rates)
      console.log('[CURRENCY] Exchange rates fetched and cached')
      return rates
    }
    
    throw new Error('Invalid API response')
  } catch (error) {
    console.error('[CURRENCY] Error fetching exchange rates:', error)
    console.log('[CURRENCY] Using fallback rates')
    return FALLBACK_RATES
  }
}

/**
 * Convert price from USD to target currency
 */
export async function convertPrice(
  priceUSD: number,
  targetCurrency: string
): Promise<number> {
  try {
    const rates = await fetchExchangeRates()
    const rate = rates[targetCurrency] || 1
    
    return priceUSD * rate
  } catch (error) {
    console.error('[CURRENCY] Error converting price:', error)
    return priceUSD
  }
}

/**
 * Convert price synchronously using cached or fallback rates
 * Use this for immediate conversions without async/await
 */
export function convertPriceSync(
  priceUSD: number,
  targetCurrency: string
): number {
  try {
    // Try to get cached rates
    const cached = getCachedRates()
    const rates = cached?.rates || FALLBACK_RATES
    
    const rate = rates[targetCurrency] || 1
    return priceUSD * rate
  } catch (error) {
    console.error('[CURRENCY] Error converting price:', error)
    return priceUSD
  }
}

/**
 * Format price with currency symbol
 */
export function formatPrice(
  price: number,
  currencyCode: string,
  locale?: string
): string {
  try {
    const currency = CURRENCY_MAP[currencyCode.toLowerCase()]
    
    if (!currency) {
      // Fallback formatting
      return `${currencyCode} ${price.toFixed(2)}`
    }
    
    // Use Intl.NumberFormat for proper currency formatting
    const formatter = new Intl.NumberFormat(locale || 'en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    
    return formatter.format(price)
  } catch (error) {
    console.error('[CURRENCY] Error formatting price:', error)
    return `${price.toFixed(2)}`
  }
}

/**
 * Get currency info for a country code
 */
export function getCurrencyInfo(countryCode: string): CurrencyConfig {
  return CURRENCY_MAP[countryCode.toLowerCase()] || CURRENCY_MAP.us
}

/**
 * Preload exchange rates (call this on app initialization)
 */
export async function preloadExchangeRates(): Promise<void> {
  try {
    await fetchExchangeRates()
  } catch (error) {
    console.error('[CURRENCY] Error preloading exchange rates:', error)
  }
}

