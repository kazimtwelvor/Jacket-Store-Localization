"use client"

import { useEffect, useState } from "react"
import Info from "./info"
import type { Product } from "@/types"

interface StickyProductDetailsProps {
  product: Product
}

const StickyProductDetails: React.FC<StickyProductDetailsProps> = ({ product }) => {
  const [isFixed, setIsFixed] = useState(true)

  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth'
    
    const handleScroll = () => {
      const imagesSection = document.querySelector('.w-\\[60\\%\\]')
      if (imagesSection) {
        const imagesSectionBottom = imagesSection.getBoundingClientRect().bottom + window.scrollY
        const currentScroll = window.scrollY + window.innerHeight
        
        if (currentScroll >= imagesSectionBottom) {
          setIsFixed(false)
        } else {
          setIsFixed(true)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      className={`w-[40%] pl-8 lg:pl-12 xl:pl-16 pr-8 lg:pr-12 xl:pr-16 py-8 ${
        isFixed 
          ? 'fixed top-0 right-0 h-screen' 
          : 'absolute bottom-0 right-0'
      }`}
      style={isFixed ? {width: '40%', maxWidth: '768px'} : {width: '40%', maxWidth: '768px'}}
    >
      <Info data={product} />
    </div>
  )
}

export default StickyProductDetails