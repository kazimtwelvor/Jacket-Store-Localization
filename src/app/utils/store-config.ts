"use client"

/**
 * Get the store ID for the current application
 * This can be configured based on your setup
 */
export const getStoreId = (): string => {
  // Option 1: From environment variable
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_STORE_ID) {
    return process.env.NEXT_PUBLIC_STORE_ID
  }

  // Option 2: From URL path (if you have multi-store setup)
  if (typeof window !== 'undefined') {
    const pathSegments = window.location.pathname.split('/').filter(Boolean)
    // Assuming URL structure like /us/collections/... or /store-id/collections/...
    const potentialStoreId = pathSegments[0]
    if (potentialStoreId && potentialStoreId !== 'us' && potentialStoreId !== 'collections' && potentialStoreId !== 'product') {
      return potentialStoreId
    }
  }

  // Option 3: Default store ID (replace with your actual default store ID)
  return 'default-store-id'
}

/**
 * Check if the current environment supports view tracking
 */
export const isTrackingEnabled = (): boolean => {
  // Enable tracking by default, but allow disabling via environment variable
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ENABLE_TRACKING === 'false') {
    return false
  }
  
  return true
}
