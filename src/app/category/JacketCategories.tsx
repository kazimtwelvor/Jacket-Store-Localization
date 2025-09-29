
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  name?: string;
  icon?: string;
  slug?: string;
  categoryId?: string;
  imageUrl?: string;
  categoryName?: string;
}

interface JacketCategoriesProps {
  categories: Category[];
  onCategoryClick?: (slug: string) => void;
  currentCategory?: {
    categoryId: string;
    categoryName: string;
    imageUrl: string;
    slug?: string;
  };
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

const JacketCategories: React.FC<JacketCategoriesProps> = ({ categories, onCategoryClick, currentCategory }) => {
  const router = useRouter();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [arrowPositions, setArrowPositions] = useState({ left: 0, right: 0 });
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  const ARROW_SPACING = -50;

  useEffect(() => {
    const css = `
      .sticky-mask::before {
        content: '';
        position: absolute;
        top: 0;
        left: -1rem;
        width: 150vw;
        height: 100%;
        background: linear-gradient(to right, white 6rem, rgba(255, 255, 255, 0) 7.5rem);
        z-index: -1;
        pointer-events: none;
      }
    `;
    const styleTag = document.createElement('style');
    styleTag.id = 'jacket-categories-styles';
    styleTag.textContent = css;
    document.head.appendChild(styleTag);
    return () => {
      const existingStyleTag = document.getElementById('jacket-categories-styles');
      if (existingStyleTag) {
        document.head.removeChild(existingStyleTag);
      }
    };
  }, []);

  const handleCategoryClick = (slug: string) => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const targetPath = `/collections/${slug}`;
      
      if (currentPath === targetPath) {
        return;
      }
    }
    
    setActiveSlug(slug);
    onCategoryClick?.(slug);
  };

  const handleLinkClick = (e: React.MouseEvent, categorySlug: string) => {
    e.preventDefault();
    
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const targetPath = `/collections/${categorySlug}`;
      
      if (currentPath === targetPath) {
        return;
      }
    }
    
    if (onCategoryClick) {
      onCategoryClick(categorySlug);
    } else {
      router.push(`/collections/${categorySlug}`);
    }
  };

  const checkForScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
    }
  }, []);

  const updateArrowPositions = useCallback(() => {
    if (navRef.current && typeof window !== 'undefined') {
      const navRect = navRef.current.getBoundingClientRect();
      const containerRect = scrollContainerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const leftOffset = navRect.left - containerRect.left + ARROW_SPACING;
        const rightOffset = containerRect.right - navRect.right + ARROW_SPACING;
        setArrowPositions({
          left: leftOffset,
          right: rightOffset,
        });
      }
    }
  }, []);

  const calculateVisibleCategories = useCallback(() => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      const isDesktopView = screenWidth >= 640;
      setIsDesktop(isDesktopView);
      
      if (isDesktopView) {
        const containerWidth = screenWidth * 0.6; // 60% container width
        const categoryWidth = 112 + 16; // w-28 (112px) + gap (16px)
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

  // Force recalculation when categories change
  useEffect(() => {
    calculateVisibleCategories();
  }, [categories, currentCategory, calculateVisibleCategories]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (!isDesktop) {
      checkForScrollability();
      updateArrowPositions();
    }
    const resizeObserver = new ResizeObserver(() => {
      if (!isDesktop) {
        checkForScrollability();
        updateArrowPositions();
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
  }, [checkForScrollability, updateArrowPositions, isDesktop]);

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

  const displayCategories = [];
  if (currentCategory) {
    let cleanImageUrl = currentCategory.imageUrl;
    if (cleanImageUrl) {
      cleanImageUrl = getCleanImageUrl(cleanImageUrl);
    }
    // Use the slug from currentCategory if available, otherwise find matching category
    const properSlug = currentCategory.slug || 
                      categories.find(cat => cat.categoryId === currentCategory.categoryId)?.slug || 
                      currentCategory.categoryId;
    
    displayCategories.push({
      name: currentCategory.categoryName,
      icon: cleanImageUrl,
      categoryId: currentCategory.categoryId,
      slug: properSlug,
      isActive: true,
    });
  }

  categories.forEach((category) => {
    const name = category.name || category.categoryName || '';
    let imageUrl = category.icon || category.imageUrl || '';
    const id = category.categoryId || '';
    if (!imageUrl || !name) return;
    if (currentCategory && id === currentCategory.categoryId) return;
    imageUrl = getCleanImageUrl(imageUrl);
    // Ensure we use the proper slug from the category object
    const categorySlug = category.slug || id;
    displayCategories.push({
      name,
      icon: imageUrl,
      categoryId: id,
      slug: categorySlug,
      isActive: false,
    });
  });

  const categoriesToShow = displayCategories;

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
    <div className="relative w-full group -mt-8 sm:mt-0">
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
          {categoriesToShow.map((category, index) => {
            // Use the slug that was already determined when creating the category object
            const categorySlug = category.slug
            return (
              <Link
                key={categorySlug || index}
                href={`/collections/${categorySlug}`}
                onClick={(e) => handleLinkClick(e, categorySlug)}
                className={`relative flex flex-col items-center flex-shrink-0 w-[23vw] sm:w-28 text-center cursor-pointer py-2 ${category.isActive ? 'sticky left-3 z-10 sticky-mask' : ''}`}
                aria-current={category.isActive ? 'page' : undefined}
              >
                <div
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 mb-2 rounded-full overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    category.isActive ? ' shadow-lg shadow-gray-700/50' : 'ring-gray-200'
                  }`}
                >
                  <Image
                    src={category.icon || '/placeholder.svg'}
                    alt={category.name || ''}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                    priority={category.isActive}
                    unoptimized={true}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <span
                  className={`text-xs sm:text-sm font-bold transition-colors duration-200 w-full ${
                    category.isActive ? 'font-semibold text-black' : 'text-gray-600'
                  }`}
                >
                  {category.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      </div>

      {showArrows && (
        <>
          <button
            onClick={() => scroll('left')}
            className={`hidden sm:block absolute top-8 sm:top-10 -left-12 sm:-left-[2rem] lg:left-[21rem] z-20 bg-white/70 rounded-full p-1.5 shadow-lg backdrop-blur-sm transition-opacity duration-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-0 disabled:cursor-not-allowed ${
              !canGoLeft && 'opacity-0'
            }`}
            aria-label="Scroll left"
            disabled={!canGoLeft}
          >
            <ArrowIcon direction="left" />
          </button>

          <button
            onClick={() => scroll('right')}
            className={`hidden sm:block absolute top-8 sm:top-10 -right-12 sm:-right-[3rem] md:right-[13rem] lg:right-[20rem] z-20 bg-white/70 rounded-full p-1.5 shadow-lg backdrop-blur-sm transition-opacity duration-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-0 disabled:cursor-not-allowed ${
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
};

export default JacketCategories;

