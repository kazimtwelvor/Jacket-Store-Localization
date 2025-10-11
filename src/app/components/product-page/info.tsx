
"use client"

import type React from "react"
import type { Product, Size, Color, ProductImage } from "@/types"
import { useCart } from "../../contexts/CartContext"
import { useState, useEffect } from "react"
import useWishlist from "../../hooks/use-wishlist"
import { cn } from "../../lib/utils"
import MobileAddToCartModal from "../../modals/MobileAddToCartModal"
import ProductHeader from "../../components/product-page/ProductHeader"
import ColorSelection from "../../components/product-page/ColorSelection"
import SizeSelection from "../../components/product-page/SizeSelection"
import AddToCartButton from "../../components/product-page/AddToCartButton"
import AddToCartSuccess from "../../components/product-page/AddToCartSuccess"
import DeliveryInfo from "../../components/product-page/DeliveryInfo"
import ProductDropdowns from "../../components/product-page/ProductDropdowns"

interface InfoProps {
  data: Product
  isMobile?: boolean
  suggestProducts?: Product[]
}

const Info: React.FC<InfoProps> = ({ data, isMobile = false, suggestProducts = [] }) => {
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [selectedSizeId, setSelectedSizeId] = useState<string>("")
  const [selectedColorId, setSelectedColorId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("")
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showDescriptionModal, setShowDescriptionModal] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewContent, setReviewContent] = useState("")
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [showMobileSizeModal, setShowMobileSizeModal] = useState(false)
  const [showMobileCartModal, setShowMobileCartModal] = useState(false)
  const [mobileSizeId, setMobileSizeId] = useState<string>("")
  const [showNavbar, setShowNavbar] = useState(false)
  const [sizeError, setSizeError] = useState<string>("")
  

  




  
  // Calculate estimated delivery date (mobile: 5-8 business days, desktop: 5-10 business days)
  const getEstimatedDeliveryDates = () => {
    const today = new Date()
    
    // Calculate earliest delivery (5 business days)
    const earliestDate = new Date(today)
    let businessDaysToAdd = 5
    let daysAdded = 0
    
    while (daysAdded < businessDaysToAdd) {
      earliestDate.setDate(earliestDate.getDate() + 1)
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (earliestDate.getDay() !== 0 && earliestDate.getDay() !== 6) {
        daysAdded++
      }
    }
    
    // Calculate latest delivery (8 business days for mobile, 10 for desktop)
    const latestDate = new Date(today)
    businessDaysToAdd = isMobile ? 8 : 10
    daysAdded = 0
    
    while (daysAdded < businessDaysToAdd) {
      latestDate.setDate(latestDate.getDate() + 1)
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (latestDate.getDay() !== 0 && latestDate.getDay() !== 6) {
        daysAdded++
      }
    }
    
    // Format the dates as "Day, Month Date"
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' }
    return {
      earliest: earliestDate.toLocaleDateString('en-US', options),
      latest: latestDate.toLocaleDateString('en-US', options)
    }
  }

  const deliveryDates = getEstimatedDeliveryDates()

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  // Use the sizes and colors from the API response if available
  const availableSizes: Size[] = (data?.sizeDetails as Size[]) || []
  // Create consistent color order using colorLinks as master reference
  const rawColors: Color[] = (data?.colorDetails as Color[]) || []
  const colorLinks = data?.colorLinks || {}
  
  // Get master color order from colorLinks keys (this stays consistent)
  const masterColorOrder = Object.keys(colorLinks)
  
  // Sort availableColors to match master order
  const availableColors: Color[] = rawColors.sort((a, b) => {
    const aIndex = masterColorOrder.indexOf(a.name)
    const bIndex = masterColorOrder.indexOf(b.name)
    
    // If both colors are in master order, sort by master order
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex
    }
    
    // If only one is in master order, prioritize it
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    
    // If neither is in master order, keep original order
    return 0
  })
  


  // Set selected color to current product's base color
  useEffect(() => {
    if (availableColors.length > 0 && !selectedColorId) {
      // Find current product's color (baseColor) in the sorted array
      const currentProductColor = data?.baseColor
      if (currentProductColor) {
        const matchingColor = availableColors.find(color => color.id === currentProductColor.id)
        if (matchingColor) {
          setSelectedColorId(matchingColor.id)
        } else {
          setSelectedColorId(availableColors[0].id)
        }
      } else {
        setSelectedColorId(availableColors[0].id)
      }
    }
  }, [availableColors.length, data?.baseColor])

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const sizeSelector = document.getElementById("size-selector");
        if (sizeSelector && !sizeSelector.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen])

  // Use reviews from product data
  const reviews = data?.reviews || []







  // Handle mobile modal events only
  useEffect(() => {
    const handleShowMobileSizeModal = () => {
      setShowMobileSizeModal(true)
    }

    window.addEventListener('showMobileSizeModal', handleShowMobileSizeModal)
    
    return () => {
      window.removeEventListener('showMobileSizeModal', handleShowMobileSizeModal)
    }
  }, [])

  // Helper function to format time ago
  const getTimeAgo = (date: Date | string) => {
    const reviewDate = new Date(date)
    const now = new Date()
    const diffInMs = now.getTime() - reviewDate.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "1 day ago"
    if (diffInDays < 30) return `${diffInDays} days ago`
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30)
      return months === 1 ? "1 month ago" : `${months} months ago`
    }
    const years = Math.floor(diffInDays / 365)
    return years === 1 ? "1 year ago" : `${years} years ago`
  }

  const { addToCart } = useCart()
  const wishlist = useWishlist()
  const isInWishlist = wishlist?.isInWishlist(data?.id)

  const onAddToCart = () => {
    if (!selectedSizeId && availableSizes.length > 0) {
      setSizeError("Please select a size")
      return
    }

    if (showSuccessAnimation || isLoading) {
      return
    }

    setIsLoading(true)

    const selectedSizeName = availableSizes.find((size: Size) => size.id === selectedSizeId)?.name || 'Default'
    const selectedColorName = selectedColorId
      ? availableColors.find((color: Color) => color.id === selectedColorId)?.name || "Default"
      : availableColors[0]?.name || "Default"
    
    addToCart(data, selectedSizeName, selectedColorName)
    
    setShowSuccessAnimation(true)
    
    setTimeout(() => {
      setIsLoading(false)
    }, 50)
  }

  // Scroll utility functions
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Get the currently selected color name
  const selectedColorName = selectedColorId
    ? availableColors.find((color: Color) => color.id === selectedColorId)?.name || "Default"
    : availableColors[0]?.name || "Default"

  return (
    <> 
      <div className={cn(
        "bg-white product-page", 
        isMobile 
          ? "w-full py-2 px-4 sm:px-6" 
          : "max-w-full pt-0 pb-6 "
      )}>

      {/* Mobile Add to Cart Modal */}
      <MobileAddToCartModal 
        isOpen={showMobileSizeModal}
        onClose={() => setShowMobileSizeModal(false)}
        product={data}
        availableSizes={availableSizes}
        availableColors={availableColors}
        selectedColorId={selectedColorId || (availableColors[0]?.id || '')}
      />

      <ProductHeader data={data} isMobile={isMobile} />

      <ColorSelection 
        availableColors={availableColors}
        selectedColorId={selectedColorId}
        setSelectedColorId={setSelectedColorId}
        selectedColorName={selectedColorName}
        isMobile={isMobile}
        colorLinks={data?.colorLinks}
      />

      <SizeSelection 
        availableSizes={availableSizes}
        selectedSizeId={selectedSizeId}
        setSelectedSizeId={(id: string) => { setSelectedSizeId(id); setSizeError("") }}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        isMobile={isMobile}
        isLoading={isLoading}
        onAddToCart={onAddToCart}
        setShowMobileSizeModal={setShowMobileSizeModal}
        errorMessage={sizeError}
      />

      <AddToCartButton onAddToCart={onAddToCart} isLoading={isLoading} isMobile={isMobile} />
      
      <DeliveryInfo deliveryDates={deliveryDates} isMobile={isMobile} />

     {/* SKU Display */}
      <div className={cn(
        "flex items-center",
        isMobile ? "mb-4" : "mb-6 sm:mb-8"
      )}>
        <span className={cn(
          "font-medium uppercase mr-2",
          isMobile ? "text-xs" : "text-sm"
        )}>SKU:</span>
        <span className={cn(
          "font-bold text-black-600",
          isMobile ? "text-xs" : "text-sm"
        )}>{data?.sku || "N/A"}</span>
      </div>

      <ProductDropdowns 
        data={data}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reviews={reviews}
        reviewsLoading={false}
        getTimeAgo={getTimeAgo}
        isMobile={isMobile}
        deliveryDates={deliveryDates}
      />
      
      {/* Success Animation */}
      <AddToCartSuccess 
        isVisible={showSuccessAnimation}
        onComplete={() => setShowSuccessAnimation(false)}
      />
      
      </div>
    </>
  )
}



export default Info