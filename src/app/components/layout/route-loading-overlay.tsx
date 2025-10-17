"use client";

import { useEffect, useState, useTransition, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCountry } from "@/src/hooks/use-country";

function RouteLoadingOverlayContent() {
  const { countryCode } = useCountry();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const loadingRef = useRef(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isOn404PageRef = useRef(false);

  useEffect(() => {
    const handlePopState = () => {
      // If we're on a 404 page, skip loading completely
      if (isOn404PageRef.current) {
        loadingRef.current = false;
        setIsLoading(false);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        return;
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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

        if (url.pathname === `/${countryCode}/`) return;

        // Check for error pages in both current and target URLs
        if (
          url.pathname === "/404" ||
          url.pathname === "/not-found" ||
          url.pathname.includes("404") ||
          url.pathname === "/500" ||
          url.pathname === "/error" ||
          url.pathname.includes("error") ||
          location.pathname === "/404" ||
          location.pathname === "/not-found" ||
          location.pathname.includes("404") ||
          location.pathname === "/500" ||
          location.pathname === "/error" ||
          location.pathname.includes("error")
        ) {
          return;
        }

        // Check if we're currently on a 404 page by DOM content
        const notFoundElement = document.querySelector(
          ".min-h-screen.flex.items-center.justify-center.bg-gray-50"
        );
        const has404Text = document.querySelector("h1")?.textContent === "404";
        if (notFoundElement && has404Text) {
          return;
        }

        const toPath = url.pathname + url.search + url.hash;
        const fromPath = location.pathname + location.search + location.hash;
        if (toPath === fromPath) return;
        if (
          url.pathname.startsWith(`/${countryCode}/collections/`) &&
          location.pathname.startsWith(`/${countryCode}/collections/`) &&
          url.pathname === location.pathname
        )
          return;

        // Skip loading if we're on a 404 page
        if (isOn404PageRef.current) {
          return;
        }

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
            window.dispatchEvent(new CustomEvent("route-loading:end"));
          }, 1000);
        }
      } catch {}
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
      // Skip loading if we're on a 404 page
      if (isOn404PageRef.current) {
        return;
      }

      if (!loadingRef.current) {
        loadingRef.current = true;
        startTransition(() => {
          setIsLoading(false);
        });

        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
        loadingTimeoutRef.current = setTimeout(() => {
          loadingRef.current = false;
          setIsLoading(false);
          window.dispatchEvent(new CustomEvent("route-loading:end"));
        }, 1000);
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
      window.removeEventListener("route-loading:end", handleProgrammaticEnd);
    };
  }, []);

  // When the route changes, hide the loader and update 404 state
  useEffect(() => {
    loadingRef.current = false;
    setIsLoading(false);

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    // Check if we're on a 404 page
    const check404 = () => {
      const notFoundElement = document.querySelector(
        ".min-h-screen.flex.items-center.justify-center.bg-gray-50"
      );
      const has404Text = document.querySelector("h1")?.textContent === "404";
      isOn404PageRef.current = !!(notFoundElement && has404Text);

      // If we detect a 404 page, ensure loading is cleared
      if (notFoundElement && has404Text) {
        loadingRef.current = false;
        setIsLoading(false);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
      }
    };

    check404();
    // Also check after a brief delay in case DOM hasn't updated yet
    setTimeout(check404, 100);
    // Check again after a longer delay to catch late-rendering 404 pages
    setTimeout(check404, 500);
  }, [pathname, searchParams]);

  if (!isLoading && !isPending) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white/30 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 text-black animate-spin" />
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
