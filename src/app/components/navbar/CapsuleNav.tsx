"use client";
import { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "../../ui/button";
import { cn } from "../../lib/utils";

import { avertaBold } from "@/src/lib/fonts";

const items = [
  { id: 0, label: "HOME", isActive: true, href: "/us/" },
  { id: 1, label: "LEATHER", isActive: false, href: "/us/collections/mens-leather-jackets" },
  { id: 2, label: "BOMBER", isActive: false, href: "/us/collections/leather-bomber-jacket-mens" },
  { id: 3, label: "BIKER", isActive: false, href: "/us/collections/biker-jacket-men" },
  { id: 4, label: "VARSITY", isActive: false, href: "/us/collections/mens-varsity-jackets" },
  { id: 5, label: "PUFFER", isActive: false, href: "/us/collections/mens-puffer-jackets" },

];

export function CapsuleNav() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(-1);
  const [isVisible, setIsVisible] = useState(true);
  const [isFilterBarSticky, setIsFilterBarSticky] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const isCategoryPage = pathname?.startsWith("/category/");
  const isCollectionsPage = pathname?.startsWith("/us/collections/");
  const isShopPage = pathname === "/us/shop";
  const lastScrollY = useRef(0);

  const isMobileView =
    typeof window !== "undefined" ? window.innerWidth < 1024 : false;
  const shouldHideOnShopPage =
    (isShopPage || isCollectionsPage) && isMobileView;

  useEffect(() => {
    setIsMounted(true);
    
    // Set initial active item after mounting
    if (pathname === "/us") {
      setActiveItem(0);
    } else if (pathname === "/us/collections/mens-leather-jackets") {
      setActiveItem(1);
    } else if (pathname === "/us/collections/leather-bomber-jacket-mens") {
      setActiveItem(2);
    } else if (pathname === "/us/collections/biker-jacket-men") {
      setActiveItem(3);
    } else if (pathname === "/us/collections/mens-varsity-jackets") {
      setActiveItem(4);
    } else if (pathname === "/us/collections/mens-puffer-jackets") {
      setActiveItem(5);
    } 
    else {
      setActiveItem(-1);
    }

    const handleFilterBarSticky = (event: CustomEvent) => {
      setIsFilterBarSticky(event.detail.isSticky);
    };

    if (isCategoryPage || isShopPage || isCollectionsPage) {
      window.addEventListener(
        "filterBarSticky",
        handleFilterBarSticky as EventListener
      );
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobileView = window.innerWidth < 1024;
      const TOP_THRESHOLD = 5; // A small threshold for the top of the page

      const isOnShopCollectionsOrCategory =
        isCategoryPage || isShopPage || isCollectionsPage;

      // Exception Case: Desktop on Shop/Collections/Category pages.
      // Here, we keep the complex scroll behavior.
      if (!isMobileView && isOnShopCollectionsOrCategory) {
        const lowerContentSection =
          document.getElementById("lower-content-section") ||
          document.getElementById("lower-content-div");
        const navbar = document.querySelector("header");
        const navBarHeight = navbar?.getBoundingClientRect().height || 64;

        if (lowerContentSection) {
          const sectionTop = lowerContentSection.offsetTop;
          const inLowerSection = currentScrollY >= sectionTop - navBarHeight;

          setIsExpanded(inLowerSection);

          if (inLowerSection) {
            setIsVisible(true); // Always visible when scrolled to lower sections
          } else {
            // Original logic for upper part of the page: hide on scroll down, show on scroll up
            if (currentScrollY > 100 && currentScrollY > lastScrollY.current) {
              setIsVisible(false); // Scrolling down
            } else {
              setIsVisible(true); // Scrolling up or at the top
            }
          }
        } else {
          // Fallback to original logic if section not found
          if (currentScrollY > 100 && currentScrollY > lastScrollY.current) {
            setIsVisible(false); // Scrolling down
          } else {
            setIsVisible(true); // Scrolling up or at the top
          }
        }
      } else {
        // Default Case: All mobile views, and desktop on non-shop pages.
        // The capsule nav should only be visible at the very top of the page.
        setIsVisible(currentScrollY <= TOP_THRESHOLD);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (isCategoryPage || isShopPage || isCollectionsPage) {
        window.removeEventListener(
          "filterBarSticky",
          handleFilterBarSticky as EventListener
        );
      }
    };
  }, [isCategoryPage, isShopPage, isCollectionsPage]);

  useEffect(() => {
    if (pathname === "/us") {
      setActiveItem(0);
    } else if (pathname === "/us/collections/mens-leather-jackets") {
      setActiveItem(1);
    } else if (pathname === "/us/collections/leather-bomber-jacket-mens") {
      setActiveItem(2);
    } else if (pathname === "/us/collections/biker-jacket-men") {
      setActiveItem(3);
    } else if (pathname === "/us/collections/mens-varsity-jackets") {
      setActiveItem(4);
    } else if (pathname === "/us/collections/mens-puffer-jackets") {
      setActiveItem(5);
    } else {
      setActiveItem(-1);
    }
  }, [pathname]);

  const handleItemClick = (id: number) => {
    setActiveItem(id);
  };

  if (!isMounted) return null;

  // if (shouldHideOnShopPage) {
  //   return null;
  // }

  const isProductPage = pathname?.startsWith("/product/") || pathname?.includes("/product/");
  
  if (isProductPage) {
    return null;
  }

  return (
    <div
      className={cn(
        "mx-auto md:w-auto md:mx-0",
        (isCategoryPage || isShopPage || isCollectionsPage) &&
          isMobileView &&
          isExpanded
          ? "w-[95%]"
          : "w-[70%]",
        // Mobile: Always sticky at top, Desktop: Keep existing positioning
        isMobileView
          ? "fixed top-16 left-0 right-0 z-40 px-4"
          : isProductPage && isMobileView
          ? "fixed top-[60px] left-0 right-0 z-40 px-4"
          : "relative",
        isVisible
          ? "opacity-100"
          : "opacity-0 pointer-events-none translate-y-[-100%]"
      )}
    >
      <div className="rounded-[15px] bg-white px-1 py-1 shadow-lg">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {items.map((item) => (
              <div key={item.id} className="relative mr-1">
                <Link href={item.href}>
                  <Button
                    variant={item.id === activeItem && activeItem !== -1 ? "destructive" : "ghost_2"}
                    className={cn(
                      "rounded-[13px] px-4 md:px-6 whitespace-nowrap text-xs md:text-sm transition-all duration-200",
                      item.id === activeItem && activeItem !== -1
                        ? "bg-[#2b2b2b] text-white"
                        : "text-black hover:bg-gray-100",
                      avertaBold.className
                    )}
                    onClick={() => handleItemClick(item.id)}
                  >
                    {item.label}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
