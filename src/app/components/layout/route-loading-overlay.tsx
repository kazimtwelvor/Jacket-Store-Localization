"use client"

import { useEffect, useState, useTransition, useRef } from "react"
import { usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function RouteLoadingOverlay() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const loadingRef = useRef(false)

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
        
        if (!loadingRef.current) {
          loadingRef.current = true
          startTransition(() => {
            setIsLoading(true)
          })
        }
      } catch {
        // ignore invalid urls
      }
    }

    document.addEventListener("click", handleClick, { capture: true, passive: true })
    return () => {
      document.removeEventListener("click", handleClick, { capture: true } as any)
    }
  }, [])

  // When the pathname changes, hide the loader
  useEffect(() => {
    loadingRef.current = false
    setIsLoading(false)
  }, [pathname])

  if (!isLoading && !isPending) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-white/30 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 text-black animate-spin" />
        {/* <p className="text-xs font-medium text-gray-700">Loading…</p> */}
      </div>
    </div>
  )
}


