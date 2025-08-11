"use client"

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import { FilterState } from './filter-context'

export function useProductFilter(initialProducts: Product[], filters: FilterState) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  
  
  useEffect(() => {
    let result = [...initialProducts]
    
    if (filters.sizes.length > 0) {
      result = result.filter(product => 
        (product as any).sizes?.some((size: any) => 
          filters.sizes.includes(size.value || size.name)
        )
      )
    }
    
  
    if (filters.colors.length > 0) {
      result = result.filter(product => 
        (product as any).colors?.some((color: any) => 
          filters.colors.includes(color.name)
        )
      )
    }
    
    if ((filters as any).categories?.length > 0) {
      result = result.filter(product => 
        (filters as any).categories.includes(product.category || '')
      )
    }
    
    if ((filters as any).priceRanges?.length > 0) {
      result = result.filter(product => {
        const price = Number(product.price) || 0
        return (filters as any).priceRanges.some((range: any) => {
          const [min, max] = range.split('-').map(Number)
          return price >= min && (max ? price <= max : true)
        })
      })
    }
    
    if ((filters as any).sort !== 'featured') {
      switch((filters as any).sort) {
        case 'price_asc':
          result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
          break
        case 'price_desc':
          result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
          break
        case 'newest':
          result.sort((a, b) => 
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          )
          break
      }
    }
    
    setFilteredProducts(result)
  }, [initialProducts, filters])
  
  return filteredProducts
}