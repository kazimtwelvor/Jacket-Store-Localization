"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingBag, ChevronLeft, ChevronRight, Truck, RotateCcw } from "lucide-react"
import Container from "@/src/app/ui/container"
import { useCart } from "@/src/app/contexts/CartContext"
import useWishlist from "@/src/app/hooks/use-wishlist"
import Currency from "@/src/app/ui/currency"
import Button from "@/src/app/ui/button"
import { toast } from "react-hot-toast"

interface AddMoreOfferProps {
  onContinueShopping: () => void
}


const AddMoreOffer: React.FC<AddMoreOfferProps> = ({ onContinueShopping }) => {
  return (
    <section className="relative overflow-hidden  shadow-md mt-4">
      <section className="absolute inset-0 bg-black"></section>

      <section className="relative p-4 flex flex-col items-center justify-center text-center">
        <p className="text-white text-base font-semibold pt13 mb-2">
          Add one more item to your cart and get <span className="text-[#F6F6F6]">10% off</span> your entire order!
        </p>
        <Button
          onClick={onContinueShopping}
          className="w-full bg-white text-[#2b2b2b] font-bold hover:bg-gray-100 hover:text-[#00000] transition-colors font-bold text-sm py-2"
        >
          Discover More
        </Button>
      </section>
    </section>
  )
}

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false)
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart()
  const wishlist = useWishlist()
  const router = useRouter()
  const [couponCode, setCouponCode] = useState("")
  const [isCouponApplied, setIsCouponApplied] = useState(false)
  const [showVoucherField, setShowVoucherField] = useState(false)
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)
  const [isCheckoutFixed, setIsCheckoutFixed] = useState(false)
  const [checkoutHeight, setCheckoutHeight] = useState(0)
  const checkoutRef = useRef<HTMLDivElement>(null)
  const sentinelTopRef = useRef<HTMLDivElement>(null)
  const sentinelBottomRef = useRef<HTMLDivElement>(null)


  const shippingPrice = totalPrice > 100 ? 0 : 10
  const taxRate = 0.08
  const taxAmount = totalPrice * taxRate
  const grandTotal = totalPrice + shippingPrice + taxAmount

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (checkoutRef.current) {
      setCheckoutHeight(checkoutRef.current.offsetHeight)
    }
  }, [isMounted])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768 && sentinelTopRef.current && sentinelBottomRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          const topEntry = entries.find(entry => entry.target === sentinelTopRef.current)
          const bottomEntry = entries.find(entry => entry.target === sentinelBottomRef.current)

          if (topEntry && !topEntry.isIntersecting) {
            if (checkoutRef.current) {
              setCheckoutHeight(checkoutRef.current.offsetHeight)
            }
            setIsCheckoutFixed(true)
          } else if (bottomEntry && bottomEntry.isIntersecting) {
            setIsCheckoutFixed(false)
          }
        },
        {
          threshold: 0,
          rootMargin: '0px 0px 0px 0px'
        }
      )

      observer.observe(sentinelTopRef.current)
      observer.observe(sentinelBottomRef.current)
      return () => observer.disconnect()
    }
  }, [isMounted])



  if (!isMounted) {
    return null
  }

  if (items.length === 0) {
    return (
      <section className="bg-white">
        <Container>
          <motion.section
            initial={{ opacity: 100, y: 20 }}
            animate={{ opacity: 100, y: 20 }}
            transition={{ duration: 0.5 }}
            className="px-4 py-16 sm:px-6 lg:px-8 min-h-[70vh] flex flex-col items-center justify-center"
          >
            <section className="text-center max-w-md mx-auto">
              <section className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-10 w-10 text-gray-400" />
              </section>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-500 pt-4 mb-8">
                Looks like you haven&apos;t added anything to your cart yet. Explore our collection and find something you&apos;ll
                love.
              </p>
              <Button onClick={() => router.push("/")} className="bg-[#B01E23] hover:bg-[#2b2b2b] text-white mt-4">
                Continue Shopping
              </Button>
            </section>
          </motion.section>
        </Container>
      </section>
    )
  }

  const handleApplyCoupon = () => {
    setIsCouponApplied(true)
    toast.success("Coupon applied successfully!")
  }

  const handleContinueShopping = () => {
    router.push("/")
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <section className="bg-gray-50">
      <Container>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-0 py-12 sm:px-1 lg:px-8"
        >
          <section className="max-w-7xl mx-auto">

            <nav className="flex items-center text-sm text-gray-500 mb-8 mt-6">


            </nav>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Your Shopping Cart
            </h1>

            <section className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-12 gap-y-8 lg:gap-y-0 lg:items-start">
              <section className="lg:col-span-7">
                <section className="space-y-2 -mt-5">
                  {items.map((item, index) => (
                    <motion.section
                      key={item.id}
                      initial={{ opacity: 100, y: 20 }}
                      animate={{ opacity: 100, y: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-4 md:p-5 flex flex-row items-start gap-3 sm:gap-4 md:gap-6 hover:shadow-md transition-all duration-200 relative w-full max-w-none sm:max-w-none md:max-w-full min-w-0 mx-0"
                    >
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded z-50 sm:top-3 sm:right-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <section className="relative w-20 sm:w-24 md:w-28 aspect-[3/5] flex-shrink-0 self-center">
                        <Image
                          src={item.product.images?.[0]?.url || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                        <button
                          onClick={() => {
                            wishlist.addItem(item)
                            toast.success('Added to wishlist!')
                          }}
                          className="absolute top-1 left-1 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.682l-1.318-1.364a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </section>

                      <section className="flex-1">
                        <h3 className="text-xs md:text-base font-bold text-black mb-2 md:mb-3 uppercase pr-10 md:pr-8 max-w-[240px] sm:max-w-[320px] md:max-w-[320px] lg:max-w-[380px] overflow-hidden relative" style={{ lineHeight: '1.2', height: '2.4em', wordBreak: 'break-word' }}>
                          <span style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent 0%, transparent 85%, white 100%)', pointerEvents: 'none', zIndex: 1 }}></span>
                          <Link href={`/product/${item.product.id}`}>{item.product.name}</Link>
                        </h3>

                        <section className="flex items-start justify-between pb-3 pt-3">
                          <section className="space-y-0.5">
                            <p className="text-xs sm:text-sm text-black">
                              <span className="font-medium">Color:</span> {item.selectedColor || item.product.color?.name || item.product.colors?.[0]?.name || 'Default'}
                            </p>
                            <p className="text-xs sm:text-sm text-black">
                              <span className="font-medium">Size:</span> {item.size || 'N/A'}
                            </p>
                          </section>
                          {item.quantity > 1 && (
                            <section className="text-right">
                              <p className="text-xs text-gray-500">Unit Price</p>
                              <section className="flex items-center gap-2">
                                {item.product.salePrice && Number(item.product.salePrice) > 0 ? (
                                  <>
                                    <span className="text-xs text-gray-400 line-through">
                                      <Currency value={Number(item.product.price) || 0} />
                                    </span>
                                    <span className="text-xs font-bold text-red-600">
                                      <Currency value={Number(item.product.salePrice) || 0} />
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-xs font-bold text-red-600">
                                    <Currency value={item.unitPrice || 0} />
                                  </span>
                                )}
                              </section>
                            </section>
                          )}
                        </section>

                        <section className="flex items-center justify-between pt-4">
                          <section className="flex items-center border border-gray-300 w-fit">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 sm:px-3 py-1 sm:py-2 text-gray-600 hover:text-[#B01E23] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm sm:text-lg"
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <span className="px-3 sm:px-4 py-1 sm:py-2 text-black font-medium min-w-[2.5rem] sm:min-w-[3rem] text-center border-l border-r border-gray-300 text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 sm:px-3 py-1 sm:py-2 text-gray-600 hover:text-[#B01E23] hover:bg-gray-50 transition-colors font-bold text-sm sm:text-lg"
                            >
                              +
                            </button>
                          </section>
                          <section className="text-right">
                            <p className="text-xs sm:text-sm text-gray-500">Total Price</p>
                            <p className="text-sm sm:text-base font-bold text-black">
                              <Currency value={(item.unitPrice || 0) * (item.quantity || 1)} />
                            </p>
                          </section>
                        </section>
                      </section>
                    </motion.section>
                  ))}
                </section>

                <section className="mt-8">
                  <button
                    onClick={handleContinueShopping}
                    className="flex items-center text-[#00000] hover:text-[#2b2b2b] transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Continue Shopping
                  </button>
                </section>

                <AddMoreOffer onContinueShopping={handleContinueShopping} />
              </section>

              <section className="lg:col-span-5">
                <section className="bg-gray-100 p-4 sm:p-6 sticky top-6 rounded-lg">
                  <h2 className="text-base sm:text-lg font-bold text-black mb-4">
                    Order Summary
                  </h2>

                  <section className="space-y-3 mb-6">
                    <section className="flex justify-between">
                      <p className="text-black">Subtotal</p>
                      <p className="font-bold text-black">
                        <Currency value={totalPrice} />
                      </p>
                    </section>
                    <section className="flex justify-between">
                      <p className="text-black">Shipping</p>
                      <p className="font-bold text-black">
                        {shippingPrice === 0 ? "Free" : <Currency value={shippingPrice} />}
                      </p>
                    </section>
                    <section className="flex justify-between">
                      <p className="text-black">Estimated Tax</p>
                      <p className="font-bold text-black">
                        <Currency value={taxAmount} />
                      </p>
                    </section>
                    <section className="border-t border-gray-300 pt-3 flex justify-between">
                      <p className="text-lg font-bold text-black">Total price</p>
                      <p className="text-lg font-bold text-black">
                        <Currency value={grandTotal} />
                      </p>
                    </section>
                  </section>

                  <section className="flex items-center gap-2 mb-6 text-sm text-black">
                    <Truck className="h-4 w-4" />
                    <span>Delivery approx. <strong>August 06 - August 12</strong></span>
                  </section>

                  <section className="mb-6">
                    <button
                      onClick={() => setShowVoucherField(!showVoucherField)}
                      className="w-full text-left p-3 bg-gray-200 text-black font-medium flex justify-between items-center"
                    >
                      <span>Redeem a voucher code</span>
                      <ChevronRight className={`h-4 w-4 transition-transform ${showVoucherField ? 'rotate-90' : ''}`} />
                    </button>
                    {showVoucherField && (
                      <section className="mt-3 flex space-x-2">
                        <input
                          type="text"
                          placeholder="Enter voucher code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          className="bg-black hover:bg-gray-800 text-white px-4"
                        >
                          Apply
                        </Button>
                      </section>
                    )}
                  </section>

                  <section className="mb-6 relative">
                    <p className="text-sm text-black mb-2">
                      <span
                        className="underline cursor-pointer hover:text-gray-600"
                        onClick={() => setShowPaymentPopup(!showPaymentPopup)}
                      >
                        Click
                      </span> to see what payment options are available.
                    </p>

                    {showPaymentPopup && (
                      <section className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
                        <section className="mb-4">
                          <h3 className="font-bold text-black mb-3">Checkout</h3>
                          <section className="flex flex-wrap gap-1 justify-center">
                            <img src="https://cdn.worldvectorlogo.com/logos/paypal-3.svg" alt="PayPal" className="w-9 h-6 object-contain rounded" />
                            <img src="https://cdn.worldvectorlogo.com/logos/visa-10.svg" alt="Visa" className="w-9 h-6 object-contain rounded" />
                            <img src="https://cdn.worldvectorlogo.com/logos/mastercard-6.svg" alt="Mastercard" className="w-9 h-6 object-contain rounded" />
                            <img src="https://cdn.worldvectorlogo.com/logos/american-express-3.svg" alt="American Express" className="w-9 h-6 object-contain rounded" />
                            <img src="https://cdn.worldvectorlogo.com/logos/apple-pay-2.svg" alt="Apple Pay" className="w-11 h-7 object-contain rounded" />
                            <img src="https://cdn.worldvectorlogo.com/logos/klarna.svg" alt="Klarna" className="w-9 h-6 object-contain rounded" />
                          </section>
                        </section>

                        <section>
                          <h3 className="font-bold text-black mb-3">Express checkout options</h3>
                          <section className="flex gap-4 justify-start">
                            <img src="https://cdn.worldvectorlogo.com/logos/paypal-3.svg" alt="PayPal" className="h-5 object-contain" />
                            <img src="https://cdn.worldvectorlogo.com/logos/apple-pay-2.svg" alt="Apple Pay" className="h-5 object-contain" />
                            <img src="https://cdn.worldvectorlogo.com/logos/google-pay-2.svg" alt="Google Pay" className="h-5 object-contain" />
                            <img src="https://cdn.worldvectorlogo.com/logos/amazon-pay-1.svg" alt="Amazon Pay" className="h-5 object-contain" />
                          </section>
                        </section>
                      </section>
                    )}
                  </section>

                  {isCheckoutFixed && <section className="md:hidden" style={{ height: `${checkoutHeight}px` }}></section>}

                  <section
                    ref={checkoutRef}
                    className={`md:static ${isCheckoutFixed ? 'fixed bottom-0 left-0 right-0 z-50' : 'relative'} bg-gray-100 md:bg-transparent p-4 md:p-0 ${isCheckoutFixed ? 'mx-0' : '-mx-4 md:mx-0'} border-t md:border-t-0 ${isCheckoutFixed ? 'shadow-lg' : ''} md:shadow-none`}
                  >
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-black hover:bg-gray-800 text-white py-4 mb-4 font-bold text-lg"
                    >
                      CHECKOUT
                    </Button>

                    <section className="mb-2 md:mb-6">
                      <p className="text-center text-sm font-medium text-black mb-3">Express checkout options</p>
                      <section className="grid grid-cols-3 gap-2">
                        <button className="p-3 border bg-white flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-200">
                          <img src="https://cdn.worldvectorlogo.com/logos/paypal-3.svg" alt="PayPal" className="h-5 object-contain" />
                        </button>
                        <button className="p-3 border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-200">
                          <img src="https://cdn.worldvectorlogo.com/logos/google-pay-2.svg" alt="Google Pay" className="h-5 object-contain" />
                        </button>
                        <button className="p-3 border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-200">
                          <img src="https://cdn.worldvectorlogo.com/logos/amazon-pay-1.svg" alt="Amazon Pay" className="h-5 object-contain" />
                        </button>
                      </section>
                    </section>
                  </section>

                  <section ref={sentinelTopRef} className="md:hidden h-px"></section>

                  <section ref={sentinelBottomRef} className="md:hidden h-px"></section>

                  <section className="text-xs text-black mb-6">
                    <p>The <Link href="/terms-and-conditions" className="underline cursor-pointer hover:text-gray-600">General Terms and Conditions</Link> apply. The <Link href="/privacy-policy" className="underline cursor-pointer hover:text-gray-600">data protection regulations</Link> can be called up here.</p>
                  </section>

                  <section className="space-y-3">
                    <section className="flex items-center gap-2 text-sm text-black">
                      <Truck className="h-4 w-4" />
                      <Link href="/shipping-and-delivery-policy" className="underline cursor-pointer hover:text-gray-600">Free Shipping over 99 USD</Link>
                    </section>
                    <section className="flex items-center gap-2 text-sm text-black">
                      <RotateCcw className="h-4 w-4" />
                      <Link href="/refund-and-returns-policy" className="underline cursor-pointer hover:text-gray-600">30 Days Free Return Policy</Link>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </motion.section>
      </Container>
    </section>
  )
}

export default CartPage