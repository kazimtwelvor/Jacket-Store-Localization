/**
 * Currency Hook
 * Provides currency conversion functionality in React components
 */

import { useState, useEffect, useCallback } from 'react'
import { useCountry } from './use-country'
import {
  convertPrice,
  convertPriceSync,
  formatPrice,
  getCurrencyInfo,
  preloadExchangeRates,
  type CurrencyConfig,
} from '@/src/lib/currency/currency-converter'

export interface UseCurrencyReturn {
  /** Current currency configuration */
  currency: CurrencyConfig
  /** Country code */
  countryCode: string
  /** Convert USD price to current currency (async) */
  convertFromUSD: (priceUSD: number) => Promise<number>
  /** Convert USD price to current currency (sync, uses cache) */
  convertFromUSDSync: (priceUSD: number) => number
  /** Format price with currency symbol */
  formatCurrency: (price: number) => string
  /** Convert and format price in one step */
  convertAndFormat: (priceUSD: number) => string
  /** Check if rates are loaded */
  isLoaded: boolean
}

/**
 * Hook for currency conversion and formatting
 * 
 * @example
 * ```tsx
 * const { convertAndFormat, currency } = useCurrency()
 * 
 * // Convert and format a USD price
 * const displayPrice = convertAndFormat(99.99)
 * // Returns: "$99.99" (US), "£78.92" (UK), "CA$135.99" (CA), etc.
 * ```
 */
export function useCurrency(): UseCurrencyReturn {
  const { countryCode } = useCountry()
  const [isLoaded, setIsLoaded] = useState(false)
  const currency = getCurrencyInfo(countryCode)

  // Preload exchange rates on mount
  useEffect(() => {
    const loadRates = async () => {
      await preloadExchangeRates()
      setIsLoaded(true)
    }
    
    loadRates()
  }, [])

  // Convert from USD (async)
  const convertFromUSD = useCallback(
    async (priceUSD: number): Promise<number> => {
      return convertPrice(priceUSD, currency.code)
    },
    [currency.code]
  )

  // Convert from USD (sync, uses cache)
  const convertFromUSDSync = useCallback(
    (priceUSD: number): number => {
      return convertPriceSync(priceUSD, currency.code)
    },
    [currency.code]
  )

  // Format price with currency
  const formatCurrency = useCallback(
    (price: number): string => {
      return formatPrice(price, countryCode)
    },
    [countryCode]
  )

  // Convert and format in one step
  const convertAndFormat = useCallback(
    (priceUSD: number): string => {
      const convertedPrice = convertPriceSync(priceUSD, currency.code)
      return formatPrice(convertedPrice, countryCode)
    },
    [currency.code, countryCode]
  )

  return {
    currency,
    countryCode,
    convertFromUSD,
    convertFromUSDSync,
    formatCurrency,
    convertAndFormat,
    isLoaded,
  }
}

/**
 * Hook for converting a single price
 * Returns the converted price value
 * 
 * @example
 * ```tsx
 * const convertedPrice = useConvertedPrice(99.99)
 * ```
 */
export function useConvertedPrice(priceUSD: number): number {
  const { convertFromUSDSync } = useCurrency()
  return convertFromUSDSync(priceUSD)
}

/**
 * Hook for formatting a price
 * Returns formatted price string with currency symbol
 * 
 * @example
 * ```tsx
 * const formattedPrice = useFormattedPrice(99.99)
 * // Returns: "$99.99", "£78.92", etc.
 * ```
 */
export function useFormattedPrice(priceUSD: number): string {
  const { convertAndFormat } = useCurrency()
  return convertAndFormat(priceUSD)
}

