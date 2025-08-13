"use client"
import { useEffect, useState, useCallback, useMemo } from "react"

import { Truck, CreditCard, RefreshCw, Shield, Gift, HeadphonesIcon } from "lucide-react"
import ProductCarousel from "./product-carousel"
import DesktopCategoryCarousel from "./desktop-category-carousel"
import HolidaySaleBanner from "./holiday-sale-banner"
import AnimatedReviewsSection from "./animated-reviews-section"
import AboutSection from "./about-section"
import { useMediaQuery } from "../../hooks/use-mobile"
import GlobalFashionPartners from "./global-fashion-partners"
import WelcomeAccordionSection from "./welcome-accordion-section"
import SignatureStylesSection from "./signature-styles-section"
import CollectionsBrowseSection from "./collections-browse-section"
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

    // Observe all section elements
    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section)
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
      <section id="holiday-banner" className="w-full">
        <HolidaySaleBanner />
      </section>

      {/* Welcome Accordion */}
      <section id="welcome-accordion" className="w-full mb-0 pb-0">
        <WelcomeAccordionSection />
      </section>

      {/* Category Carousel */}
      {/* <section id="category-carousel" className="w-full mt-0 pt-0">
        <DesktopCategoryCarousel />
      </section> */}

       
{/* Signature Styles */}
      <section id="signature-styles" className="w-full">
        <SignatureStylesSection />
      </section>
      
       {/* Product Carousel */}
      <section id="product-carousel" className="w-full">
        {memoizedProducts && memoizedProducts.length > 0 ? (
          <ProductCarousel items={memoizedProducts} />
        ) : (
          <div className="py-10 text-center">
            <p className="text-gray-500">No featured products available</p>
          </div>
        )}
      </section>

{/* Collections Browse */}
      <section id="collections-browse" className="w-full">
        <CollectionsBrowseSection />
      </section>
      
     
    {/* About Section */}
      <section id="about" className="w-full">
        <AboutSection />
      </section>
     
{/* Why Choose FINEYST */}
      <section id="why-choose-fineyst" className="w-full">
        <WhyChooseFineystSlider />
      </section>

      {/* FAQ Leather */}
      <section id="faq-leather" className="w-full">
        <FAQ/>
      </section>

      {/* Blogs Showcase */}
      <section id="blogs-showcase" className="w-full">
        <BlogsShowcase />
      </section>

 {/* Global Fashion Partners */}
      <section id="GFP" className="w-full">
        <GlobalFashionPartners />
      </section>

      {/* Animated Reviews */}
      <section id="reviews" className="w-full">
        <AnimatedReviewsSection />
      </section>
    </main>
  )
}
