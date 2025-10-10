"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"
import type { Product, Review } from "@/types"
import ProductDetailsModal from "../../modals/ProductDetailsModal"
import { stripH2Tags } from "../../lib/stripHeadings"

interface ProductDropdownsProps {
  data: Product
  activeTab: string
  setActiveTab: (tab: string) => void
  reviews: Review[]
  reviewsLoading: boolean
  getTimeAgo: (date: Date | string) => string
  isMobile: boolean
  deliveryDates: {
    earliest: string
    latest: string
  }
}

const ProductDropdowns = ({ 
  data, 
  activeTab, 
  setActiveTab, 
  reviews, 
  reviewsLoading, 
  getTimeAgo,
  isMobile,
  deliveryDates
}: ProductDropdownsProps) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  

  
  return (
    <div className="border-t border-gray-200">
      <noscript>
        <div className="py-3 sm:py-4 px-2 sm:px-0">
          <h3 className="text-sm font-bold uppercase mb-2">Details</h3>
          <div className="pb-3 sm:pb-4 text-sm text-gray-700 leading-relaxed">
            {(() => {
              const description = data?.description || "";
              let parsedSpecs = null;
              try {
                parsedSpecs = typeof data?.specifications === 'string' 
                  ? JSON.parse(data.specifications) 
                  : data?.specifications;
              } catch {
                parsedSpecs = data?.specifications;
              }
              const materials = parsedSpecs?.externalMaterial || [];
              const materialDisplay = materials.length > 0 ? materials.join(', ') : (data?.material || "Premium fabric");
              const fitDisplay = parsedSpecs?.fit || "Regular fit";
              
              return (
                <>
                  <div dangerouslySetInnerHTML={{ __html: stripH2Tags(description) }} />
                  <ul className="list-disc pl-5 mt-3 sm:mt-4 space-y-1">
                    <li>SKU: {data?.sku || "N/A"}</li>
                    <li>Material: {materialDisplay}</li>
                    <li>Fit: {fitDisplay}</li>
                  </ul>
                </>
              );
            })()}
          </div>
        </div>
        <div className="py-3 sm:py-4 px-2 sm:px-0">
          <h3 className="text-sm font-bold uppercase mb-2">Customer Reviews</h3>
          <div className="pb-6 pt-2">
            <div className="text-center py-4">
              <p className="text-gray-500">Reviews require JavaScript to load.</p>
            </div>
          </div>
        </div>
        <div className="py-3 sm:py-4 px-2 sm:px-0">
          <h3 className="text-sm font-bold uppercase mb-2">Care</h3>
          <div className="pb-3 sm:pb-4 text-sm text-gray-700 leading-relaxed">
            <p>To preserve the quality of your garment:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Machine wash cold with similar colors</li>
              <li>Do not bleach</li>
              <li>Tumble dry low</li>
              <li>Iron on low heat if needed</li>
              <li>Do not dry clean</li>
            </ul>
          </div>
        </div>
        <div className="py-3 sm:py-4 px-2 sm:px-0">
          <h3 className="text-sm font-bold uppercase mb-2">Shipping & Returns</h3>
          <div className="pb-3 sm:pb-4 text-sm text-gray-700 leading-relaxed">
            <p className="mb-2">Standard Shipping (5-10 business days): Free on orders over $99</p>
            <p className="mb-2">Express Shipping (1-2 business days): $15</p>
            <p>International shipping available to select countries.</p>
            <p className="mt-3 sm:mt-4 font-medium">Returns accepted within 30 days of delivery.</p>
          </div>
        </div>
      </noscript>
      {/* Details Dropdown */}
      <div className="border-b border-gray-200" data-dropdown>
        <button 
          onClick={() => setActiveTab(activeTab === "details" ? "" : "details")}
          className="w-full py-3 sm:py-4 px-2 sm:px-0 flex items-center justify-between text-sm font-bold uppercase text-[#00000]"
        >
          <span>Details</span>
          <ChevronDown 
            size={16} 
            className={`text-[#00000] transition-transform duration-200 ${activeTab === "details" ? "rotate-180" : ""}`} 
          />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeTab === "details" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="pb-3 sm:pb-4 text-sm text-gray-700 leading-relaxed" data-dropdown>
            {(() => {
              const description = data?.description || "";
              const firstParagraphEnd = description.indexOf('</p>') + 4;
              const firstParagraph = firstParagraphEnd > 4 ? description.substring(0, firstParagraphEnd) : description;
              const restOfDescription = firstParagraphEnd > 4 ? description.substring(firstParagraphEnd) : "";
              
              let parsedSpecs = null;
              try {
                parsedSpecs = typeof data?.specifications === 'string' 
                  ? JSON.parse(data.specifications) 
                  : data?.specifications;
              } catch {
                parsedSpecs = data?.specifications;
              }
              const materials = parsedSpecs?.externalMaterial || [];
              const materialDisplay = materials.length > 0 ? materials.join(', ') : (data?.material || "Premium fabric");
              const fitDisplay = parsedSpecs?.fit || "Regular fit";
              
              return (
                <>
                  <div dangerouslySetInnerHTML={{ __html: stripH2Tags(firstParagraph) }} />
                  
                  {restOfDescription && (
                    <button 
                      onClick={() => setShowDetailsModal(true)}
                      className="flex items-center justify-center w-full py-2 mt-2 bg-black-50 hover:bg-black-100 rounded-md transition-colors"
                    >
                      <span className="text-sm font-medium mr-1 text-[#00000]">Read more</span>
                      <ChevronDown size={16} className="text-[#00000]" />
                    </button>
                  )}
                  
                  <ul className="list-disc pl-5 mt-3 sm:mt-4 space-y-1">
                    <li>SKU: {data?.sku || "N/A"}</li>
                    <li>Material: {materialDisplay}</li>
                    <li>Fit: {fitDisplay}</li>
                  </ul>
                </>
              );
            })()}
          </div>
        </div>
      </div>
      
      {/* Reviews Dropdown */}
      <div className="border-b border-gray-200" data-dropdown>
        <button 
          onClick={() => setActiveTab(activeTab === "reviews" ? "" : "reviews")}
          className="w-full py-3 sm:py-4 px-2 sm:px-0 flex items-center justify-between text-sm font-bold uppercase text-[#00000]"
        >
          <span>Customer Reviews</span>
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const avgRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0
                return (
                  <svg key={star} className={`w-3 h-3 ${star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                  </svg>
                )
              })}
            </div>
            <span className="text-xs text-gray-500">({reviews.length})</span>
            <ChevronDown 
              size={16} 
              className={`text-[#00000] ml-2 transition-transform duration-200 ${activeTab === "reviews" ? "rotate-180" : ""}`} 
            />
          </div>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeTab === "reviews" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="pb-6 pt-2" data-dropdown>
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-[#00000] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="max-h-80 overflow-y-auto space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 22 20">
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                          ))}
                        </div>
                        <p className="font-medium text-sm">{review.userName}</p>
                      </div>
                      <span className="text-xs text-gray-500">{getTimeAgo(new Date(review.createdAt))}</span>
                    </div>
                    {review.title && <h4 className="font-medium text-sm mb-1">{review.title}</h4>}
                    <p className="text-sm text-gray-700">{review.comment}</p>
                    {review.photoUrl && (
                      <img src={review.photoUrl} alt="Review photo" width={64} height={64} className="mt-2 w-16 h-16 object-cover rounded" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Care Dropdown */}
      <div className="border-b border-gray-200" data-dropdown>
        <button 
          onClick={() => setActiveTab(activeTab === "care" ? "" : "care")}
          className="w-full py-3 sm:py-4 px-2 sm:px-0 flex items-center justify-between text-sm font-bold uppercase text-[#00000]"
        >
          <span>Care</span>
          <ChevronDown 
            size={16} 
            className={`text-[#00000] transition-transform duration-200 ${activeTab === "care" ? "rotate-180" : ""}`} 
          />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeTab === "care" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="pb-3 sm:pb-4 text-sm text-gray-700 leading-relaxed" data-dropdown>
            <p>To preserve the quality of your garment:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Machine wash cold with similar colors</li>
              <li>Do not bleach</li>
              <li>Tumble dry low</li>
              <li>Iron on low heat if needed</li>
              <li>Do not dry clean</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Shipping Dropdown */}
      <div className="border-b border-gray-200" data-dropdown>
        <button 
          onClick={() => setActiveTab(activeTab === "shipping" ? "" : "shipping")}
          className="w-full py-3 sm:py-4 px-2 sm:px-0 flex items-center justify-between text-sm font-bold uppercase text-[#00000]"
        >
          <span>Shipping & Returns</span>
          <ChevronDown 
            size={16} 
            className={`text-[#00000] transition-transform duration-200 ${activeTab === "shipping" ? "rotate-180" : ""}`} 
          />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeTab === "shipping" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="pb-3 sm:pb-4 text-sm text-gray-700 leading-relaxed" data-dropdown>
            <p className="mb-2">Standard Shipping (5-10 business days): Free on orders over $99</p>
            <p className="mb-2">Express Shipping (1-2 business days): $15</p>
            <p>International shipping available to select countries.</p>
            <div className={cn(
              "mt-3 p-4 bg-gray  rounded-lg border border-black-200 shadow-sm",
              isMobile && "mt-2 p-3"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("bg-gray rounded-full p-1.5", isMobile && "p-1")}>
                  <svg className={cn("text-black", isMobile ? "w-3 h-3" : "w-4 h-4")} fill="white" stroke="black" viewBox="0 0 24 24">
                    <path strokeLinecap="round"  strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 13a2 2 0 002 2h6a2 2 0 002-2L16 7" />
                  </svg>
                </div>
                <p className={cn("font-medium text-[#00000]", isMobile && "text-xs")}>Estimated Delivery Range</p>
              </div>
              <p className={cn("ml-8  text-black-600 font-bold", isMobile && "ml-4 text-sm")}>
                {deliveryDates.earliest} - {deliveryDates.latest}
              </p>
              <p className={cn("ml-8 text-xs text-gray-500 mt-2", isMobile && "ml-6 text-[10px]")}>If you order today</p>
            </div>
            <p className="mt-3 sm:mt-4 font-medium">Returns accepted within 30 days of delivery.</p>
          </div>
        </div>
      </div>
      
      <ProductDetailsModal 
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        product={data}
      />
    </div>
  )
}

export default ProductDropdowns