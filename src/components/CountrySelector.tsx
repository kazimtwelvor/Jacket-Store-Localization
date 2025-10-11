"use client"

import { useEffect, useState } from 'react'
import { useCountryStore, type Country } from '../store/country-store'
import { ChevronDown, Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/app/ui/dropdown-menu'
import { Button } from '@/src/app/ui/button'
import apiClient from '../lib/axios-instance'

export function CountrySelector() {
  const {
    selectedCountry,
    countries,
    setSelectedCountry,
    setCountries,
    setLoading,
    isLoading,
  } = useCountryStore()
  
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get('/countries', {
          params: {
            isActive: 'true',
            sortBy: 'sortOrder',
            sortOrder: 'asc',
            limit: 100
          }
        })

        if (response.data?.countries) {
          setCountries(response.data.countries)
          
          // If no country selected or selected country not in list, set to first active or 'us'
          if (!selectedCountry || !response.data.countries.find((c: Country) => c.id === selectedCountry.id)) {
            const defaultCountry = response.data.countries.find(
              (c: Country) => c.countryCode.toLowerCase() === 'us'
            ) || response.data.countries[0]
            
            if (defaultCountry) {
              setSelectedCountry(defaultCountry)
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch countries:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country)
    // Trigger a page reload or state update to fetch new data
    window.dispatchEvent(new CustomEvent('country-changed', { detail: country }))
  }

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={isLoading}>
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {selectedCountry?.countryCode.toUpperCase() || 'US'}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.id}
            onClick={() => handleCountryChange(country)}
            className={`flex items-center justify-between ${
              selectedCountry?.id === country.id ? 'bg-accent' : ''
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="font-medium">{country.countryCode.toUpperCase()}</span>
              <span>{country.name}</span>
            </span>
            {country.currencySymbol && (
              <span className="text-muted-foreground text-sm">
                {country.currencySymbol}
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}



