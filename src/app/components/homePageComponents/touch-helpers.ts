/**
 * Touch event helpers for carousels and sliders
 */

// Minimum distance required for a swipe to register (in pixels)
export const MIN_SWIPE_DISTANCE = 50

// Default animation duration for transitions (in ms)
export const DEFAULT_ANIMATION_DURATION = 300

// Default autoplay interval (in ms)
export const DEFAULT_AUTOPLAY_INTERVAL = 5000

/**
 * Calculate the direction and distance of a touch swipe
 * @param touchStart - Starting X position of touch
 * @param touchEnd - Ending X position of touch
 * @returns Object containing swipe direction and distance
 */
export function getSwipeDirection(touchStart: number, touchEnd: number) {
  const distance = touchStart - touchEnd
  
  if (Math.abs(distance) < MIN_SWIPE_DISTANCE) {
    return { direction: "none", distance: 0 }
  }
  
  return {
    direction: distance > 0 ? "left" : "right",
    distance: Math.abs(distance)
  }
}

/**
 * Calculate the number of items to display based on screen width
 * @param breakpoints - Object containing breakpoints and items per view
 * @returns Number of items to display
 */
export function getItemsPerView(
  breakpoints: { 
    mobile?: number, 
    tablet?: number, 
    desktop?: number,
    [key: string]: number | undefined
  } = {}
) {
  if (typeof window === "undefined") {
    return breakpoints.mobile || 1
  }
  
  const width = window.innerWidth
  
  if (width >= 1280) return breakpoints.desktop || 3
  if (width >= 768) return breakpoints.tablet || 2
  return breakpoints.mobile || 1
}

/**
 * Add passive touch event listeners to an element
 * @param element - DOM element to attach listeners to
 * @param handlers - Object containing touch event handlers
 * @returns Cleanup function to remove listeners
 */
export function addTouchListeners(
  element: HTMLElement,
  handlers: {
    onTouchStart?: (e: TouchEvent) => void,
    onTouchMove?: (e: TouchEvent) => void,
    onTouchEnd?: (e: TouchEvent) => void
  }
) {
  if (handlers.onTouchStart) {
    element.addEventListener('touchstart', handlers.onTouchStart, { passive: true })
  }
  
  if (handlers.onTouchMove) {
    element.addEventListener('touchmove', handlers.onTouchMove, { passive: true })
  }
  
  if (handlers.onTouchEnd) {
    element.addEventListener('touchend', handlers.onTouchEnd)
  }
  
  return () => {
    if (handlers.onTouchStart) {
      element.removeEventListener('touchstart', handlers.onTouchStart)
    }
    
    if (handlers.onTouchMove) {
      element.removeEventListener('touchmove', handlers.onTouchMove)
    }
    
    if (handlers.onTouchEnd) {
      element.removeEventListener('touchend', handlers.onTouchEnd)
    }
  }
}

/**
 * Calculate the transform value for a carousel item based on its position
 * @param index - Item index
 * @param activeIndex - Current active index
 * @param totalItems - Total number of items
 * @returns CSS transform value
 */
export function getItemTransform(index: number, activeIndex: number, totalItems: number) {
  // Calculate the shortest distance considering the carousel might be circular
  let distance = index - activeIndex
  
  // Handle wrapping for circular carousels
  if (Math.abs(distance) > totalItems / 2) {
    if (distance > 0) {
      distance = distance - totalItems
    } else {
      distance = distance + totalItems
    }
  }
  
  // Scale based on distance from center
  const scale = 1 - Math.min(0.3, Math.abs(distance) * 0.15)
  
  // Optional: add some Y offset for a more dynamic look
  const yOffset = Math.abs(distance) * 10
  
  return `scale(${scale}) translateY(${distance === 0 ? 0 : yOffset}px)`
}