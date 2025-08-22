"use client";
import { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "../../ui/button";
import { cn } from "../../lib/utils";

import { avertaBold } from "@/src/lib/fonts";

const items = [
 { id: 0, label: "HOME", isActive: true, href: "/" },
  // Use query keys/values that the shop page understands
  { id: 1, label: "LEATHER", isActive: false, category: "materials=Leather" },
  { id: 2, label: "BOMBER", isActive: false, category: "styles=Bomber" },
  { id: 3, label: "VARSITY", isActive: false, category: "styles=Varsity" },
  { id: 4, label: "BIKER", isActive: false, category: "styles=Biker" },
];

export function CapsuleNav() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFilterBarSticky, setIsFilterBarSticky] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const pathname = usePathname();
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const isProductPage = pathname?.startsWith("/product/");
  const isCategoryPage = pathname?.startsWith("/category/");
  const isCollectionsPage = pathname?.startsWith("/collections/");
  const isShopPage = pathname === "/shop";
  const lastScrollY = useRef(0);

  const isMobileView =
    typeof window !== "undefined" ? window.innerWidth < 1024 : false;
  const shouldHideOnShopPage =
    (isShopPage || isCollectionsPage) && isMobileView;

  useEffect(() => {
    setIsMounted(true);

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

      // Mobile-specific behavior: Visible only at the very top; hidden otherwise
      if (isMobileView) {
        const TOP_THRESHOLD = 2; // allow tiny scroll jitter/bounce
        setIsVisible(currentScrollY <= TOP_THRESHOLD);
      } else {
        // Desktop behavior: Keep existing logic
        if (isProductPage) {
          const productImage = document.querySelector(".product-gallery");
          const navbar = document.querySelector("header");
          if (productImage && navbar) {
            const imageRect = productImage.getBoundingClientRect();
            const navbarHeight = navbar.getBoundingClientRect().height;

            // Show nav only when scrolled past the product image
            setIsVisible(imageRect.bottom <= navbarHeight);
          }
        } else if (isCategoryPage || isShopPage || isCollectionsPage) {
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
              // Original logic for upper part of the page
              if (
                currentScrollY > 100 &&
                currentScrollY > lastScrollY.current
              ) {
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
          // Generic logic for all other pages (including desktop)
          // Hide on scroll down, show on scroll up
          if (currentScrollY > 100 && currentScrollY > lastScrollY.current) {
            setIsVisible(false); // Scrolling down
          } else {
            setIsVisible(true); // Scrolling up or at the top
          }
        }
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
  }, [isProductPage, isCategoryPage, isShopPage, isCollectionsPage]);

  useEffect(() => {
    if (pathname === "/") {
      setActiveItem(0);
    }
  }, [pathname]);

  const handleItemClick = (id: number) => {
    setActiveItem(id);
  };

  if (!isMounted) return null;

  if (shouldHideOnShopPage) {
    return null;
  }

  return (
    <div
      className={cn(
        "mx-auto md:w-auto md:mx-0 transition-all duration-300",
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
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="rounded-[15px] bg-white px-1 py-1 shadow-lg">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {items.map((item) => (
              <div key={item.id} className="relative mr-1">
                <Link href={item.href ?? `/shop?${item.category}`}>
                  <Button
                    variant={item.id === activeItem ? "default" : "ghost"}
                    className={cn(
                      "rounded-[13px] px-4 md:px-6 whitespace-nowrap text-xs md:text-sm",
                      item.id === activeItem &&
                        "bg-[#2b2b2b] text-white hover:bg-[#2b2b2b]/90",
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
