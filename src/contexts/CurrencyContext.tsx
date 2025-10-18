"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { preloadExchangeRates } from '@/src/lib/currency/currency-converter'

interface CurrencyContextValue {
  isLoaded: boolean
  error: Error | null
}

const CurrencyContext = createContext<CurrencyContextValue>({
  isLoaded: false,
  error: null,
})

export function useCurrencyContext() {
  return useContext(CurrencyContext)
}

interface CurrencyProviderProps {
  children: ReactNode
}

/**
 * Currency Provider
 * Wrap your app with this to enable currency conversion
 * 
 * @example
 * ```tsx
 * <CurrencyProvider>
 *   <App />
 * </CurrencyProvider>
 * ```
 */
export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initializeRates = async () => {
      try {
        console.log('[CURRENCY_PROVIDER] Initializing exchange rates...')
        await preloadExchangeRates()
        setIsLoaded(true)
        console.log('[CURRENCY_PROVIDER] Exchange rates loaded successfully')
      } catch (err) {
        console.error('[CURRENCY_PROVIDER] Error loading exchange rates:', err)
        setError(err instanceof Error ? err : new Error('Failed to load exchange rates'))
        // Still set isLoaded to true so app doesn't hang (will use fallback rates)
        setIsLoaded(true)
      }
    }

    initializeRates()

    // Refresh rates every hour
    const intervalId = setInterval(() => {
      console.log('[CURRENCY_PROVIDER] Refreshing exchange rates...')
      initializeRates()
    }, 3600000) // 1 hour

    return () => clearInterval(intervalId)
  }, [])

  return (
    <CurrencyContext.Provider value={{ isLoaded, error }}>
      {children}
    </CurrencyContext.Provider>
  )
}

