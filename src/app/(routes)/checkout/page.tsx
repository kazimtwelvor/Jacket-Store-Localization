"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingBag, ChevronLeft, CreditCard, Truck, Shield, Check, ChevronRight, RotateCcw } from "lucide-react"
import Container from "@/src/app/ui/container"
import { useCart } from "@/src/app/contexts/CartContext"
import Currency from "@/src/app/ui/currency"
import Button from "@/src/app/ui/button"
import { cn } from "@/src/app/lib/utils"
import { toast } from "react-hot-toast"
import { FloatingLabelInput } from "@/src/app/ui/input"

const CheckoutPage = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeStep, setActiveStep] = useState("address")
  const [showOrderSummary, setShowOrderSummary] = useState(false)
  const { items, clearCart, totalPrice: cartTotalPrice } = useCart()
  const router = useRouter()

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    password: "",
    createAccount: false,
    acceptTerms: false,
    acceptPrivacy: false,
    billingAddressSame: true,
    selectedPaymentMethod: "",
    shippingMethod: "standard",
    billingFirstName: "",
    billingLastName: "",
    billingAddress1: "",
    billingAddress2: "",
    billingCity: "",
    billingState: "",
    billingZipCode: ""
  })

  const [formTouched, setFormTouched] = useState({
    firstName: false,
    lastName: false,
    address1: false,
    address2: false,
    city: false,
    state: false,
    zipCode: false,
    email: false,
    password: false,
    phone: false,
  });

  const totalPrice = cartTotalPrice
  const shippingPrice = formData.shippingMethod === "express" ? 15 : (totalPrice > 100 ? 0 : 15)
  const taxRate = 0.08
  const taxAmount = totalPrice * taxRate
  const grandTotal = totalPrice + shippingPrice + taxAmount

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  if (items.length === 0) {
    return (
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-black mb-8">Checkout</h1>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-lg mb-6">Your cart is empty. Add some items before checking out.</p>
              <Button onClick={() => router.push("/")} className="bg-[#B01E23] hover:bg-[#8a1a1e] text-white">
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </Container>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setFormTouched(prev => ({ ...prev, [name]: true }));
  };

  const isAddressComplete = formData.firstName && formData.lastName && formData.email && 
                           formData.address1 && formData.city && formData.state && formData.zipCode

  return (
    <div className="min-h-screen bg-gray-50 px-0 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-8"
        >
        <h1 className="text-3xl font-bold text-black mt-2 mb-2 md:my-8 text-center">Checkout</h1>
        
        {/* Mobile Order Summary Toggle */}
        <div className="lg:hidden mb-4">
          <div className="bg-white rounded-lg shadow-sm">
            <button
              onClick={() => setShowOrderSummary(!showOrderSummary)}
              className={`flex w-full items-center justify-between ${showOrderSummary ? 'p-4' : 'p-3'}`}
            >
              <span className="text-lg font-medium">
                <Currency value={grandTotal} />
              </span>
              <div className="flex items-center">
                <span 
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push('/cart');
                  }}
                  className="text-sm text-black underline hover:text-gray-800 mr-2 cursor-pointer"
                >
                  « Back to cart
                </span>
                <ChevronRight className={`h-5 w-5 transition-transform ${showOrderSummary ? 'rotate-90' : ''}`} />
              </div>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            {/* Progress Steps */}
            <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6 md:mb-8 py-6 px-4 sm:py-8 sm:px-6 md:py-6 md:px-6">
              <div className="flex items-center justify-between w-full">
                {activeStep === "address" && (
              <>
                <div className="flex items-center text-black">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 bg-black text-white flex-shrink-0">
                        <Truck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                      <div className="min-w-0">
                        <h2 className="font-bold text-sm sm:text-base md:text-lg truncate">ADDRESS</h2>
                        <p className="text-xs sm:text-sm text-red-600 hidden sm:block">+ Delivery options</p>
                  </div>
                </div>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400 flex-shrink-0" />
                <div className="flex items-center text-gray-400">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 bg-gray-300 flex-shrink-0">
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                      <div className="min-w-0">
                        <h2 className="font-bold text-sm sm:text-base md:text-lg truncate">PAYMENT</h2>
                        <p className="text-xs sm:text-sm text-red-600 hidden sm:block">+ Delivery details</p>
                  </div>
                </div>
              </>
            )}
                {activeStep === "payment" && (
                  <div className="flex items-center text-black justify-start w-full">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mr-2 sm:mr-3 md:mr-4 bg-black text-white flex-shrink-0">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <div>
                      <h2 className="font-bold text-sm sm:text-base md:text-lg">PAYMENT</h2>
                      <p className="text-xs sm:text-sm text-red-600 hidden sm:block">+ Delivery details</p>
                </div>
              </div>
            )}
          </div>
            </div>

            {/* Main Content */}
            {activeStep === "address" && (
              <div className="bg-white rounded-lg shadow-sm p-4 pb-2 sm:p-6 sm:pb-4 md:p-8 lg:p-10 xl:p-12">                

                <form className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <FloatingLabelInput
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        error={!formData.firstName && formTouched.firstName}
                      />
                    </div>
                    <div>
                      <FloatingLabelInput
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        error={!formData.lastName && formTouched.lastName}
                      />
                    </div>
                  </div>

                  {/* Address Fields */}
                  <div>
                    <FloatingLabelInput
                      label="Address Line 1"
                      name="address1"
                      value={formData.address1}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      error={!formData.address1 && formTouched.address1}
                    />
                  </div>

                  <div>
                    <FloatingLabelInput
                      label="Additional address details"
                      name="address2"
                      value={formData.address2}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      
                    />
                  </div>

                  <div>
                    <FloatingLabelInput
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      error={!formData.city && formTouched.city}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <div className="relative w-full">
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                          onBlur={handleBlur}
                        required
                          className={cn(
                            "block w-full h-12 py-3 px-3 border rounded-none bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-black transition-all [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white]",
                            !formData.state && formTouched.state ? "border-red-500" : "border-gray-300"
                          )}
                      >
                          <option value=""></option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                      </select>
                        <label
                          className={cn(
                            "absolute left-3 top-3 pointer-events-none transition-all duration-200",
                            (formData.state && formData.state !== "")
                              ? "-translate-y-6 scale-95 text-sm bg-white px-1 z-10 font-semibold"
                              : "text-base text-gray-500",
                            (!formData.state && formTouched.state) ? "text-red-600" : "text-gray-700"
                          )}
                        >
                          State *
                        </label>
                      </div>
                    </div>
                    <div>
                      <FloatingLabelInput
                        label="Zip Code"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        error={!formData.zipCode && formTouched.zipCode}
                      />
                    </div>
                  </div>

                  <div>
                    <FloatingLabelInput
                      label="E-mail address"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      error={!formData.email && formTouched.email}
                    />
                  </div>

                  <div>
                    <FloatingLabelInput
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder=""
                      required
                      error={!formData.phone && formTouched.phone}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      setFormTouched(prev => ({
                        ...prev,
                        firstName: prev.firstName || !formData.firstName,
                        lastName: prev.lastName || !formData.lastName,
                        address1: prev.address1 || !formData.address1,
                        city: prev.city || !formData.city,
                        state: prev.state || !formData.state,
                        zipCode: prev.zipCode || !formData.zipCode,
                        email: prev.email || !formData.email,
                        phone: prev.phone || !formData.phone,
                      }));
                      if (isAddressComplete) {
                        setActiveStep("payment");
                      }
                    }}
                    className="w-full bg-black hover:bg-black text-white py-3 mt-2 mb-8 md:mt-4 md:mb-0"
                    disabled={!isAddressComplete}
                  >
                    Continue to Payment
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            )}

            {activeStep === "payment" && (
              <div className="bg-white rounded-lg shadow-sm p-4 pb-2 sm:p-6 sm:pb-4 md:p-8 lg:p-10 xl:p-12">                
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Payment integration coming soon</p>
                  <Button
                    onClick={() => setActiveStep("address")}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Address
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-6">
              <div className="hidden lg:flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Order overview</h2>
                </div>
                <button 
                  onClick={() => router.push('/cart')}
                  className="text-sm text-gray-600 underline hover:text-gray-800"
                >
                  « Back to cart
                </button>
              </div>

              <div className={`${showOrderSummary ? 'block' : 'hidden'} lg:block`}>
                <div className="space-y-4 mb-6 max-h-[28rem] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border-b">
                      <div className="relative w-32 h-36 flex-shrink-0">
                        <Image
                          src={(item.product.images?.[0] as any)?.url || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-contain rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-black text-sm uppercase mb-2 line-clamp-2">
                          {item.product.name}
                        </h3>
                        <div className="space-y-1 mb-2">
                          <p className="text-xs text-gray-700">
                            Size: {item.size}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-700">
                            Total Price <span className="font-bold text-black">
                              <Currency value={item.unitPrice * item.quantity} />
                            </span>
                          </p>
                          <p className="text-sm text-gray-700">
                            Quantity {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-100 p-4 rounded">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="py-2 text-base text-black">Subtotal</td>
                        <td className="py-2 text-right">
                          <strong className="text-base text-black">
                            <Currency value={totalPrice} />
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-base text-black">Shipping</td>
                        <td className="py-2 text-right">
                          <strong className="text-base text-green-600">
                            {shippingPrice === 0 ? "Free" : <Currency value={shippingPrice} />}
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-base text-black">Estimated Tax</td>
                        <td className="py-2 text-right">
                          <strong className="text-base text-black">
                            <Currency value={taxAmount} />
                          </strong>
                        </td>
                      </tr>
                      <tr className="border-t-2 border-gray-400">
                        <td className="py-3 text-lg font-bold text-black">Your order</td>
                        <td className="py-3 text-right">
                          <strong className="text-lg font-bold text-black">
                            <Currency value={grandTotal} />
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CheckoutPage