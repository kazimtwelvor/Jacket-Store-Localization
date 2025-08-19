"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function RouteLoadingOverlay() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null
      if (!anchor) return

      // Skip if modified click or external
      const isModified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      if (isModified) return
      if (anchor.target && anchor.target !== "_self") return
      if (anchor.hasAttribute("download") || anchor.getAttribute("rel") === "external") return

      try {
        const url = new URL(anchor.href, location.href)
        const isInternal = url.origin === location.origin
        if (!isInternal) return
        // Same-path clicks should not trigger
        const toPath = url.pathname + url.search + url.hash
        const fromPath = location.pathname + location.search + location.hash
        if (toPath === fromPath) return
        setIsLoading(true)
      } catch {
        // ignore invalid urls
      }
    }

    const handlePopState = () => setIsLoading(true)

    // Intercept programmatic navigations (router.push/replace)
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState
    history.pushState = function (...args) {
      try {
        const to = args?.[2] as string | URL | null
        if (to != null) {
          const url = new URL(to as any, location.href)
          const toPath = url.pathname + url.search + url.hash
          const fromPath = location.pathname + location.search + location.hash
          if (toPath !== fromPath) setIsLoading(true)
        } else {
          setIsLoading(true)
        }
      } catch {
        setIsLoading(true)
      }
      return originalPushState.apply(this, args as any)
    }
    history.replaceState = function (...args) {
      try {
        const to = args?.[2] as string | URL | null
        if (to != null) {
          const url = new URL(to as any, location.href)
          const toPath = url.pathname + url.search + url.hash
          const fromPath = location.pathname + location.search + location.hash
          if (toPath !== fromPath) setIsLoading(true)
        } else {
          setIsLoading(true)
        }
      } catch {
        setIsLoading(true)
      }
      return originalReplaceState.apply(this, args as any)
    }

    document.addEventListener("click", handleClick, true)
    window.addEventListener("popstate", handlePopState)
    return () => {
      document.removeEventListener("click", handleClick, true)
      window.removeEventListener("popstate", handlePopState)
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
    }
  }, [])

  // When the pathname changes, hide the loader shortly after commit
  useEffect(() => {
    if (!isLoading) return
    const t = setTimeout(() => setIsLoading(false), 150)
    return () => clearTimeout(t)
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-white/30 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 text-black animate-spin" />
        {/* <p className="text-xs font-medium text-gray-700">Loading…</p> */}
      </div>
    </div>
  )
}


