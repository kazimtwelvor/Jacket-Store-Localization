import React from "react"
import { cn } from "../../../lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Button from "../../../ui/button"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  loading: boolean
  onPageChange: (page: number) => void
  isDesktop: boolean
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  loading,
  onPageChange,
  isDesktop,
}) => {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = isDesktop ? 5 : 3

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2)
      let start = Math.max(1, currentPage - halfVisible)
      const end = Math.min(totalPages, start + maxVisiblePages - 1)

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={!hasPreviousPage || loading} 
        className="flex items-center gap-1"
      >
        <ChevronLeft size={16} />
        {isDesktop && "Previous"}
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page) => (
          <Button 
            key={page} 
            variant={page === currentPage ? "default" : "outline"} 
            size="sm" 
            onClick={() => onPageChange(page)} 
            disabled={loading} 
            className={cn(
              "min-w-[40px]", 
              page === currentPage && "bg-[#2b2b2b] hover:bg-black-700 text-white"
            )}
          >
            {page}
          </Button>
        ))}
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={!hasNextPage || loading} 
        className="flex items-center gap-1"
      >
        {isDesktop && "Next"}
        <ChevronRight size={16} />
      </Button>
    </div>
  )
}
