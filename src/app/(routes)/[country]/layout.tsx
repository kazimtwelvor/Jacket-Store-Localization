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

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (!params?.country) return
      
      const urlParams = new URLSearchParams(window.location.search)
      const testCountry = urlParams.get('test_country')
      
      if (testCountry) {
        console.log('[COUNTRY_LAYOUT] Manual test country detected:', testCountry)
        const currentRegion = params.country as string
        if (testCountry !== currentRegion) {
          console.log('[COUNTRY_LAYOUT] Redirecting from', currentRegion, 'to', testCountry, '(manual test)')
          window.location.replace(`/${testCountry}`)
        }
        return
      }
      
      try {
        const services = [
          'https://ipapi.co/json/',
          'https://ipinfo.io/json',
          'https://api.country.is/'
        ]
        
        let detectedCountry = null
        
        for (const service of services) {
          try {
            console.log('[COUNTRY_LAYOUT] Trying IP service:', service)
            const response = await fetch(service, {
              headers: { 'Accept': 'application/json' }
            })
            
            if (response.ok) {
              const data = await response.json()
              
              if (service.includes('ipapi.co')) {
                detectedCountry = data.country_code?.toUpperCase()
              } else if (service.includes('ipinfo.io')) {
                detectedCountry = data.country?.toUpperCase()
              } else if (service.includes('country.is')) {
                detectedCountry = data.country?.toUpperCase()
              }
              
              if (detectedCountry) {
                console.log('[COUNTRY_LAYOUT] IP detection successful:', detectedCountry, 'from:', service)
                break
              }
            }
          } catch (serviceError) {
            console.log('[COUNTRY_LAYOUT] Service failed:', service, serviceError)
            continue
          }
        }
        
        if (!detectedCountry) {
          console.log('[COUNTRY_LAYOUT] All IP services failed, staying on current region')
          return
        }
        
        let expectedRegion = ''
        if (detectedCountry === 'GB') expectedRegion = 'uk'
        else if (detectedCountry === 'US') expectedRegion = 'us'
        else if (detectedCountry === 'CA') expectedRegion = 'ca'
        else if (detectedCountry === 'AU') expectedRegion = 'au'
        
        const currentRegion = params.country as string
        
        console.log('[COUNTRY_LAYOUT] IP check - detected:', detectedCountry, 'expected:', expectedRegion, 'current:', currentRegion)
        
        if (expectedRegion !== currentRegion) {
          console.log('[COUNTRY_LAYOUT] Redirecting from', currentRegion, 'to', expectedRegion)
          window.location.replace(`/${expectedRegion}`)
        } else {
          console.log('[COUNTRY_LAYOUT] IP matches current region, no redirect needed')
        }
      } catch (error) {
        console.error('[COUNTRY_LAYOUT] IP detection failed:', error)
      }
    }

    const timer = setTimeout(checkAndRedirect, 1000)
    return () => clearTimeout(timer)
  }, []) 

  return <>{children}</>
}










