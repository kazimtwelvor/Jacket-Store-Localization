"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, ChevronDown, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import type { Category } from "@/types";

interface CategoryFilterBarProps {
  category: Category;
  hasActiveFilters: boolean;
  isFilterSticky: boolean;
  sortDropdownOpen: boolean;
  setSortDropdownOpen: (open: boolean) => void;
  setCategoriesSidebarOpen: (open: boolean) => void;
  setCategorySliderOpen: (open: boolean) => void;
  setFilterSidebarOpen: (open: boolean) => void;
  setSizeModalOpen: (open: boolean) => void;
  clearFilters: () => void;
  selectedFilters: {
    sizes: string[];
    colors: string[];
  };
  onSortChange?: (sortBy: string) => void;
  currentSort?: string;
}

const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  category,
  hasActiveFilters,
  isFilterSticky,
  sortDropdownOpen,
  setSortDropdownOpen,
  setCategoriesSidebarOpen,
  setCategorySliderOpen,
  setFilterSidebarOpen,
  setSizeModalOpen,
  clearFilters,
  selectedFilters,
  onSortChange,
  currentSort = "popular",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterBarRef = useRef<HTMLDivElement>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    const handleHeaderVisibility = (event: CustomEvent) => {
      setIsHeaderVisible(event.detail.isVisible);
    };

    window.addEventListener("headerVisibilityChange", handleHeaderVisibility as EventListener);
    
    return () => {
      window.removeEventListener("headerVisibilityChange", handleHeaderVisibility as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownOpen &&
        filterBarRef.current &&
        !filterBarRef.current.contains(event.target as Node)
      ) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortDropdownOpen, setSortDropdownOpen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("filterBarSticky", {
          detail: { isSticky: isFilterSticky },
        })
      );
    }
  }, [isFilterSticky]);

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortValue);
    router.push(`?${params.toString()}`, { scroll: false });
    onSortChange?.(sortValue);
    setSortDropdownOpen(false);
  };

  const getSortDisplayName = (sortValue: string) => {
    const sortOptions = {
      popular: "Most Popular",
      newest: "Newest",
      "price-high": "Price (high-low)",
      "price-low": "Price (low-high)",
    };
    return sortOptions[sortValue as keyof typeof sortOptions] || "Most Popular";
  };

  const getStickyPosition = () => {
    if (!isFilterSticky) return "relative";
    
    if (isHeaderVisible) {
      return "fixed top-10 sm:top-16 md:top-0 left-0 right-0 px-2 py-2 z-[9003] sticky-filter-bar";
    } else {
      return "fixed top-0 left-0 right-0 px-2 py-2 z-[9003] sticky-filter-bar";
    }
  };

  return (
    <>
      <style jsx>{`
        .filter-button {
          padding: 0.5rem 0.75rem;
          display: flex;
          align-items: center;
          cursor: pointer;
          border-right: 1px solid rgba(255, 255, 255, 0.3);
          transition: background-color 0.2s;
        }
        .filter-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .filter-button.active {
          background-color: white;
          color: #374151;
        }
        .filter-button span {
          margin-right: 0.25rem;
          font-size: 0.75rem;
        }
        .filter-count {
          font-size: 0.75rem;
          color: #4b5563;
          margin-right: 0.25rem;
        }
        .sort-button-container {
          position: relative;
        }
        .sort-button {
          display: flex;
          align-items: center;
          padding: 1rem 0.75rem;
          color: white;
          transition: background-color 0.2s;
        }
        .sort-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .sort-button span {
          margin-right: 0.25rem;
          font-size: 0.75rem;
        }
        .sort-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 0.5rem;
          background-color: black;
          border-radius: 0.375rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          padding: 0.5rem 0;
          z-index: 9999;
          width: 8rem;
        }
        .sort-dropdown button {
          width: 100%;
          text-align: left;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          color: white;
          transition: color 0.2s;
        }
        .sort-dropdown button:hover {
          color: #666;
        }
        .clear-filters-button {
          margin-left: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #4b5563;
          transition: color 0.2s;
        }
        .clear-filters-button:hover {
          color: black;
        }
        .size-guide-button {
          display: none;
          align-items: center;
          border: 1px solid #d1d5db;
          padding: 0.375rem 0.5rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s;
        }
        .size-guide-button:hover {
          background-color: #f9fafb;
        }
        .size-guide-button span {
          font-size: 0.75rem;
        }
        @media (min-width: 640px) {
          .filter-button {
            padding: 0.625rem 1rem;
          }
          .filter-button span {
            font-size: 0.8rem;
          }
          .sort-button {
            padding: 0.75rem 1rem;
          }
          .sort-button span {
            margin-right: 0.5rem;
            font-size: 0.875rem;
          }
          .clear-filters-button {
            margin-left: 0.75rem;
            font-size: 0.875rem;
          }
          .size-guide-button {
            display: flex;
            padding: 0.5rem 0.75rem;
          }
          .size-guide-button span {
            font-size: 0.875rem;
          }
        }
        @media (min-width: 768px) {
          .clear-filters-button {
            margin-left: 1rem;
          }
        }
      `}</style>
      <style jsx global>{`
        body.header-hidden .sticky-filter-bar {
          top: 0px;
        }
      `}</style>
      <div
        ref={filterBarRef}
        className={cn(
          "w-full px-2 py-4 mb-6 transition-all duration-300",
          getStickyPosition(),
          "md:px-6 md:py-3 md:mb-10",
          "lg:px-8 lg:py-3"
        )}
      >
        <div
          className={cn(
            "w-full flex flex-col justify-center items-center gap-3",
            "md:flex-row md:justify-between md:items-center"
          )}
        >
          <div
            className={cn(
              "w-full flex items-center relative",
              "md:w-auto md:flex-row md:items-center"
            )}
          >
            <div className="w-full bg-[#2b2b2b] text-white rounded-[15px] shadow-md flex items-center">
              <button
                className="flex-1 px-4 py-4 md:px-6 md:py-3 flex items-center cursor-pointer border-r border-white/30 hover:bg-white/10 transition-colors"
                onClick={() => setCategorySliderOpen(true)}
              >
                <span className="font-bold mr-1 text-xs md:text-sm">
                  {category.name}
                </span>
                <ChevronDown size={16} />
              </button>

              <div
                className={cn(
                  "filter-button",
                  hasActiveFilters ? "active" : ""
                )}
                onClick={() => setFilterSidebarOpen(true)}
              >
                <span>Filter</span>
                {hasActiveFilters && (
                  <span className="filter-count">
                    (
                    {selectedFilters.sizes.length +
                      selectedFilters.colors.length}
                    )
                  </span>
                )}
                <Filter size={14} />
              </div>
              <div className="sort-button-container">
                <button
                  className="sort-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSortDropdownOpen(!sortDropdownOpen);
                  }}
                >
                  <span>{getSortDisplayName(currentSort)}</span>
                  <ChevronDown size={14} />
                </button>

                {sortDropdownOpen && (
                  <div className="sort-dropdown">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSortChange("popular");
                      }}
                    >
                      Most Popular
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSortChange("newest");
                      }}
                    >
                      Newest
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSortChange("price-high");
                      }}
                    >
                      Price (high-low)
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSortChange("price-low");
                      }}
                    >
                      Price (low-high)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <motion.button
                onClick={clearFilters}
                className="clear-filters-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                CLEAR FILTERS
              </motion.button>
            )}
            <motion.button
              onClick={() => setSizeModalOpen(true)}
              className="hidden sm:flex items-center  top-33 md:top-28 px-4 py-3 rounded-[15px] bg-black text-white hover:bg-black transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-medium">What's my size?</span>
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryFilterBar;
