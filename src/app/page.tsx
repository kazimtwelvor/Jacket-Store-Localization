'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const detectAndRedirect = async () => {
      const pathSegments = pathname.split('/').filter(Boolean)
      const firstSegment = pathSegments[0]?.toLowerCase()
      
      const validCountries = ['us', 'uk', 'ca', 'au', 'de', 'fr', 'es', 'it']
      
      if (firstSegment && validCountries.includes(firstSegment)) {
        console.log('[ROOT_PAGE] URL already has country slug:', firstSegment, '- no redirect needed')
        return 
      }
      
      if (pathname !== '/') {
        console.log('[ROOT_PAGE] Not on root path:', pathname, '- no redirect needed')
        return
      }
      
      console.log('[ROOT_PAGE] On root path, detecting country from IP...')
      
      try {
        const services = [
          'https://ipapi.co/json/',
          'https://ipinfo.io/json',
          'https://api.country.is/'
        ]
        
        let detectedCountry = null
        
        for (const service of services) {
          try {
            console.log('[ROOT_PAGE] Trying IP service:', service)
            const response = await fetch(service, {
              headers: { 'Accept': 'application/json' }
            })
            
            if (response.ok) {
              const data = await response.json()
              
              // Handle different response formats
              if (service.includes('ipapi.co')) {
                detectedCountry = data.country_code?.toUpperCase()
              } else if (service.includes('ipinfo.io')) {
                detectedCountry = data.country?.toUpperCase()
              } else if (service.includes('country.is')) {
                detectedCountry = data.country?.toUpperCase()
              }
              
              if (detectedCountry) {
                console.log('[ROOT_PAGE] IP detection successful:', detectedCountry, 'from:', service)
                break
              }
            }
          } catch (serviceError) {
            console.log('[ROOT_PAGE] Service failed:', service, serviceError)
            continue
          }
        }
        
        if (detectedCountry) {
          let redirectCountry = 'us' // Default fallback
          if (detectedCountry === 'GB') redirectCountry = 'uk'
          else if (detectedCountry === 'US') redirectCountry = 'us'
          else if (detectedCountry === 'CA') redirectCountry = 'ca'
          else if (detectedCountry === 'AU') redirectCountry = 'au'
          
          console.log('[ROOT_PAGE] Detected country:', detectedCountry, '-> redirecting to:', redirectCountry)
          router.push(`/${redirectCountry}`)
        } else {
          // If no country detected, only then fallback to US
          console.log('[ROOT_PAGE] No country detected, defaulting to US')
          router.push('/us')
        }
      } catch (error) {
        console.error('[ROOT_PAGE] All IP services failed, defaulting to US')
        router.push('/us')
      }
    }

    detectAndRedirect()
  }, [router, pathname])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Detecting your location...</h1>
        <p className="text-gray-600">Please wait while we redirect you to the appropriate store.</p>
      </div>
    </div>
  )
}

