"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, X, Ruler } from "lucide-react";
import { cn } from "../lib/utils";
import type { Size, Color, Product } from "@/types";
// import { useCart } from "@/contexts/CartContext"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../contexts/CartContext";

interface MobileAddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  availableSizes: Size[];
  availableColors: Color[];
  selectedColorId: string;
}

export default function MobileAddToCartModal({
  isOpen,
  onClose,
  product,
  availableSizes,
  availableColors,
  selectedColorId,
}: MobileAddToCartModalProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<"size-selection" | "cart-confirmation">(
    "size-selection"
  );
  const [mobileSizeId, setMobileSizeId] = useState<string>("");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("US");

  // Enable smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  // Debug logging

  // Hardcoded test sizes for debugging
  const testSizes = [
    { id: "1", name: "XS", value: "XS" },
    { id: "2", name: "S", value: "S" },
    { id: "3", name: "M", value: "M" },
    { id: "4", name: "L", value: "L" },
    { id: "5", name: "XL", value: "XL" },
  ];

  // Use test sizes if no real sizes available
  const sizesToShow = availableSizes.length > 0 ? availableSizes : testSizes;

  const handleAddToCart = () => {
    if (mobileSizeId) {
      const selectedSize = sizesToShow.find((s: Size) => s.id === mobileSizeId);
      const selectedSizeName = selectedSize?.name || "Default";

      addToCart(product, selectedSizeName);
      setStep("cart-confirmation");
      // Open cart sidebar after adding item
      window.dispatchEvent(new CustomEvent("openCart"));
    }
  };

  const handleClose = () => {
    setStep("size-selection");
    setMobileSizeId("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50  bg-opacity-50 z-[9999] block lg:hidden"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="absolute bottom-0 left-0 right-0 w-full bg-white overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full max-h-[90vh]">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {step === "size-selection" ? (
                <>
                  {/* Product Info - Fixed */}
                  <div className="px-6 pb-4 pt-4">
                    <h3 className="text-base font-bold text-black mb-2 truncate pr-12">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {product.salePrice !== "0" ? (
                        <>
                          <span className="text-base font-bold line-through text-gray-400">
                            ${product.price}
                          </span>
                          <span className="text-base font-bold text-[#2b2b2b]">
                            ${product.salePrice}
                          </span>
                        </>
                      ) : (
                        <span className="text-base font-bold text-[#2b2b2b]">
                          ${product.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Separator Line */}
                  <div className="border-t border-gray-200 mb-6"></div>

                  {/* Size Selection - Scrollable */}
                  <div className="flex-1 px-6 mb-6">
                    <p className="text-xs font-medium text-gray-700 mb-3">
                      Sizes shown are standard to your country
                    </p>
                    <div className="max-h-60 overflow-y-auto">
                      {sizesToShow.map((size: Size) => {
                        const isSelected = mobileSizeId === size.id;
                        let stockStatus = "available";
                        if (typeof (size as any).stock === "number") {
                          stockStatus =
                            (size as any).stock === 0
                              ? "notify"
                              : (size as any).stock <= 5
                                ? "few"
                                : "available";
                        }

                        return (
                          <button
                            key={size.id}
                            onClick={() => {
                              if (stockStatus !== "notify") {
                                setMobileSizeId(size.id);
                              }
                            }}
                            disabled={stockStatus === "notify"}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 border-t border-b",
                              "border-gray-300",
                              stockStatus === "notify" &&
                              "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <div
                              className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                isSelected
                                  ? "border-black bg-black"
                                  : "border-gray-300 bg-white"
                              )}
                            >
                              {isSelected && (
                                <Check size={12} className="text-white" />
                              )}
                            </div>
                            <span className="font-medium flex-1 text-left">
                              {size.name}
                            </span>
                            {stockStatus === "few" && (
                              <span className="text-xs text-orange-600 font-medium">
                                Few left
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setShowSizeChart(true)}
                      className="flex items-center gap-2 text-xs text-black-500 mt-2 hover:text-gray-700 ml-auto"
                    >
                      <span>Size Chart</span>
                      <Ruler size={14} />
                    </button>
                  </div>

                  {/* Add to Cart Button - Fixed */}
                  <div className="px-6 pb-6">
                    <button
                      onClick={handleAddToCart}
                      disabled={!mobileSizeId}
                      className={cn(
                        "w-full py-4  font-bold transition-colors",
                        mobileSizeId
                          ? "bg-black hover:bg-gray-800 text-white"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Success Message */}
                  <div className="px-6 pb-4 pt-2">
                    <h3 className="text-lg font-bold text-black">
                      Item Added to Cart
                    </h3>
                  </div>

                  <div className="border-t border-gray-200 mb-6"></div>

                  {/* Product Details */}
                  <div className=" flex gap-2 mb-8 p-4 bg-gray-50  mx-5">
                    {/* Product Image */}
                    <div className="w-32 h-48 bg-white  flex-shrink-0 overflow-hidden">
                      <img
                        src={
                          (product.images?.[0] as any)?.url ||
                          "/placeholder.svg"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-black mb-1 line-clamp-2">
                        {product.name}
                      </h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {product.salePrice !== "0" ? (
                            <>
                              <span className="text-sm line-through text-gray-400">
                                ${product.price}
                              </span>
                              <span className="text-base font-bold text-[#2b2b2b]">
                                ${product.salePrice}
                              </span>
                            </>
                          ) : (
                            <span className="text-base font-bold text-[#2b2b2b]">
                              ${product.price}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Size:{" "}
                          <span className="font-medium">
                            {
                              sizesToShow.find(
                                (s: Size) => s.id === mobileSizeId
                              )?.name
                            }
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Color:{" "}
                          <span className="font-medium">
                            {availableColors.find(
                              (c: Color) => c.id === selectedColorId
                            )?.name || "Default"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 px-6 pb-6">
                    <button
                      onClick={() => {
                        handleClose();
                        router.push("/cart");
                      }}
                      className="w-full py-4 bg-white border-2 border-black text-black font-bold  hover:bg-gray-50 transition-colors"
                    >
                      VIEW CART
                    </button>
                    <button
                      onClick={() => {
                        handleClose();
                        router.push("/checkout");
                      }}
                      className="w-full py-4 bg-black text-white font-bold  hover:bg-gray-800 transition-colors"
                    >
                      CHECKOUT
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Size Chart Modal */}
      {showSizeChart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-[10000]"
          onClick={() => setShowSizeChart(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="absolute bottom-0 left-0 right-0 w-full bg-white overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full max-h-[90vh]">
              {/* Close Button */}
              <div className="relative">
                <button
                  onClick={() => setShowSizeChart(false)}
                  className="absolute top-2
                   right-4 p-2 hover:bg-black-50 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              <div className="px-6 pb-4 pt-16">
                <h3 className="text-xl font-bold text-[#2b2b2b] mb-2">
                  Size Chart
                </h3>
                <p className="text-sm text-gray-600">Find your perfect fit</p>
              </div>

              <div className="border-t border-[#2b2b2b]/20 mb-6"></div>

              <div className="flex-1 px-6 mb-8 overflow-y-auto">
                {/* Size Chart Table */}
                <div className="bg-gradient-to-br from-red-50 to-white p-4 border border-[#2b2b2b]/20 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#2b2b2b] text-white">
                          <th className="text-left py-3 px-3 font-bold ">
                            US
                          </th>
                          {/* <th className="text-left py-3 px-3 font-bold">UK</th>
                          <th className="text-left py-3 px-3 font-bold">EU</th> */}
                          <th className="text-left py-3 px-3 font-bold">
                            Chest (in)
                          </th>
                          <th className="text-left py-3 px-3 font-bold">
                            Waist (in)
                          </th>
                          <th className="text-left py-3 px-3 font-bold ">
                            Hip (in)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr className="border-b border-[#2b2b2b]/10 hover:bg-black-50 transition-colors">
                          <td className="py-3 px-3 font-semibold text-[#2b2b2b]">
                            XS
                          </td>

                          <td className="py-3 px-3">32-34</td>
                          <td className="py-3 px-3">24-26</td>
                          <td className="py-3 px-3">34-36</td>
                        </tr>
                        <tr className="border-b border-[#2b2b2b]/10 hover:bg-black-50 transition-colors">
                          <td className="py-3 px-3 font-semibold text-[#2b2b2b]">
                            S
                          </td>

                          <td className="py-3 px-3">34-36</td>
                          <td className="py-3 px-3">26-28</td>
                          <td className="py-3 px-3">36-38</td>
                        </tr>
                        <tr className="border-b border-[#2b2b2b]/10 hover:bg-black-50 transition-colors">
                          <td className="py-3 px-3 font-semibold text-[#2b2b2b]">
                            M
                          </td>

                          <td className="py-3 px-3">36-38</td>
                          <td className="py-3 px-3">28-30</td>
                          <td className="py-3 px-3">38-40</td>
                        </tr>
                        <tr className="border-b border-[#2b2b2b]/10 hover:bg-black-50 transition-colors">
                          <td className="py-3 px-3 font-semibold text-[#2b2b2b]">
                            L
                          </td>

                          <td className="py-3 px-3">38-40</td>
                          <td className="py-3 px-3">30-32</td>
                          <td className="py-3 px-3">40-42</td>
                        </tr>
                        <tr className="hover:bg-black-50 transition-colors">
                          <td className="py-3 px-3 font-semibold text-[#2b2b2b] rounded-bl-lg">
                            XL
                          </td>

                          <td className="py-3 px-3">40-42</td>
                          <td className="py-3 px-3">32-34</td>
                          <td className="py-3 px-3 rounded-br-lg">42-44</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#2b2b2b]/5 border-l-4 border-[#2b2b2b] ">
                  <p className="text-sm text-[#2b2b2b] font-medium mb-1">
                    📏 Measurement Guide
                  </p>
                  <p className="text-xs text-gray-600">
                    All measurements are in inches. For best fit, measure
                    yourself and compare with the chart above.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
