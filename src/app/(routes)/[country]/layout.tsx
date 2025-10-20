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

  // useEffect(() => {
  //   const urlCountry = params?.country as string
    
  //   if (urlCountry) {
  //     console.log('[COUNTRY_LAYOUT] URL country:', urlCountry)
      
  //     const countryData = getCountryByCode(urlCountry)
      
  //     if (countryData && countryData.id !== selectedCountry?.id) {
  //       console.log('[COUNTRY_LAYOUT] Syncing country from URL:', urlCountry)
  //       setSelectedCountry(countryData)
        
  //       if (typeof document !== 'undefined') {
  //         document.cookie = `selected-country=${urlCountry}; path=/; max-age=31536000`
  //       }
  //     } else if (!countryData && countries.length > 0) {
  //       console.warn('[COUNTRY_LAYOUT] Country not found:', urlCountry)
  //     }
  //   }
  // }, [params?.country, countries.length])

  // Note: IP detection and redirection is now handled by the root page (src/app/page.tsx)
  // Country layout should only handle country-specific logic, not IP-based redirects 

  return <>{children}</>
}










