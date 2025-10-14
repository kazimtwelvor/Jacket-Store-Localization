/**
 * Hooks for country-based operations
 */

import { useCountryStore } from '@/src/store/country-store'
import { useParams, usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Hook to sync URL country param with store
 */
export function useCountrySync() {
  const params = useParams()
  const pathname = usePathname()
  const { selectedCountry, setSelectedCountry, getCountryByCode } = useCountryStore()
  
  useEffect(() => {
    // Get country from URL params
    const urlCountry = params?.country as string | undefined
    
    if (urlCountry) {
      const countryFromUrl = getCountryByCode(urlCountry)
      
      // If URL has a country and it's different from selected, update store
      if (countryFromUrl && countryFromUrl.id !== selectedCountry?.id) {
        console.log('[USE_COUNTRY_SYNC] Syncing country from URL:', urlCountry)
        setSelectedCountry(countryFromUrl)
      }
    }
  }, [params?.country, pathname])
  
  return {
    selectedCountry,
    countryCode: selectedCountry?.countryCode || 'us',
  }
}

/**
 * Hook to get country code for API calls
 */
export function useCountryCode() {
  const { selectedCountry } = useCountrySync()
  return selectedCountry?.countryCode || 'us'
}

/**
 * Hook to get query params with country
 */
export function useCountryParams(additionalParams: Record<string, any> = {}) {
  const countryCode = useCountryCode()
  
  return {
    ...additionalParams,
    cn: countryCode,
  }
}

/**
 * Main hook for country operations (alias for useCountrySync)
 */
export function useCountry() {
  return useCountrySync()
}





