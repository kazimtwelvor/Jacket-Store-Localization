'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const detectAndRedirect = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/', {
          headers: { 'Accept': 'application/json' }
        })
        const data = await response.json()
        const countryCode = data.country_code?.toUpperCase()
        
        let redirectCountry = 'us'
        if (countryCode === 'GB') redirectCountry = 'uk'
        else if (countryCode === 'US') redirectCountry = 'us'
        else if (countryCode === 'CA') redirectCountry = 'ca'
        else if (countryCode === 'AU') redirectCountry = 'au'
        
        console.log('[ROOT_PAGE] Detected country:', countryCode, '-> redirecting to:', redirectCountry)
        router.push(`/${redirectCountry}`)
      } catch (error) {
        console.error('[ROOT_PAGE] Failed to detect country, defaulting to US')
        router.push('/us')
      }
    }

    detectAndRedirect()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Detecting your location...</h1>
        <p className="text-gray-600">Please wait while we redirect you to the appropriate store.</p>
      </div>
    </div>
  )
}

