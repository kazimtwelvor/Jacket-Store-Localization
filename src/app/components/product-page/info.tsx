
"use client"

import type React from "react"
import type { Product, Size, Color, ProductImage } from "@/types"
import { useCart } from "../../contexts/CartContext"
import { useState, useEffect } from "react"
import useWishlist from "../../hooks/use-wishlist"
import { cn } from "../../lib/utils"
import { getProductReviews, type ReviewData } from "../../actions/get-reviews"
import MobileAddToCartModal from "../../modals/MobileAddToCartModal"
import ProductHeader from "../../components/product-page/ProductHeader"
import ColorSelection from "../../components/product-page/ColorSelection"
import SizeSelection from "../../components/product-page/SizeSelection"
import AddToCartButton from "../../components/product-page/AddToCartButton"
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
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showDescriptionModal, setShowDescriptionModal] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewContent, setReviewContent] = useState("")
  const [reviews, setReviews] = useState<ReviewData[]>([])
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
  const availableSizes: Size[] = (data.sizeDetails as Size[]) || []
  const availableColors: Color[] = (data.colorDetails as Color[]) || []
  


  // Set default selected color when data loads (but not size)
  useEffect(() => {
    if (availableColors.length > 0 && !selectedColorId) {
      setSelectedColorId(availableColors[0].id)
    }
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const sizeSelector = document.getElementById("size-selector");
        if (sizeSelector && !sizeSelector.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [availableSizes, availableColors, selectedSizeId, selectedColorId])

  // Fetch reviews when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      if (data.id) {
        setReviewsLoading(true)
        try {
          const productReviews = await getProductReviews(data.id)
          setReviews(productReviews)
        } catch (error) {
        } finally {
          setReviewsLoading(false)
        }
      }
    }

    fetchReviews()
  }, [data.id])







  // Handle navbar visibility on scroll and modal events
  useEffect(() => {
    // Enable smooth scrolling for all devices
    document.documentElement.style.scrollBehavior = 'smooth'
    document.body.style.scrollBehavior = 'smooth'
    
    // Aggressive mobile scroll optimization
    if (isMobile) {
      document.body.style.overscrollBehavior = 'auto'
      document.body.style.touchAction = 'auto'
      document.documentElement.style.touchAction = 'auto'
      
      // Force touch-action on all elements
      const allElements = document.querySelectorAll('*')
      allElements.forEach(el => {
        (el as HTMLElement).style.touchAction = 'auto'
      })
    }
    
    const handleScroll = () => {
      if (!isMobile) return
      const productTitle = document.getElementById('product-title')
      if (productTitle) {
        const rect = productTitle.getBoundingClientRect()
        const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0
        setShowNavbar(isVisible)
        
        // Dispatch custom event to control navbar
        window.dispatchEvent(new CustomEvent('toggleNavbar', { 
          detail: { show: isVisible } 
        }))
      }
    }

    const handleShowMobileSizeModal = () => {
      setShowMobileSizeModal(true)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('showMobileSizeModal', handleShowMobileSizeModal)
    
    // Prevent touch events from interfering with scroll
    if (isMobile) {
      const preventTouchInterference = (e: TouchEvent) => {
        // Don't prevent default, just ensure scrolling continues
        e.stopPropagation = () => {}
      }
      
      document.addEventListener('touchstart', preventTouchInterference, { passive: true })
      document.addEventListener('touchmove', preventTouchInterference, { passive: true })
      
      handleScroll() // Check initial state
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('showMobileSizeModal', handleShowMobileSizeModal)
    }
  }, [isMobile])

  // Helper function to format time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
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
  const isInWishlist = wishlist.isInWishlist(data.id)

  const onAddToCart = () => {
    
    if (!selectedSizeId && availableSizes.length > 0) {
      // Highlight size selector if no size is selected
      document.getElementById("size-selector")?.classList.add("ring-2", "ring-red-500")
      setSizeError("Please select a size")
      setTimeout(() => {
        document.getElementById("size-selector")?.classList.remove("ring-2", "ring-red-500")
      }, 2000)
      return
    }

    setIsLoading(true)

    try {
      // Get the selected size name
      const selectedSizeName = availableSizes.find((size: Size) => size.id === selectedSizeId)?.name || 'Default'
      
      // Get the selected color name
      const selectedColorName = selectedColorId
        ? availableColors.find((color: Color) => color.id === selectedColorId)?.name || "Default"
        : availableColors[0]?.name || "Default"
      
      
      // Add to cart immediately
      addToCart(data, selectedSizeName, selectedColorName)
      
      
      // Open cart sidebar after adding item
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openCart'))
        setIsLoading(false)
      }, 300)
      
    } catch (error) {
      setIsLoading(false)
    }
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
          : "max-w-full pt-6 pb-6 px-4 lg:px-6"
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
        colorLinks={data.colorLinks}
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
        )}>{data.sku || "N/A"}</span>
      </div>

      <ProductDropdowns 
        data={data}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reviews={reviews}
        reviewsLoading={reviewsLoading}
        getTimeAgo={getTimeAgo}
        isMobile={isMobile}
        deliveryDates={deliveryDates}
      />
      
      </div>
    </>
  )
}



export default Info