/**
 * Currency Symbol Display Utility
 * Shows appropriate currency symbol based on country (NO CONVERSION)
 * All prices remain in USD, only the symbol changes
 */

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

/**
 * No conversion - returns original USD price
 */
export async function convertPrice(
  priceUSD: number,
  targetCurrency: string
): Promise<number> {
  return priceUSD
}

/**
 * No conversion - returns original USD price
 */
export function convertPriceSync(
  priceUSD: number,
  targetCurrency: string
): number {
  return priceUSD
}

/**
 * Format price with currency symbol (symbol only, no conversion)
 * Example: US: $99.99, UK: £99.99, CA: CA$99.99 (all same USD value)
 */
export function formatPrice(
  price: number,
  currencyCode: string,
  locale?: string
): string {
  try {
    const currency = CURRENCY_MAP[currencyCode.toLowerCase()]
    
    if (!currency) {
      return `$${price.toFixed(2)}`
    }
    
    // Just add the country's symbol (no conversion)
    return `${currency.symbol}${price.toFixed(2)}`
  } catch (error) {
    console.error('[CURRENCY] Error formatting price:', error)
    return `$${price.toFixed(2)}`
  }
}

/**
 * Get currency info for a country code
 */
export function getCurrencyInfo(countryCode: string): CurrencyConfig {
  return CURRENCY_MAP[countryCode.toLowerCase()] || CURRENCY_MAP.us
}

/**
 * No-op - not needed for symbol-only display
 */
export async function preloadExchangeRates(): Promise<void> {
  // Symbol-only mode - no rate fetching needed
}
