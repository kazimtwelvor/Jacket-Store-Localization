"use client"

import { useEffect, useCallback, useRef } from 'react'

interface TrackingData {
  userAgent?: string
  ipAddress?: string
  referrer?: string
}

interface UseViewTrackingOptions {
  storeId: string
  entityId: string
  entityType: 'product' | 'category' | 'categoryPage'
  enabled?: boolean
  delay?: number
}

interface UseViewTrackingReturn {
  trackView: () => Promise<void>
  isTracking: boolean
  hasTracked: boolean
}

export const useViewTracking = ({
  storeId,
  entityId,
  entityType,
  enabled = true,
  delay = 1000
}: UseViewTrackingOptions): UseViewTrackingReturn => {
  const hasTrackedRef = useRef(false)
  const isTrackingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const getTrackingData = useCallback((): TrackingData => {
    if (typeof window === 'undefined') {
      return {}
    }

    return {
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
      ipAddress: undefined 
    }
  }, [])

  const trackView = useCallback(async (): Promise<void> => {
    if (!enabled || hasTrackedRef.current || isTrackingRef.current || !entityId || !storeId) {
      return
    }

    isTrackingRef.current = true

    try {
      const trackingData = getTrackingData()
      
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL 
      
      let endpoint = ''
      switch (entityType) {
        case 'product':
          endpoint = `${baseApiUrl}/products/${entityId}/track-view`
          break
        case 'category':
          endpoint = `${baseApiUrl}/categories/${entityId}/track-view`
          break
        case 'categoryPage':
          endpoint = `${baseApiUrl}/category-pages/${entityId}/track-view`
          break
        default:
          throw new Error(`Unknown entity type: ${entityType}`)
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(trackingData),
        mode: 'cors', 
        credentials: 'omit', 
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        hasTrackedRef.current = true
        console.log(`${entityType} view tracked successfully:`, result.viewId)
      } else if (result.duplicate) {
        hasTrackedRef.current = true
        console.log(`${entityType} view already recorded for this IP`)
      } else {
        console.warn(`Failed to track ${entityType} view:`, result.message)
      }
    } catch (error) {
      console.error(`Error tracking ${entityType} view:`, error)
    } finally {
      isTrackingRef.current = false
    }
  }, [enabled, entityId, storeId, entityType, getTrackingData])

  const trackViewWithDelay = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      trackView()
    }, delay)
  }, [trackView, delay])

  useEffect(() => {
    if (enabled && entityId && storeId) {
      if (process.env.NODE_ENV === 'development') {
        // logTrackingDebugInfo()
      }
      trackViewWithDelay()
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [enabled, entityId, storeId, trackViewWithDelay])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    trackView,
    isTracking: isTrackingRef.current,
    hasTracked: hasTrackedRef.current
  }
}
