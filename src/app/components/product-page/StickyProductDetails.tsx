"use client"

import { useEffect, useState, useRef } from "react"
import Info from "./info"
import type { Product } from "@/types"

interface StickyProductDetailsProps {
  product: Product
}

const StickyProductDetails: React.FC<StickyProductDetailsProps> = ({ product }) => {
  const [isFixed, setIsFixed] = useState(true)

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    
    const handleScroll = () => {
      console.log('scrolling')
      const imagesSection = document.querySelector('.w-\\[60\\%\\]')
      if (imagesSection) {
        console.log('imagesSection', imagesSection)
        const imagesSectionBottom = imagesSection.getBoundingClientRect().bottom + window.scrollY
        const currentScroll = window.scrollY + window.innerHeight
        
        if (currentScroll >= imagesSectionBottom) {
          console.log('currentScrollNOTFIXED', currentScroll)
          setIsFixed(false)
        } else {
          console.log('currentScrollFIXED', currentScroll)
          setIsFixed(true)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
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