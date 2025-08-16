"use client"
import { useEffect, useState, useCallback, useMemo } from "react"

import { Truck, CreditCard, RefreshCw, Shield, Gift, HeadphonesIcon } from "lucide-react"
import ProductCarousel from "./product-carousel"
import DesktopCategoryCarousel from "./desktop-category-carousel"
import HolidaySaleBanner from "./holiday-sale-banner"
import AnimatedReviewsSection from "./animated-reviews-div"
import AboutSection from "./about-div"
import { useMediaQuery } from "../../hooks/use-mobile"
import GlobalFashionPartners from "./global-fashion-partners"
import WelcomeAccordionSection from "./welcome-accordion-div"
import SignatureStylesSection from "./signature-styles-div"
import CollectionsBrowseSection from "./collections-browse-div"
import FAQ from "./faq"
import WhyChooseFineystSlider from "./why-choose-fineyst-slider"
import BlogsShowcase from "./BlogsShowcase"

// Define types for the props
interface ShowcaseItem {
  id: string
  title: string
  image: string
  link: string
  bgColor: string
}

interface Feature {
  title: string
  description: string
  icon: string
  link: string
}

interface HomePageClientProps {
  billboard: any
  products: any[]
  showcaseItems: ShowcaseItem[]
  features: Feature[]
}

// Add a performance optimization hook at the top of the component
export default function HomePageClient({ billboard, products, showcaseItems, features }: HomePageClientProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Optimize component mounting
  useEffect(() => {
    setIsMounted(true)

    // Add intersection observer to lazy load components as they come into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }))
        })
      },
      { threshold: 0.1, rootMargin: "100px" },
    )

    // Observe all div elements
    document.querySelectorAll("div[id]").forEach((div) => {
      observer.observe(div)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  // Optimize icon mapping with useMemo
  const iconMap = useMemo(
    () => ({
      Truck,
      CreditCard,
      RefreshCw,
      Shield,
      Gift,
      HeadphonesIcon,
    }),
    [],
  )

  // Optimize icon getter with useCallback
  const getIcon = useCallback(
    (iconName: string) => {
      return (iconMap as any)[iconName] || Truck
    },
    [iconMap],
  )

  // Memoize products to prevent unnecessary re-renders
  const memoizedProducts = useMemo(() => products, [products])
  const memoizedShowcaseItems = useMemo(() => showcaseItems, [showcaseItems])

  return (
    <main className="flex flex-col w-full overflow-hidden">
      <h1 className="sr-only">Fineyst - Premium Leather Jackets and Streetwear</h1>
      {/* Holiday Banner */}
      <div id="holiday-banner" className="w-full">
        <HolidaySaleBanner />
      </div>

      {/* Welcome Accordion */}
      <div id="welcome-accordion" className="w-full mb-0 pb-0">
        <WelcomeAccordionSection />
      </div>

      {/* Category Carousel */}
      {/* <div id="category-carousel" className="w-full mt-0 pt-0">
        <DesktopCategoryCarousel />
      </div> */}

       
{/* Signature Styles */}
      <div id="signature-styles" className="w-full">
        <SignatureStylesSection />
      </div>
      
       {/* Product Carousel */}
      <div id="product-carousel" className="w-full">
        {memoizedProducts && memoizedProducts.length > 0 ? (
          <ProductCarousel items={memoizedProducts} />
        ) : (
          <div className="py-10 text-center">
            <p className="text-gray-500">No featured products available</p>
          </div>
        )}
      </div>

{/* Collections Browse */}
      <div id="collections-browse" className="w-full">
        <CollectionsBrowseSection />
      </div>
      
     
    {/* About Section */}
      <div id="about" className="w-full">
        <AboutSection />
      </div>
     
{/* Why Choose FINEYST */}
      <div id="why-choose-fineyst" className="w-full">
        <WhyChooseFineystSlider />
      </div>

      {/* FAQ Leather */}
      <div id="faq-leather" className="w-full">
        <FAQ/>
      </div>

      {/* Blogs Showcase */}
      <div id="blogs-showcase" className="w-full">
        <BlogsShowcase />
      </div>

 {/* Global Fashion Partners */}
      <div id="GFP" className="w-full">
        <GlobalFashionPartners />
      </div>

      {/* Animated Reviews */}
      <div id="reviews" className="w-full">
        <AnimatedReviewsSection />
      </div>
    </main>
  )
}
