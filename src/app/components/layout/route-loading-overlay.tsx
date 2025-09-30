"use client";

import { useEffect, useState, useTransition, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function RouteLoadingOverlayContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const loadingRef = useRef(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      // Skip if modified click or external
      const isModified =
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      if (isModified) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (
        anchor.hasAttribute("download") ||
        anchor.getAttribute("rel") === "external"
      )
        return;

      try {
        const url = new URL(anchor.href, location.href);
        const isInternal = url.origin === location.origin;
        if (!isInternal) return;

        // Ignore hash-only navigation (same page, different section)
        if (
          url.pathname === location.pathname &&
          url.search === location.search &&
          url.hash &&
          url.hash !== location.hash
        ) {
          return;
        }

        if (url.pathname === "/") return;

        if (url.pathname === '/404' || url.pathname === '/not-found' || url.pathname.includes('404') ||
          url.pathname === '/500' || url.pathname === '/error' || url.pathname.includes('error') ||
          location.pathname === '/404' || location.pathname === '/not-found' || location.pathname.includes('404') ||
          location.pathname === '/500' || location.pathname === '/error' || location.pathname.includes('error')) {
          return;
        }

        const toPath = url.pathname + url.search + url.hash;
        const fromPath = location.pathname + location.search + location.hash;
        if (toPath === fromPath) return;
        if (url.pathname.startsWith("/collections/") &&
          location.pathname.startsWith("/collections/") &&
          url.pathname === location.pathname) return;

        if (!loadingRef.current) {
          loadingRef.current = true;
          startTransition(() => {
            setIsLoading(true);
          });
          
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
          }
          loadingTimeoutRef.current = setTimeout(() => {
            loadingRef.current = false;
            setIsLoading(false);
            window.dispatchEvent(new CustomEvent('route-loading:end'));
          }, 10000);
        }
      } catch {
      }
    };

    document.addEventListener("click", handleClick, {
      capture: true,
      passive: true,
    });
    return () => {
      document.removeEventListener("click", handleClick, {
        capture: true,
      } as any);
    };
  }, []);

  // Support programmatic navigations (e.g., router.push) via a custom event
  useEffect(() => {
    const handleProgrammaticStart = () => {
      if (!loadingRef.current) {
        loadingRef.current = true;
        startTransition(() => {
          setIsLoading(true);
        });
        
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        loadingTimeoutRef.current = setTimeout(() => {
          loadingRef.current = false;
          setIsLoading(false);
          window.dispatchEvent(new CustomEvent('route-loading:end'));
        }, 10000);
      }
    };

    const handleProgrammaticEnd = () => {
      loadingRef.current = false;
      setIsLoading(false);
      
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };

    window.addEventListener("route-loading:start", handleProgrammaticStart);
    window.addEventListener("route-loading:end", handleProgrammaticEnd);
    return () => {
      window.removeEventListener(
        "route-loading:start",
        handleProgrammaticStart
      );
      window.removeEventListener(
        "route-loading:end",
        handleProgrammaticEnd
      );
    };
  }, []);

  // When the route (path or query) changes, hide the loader
  useEffect(() => {
    loadingRef.current = false;
    setIsLoading(false);
    
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    
    window.dispatchEvent(new CustomEvent('route-loading:end'));
  }, [pathname, searchParams]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      loadingRef.current = false;
      setIsLoading(false);
      
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      window.dispatchEvent(new CustomEvent('route-loading:end'));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const checkForNotFound = () => {
      const notFoundElement = document.querySelector('.min-h-screen.flex.items-center.justify-center.bg-gray-50');
      const has404Text = document.querySelector('h1')?.textContent === '404';
      
      if (notFoundElement && has404Text) {
        loadingRef.current = false;
        setIsLoading(false);
        return true;
      }
      return false;
    };

    if (checkForNotFound()) return;

    if (pathname === '/404' || pathname === '/not-found' || pathname.includes('404') ||
        pathname === '/500' || pathname === '/error' || pathname.includes('error')) {
      loadingRef.current = false;
      setIsLoading(false);
    }

    const observer = new MutationObserver(() => {
      checkForNotFound();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, [pathname]);

  if (!isLoading && !isPending) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white/30 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 text-black animate-spin" />
        {/* <p className="text-xs font-medium text-gray-700">Loading…</p> */}
      </div>
    </div>
  );
}

export default function RouteLoadingOverlay() {
  return (
    <Suspense fallback={null}>
      <RouteLoadingOverlayContent />
    </Suspense>
  );
}
