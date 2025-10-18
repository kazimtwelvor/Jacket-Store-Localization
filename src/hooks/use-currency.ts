/**
 * Currency Hook (Simplified - Symbol Only)
 * Provides currency symbol formatting without conversion
 */

import { useCallback } from 'react'
import { useCountry } from './use-country'
import {
  convertPriceSync,
  formatPrice,
  getCurrencyInfo,
  type CurrencyConfig,
} from '@/src/lib/currency/currency-converter'

export interface UseCurrencyReturn {
  /** Current currency configuration */
  currency: CurrencyConfig
  /** Country code */
  countryCode: string
  /** Format price with currency symbol (no conversion) */
  formatCurrency: (price: number) => string
  /** Convert and format price (no actual conversion, just symbol change) */
  convertAndFormat: (priceUSD: number) => string
  /** Always true since no fetching needed */
  isLoaded: boolean
}

/**
 * Hook for currency symbol formatting
 * 
 * @example
 * ```tsx
 * const { convertAndFormat, currency } = useCurrency()
 * 
 * // Format a USD price with the country's symbol
 * const displayPrice = convertAndFormat(99.99)
 * // Returns: "$99.99" (US), "£99.99" (UK), "CA$99.99" (CA), etc.
 * // Note: All show the same USD value, just different symbols
 * ```
 */
export function useCurrency(): UseCurrencyReturn {
  const { countryCode } = useCountry()
  const currency = getCurrencyInfo(countryCode)

  // Format price with currency symbol
  const formatCurrency = useCallback(
    (price: number): string => {
      return formatPrice(price, countryCode)
    },
    [countryCode]
  )

  // "Convert" and format (no actual conversion, just adds symbol)
  const convertAndFormat = useCallback(
    (priceUSD: number): string => {
      const price = convertPriceSync(priceUSD, currency.code) // Returns same value
      return formatPrice(price, countryCode)
    },
    [currency.code, countryCode]
  )

  return {
    currency,
    countryCode,
    formatCurrency,
    convertAndFormat,
    isLoaded: true, // Always loaded
  }
}

/**
 * Hook for formatting a price with currency symbol
 * 
 * @example
 * ```tsx
 * const formattedPrice = useFormattedPrice(99.99)
 * // Returns: "$99.99", "£99.99", "CA$99.99", etc.
 * ```
 */
export function useFormattedPrice(priceUSD: number): string {
  const { convertAndFormat } = useCurrency()
  return convertAndFormat(priceUSD)
}
