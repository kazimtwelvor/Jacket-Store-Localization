"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/src/app/lib/utils";
import { avertaBlack, avertaBold, avertaDefault } from "@/src/lib/fonts";

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  href: string;
}
const menCategories: Category[] = [
  {
    id: "leather-men",
    name: "LEATHER JACKETS",
    imageUrl: "/images/leather.webp",
    href: "/collections/leather-bomber-jacket-mens",
  },
  {
    id: "puffer-men",
    name: "PUFFER JACKETS",
    imageUrl: "/images/puffer.webp",
    href: "/collections/mens-puffer-jackets",
  },
  {
    id: "denim-men",
    name: "DENIM JACKETS",
    imageUrl: "/images/denim.webp",
    href: "/collections/womens-denim-jackets",
  },
  {
    id: "suede-men",
    name: "SUEDE JACKETS",
    imageUrl: "/images/suede.webp",
    href: "/collections/mens-suede-jackets",
  },
  {
    id: "aviator-men",
    name: "AVIATOR JACKETS",
    imageUrl: "/images/aviator.webp",
    href: "/collections/mens-aviator-jackets",
  },
  {
    id: "biker-men",
    name: "BIKER JACKETS",
    imageUrl: "/images/leather.webp",
    href: "/collections/biker-jacket-men",
  },
  {
    id: "varsity-men",
    name: "VARSITY JACKETS",
    imageUrl: "/images/varsity.webp",
    href: "/collections/mens-varsity-jackets",
  },
  {
    id: "letterman-men",
    name: "LETTERMAN JACKETS",
    imageUrl: "/images/letterman.webp",
    href: "/collections/mens-aviator-jackets",
  },
];

const womenCategories: Category[] = [
  {
    id: "leather-women",
    name: "LEATHER JACKETS",
    imageUrl: "/images/women-leather.webp",
    href: "/collections/womens-leather-bomber-jackets",
  },
  {
    id: "puffer-women",
    name: "PUFFER JACKETS",
    imageUrl: "/images/women-puffer.webp",
    href: "/collections/womens-puffer-vests",
  },
  {
    id: "denim-women",
    name: "DENIM JACKETS",
    imageUrl: "/images/women-denim.webp",
    href: "/collections/womens-denim-jackets",
  },
  {
    id: "suede-women",
    name: "SUEDE JACKETS",
    imageUrl: "/images/women-suede.webp",
    href: "/collections/womens-suede-leather-jackets",
  },
  {
    id: "aviator-women",
    name: "AVIATOR JACKETS",
    imageUrl: "/images/women-aviator.webp",
    href: "/collections/womens-pilot-jackets",
  },
  {
    id: "biker-women",
    name: "BIKER JACKETS",
    imageUrl: "/images/women-biker.webp",
    href: "/collections/womens-biker-jackets",
  },
  {
    id: "varsity-women",
    name: "VARSITY JACKETS",
    imageUrl: "/images/women-varsity.webp",
    href: "/collections/womens-varsity-jackets",
  },
  {
    id: "letterman-women",
    name: "LETTERMAN JACKETS",
    imageUrl: "/images/women-letterman.webp",
    href: "/collections/womens-letterman-jackets",
  },
];

interface ProductCategoryProps {
  bg?: string;
  arrowBgColor?: string;
  arrowTextColor?: string;
  arrowHoverBgColor?: string;
  tabTextColor?: string;
  tabActiveColor?: string;
  tabHoverColor?: string;
}

