/**
 * Price Display Component
 * Automatically converts and displays prices in the user's currency
 */

"use client"

import { useCurrency } from '@/src/hooks/use-currency'

interface PriceDisplayProps {
  /** Price in USD */
  priceUSD: number
  /** Optional className for styling */
  className?: string
  /** Show original USD price (for comparison) */
  showOriginal?: boolean
  /** Custom wrapper element */
  as?: 'span' | 'div' | 'p'
}

/**
 * Display price with automatic currency conversion
 * 
 * @example
 * ```tsx
 * <PriceDisplay priceUSD={99.99} />
 * // Renders: $99.99 (US), £78.92 (UK), CA$135.99 (CA), etc.
 * 
 * <PriceDisplay priceUSD={99.99} showOriginal />
 * // Renders: £78.92 (USD $99.99)
 * ```
 */
export function PriceDisplay({
  priceUSD,
  className = '',
  showOriginal = false,
  as: Component = 'span',
}: PriceDisplayProps) {
  const { convertAndFormat, currency } = useCurrency()
  
  const convertedPrice = convertAndFormat(priceUSD)
  
  return (
    <Component className={className}>
      {convertedPrice}
      {showOriginal && currency.code !== 'USD' && (
        <span className="text-sm text-gray-500 ml-2">
          (USD ${priceUSD.toFixed(2)})
        </span>
      )}
    </Component>
  )
}

interface PriceRangeDisplayProps {
  /** Minimum price in USD */
  minPriceUSD: number
  /** Maximum price in USD */
  maxPriceUSD: number
  /** Optional className for styling */
  className?: string
  /** Separator between prices */
  separator?: string
}

/**
 * Display price range with automatic currency conversion
 * 
 * @example
 * ```tsx
 * <PriceRangeDisplay minPriceUSD={49.99} maxPriceUSD={99.99} />
 * // Renders: $49.99 - $99.99 (US), £39.49 - £78.92 (UK), etc.
 * ```
 */
export function PriceRangeDisplay({
  minPriceUSD,
  maxPriceUSD,
  className = '',
  separator = ' - ',
}: PriceRangeDisplayProps) {
  const { convertAndFormat } = useCurrency()
  
  const minPrice = convertAndFormat(minPriceUSD)
  const maxPrice = convertAndFormat(maxPriceUSD)
  
  return (
    <span className={className}>
      {minPrice}{separator}{maxPrice}
    </span>
  )
}

interface ComparePriceDisplayProps {
  /** Original price in USD */
  originalPriceUSD: number
  /** Sale price in USD */
  salePriceUSD: number
  /** Optional className for styling */
  className?: string
  /** Show discount badge */
  showDiscount?: boolean
}

/**
 * Display compare-at price (strikethrough) and sale price
 * 
 * @example
 * ```tsx
 * <ComparePriceDisplay originalPriceUSD={149.99} salePriceUSD={99.99} />
 * // Renders: $149.99 $99.99 (with strikethrough on original)
 * ```
 */
export function ComparePriceDisplay({
  originalPriceUSD,
  salePriceUSD,
  className = '',
  showDiscount = false,
}: ComparePriceDisplayProps) {
  const { convertAndFormat } = useCurrency()
  
  const originalPrice = convertAndFormat(originalPriceUSD)
  const salePrice = convertAndFormat(salePriceUSD)
  
  // Calculate discount percentage
  const discount = Math.round(((originalPriceUSD - salePriceUSD) / originalPriceUSD) * 100)
  
  // Default styling - can be overridden by className
  // Mobile: text-sm (strikethrough) + text-lg (sale price)
  // Desktop: text-sm (both)
  const defaultOriginalClass = "text-sm font-bold line-through text-gray-500"
  const defaultSaleClass = "text-lg font-bold text-black"
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className={defaultOriginalClass}>
        {originalPrice}
      </span>
      <span className={defaultSaleClass}>
        {salePrice}
      </span>
      {showDiscount && discount > 0 && (
        <span className="bg-black/10 text-black text-xs px-2 py-1 rounded">
          {discount}% OFF
        </span>
      )}
    </div>
  )
}

