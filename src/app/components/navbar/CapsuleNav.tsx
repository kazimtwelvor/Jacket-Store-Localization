"use client";
import { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter, usePathname } from "next/navigation";
import Button from "../../ui/button";
import { cn } from "../../lib/utils";


const items = [
  { id: 1, label: "Leather", isActive: true, category: "leather-jackets" },
  { id: 2, label: "Puffer", isActive: false, category: "puffer-jackets" },
  { id: 3, label: "Bomber", isActive: false, category: "bomber-jackets" },
  { id: 4, label: "Varsity", isActive: false, category: "varsity-jackets" },
  { id: 5, label: "Lettermen", isActive: false, category: "lettermen-jackets" },
];

export function CapsuleNav() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeItem, setActiveItem] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const [isFilterBarSticky, setIsFilterBarSticky] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const isProductPage = pathname?.startsWith("/product/");
  const isCategoryPage = pathname?.startsWith("/category/");
  const isShopPage = pathname === "/shop";
  const lastScrollY = useRef(0);

  useEffect(() => {
    setIsMounted(true);

    const handleFilterBarSticky = (event: CustomEvent) => {
      setIsFilterBarSticky(event.detail.isSticky);
    };

    if (isCategoryPage || isShopPage) {
      window.addEventListener(
        "filterBarSticky",
        handleFilterBarSticky as EventListener
      );
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobileView = window.innerWidth < 1024;

      // Specific logic for product pages on mobile
      if (isProductPage && isMobileView) {
        const productImage = document.querySelector(".product-gallery");
        const navbar = document.querySelector("header");
        if (productImage && navbar) {
          const imageRect = productImage.getBoundingClientRect();
          const navbarHeight = navbar.getBoundingClientRect().height;

          // Show nav only when scrolled past the product image
          setIsVisible(imageRect.bottom <= navbarHeight);
        }
      } else if ((isCategoryPage || isShopPage) && isMobileView) {
        const lowerContentSection = document.getElementById(
          "lower-content-section"
        );
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
        // Generic logic for all other pages (including desktop)
        // Hide on scroll down, show on scroll up
        if (currentScrollY > 100 && currentScrollY > lastScrollY.current) {
          setIsVisible(false); // Scrolling down
        } else {
          setIsVisible(true); // Scrolling up or at the top
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (isCategoryPage || isShopPage) {
        window.removeEventListener(
          "filterBarsticky",
          handleFilterBarSticky as EventListener
        );
      }
    };
  }, [isProductPage, isCategoryPage, isShopPage]);

  const handleItemClick = (id: number, category: string) => {
    setActiveItem(id);
    router.push(`/shop?category=${category}`);
  };

  if (!isMounted) {
    return (
      <div className="relative w-[70%] mx-auto md:w-auto md:mx-0">
        <div className="rounded-[15px] bg-white px-1 py-1 shadow-lg">
          <div className="overflow-hidden">
            <div className="flex touch-pan-y">
              {items.map((item) => (
                <div key={item.id} className="relative mr-1">
                  <Button
                    variant={item.id === activeItem ? "default" : "ghost"}
                    className={cn(
                      "rounded-[13px] px-4 md:px-6 whitespace-nowrap text-sm md:text-base",
                      item.id === activeItem &&
                        "bg-[#2b2b2b] text-white hover:bg-[#2b2b2b]/90"
                    )}
                    onClick={() => handleItemClick(item.id, item.category)}
                  >
                    {item.label}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isMounted) return null;

  const isMobileView = window.innerWidth < 1024;

  return (
    <div
      className={cn(
        "mx-auto md:w-auto md:mx-0 transition-all duration-300",
        (isCategoryPage || isShopPage) && isMobileView && isExpanded
          ? "w-[95%]"
          : "w-[70%]",
        isProductPage && isMobileView
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
                <Button
                  variant={item.id === activeItem ? "default" : "ghost"}
                  className={cn(
                    "rounded-[13px] px-4 md:px-6 whitespace-nowrap text-sm md:text-base",
                    item.id === activeItem &&
                      "bg-[#2b2b2b] text-white hover:bg-[#2b2b2b]/90"
                  )}
                  onClick={() => handleItemClick(item.id, item.category)}
                >
                  {item.label}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
