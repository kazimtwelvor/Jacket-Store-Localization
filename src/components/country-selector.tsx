"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'
import { useCountryStore } from '@/src/store/country-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/app/ui/dropdown-menu'
import { Button } from '@/src/app/ui/button'

interface CountrySelectorProps {
  variant?: 'default' | 'footer'
  size?: 'sm' | 'default' | 'lg'
}

export function CountrySelector({ variant = 'default', size = 'default' }: CountrySelectorProps = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const {
    selectedCountry,
    countries,
    setSelectedCountry,
    setCountries,
    setLoading,
    isLoading,
  } = useCountryStore()
  
  const [mounted, setMounted] = useState(false)

  // Client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Note: URL syncing is now handled only during initial country detection
  // This prevents automatic updates when user navigates to /us or /uk URLs

  // Detect user's country from IP
  const detectUserCountry = async (): Promise<string | null> => {
    try {
      const response = await fetch('https://ip-api.com/json/?fields=countryCode')
      const data = await response.json()
      return data.countryCode?.toUpperCase() || null
    } catch (error) {
      console.error('[COUNTRY_SELECTOR] Failed to detect country from IP:', error)
      return null
    }
  }

  // Fetch countries from API and detect user country
  useEffect(() => {
    const fetchCountriesAndDetectCountry = async () => {
      try {
        setLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        
        if (!apiUrl) {
          console.error('[COUNTRY_SELECTOR] API URL not configured')
          return
        }

        // Extract base URL (remove /api/{storeId} if present)
        const baseUrl = apiUrl.replace(/\/api\/[a-f0-9-]+$/, '')
        
        const response = await fetch(`${baseUrl}/api/countries?isActive=true&sortBy=sortOrder&sortOrder=asc&limit=100`)
        const data = await response.json()

        if (data?.countries && Array.isArray(data.countries)) {
          setCountries(data.countries)
          
          console.log('[COUNTRY_SELECTOR] Countries fetched:', data.countries.length)
          
          const pathSegments = pathname.split('/').filter(Boolean)
          const urlCountryCode = pathSegments[0]?.toLowerCase()
          
          let detectedCountry = null
          
          // Note: IP detection is now handled by the root page (src/app/page.tsx)
          // Country selector only reads from URL and sets the appropriate country
          
          // If no IP detection or IP detection failed, use URL country
          if (!detectedCountry && urlCountryCode) {
            detectedCountry = data.countries.find(
              (c: any) => c.countryCode.toLowerCase() === urlCountryCode
            )
            console.log('[COUNTRY_SELECTOR] Using country from URL:', urlCountryCode)
          }
          
          if (!detectedCountry && pathname !== '/') {
            detectedCountry = data.countries.find(
              (c: any) => c.countryCode.toLowerCase() === 'us'
            ) || data.countries[0]
            console.log('[COUNTRY_SELECTOR] Using fallback country:', detectedCountry.countryCode)
          }
          
          if (detectedCountry) {
            console.log('[COUNTRY_SELECTOR] Setting detected country:', detectedCountry.countryCode)
            setSelectedCountry(detectedCountry)
            // Note: Redirect logic is handled by the root page (src/app/page.tsx)
          }
        }
      } catch (error) {
        console.error('[COUNTRY_SELECTOR] Failed to fetch countries:', error)
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      fetchCountriesAndDetectCountry()
    }
  }, [mounted])

  const handleCountryChange = (country: any) => {
    console.log('[COUNTRY_SELECTOR] Changing country to:', country.countryCode)
    setSelectedCountry(country)
    
    // Always redirect to homepage of selected country
    const newPath = `/${country.countryCode.toLowerCase()}`
    
    console.log('[COUNTRY_SELECTOR] Navigating to homepage:', newPath)
    router.push(newPath)
  }

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={size}
          className={`gap-2 ${
            variant === 'footer' 
              ? 'border-gray-300 bg-white text-black hover:bg-gray-100' 
              : 'border-gray-700 bg-gray-800 text-white hover:bg-gray-700'
          }`}
          disabled={isLoading}
        >
          <Globe className="h-4 w-4" />
          <span>
            {selectedCountry?.countryCode.toUpperCase() || 'US'}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={`w-56 ${
        variant === 'footer' 
          ? 'bg-white border-gray-300' 
          : 'bg-gray-800 border-gray-700'
      }`}>
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.id}
            onClick={() => handleCountryChange(country)}
            className={`flex items-center justify-between cursor-pointer ${
              variant === 'footer' 
                ? 'text-black hover:bg-gray-100' + (selectedCountry?.id === country.id ? ' bg-gray-100' : '')
                : 'text-white hover:bg-gray-700' + (selectedCountry?.id === country.id ? ' bg-gray-700' : '')
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="font-medium">{country.countryCode.toUpperCase()}</span>
              <span>{country.name}</span>
            </span>
            {country.currencySymbol && (
              <span className="text-gray-400 text-sm">
                {country.currencySymbol}
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}