export default function ProductCategory({
  bg = "bg-white",
  arrowBgColor = "bg-black",
  arrowTextColor = "text-white",
  arrowHoverBgColor = "hover:bg-black",
  tabTextColor = "text-gray-700",
  tabActiveColor = "border-[#2b2b2b] text-[#2b2b2b]",
  tabHoverColor = "hover:text-[#2b2b2b]",
}: ProductCategoryProps) {
  const [activeTab, setActiveTab] = useState<"men" | "women">("men");
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const categories = activeTab === "men" ? menCategories : womenCategories;

  const checkForScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 5);
      const nextClickAmount = el.clientWidth * 0.75;
      const remainingScrollable =
        el.scrollWidth - el.clientWidth - el.scrollLeft;
      setCanScrollRight(hasOverflow && remainingScrollable > nextClickAmount);
    }
  }, []);

  const calculateVisibleCategories = useCallback(() => {
    if (typeof window !== "undefined") {
      const screenWidth = window.innerWidth;
      const isDesktopView = screenWidth >= 640;
      setIsDesktop(isDesktopView);

      if (isDesktopView) {
        const containerWidth = screenWidth * 0.8;
        const categoryWidth = 360 + 24;
        const count = Math.floor(containerWidth / categoryWidth);
        setVisibleCount(Math.max(1, count));
      }
    }
  }, []);

  useEffect(() => {
    calculateVisibleCategories();
    window.addEventListener("resize", calculateVisibleCategories);
    return () =>
      window.removeEventListener("resize", calculateVisibleCategories);
  }, [calculateVisibleCategories]);

  useEffect(() => {
    calculateVisibleCategories();
  }, [categories, calculateVisibleCategories]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (!isDesktop) {
      checkForScrollability();
    }
    const resizeObserver = new ResizeObserver(() => {
      if (!isDesktop) {
        checkForScrollability();
      }
    });
    resizeObserver.observe(el);
    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }
    if (!isDesktop) {
      el.addEventListener("scroll", checkForScrollability, { passive: true });
    }
    return () => {
      resizeObserver.disconnect();
      el.removeEventListener("scroll", checkForScrollability);
    };
  }, [checkForScrollability, isDesktop]);

  const scroll = (direction: "left" | "right") => {
    if (isDesktop && categories.length > visibleCount) {
      const newIndex =
        direction === "left"
          ? Math.max(0, currentStartIndex - 1)
          : Math.min(categories.length - visibleCount, currentStartIndex + 1);
      setCurrentStartIndex(newIndex);
    } else if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const showArrows = isDesktop
    ? categories.length > visibleCount
    : canScrollLeft || canScrollRight;

  const canGoLeft = isDesktop ? currentStartIndex > 0 : canScrollLeft;
  const canGoRight = isDesktop
    ? currentStartIndex + visibleCount + 1 < categories.length
    : canScrollRight;

  return (
    <section
      className={`w-full ${bg} flex justify-center overflow-hidden ${avertaBold.className}`}
    >
      <div className="w-full max-w-[1896px] py-0 m-0  md:pl-8 lg:pl-[57px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-0"
        ></motion.div>
        <div className="w-full flex justify-center items-center -mt-1 mb-3 md:mb-4 -ml-4 ml-3 md:-ml-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("men")}
              className={cn(
                "px-3 pb-1 text-base font-semibold transition-colors border-b-2 text-center",
                activeTab === "men"
                  ? tabActiveColor
                  : `border-transparent ${tabTextColor} ${tabHoverColor}`
              )}
            >
              MEN
            </button>
            <button
              onClick={() => setActiveTab("women")}
              className={cn(
                "px-3 pb-1 text-base font-semibold transition-colors border-b-2 text-center",
                activeTab === "women"
                  ? tabActiveColor
                  : `border-transparent ${tabTextColor} ${tabHoverColor}`
              )}
            >
              WOMEN
            </button>
          </div>
        </div>
        {showArrows && (
          <div className="w-full flex justify-end items-center gap-2 sm:gap-3 mb-2 md:mb-3">
            <button
              onClick={() => scroll("left")}
              className={cn(
                "block rounded-none p-2 sm:p-3 shadow-lg backdrop-blur-sm transition-all duration-300 focus:outline-none",
                arrowBgColor,
                arrowHoverBgColor,
                !canGoLeft ? "hidden" : ""
              )}
              aria-label="Scroll left"
              disabled={!canGoLeft}
            >
              <ChevronLeft
                className={cn("w-5 h-5 sm:w-6 sm:h-6", arrowTextColor)}
              />
            </button>
            <button
              onClick={() => scroll("right")}
              className={cn(
                "block rounded-none p-2 sm:p-3 shadow-lg backdrop-blur-sm transition-all duration-300 disabled:opacity-50",
                arrowBgColor,
                arrowHoverBgColor,
                !canGoRight ? "hidden" : ""
              )}
              aria-label="Scroll right"
              disabled={!canGoRight}
            >
              <ChevronRight
                className={cn("w-5 h-5 sm:w-6 sm:h-6", arrowTextColor)}
              />
            </button>
          </div>
        )}
        <div className="relative w-full">
          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
              width: 0;
              height: 0;
            }
          `}</style>
          <div
            ref={scrollContainerRef}
            className={`${
              isDesktop && categories.length > visibleCount
                ? "overflow-hidden"
                : "overflow-x-auto overflow-y-hidden scroll-smooth"
            } hide-scrollbar`}
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            <div
              ref={navRef}
              className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6 transition-transform duration-300 ease-in-out"
              style={
                isDesktop && categories.length > visibleCount
                  ? {
                      transform: `translateX(-${
                        currentStartIndex * (360 + 24)
                      }px)`,
                    }
                  : {}
              }
            >
              {categories.map((item) => (
                <div key={item.id} className="group flex-shrink-0">
                  <Link href={item.href}>
                    <div className="relative overflow-hidden bg-white shadow-md w-[270px] h-[390px] sm:w-[270px] sm:h-[420px] md:w-[320px] md:h-[500px] lg:w-[340px] lg:h-[530px] xl:w-[360px] xl:h-[560px] transition-all duration-300 ease-in-out transform hover:scale-105">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                      <div className="absolute inset-x-0 bottom-0 p-4 group">
                        <div className="transition-all duration-500 ease-in-out group-hover:-translate-y-12">
                          <div className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                            <h3
                              className={`text-white text-lg md:text-xl lg:text-2xl font-bold text-left transition-all duration-500 ${avertaBlack.className}`}
                            >
                              {item.name}
                            </h3>
                            <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                          </div>
                        </div>

                        <div className="absolute left-0 right-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                          <p className="text-white/90 text-sm md:text-base pb-[2px] pl-[2px]">
                            Durable and stylish outerwear reimagined for the
                            next generation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows moved above container */}
        </div>
      </div>
    </section>
  );
}
