"use client"
import { createContext, useContext, type ReactNode } from 'react'

interface CurrencyContextValue {
  isLoaded: boolean
  error: Error | null
}

const CurrencyContext = createContext<CurrencyContextValue>({
  isLoaded: true, // Always loaded since we don't fetch anything
  error: null,
})

export function useCurrencyContext() {
  return useContext(CurrencyContext)
}

interface CurrencyProviderProps {
  children: ReactNode
}

/**
 * Currency Provider (Simplified - Symbol Only)
 * No rate fetching needed since we only change symbols
 */
export function CurrencyProvider({ children }: CurrencyProviderProps) {
  return (
    <CurrencyContext.Provider value={{ isLoaded: true, error: null }}>
      {children}
    </CurrencyContext.Provider>
  )
}
