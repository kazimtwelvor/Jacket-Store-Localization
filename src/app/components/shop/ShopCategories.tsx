import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface KeywordCategory {
  id: string
  name: string
  slug: string
  imageUrl?: string
}

interface ShopCategoriesProps {
  keywordCategories: KeywordCategory[]
}

const getCleanImageUrl = (rawUrl: string): string => {
  const trimmedUrl = rawUrl.replace(/\n/g, '').trim();
  if (trimmedUrl.startsWith('http')) {
    const parts = trimmedUrl.split('/');
    const filename = parts[parts.length - 1]?.trim();
    if (filename) {
      return `/uploads/2025/${filename}`;
    }
  }
  return trimmedUrl;
};

const ArrowIcon = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {direction === 'left' ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    )}
  </svg>
);

const ShopCategories: React.FC<ShopCategoriesProps> = ({ keywordCategories }) => {
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const isNavigatingRef = useRef(false);

  // Placeholder categories for error handling
  const placeholderCategories = [
    { id: "1", name: "Leather Jackets", slug: "leather-jackets", imageUrl: "/images/leather.webp" },
    { id: "2", name: "Bomber Jackets", slug: "bomber-jackets", imageUrl: "/placeholder.svg" },
    { id: "3", name: "Aviator Jackets", slug: "aviator-jackets", imageUrl: "/images/aviator.webp" },
    { id: "4", name: "Varsity Jackets", slug: "varsity-jackets", imageUrl: "/images/varsity.webp" },
    { id: "5", name: "Denim Jackets", slug: "denim-jackets", imageUrl: "/images/denim.webp" },
  ]

  const categories = keywordCategories.length > 0 ? keywordCategories : placeholderCategories

  const displayCategories = categories.map(category => ({
    name: category.name,
    icon: category.imageUrl ? getCleanImageUrl(category.imageUrl) : '/placeholder.svg',
    categoryId: category.id,
    slug: category.slug,
    isActive: false,
  }));

  const handleCategoryClick = (slug: string) => {
    if (!slug) return;
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    router.push(`/us/collections/${slug}`);
  }

  const checkForScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
    }
  }, []);

  const calculateVisibleCategories = useCallback(() => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      const isDesktopView = screenWidth >= 640;
      setIsDesktop(isDesktopView);
      
      if (isDesktopView) {
        const containerWidth = screenWidth * 0.6;
        const categoryWidth = 112 + 16;
        const count = Math.floor(containerWidth / categoryWidth) - 1;
        setVisibleCount(Math.max(1, count));
      }
    }
  }, []);

  useEffect(() => {
    calculateVisibleCategories();
    window.addEventListener('resize', calculateVisibleCategories);
    return () => window.removeEventListener('resize', calculateVisibleCategories);
  }, [calculateVisibleCategories]);

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
      el.addEventListener('scroll', checkForScrollability, { passive: true });
    }
    return () => {
      resizeObserver.disconnect();
      el.removeEventListener('scroll', checkForScrollability);
    };
  }, [checkForScrollability, isDesktop]);

  const scroll = (direction: 'left' | 'right') => {
    if (isDesktop && displayCategories.length > visibleCount) {
      const newIndex = direction === 'left' 
        ? Math.max(0, currentStartIndex - 2)
        : Math.min(displayCategories.length - visibleCount, currentStartIndex + 2);
      setCurrentStartIndex(newIndex);
    } else if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const showArrows = isDesktop 
    ? displayCategories.length > visibleCount
    : canScrollLeft || canScrollRight;

  const canGoLeft = isDesktop 
    ? currentStartIndex > 0
    : canScrollLeft;

  const canGoRight = isDesktop 
    ? currentStartIndex + visibleCount < displayCategories.length
    : canScrollRight;

  return (
    <div className="relative w-full group pt-20 sm:pt-24 md:pt-16">
      <div className="relative w-full md:w-[758px] md:mx-auto">
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}</style>
        <div
          ref={scrollContainerRef}
          className={`${isDesktop && displayCategories.length > visibleCount ? 'overflow-hidden' : 'overflow-x-auto overflow-y-hidden scroll-smooth'} md:text-center hide-scrollbar`}
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          <nav
            ref={navRef}
            className="inline-flex items-start gap-x-1 sm:gap-x-4 px-3 py-2 transition-transform duration-300 ease-in-out"
            style={isDesktop && displayCategories.length > visibleCount ? {
              transform: `translateX(-${currentStartIndex * (112 + 16)}px)`
            } : {}}
            aria-label="Product Categories"
          >
            {displayCategories.map((category, index) => {
              return (
                <div
                  key={category.slug || index}
                  onClick={() => handleCategoryClick(category.slug || '')}
                  className="relative flex flex-col items-center flex-shrink-0 w-[23vw] sm:w-28 text-center cursor-pointer py-2"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && handleCategoryClick(category.slug || '')}
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 rounded-full overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 ring-gray-200">
                    <Image
                      src={category.icon || '/placeholder.svg'}
                      alt={category.name || ''}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                      unoptimized={true}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-bold transition-colors duration-200 w-full text-gray-600">
                    {category.name}
                  </span>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {showArrows && (
        <>
          <button
            onClick={() => scroll('left')}
            className={`hidden 2xl:block absolute top-16 sm:top-20 md:top-24 -left-12 sm:-left-[2rem] lg:left-[21rem] z-20 bg-white/70 rounded-full p-1.5 shadow-lg backdrop-blur-sm transition-opacity duration-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-0 disabled:cursor-not-allowed ${
              !canGoLeft && 'opacity-0'
            }`}
            aria-label="Scroll left"
            disabled={!canGoLeft}
          >
            <ArrowIcon direction="left" />
          </button>

          <button
            onClick={() => scroll('right')}
            className={`hidden 2xl:block absolute top-16 sm:top-20 md:top-24 -right-12 sm:-right-[3rem] md:right-[13rem] lg:right-[20rem] z-20 bg-white/70 rounded-full p-1.5 shadow-lg backdrop-blur-sm transition-opacity duration-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-0 disabled:cursor-not-allowed ${
              !canGoRight && 'opacity-0'
            }`}
            aria-label="Scroll right"
            disabled={!canGoRight}
          >
            <ArrowIcon direction="right" />
          </button>
        </>
      )}
    </div>
  );
}

export default ShopCategories;