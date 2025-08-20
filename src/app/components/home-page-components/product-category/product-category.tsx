"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/src/app/lib/utils";

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  href: string;
  slug?: string;
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
    href: "/collections/mens-denim-jackets",
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
  categories?: {
    men: Category[];
    women: Category[];
  };
  onCategoryClick?: (slug: string) => void;
}

export default function ProductCategory({
  bg = "bg-white",
  arrowBgColor = "bg-black",
  arrowTextColor = "text-white",
  arrowHoverBgColor = "hover:bg-black",
  tabTextColor = "text-gray-700",
  tabActiveColor = "border-[#2b2b2b] text-[#2b2b2b]",
  tabHoverColor = "hover:text-[#2b2b2b]",
  categories: propCategories,
  onCategoryClick,
}: ProductCategoryProps) {
  const [activeTab, setActiveTab] = useState<"men" | "women">("men");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const displayCategories = propCategories 
    ? (activeTab === "men" ? propCategories.men : propCategories.women)
    : (activeTab === "men" ? menCategories : womenCategories);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={`w-full ${bg} flex justify-center overflow-hidden font-bold`}>
      <div className="w-full max-w-[1896px] py-0 m-0 md:pl-8 lg:pl-[57px]">
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
        
        <div className="w-full flex justify-end items-center gap-2 sm:gap-3 mb-2 md:mb-3">
          <button
            onClick={() => scroll("left")}
            className={cn(
              "block rounded-none p-2 sm:p-3 shadow-lg backdrop-blur-sm transition-all duration-300 focus:outline-none",
              arrowBgColor,
              arrowHoverBgColor
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft className={cn("w-5 h-5 sm:w-6 sm:h-6", arrowTextColor)} />
          </button>
          <button
            onClick={() => scroll("right")}
            className={cn(
              "block rounded-none p-2 sm:p-3 shadow-lg backdrop-blur-sm transition-all duration-300",
              arrowBgColor,
              arrowHoverBgColor
            )}
            aria-label="Scroll right"
          >
            <ChevronRight className={cn("w-5 h-5 sm:w-6 sm:h-6", arrowTextColor)} />
          </button>
        </div>
        
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
            className="overflow-x-auto overflow-y-hidden scroll-smooth hide-scrollbar"
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {displayCategories.map((item) => (
                <div key={item.id} className="group flex-shrink-0">
                  {onCategoryClick ? (
                    <div onClick={() => onCategoryClick(item.href || item.slug || '')} className="cursor-pointer">
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
                              <h3 className="text-white text-lg md:text-xl lg:text-2xl font-black text-left transition-all duration-500">
                                {item.name}
                              </h3>
                              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                            </div>
                          </div>

                          <div className="absolute left-0 right-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                            <p className="text-white/90 text-sm md:text-base pb-[2px] pl-[2px]">
                              Durable and stylish outerwear reimagined for the next generation.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
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
                              <h3 className="text-white text-lg md:text-xl lg:text-2xl font-black text-left transition-all duration-500">
                                {item.name}
                              </h3>
                              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                            </div>
                          </div>

                          <div className="absolute left-0 right-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                            <p className="text-white/90 text-sm md:text-base pb-[2px] pl-[2px]">
                              Durable and stylish outerwear reimagined for the next generation.
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}