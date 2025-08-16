"use client"

import Link from "next/link"
import { cn } from "../../lib/utils"
import type { Product } from "@/types"
import { avertaBlack } from "@/src/lib/fonts"

interface ProductHeaderProps {
  data: Product
  isMobile: boolean
}

const ProductHeader = ({ data, isMobile }: ProductHeaderProps) => {
  return (
    <>
    
      {!isMobile && (
        <div className="pt-20 text-sm">
          <nav className="flex items-center">
            <Link href="/shop" className="text-gray-500 hover:text-black uppercase font-medium">
              SHOP
            </Link>
            <span className="mx-1 text-gray-500">/</span>
            <Link href="/shop/leather" className="text-gray-500 hover:text-black uppercase font-medium">
              LEATHER
            </Link>
            <span className="mx-1 text-gray-500">/</span>
            <span className="text-black truncate max-w-[170px] uppercase font-medium" title={data.name}>
              {data.name.length > 20 ? `${data.name.substring(0, 20)}` : data.name}
            </span>
          </nav>
        </div>
      )}

      {/* Sale Flags - Mobile Style */}
      {isMobile && data.salePrice && (
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-black text-white px-2 py-1 text-xs font-bold">
            Sale -{Math.round(((parseFloat(data.price) - parseFloat(data.salePrice as string)) / parseFloat(data.price)) * 100)}%
          </div>
          <div className="text-black px-2 py-1 text-xs font-medium border border-gray-300">
            Slim fit
          </div>
        </div>
      )}



      {/* Product Title */}
      <div className={cn("mt-2", isMobile ? "mb-3" : "mt-2")}>
        <h1 id="product-title" className={cn(
          `${avertaBlack.className} font-bold leading-tight`,
          isMobile ? "text-lg line-clamp-2 md:text-xl line-clamp-2 sm:text-2xl line-clamp-2" : "text-xl lg:text-2xl line-clamp-2"
        )}>
          {data.name.toUpperCase()}
        </h1>



        {/* Price Section */}
        <div className={cn(isMobile ? "py-1 mb-1" : "py-5 mb-3")}>
          {(() => {
            const hasValidSalePrice = data.salePrice && parseFloat(data.salePrice) > 0;
            if (hasValidSalePrice) {
              return (
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-bold line-through text-gray-500",
                    isMobile ? "text-lg sm:text-xl md:text-2xl" : "text-lg lg:text-xl"
                  )}>
                    ${data.price}
                  </span>
                  <span className={cn(
                    "font-bold text-black",
                    isMobile ? "text-lg sm:text-xl md:text-2xl" : "text-xl lg:text-2xl"
                  )}>
                    ${data.salePrice}
                  </span>
                </div>
              );
            } else {
              return (
                <span className={cn(
                  "font-bold text-black",
                  isMobile ? "text-lg sm:text-xl md:text-2xl" : "text-xl lg:text-2xl"
                )}>
                  ${data.price}
                </span>
              );
            }
          })()}
          <div className={cn(
            "text-gray-600 font-medium",
            isMobile ? "text-xs mt-1" : "text-sm mt-2"
          )}>

            {/* Sale Flags - Desktop Style */}
            {!isMobile && (
              <div className="flex items-center gap-3 ">
                {data.salePrice && parseFloat(data.salePrice) > 0 && (
                  <div className="bg-black text-white px-3 py-1.5 text-xs pointer-events-none">
                    Sale -{Math.round(((parseFloat(data.price) - parseFloat(data.salePrice as string)) / parseFloat(data.price)) * 100)}%
                  </div>
                )}
                <div className="text-black px-3 py-1.5 text-xs  border border-gray-800">
                  Slim fit
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

export default ProductHeader