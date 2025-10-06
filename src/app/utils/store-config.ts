"use client"

export const getStoreId = (): string => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_STORE_ID) {
    return process.env.NEXT_PUBLIC_STORE_ID
  }

  if (typeof window !== 'undefined') {
    const pathSegments = window.location.pathname.split('/').filter(Boolean)
    const potentialStoreId = pathSegments[0]
    if (potentialStoreId && potentialStoreId !== 'us' && potentialStoreId !== 'collections' && potentialStoreId !== 'product') {
      return potentialStoreId
    }
  }

  return 'default-store-id'
}

export const isTrackingEnabled = (): boolean => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ENABLE_TRACKING === 'false') {
    return false
  }
  
  return true
}
