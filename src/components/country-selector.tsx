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

export function CountrySelector() {
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

  // Fetch countries from API
  useEffect(() => {
    const fetchCountries = async () => {
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
          
          // If no country is selected or the selected country is not in the list, set default
          if (!selectedCountry || !data.countries.find((c: any) => c.id === selectedCountry.id)) {
            const defaultCountry = data.countries.find(
              (c: any) => c.countryCode.toLowerCase() === 'us'
            ) || data.countries[0]
            
            if (defaultCountry) {
              console.log('[COUNTRY_SELECTOR] Setting default country:', defaultCountry.countryCode)
              setSelectedCountry(defaultCountry)
            }
          } else {
            console.log('[COUNTRY_SELECTOR] Using existing country:', selectedCountry.countryCode)
          }
        }
      } catch (error) {
        console.error('[COUNTRY_SELECTOR] Failed to fetch countries:', error)
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      fetchCountries()
    }
  }, [mounted])

  const handleCountryChange = (country: any) => {
    console.log('[COUNTRY_SELECTOR] Changing country to:', country.countryCode)
    setSelectedCountry(country)
    
    // Update URL with new country
    const currentPath = pathname || '/'
    
    // Extract the path without the country code
    const pathParts = currentPath.split('/').filter(Boolean)
    
    // Check if first part is a country code (2-letter lowercase)
    const isCountryInPath = pathParts[0]?.length === 2 && /^[a-z]{2}$/.test(pathParts[0])
    
    let newPath: string
    if (isCountryInPath) {
      // Replace existing country code
      pathParts[0] = country.countryCode.toLowerCase()
      newPath = '/' + pathParts.join('/')
    } else {
      // Add country code at the beginning
      newPath = `/${country.countryCode.toLowerCase()}${currentPath === '/' ? '' : currentPath}`
    }
    
    console.log('[COUNTRY_SELECTOR] Navigating to:', newPath)
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
          size="sm" 
          className="gap-2 border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
          disabled={isLoading}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {selectedCountry?.countryCode.toUpperCase() || 'US'}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.id}
            onClick={() => handleCountryChange(country)}
            className={`flex items-center justify-between cursor-pointer text-white hover:bg-gray-700 ${
              selectedCountry?.id === country.id ? 'bg-gray-700' : ''
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





