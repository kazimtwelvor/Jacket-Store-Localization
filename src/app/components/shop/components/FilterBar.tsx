import React from "react"
import { cn } from "../../../lib/utils"
import { ChevronDown, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface FilterBarProps {
  isFilterSticky: boolean
  layoutMetrics: {
    filterBarHeight: number
  }
  hasActiveFilters: boolean
  totalActiveFilters: number
  activeSort: string
  sortDropdownOpen: boolean
  setSortDropdownOpen: (open: boolean) => void
  setFilterSidebarOpen: (open: boolean) => void
  setSizeModalOpen: (open: boolean) => void
  clearFilters: () => void
  handleSortChange: (sortValue: string) => void
  isDesktop: boolean
}

export const FilterBar: React.FC<FilterBarProps> = ({
  isFilterSticky,
  layoutMetrics,
  hasActiveFilters,
  totalActiveFilters,
  activeSort,
  sortDropdownOpen,
  setSortDropdownOpen,
  setFilterSidebarOpen,
  setSizeModalOpen,
  clearFilters,
  handleSortChange,
  isDesktop,
}) => {
  const getSortDisplayName = (sortValue: string) => {
    const sortOptions = {
      'popular': 'Most Popular',
      'newest': 'Newest',
      'price_desc': 'Price (high-low)',
      'price_asc': 'Price (low-high)'
    }
    return (sortOptions as any)[sortValue] || 'Most Popular'
  }

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
          color: #2b2b2b;
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
        @media (min-width: 640px) {
          .filter-button {
            padding: 0.625rem 1rem;
          }
          .filter-button span {
            font-size: 0.800rem;
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
        }
        @media (min-width: 768px) {
          .clear-filters-button {
            margin-left: 1rem;
          }
        }
      `}</style>
      
      <div style={{ height: isFilterSticky ? `${layoutMetrics.filterBarHeight}px` : "auto" }}>
        <div
          className={cn(
            "w-full px-2 py-4 mb-6 transition-all duration-300",
            isFilterSticky ? "fixed left-0 right-0 px-2 py-2 z-[9003] sticky-filter-bar" : "relative",
            isFilterSticky ? "top-16 md:top-[6.5rem]" : "",
            "md:px-6 md:py-3 md:mb-10",
            "lg:px-8 lg:py-3"
          )}
        >
          <div className={cn(
            "w-full flex flex-col justify-center items-center gap-3",
            "md:flex-row md:justify-between md:items-center"
          )}>
            <div className={cn(
              "w-full flex items-center relative",
              "md:w-auto md:flex-row md:items-center"
            )}>
              <div className="w-full bg-[#2b2b2b] text-white rounded-[15px] shadow-md flex items-center">
                <button
                  className="flex-1 px-4 py-4 md:px-6 md:py-3 flex items-center cursor-pointer border-r border-white/30 hover:bg-white/10 transition-colors"
                  onClick={() => setFilterSidebarOpen(true)}
                >
                  <span className="font-bold mr-1 text-xs md:text-sm">All Categories</span>
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
                      ({totalActiveFilters})
                    </span>
                  )}
                  <Filter size={14} />
                </div>
                
                <div className="sort-button-container">
                  <button
                    className="sort-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSortDropdownOpen(!sortDropdownOpen)
                    }}
                  >
                    <span>{getSortDisplayName(activeSort)}</span>
                    <ChevronDown size={14} />
                  </button>
                  
                  {sortDropdownOpen && (
                    <div className="sort-dropdown">
                      <button onClick={(e) => { e.stopPropagation(); handleSortChange('popular'); }}>Most Popular</button>
                      <button onClick={(e) => { e.stopPropagation(); handleSortChange('newest'); }}>Newest</button>
                      <button onClick={(e) => { e.stopPropagation(); handleSortChange('price_desc'); }}>Price (high-low)</button>
                      <button onClick={(e) => { e.stopPropagation(); handleSortChange('price_asc'); }}>Price (low-high)</button>
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
                className="hidden sm:flex items-center top-33 md:top-28 px-4 py-3 rounded-[15px] bg-black text-white hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm font-medium">What's my size?</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
