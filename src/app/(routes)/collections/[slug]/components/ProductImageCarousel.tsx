import React, { useState, useRef, useEffect } from "react"
import type { Product } from "@/types"
import { motion, useMotionValue, animate } from "framer-motion"
import Image from "next/image"
import { cn } from "@/src/app/lib/utils"

const DRAG_BUFFER = 10

interface ProductImageCarouselProps {
  product: Product
  wasDragged: React.MutableRefObject<boolean>
}

export const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({ 
  product, 
  wasDragged 
}) => {
  const images = product.images && product.images.length > 0 
    ? product.images.map(img => ({
        id: img.id,
        url: (img as any).image?.url || (img as any).url || "/placeholder.svg"
      }))
    : [{ id: "placeholder", url: "/placeholder.svg" }]
  const [imageIndex, setImageIndex] = useState(0)
  const dragX = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const onDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: any) => {
    if (Math.abs(offset.x) > DRAG_BUFFER) {
      wasDragged.current = true
    } else {
      wasDragged.current = false
      return
    }
    const dragThreshold = containerWidth / 4
    if (offset.x < -dragThreshold || velocity.x < -500) {
      setImageIndex(Math.min(imageIndex + 1, images.length - 1))
    } else if (offset.x > dragThreshold || velocity.x > 500) {
      setImageIndex(Math.max(imageIndex - 1, 0))
    }
  }

  useEffect(() => {
    if (containerWidth > 0) {
      animate(dragX, -imageIndex * containerWidth, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4,
      })
    }
  }, [imageIndex, containerWidth, dragX])

  if (images.length <= 1) {
    return (
      <div className="w-full h-full overflow-hidden">
        <Image 
          src={(product.images?.[0] as any)?.image?.url || (product.images?.[0] as any)?.url || "/placeholder.svg"} 
          alt={product.name} 
          fill 
          className="object-cover object-top" 
          sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw" 
          draggable={false} 
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden relative cursor-grab active:cursor-grabbing">
      <motion.div 
        className="flex h-full" 
        style={{ x: dragX }} 
        drag="x" 
        dragConstraints={{ right: 0, left: -containerWidth * (images.length - 1) }} 
        dragElastic={0.15} 
        onPointerDown={() => { wasDragged.current = false }} 
        onDragEnd={onDragEnd}
      >
        {images.map((image, i) => (
          <div key={image.id || i} className="relative flex-shrink-0 w-full h-full">
            <Image 
              src={image.url} 
              alt={product.name} 
              fill 
              className="object-cover object-top pointer-events-none" 
              sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw" 
              draggable={false} 
              onDragStart={(e) => e.preventDefault()} 
            />
          </div>
        ))}
      </motion.div>
      
      <div className="absolute top-3 right-3 flex gap-1.5 z-10">
        {images.map((_, i) => (
          <div 
            key={`dot-${i}`} 
            onClick={(e) => { 
              e.stopPropagation(); 
              setImageIndex(i) 
            }} 
            className={cn(
              "w-1.5 h-1.5 rounded-full cursor-pointer transition-colors duration-300", 
              imageIndex === i ? "bg-black border border-black" : "bg-white border border-gray-400"
            )} 
          />
        ))}
      </div>
    </div>
  )
}
