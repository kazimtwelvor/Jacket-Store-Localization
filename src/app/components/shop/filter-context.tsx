"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useCountry } from "@/src/hooks/use-country"

// Define filter types
export type FilterState = {
  materials: string[]
  style: string[]
  gender: string[]
  colors: string[]
  sizes: string[]
}

type FilterContextType = {
  filters: FilterState
  setFilter: (type: keyof FilterState, value: string) => void
  clearFilters: () => void
  applyFilters: () => void
  totalActiveFilters: number
}

const initialFilters: FilterState = {
  materials: [],
  style: [],
  gender: [],
  colors: [],
  sizes: []
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const router = useRouter()
  const { countryCode } = useCountry()

  // Load filters from URL on initial render
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const params = new URLSearchParams(window.location.search);
    const materials = params.get("materials")?.split(",").filter(Boolean) || []
    const style = params.get("style")?.split(",").filter(Boolean) || []
    const gender = params.get("gender")?.split(",").filter(Boolean) || []
    const colors = params.get("color")?.split(",").filter(Boolean) || []
    const sizes = params.get("size")?.split(",").filter(Boolean) || []

    setFilters({
      materials,
      style,
      gender,
      colors,
      sizes
    })
  }, [])

  // Toggle a filter value
  const setFilter = (type: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentValues = prev[type] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value]
      
      return { ...prev, [type]: newValues }
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters(initialFilters)
  }

  // Apply filters by updating URL
  const applyFilters = () => {
    const params = new URLSearchParams(window.location.search)
    
    // Clear existing filter params
    params.delete("materials")
    params.delete("style")
    params.delete("gender")
    params.delete("color")
    params.delete("size")
    params.delete("page") // Reset to page 1 when filters change
    
    if (filters.materials.length > 0) {
      params.set("materials", filters.materials.join(","))
    }
    
    if (filters.style.length > 0) {
      params.set("style", filters.style.join(","))
    }
    
    if (filters.gender.length > 0) {
      params.set("gender", filters.gender.join(","))
    }
    
    if (filters.colors.length > 0) {
      params.set("color", filters.colors.join(","))
    }
    
    if (filters.sizes.length > 0) {
      params.set("size", filters.sizes.join(","))
    }
    
    const queryString = params.toString()
    router.push(`/${countryCode}/shop${queryString ? `?${queryString}` : ""}`, { scroll: false })
  }

  // Calculate total active filters
  const totalActiveFilters = 
    filters.materials.length + 
    filters.style.length + 
    filters.gender.length + 
    filters.colors.length + 
    filters.sizes.length

  return (
    <FilterContext.Provider value={{ 
      filters, 
      setFilter, 
      clearFilters, 
      applyFilters,
      totalActiveFilters
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider")
  }
  return context
}