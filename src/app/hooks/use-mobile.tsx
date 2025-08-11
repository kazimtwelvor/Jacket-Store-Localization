"use client"

import { useState, useEffect, useCallback } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Debounce function to prevent excessive updates
  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }, [])

  useEffect(() => {
    setIsClient(true)

    // Return early if not in browser environment
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    // Use debounced handler for resize events
    const debouncedHandler = debounce((e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }, 100)

    // Use the appropriate event listener based on browser support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", debouncedHandler)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(debouncedHandler as any)
    }

    // Cleanup function
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", debouncedHandler)
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(debouncedHandler as any)
      }
    }
  }, [query, debounce])

  // Return false during SSR to prevent hydration mismatch
  return isClient ? matches : false
}

// Add additional breakpoint helpers
export const useBreakpoints = () => {
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)")
  const isDesktop = useMediaQuery("(min-width: 1025px)")
  const isLargeDesktop = useMediaQuery("(min-width: 1280px)")

  return { isMobile, isTablet, isDesktop, isLargeDesktop }
}

export default useMediaQuery
