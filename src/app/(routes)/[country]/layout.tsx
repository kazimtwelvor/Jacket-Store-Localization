"use client"

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useCountryStore } from '@/src/store/country-store'

export default function CountryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const { getCountryByCode, setSelectedCountry, selectedCountry, countries } = useCountryStore()

  useEffect(() => {
    const urlCountry = params?.country as string
    
    if (urlCountry) {
      console.log('[COUNTRY_LAYOUT] URL country:', urlCountry)
      
      // Try to find country in loaded countries
      const countryData = getCountryByCode(urlCountry)
      
      if (countryData && countryData.id !== selectedCountry?.id) {
        console.log('[COUNTRY_LAYOUT] Syncing country from URL:', urlCountry)
        setSelectedCountry(countryData)
        
        // Update cookie for persistence
        if (typeof document !== 'undefined') {
          document.cookie = `selected-country=${urlCountry}; path=/; max-age=31536000`
        }
      } else if (!countryData && countries.length > 0) {
        // Country not found in loaded countries, wait for countries to load
        console.warn('[COUNTRY_LAYOUT] Country not found:', urlCountry)
      }
    }
  }, [params?.country, countries.length])

  return <>{children}</>
}





