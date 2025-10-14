/**
 * CountryLink Component
 * A wrapper around Next.js Link that automatically prefixes URLs with country code
 */

"use client"

import Link from 'next/link'
import { useCountryCode } from '@/src/hooks/use-country'
import { withCountry } from '@/src/lib/country-url'

interface CountryLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  [key: string]: any // Allow other Link props
}

/**
 * Use this instead of regular Link for country-aware routing
 * 
 * Example:
 * <CountryLink href="/collections">Collections</CountryLink>
 * 
 * Result: /us/collections (or /uk/collections based on selected country)
 */
export function CountryLink({ href, children, className, ...props }: CountryLinkProps) {
  const countryCode = useCountryCode()
  
  // Build full path with country
  const fullHref = withCountry(href, countryCode)
  
  return (
    <Link href={fullHref} className={className} {...props}>
      {children}
    </Link>
  )
}

/**
 * Alternative: Button with country-aware navigation
 */
export function CountryButton({ 
  href, 
  children, 
  className,
  onClick,
  ...props 
}: CountryLinkProps & { onClick?: () => void }) {
  const countryCode = useCountryCode()
  
  const handleClick = () => {
    if (onClick) onClick()
    if (typeof window !== 'undefined') {
      window.location.href = withCountry(href, countryCode)
    }
  }
  
  return (
    <button onClick={handleClick} className={className} {...props}>
      {children}
    </button>
  )
}





