/**
 * Country Store for Frontend
 * Manages country selection and provides country code for API calls
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Country {
  id: string
  name: string
  countryCode: string
  currency: string | null
  currencySymbol: string | null
  timezone: string | null
  isActive: boolean
  sortOrder: number
}

interface CountryStore {
  selectedCountry: Country | null
  countries: Country[]
  isLoading: boolean
  
  // Actions
  setSelectedCountry: (country: Country) => void
  setCountries: (countries: Country[]) => void
  setLoading: (loading: boolean) => void
  getCountryByCode: (code: string) => Country | undefined
  reset: () => void
}

// Default country (fallback)
const defaultCountry: Country = {
  id: 'default-us',
  name: 'United States',
  countryCode: 'us',
  currency: 'USD',
  currencySymbol: '$',
  timezone: 'America/New_York',
  isActive: true,
  sortOrder: 0,
}

export const useCountryStore = create<CountryStore>()(
  persist(
    (set, get) => ({
      selectedCountry: defaultCountry,
      countries: [defaultCountry],
      isLoading: false,

      setSelectedCountry: (country) => {
        console.log('[COUNTRY_STORE] Setting country:', country.countryCode)
        set({ selectedCountry: country })
      },

      setCountries: (countries) => set({ countries }),

      setLoading: (loading) => set({ isLoading: loading }),

      getCountryByCode: (code) => {
        const { countries } = get()
        return countries.find((c) => c.countryCode.toLowerCase() === code.toLowerCase())
      },

      reset: () =>
        set({
          selectedCountry: defaultCountry,
          countries: [defaultCountry],
          isLoading: false,
        }),
    }),
    {
      name: 'country-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedCountry: state.selectedCountry,
      }),
    }
  )
)

/**
 * Hook to get country code for API calls
 */
export function useCountryCode() {
  const selectedCountry = useCountryStore((state) => state.selectedCountry)
  return selectedCountry?.countryCode || 'us'
}

/**
 * Hook to get API params with country code
 */
export function useCountryParams(additionalParams: Record<string, any> = {}) {
  const countryCode = useCountryCode()
  return {
    ...additionalParams,
    cn: countryCode,
  }
}





