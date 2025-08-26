"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingBag, ChevronLeft, CreditCard, Truck, Shield, Check, ChevronRight, RotateCcw } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import Currency from "../../ui/currency"
import Button from "../../ui/button"
import { toast } from "react-hot-toast"
import { FloatingLabelInput } from "../../ui/input"
import Container from "../../ui/container"
import { cn } from "../../lib/utils"
import { useCart } from "../../contexts/CartContext"

// Initialize Stripe
let stripePromise: any = null

// Payment Form Component
const PaymentForm = ({
  clientSecret,
  orderId,
  onSuccess,
  onBack,
  isLoading,
  setIsLoading,
}: {
  clientSecret: string
  orderId: string
  onSuccess: () => void
  onBack: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation?orderId=${orderId}`,
        },
        redirect: "if_required",
      })

      if (result.error) {
        setError(result.error.message || "An error occurred during payment")
        toast.error(result.error.message || "Payment failed")
      } else {
        toast.success("Payment successful!")
        onSuccess()
      }
    } catch (err) {
      console.error("Payment error:", err)
      setError("An unexpected error occurred")
      toast.error("Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <div className="flex justify-between mt-6">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !stripe || !elements}
          className="bg-black hover:bg-black text-white"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            <>
              Submit order
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

const CheckoutPage = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeStep, setActiveStep] = useState("address")
  const [showOrderSummary, setShowOrderSummary] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [stripePublishableKey, setStripePublishableKey] = useState<string | null>(null)
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

  // Add formTouched state to track touched fields
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

  useEffect(() => {
    const fetchStripePublishableKey = async () => {
      try {
        // Check if API URL is available
        if (!process.env.NEXT_PUBLIC_API_URL) {
          console.warn("API URL not configured. Using fallback Stripe key.")
          // You can set a fallback key here for development
          setStripePublishableKey(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null)
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe-publishable-key`)
        if (!response.ok) {
          throw new Error(`Failed to fetch Stripe publishable key: ${response.status}`)
        }
        const data = await response.json()
        setStripePublishableKey(data.publishableKey)
      } catch (error) {
        console.error("Error fetching Stripe publishable key:", error)
        // Fallback to environment variable if API call fails
        const fallbackKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        if (fallbackKey) {
          console.warn("Using fallback Stripe key from environment variable")
          setStripePublishableKey(fallbackKey)
        } else {
          toast.error("Failed to load Stripe. Please try again later.")
        }
      }
    }

    fetchStripePublishableKey()
  }, [])

  useEffect(() => {
    stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null
  }, [stripePublishableKey])

  const initializePayment = async () => {
    if (clientSecret) return

    setIsLoading(true)
    try {
      const checkoutData = {
        productIds: items.map((item) => item.product.id),
        paymentMethod: "stripe",
        customerEmail: formData.email,
        phone: formData.phone,
        address: `${formData.address1}, ${formData.city}, ${formData.state}, ${formData.zipCode}`,
        billingAddress: `${formData.address1}, ${formData.city}, ${formData.state}, ${formData.zipCode}`,
        shippingAddress: `${formData.address1}, ${formData.city}, ${formData.state}, ${formData.zipCode}`,
        embedded: true,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      })

      if (!response.ok) {
        throw new Error("Failed to initialize payment")
      }

      const data = await response.json()
      setClientSecret(data.clientSecret)
      setOrderId(data.orderId)
    } catch (error) {
      console.error("Payment initialization error:", error)
      toast.error("Failed to initialize payment. Please try again.")
      setActiveStep("address")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    clearCart();
    router.push(`/checkout/confirmation?orderId=${orderId}&success=1`)
  }

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

  // Update handleInputChange to mark fields as touched on blur
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
            
            {/* Mobile Order Summary Content */}
            {showOrderSummary && (
              <div className="p-4 border-t">
                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-[28rem] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border-b">
                      <div className="relative w-32 h-36 flex-shrink-0">
                        <Image
                          src={item.product.images?.[0]?.image?.url || "/placeholder.svg"}
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
                            Color: {item.product.colorDetails?.[0]?.name || 'Black'}
                          </p>
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

                {/* Order Totals */}
                <div className="bg-gray-100 p-4 rounded">
                  <table className="w-full">
                    <thead className="hidden">
                      <tr className="border-b border-gray-300">
                        <th className="text-left pb-2" colSpan={2}>
                          <strong className="text-lg font-bold text-black">
                            Order overview 
                          </strong>
                          <span className="text-sm font-normal text-gray-600 ml-2">
                            ({items.length} Items)
                          </span>
                        </th>
                      </tr>
                    </thead>
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

                {/* Voucher Code */}
                <div className="mt-6">
                  <button className="text-sm font-medium text-black mb-2 w-full text-left">
                    <strong>Redeem a voucher code</strong>
                  </button>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Voucher code"
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B01E23]"
                    />
                    <Button className="bg-[#B01E23] hover:bg-[#8a1a1e] text-white">Apply</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            {/* Progress Steps */}
            <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6 md:mb-8 py-6 px-4 sm:py-8 sm:px-6 md:py-6 md:px-6">
              <div className="flex items-center justify-between w-full">
                {activeStep === "address" && ( // Address step is active
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
                {activeStep === "payment" && ( // Payment step is active
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
                          onBlur={handleBlur} // Mark as touched on blur
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
                              ? "-translate-y-6 scale-95 text-sm bg-white px-1 z-10 font-semibold" // Label for filled state
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

                  {/* Account Creation */}
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="createAccount"
                        checked={formData.createAccount}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-[#B01E23] focus:ring-[#B01E23] border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Create an account to enjoy all the benefits of our registered customers.
                      </span>
                    </label>

                    {formData.createAccount && (
                      <div>
                        <FloatingLabelInput
                          label="Password"
                          name="password"
                          type="password"
                          value={formData.password || ''}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          required={formData.createAccount}
                          error={!formData.password && formTouched.password}
                        />
                      </div>
                    )}
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

                  {/* Other checkboxes */}
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="billingAddressSame"
                        checked={formData.billingAddressSame}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#B01E23] focus:ring-[#B01E23] border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Billing Address same as Delivery Address
                      </span>
                    </label>
                    
                    {/* Billing Address Fields */}
                    {!formData.billingAddressSame && (
                      <div className="space-y-6 mt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
                        
                        {/* Billing Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div>
                            <FloatingLabelInput
                              label="First Name"
                              name="billingFirstName"
                              value={formData.billingFirstName}
                              onChange={handleInputChange}
                              onBlur={handleBlur} // Mark as touched on blur
                              required
                            />
                          </div>
                          <div>
                            <FloatingLabelInput
                              label="Last Name"
                              name="billingLastName"
                              value={formData.billingLastName}
                              onChange={handleInputChange}
                              onBlur={handleBlur} // Mark as touched on blur
                              required
                            />
                          </div>
                        </div>
                        
                        {/* Billing Address Fields */}
                        <div>
                          <FloatingLabelInput
                            label="Address Line 1"
                            name="billingAddress1"
                            value={formData.billingAddress1}
                            onChange={handleInputChange}
                            onBlur={handleBlur} // Mark as touched on blur
                            required
                          />
                        </div>
                        
                        <div>
                          <FloatingLabelInput
                            label="Additional address details"
                            name="billingAddress2"
                            value={formData.billingAddress2}
                            onChange={handleInputChange}
                            onBlur={handleBlur} // Mark as touched on blur
                          />
                        </div>
                        
                        <div>
                          <FloatingLabelInput
                            label="City"
                            name="billingCity"
                            value={formData.billingCity}
                            onChange={handleInputChange}
                            onBlur={handleBlur} // Mark as touched on blur
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div>
                            <div className="relative w-full">
                              <select
                                name="billingState"
                                value={formData.billingState}
                                onChange={handleInputChange}
                                onBlur={handleBlur} // Mark as touched on blur
                                required
                                className="block w-full h-12 py-3 px-3 border rounded-none bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-black transition-all [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white] border-gray-300"
                              >
                                <option value=""></option>
                                <option value="CA">California</option>
                                <option value="NY">New York</option>
                                <option value="TX">Texas</option>
                              </select>
                              <label
                                className={`absolute left-3 top-3 pointer-events-none transition-all duration-200 ${
                                  (formData.billingState && formData.billingState !== "")
                                    ? "-translate-y-6 scale-95 text-sm bg-white px-1 z-10 font-semibold" // Label for filled state
                                    : "text-base text-gray-500"
                                } text-gray-700`}
                              >
                                State *
                              </label>
                            </div>
                          </div>
                          <div>
                            <FloatingLabelInput
                              label="Zip Code"
                              name="billingZipCode"
                              value={formData.billingZipCode}
                              onChange={handleInputChange}
                              onBlur={handleBlur} // Mark as touched on blur
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      // Mark all required fields as touched if they are empty
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
                        password: formData.createAccount ? (prev.password || !formData.password) : prev.password,
                      }));
                      if (isAddressComplete) {
                        setActiveStep("payment");
                        initializePayment();
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
                {/* Address Details */}
                <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Address Details</h3>
                    <button
                      onClick={() => setActiveStep("address")}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Edit
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>{formData.firstName} {formData.lastName}</p>
                        <p>{formData.address1}</p>
                        {formData.address2 && <p>{formData.address2}</p>}
                        <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                        <p>{formData.email}</p>
                        <p>{formData.phone}</p>
                      </div>
                    </div>
                    
                    {/* Billing Address */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Billing Address</h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        {formData.billingAddressSame ? (
                          <p className="italic">Same as shipping address</p>
                        ) : (
                          <>
                            <p>{formData.billingFirstName} {formData.billingLastName}</p>
                            <p>{formData.billingAddress1}</p>
                            {formData.billingAddress2 && <p>{formData.billingAddress2}</p>}
                            <p>{formData.billingCity}, {formData.billingState} {formData.billingZipCode}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-6">Select Payment Method</h3>
                  <div className="space-y-3">
                    {/* Google Pay */}
                    <div>
                      <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                        <div className="flex items-center">
                          <div className="relative">
                            <input
                              type="radio"
                              name="selectedPaymentMethod"
                              value="google_pay"
                              checked={formData.selectedPaymentMethod === "google_pay"}
                              onChange={handleInputChange}
                              className="sr-only" // Hidden radio button
                            />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.selectedPaymentMethod === "google_pay" 
                                ? "bg-black border-black" 
                                : "border-gray-300"
                            }`}>
                              {formData.selectedPaymentMethod === "google_pay" && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                          <span className="ml-3 text-sm font-medium">Google Pay</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-12 h-8" viewBox="0 0 48 20" fill="none">
                            <rect width="48" height="20" rx="4" fill="#4285F4"/>
                            <path d="M12.24 10.285c0-.639-.057-1.252-.164-1.841H6.24v3.481h3.361c-.144.766-.58 1.415-1.235 1.85v1.538h1.998c1.168-1.076 1.841-2.661 1.841-4.53z" fill="white"/>
                            <path d="M6.24 14.71c1.668 0 3.064-.55 4.085-1.496l-1.998-1.538c-.554.371-1.262.59-2.087.59-1.606 0-2.967-1.085-3.45-2.544H.72v1.59C1.728 13.16 3.82 14.71 6.24 14.71z" fill="white"/>
                            <path d="M2.79 9.722c-.123-.371-.193-.766-.193-1.177s.07-.806.193-1.177V5.778H.72C.263 6.69 0 7.715 0 8.545s.263 1.855.72 2.767l2.07-1.59z" fill="white"/>
                            <path d="M6.24 2.346c.905 0 1.719.311 2.36.922l1.769-1.769C9.304.551 7.908 0 6.24 0 3.82 0 1.728 1.55.72 3.398l2.07 1.59c.483-1.459 1.844-2.544 3.45-2.544z" fill="white"/>
                          </svg>
                        </div>
                      </label>
                      
                      {/* Stripe Payment Form for Google Pay */}
                      {formData.selectedPaymentMethod === "google_pay" && (
                        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  {isLoading && !clientSecret ? (
                            <div className="flex flex-col items-center justify-center py-6">
                              <div className="w-8 h-8 border-4 border-[#B01E23] border-t-transparent rounded-full animate-spin mb-2"></div>
                              <p className="text-gray-600 text-sm">Initializing payment...</p>
                    </div>
                  ) : stripePromise && clientSecret ? (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: "stripe",
                          variables: {
                                    colorPrimary: "#000000",
                            colorBackground: "#ffffff",
                            colorText: "#30313d",
                          },
                        },
                      }}
                    >
                      <PaymentForm
                        clientSecret={clientSecret}
                        orderId={orderId!}
                        onSuccess={handlePaymentSuccess}
                        onBack={() => setActiveStep("address")}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                      />
                    </Elements>
                  ) : (
                            <div className="text-center py-6">
                              <p className="text-red-500 text-sm">Failed to load payment form. Please try again.</p>
                            </div>
                          )}
                    </div>
                  )}
                    </div>

                    {/* PayPal */}
                    <div>
                      <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                        <div className="flex items-center">
                          <div className="relative">
                            <input
                              type="radio"
                              name="selectedPaymentMethod"
                              value="paypal"
                              checked={formData.selectedPaymentMethod === "paypal"}
                              onChange={handleInputChange}
                              className="sr-only" // Hidden radio button
                            />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.selectedPaymentMethod === "paypal" 
                                ? "bg-black border-black" 
                                : "border-gray-300"
                            }`}>
                              {formData.selectedPaymentMethod === "paypal" && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                          <span className="ml-3 text-sm font-medium">PayPal</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-16 h-8" viewBox="0 0 64 20" fill="none">
                            <rect width="64" height="20" rx="4" fill="#0070BA"/>
                            <path d="M8.5 5h3.2c1.8 0 3.2 1.4 3.2 3.2 0 1.8-1.4 3.2-3.2 3.2H9.7l-.6 2.6H7.3L8.5 5zm2.4 4.8c.7 0 1.3-.6 1.3-1.3s-.6-1.3-1.3-1.3H9.8l-.4 2.6h1.5z" fill="white"/>
                            <path d="M15.8 8.2c1.1 0 2 .9 2 2v.1h-3.2c.1.5.5.9 1 .9.3 0 .6-.1.8-.3l.8 1.2c-.5.4-1.1.6-1.8.6-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5c1.3 0 2.4 1 2.4 2.5zm-1.3-.8c-.4 0-.7.3-.8.7h1.6c0-.4-.4-.7-.8-.7z" fill="white"/>
                            <path d="M21.5 8.2l-1.2 4.6h-1.8l.2-.8c-.4.6-1 1-1.7 1-1 0-1.8-.8-1.8-1.8 0-1.6 1.3-2.9 2.9-2.9.6 0 1.1.2 1.5.6l.1-.9h1.8zm-2.8 2.3c0 .3.2.5.5.5s.6-.2.7-.5c.1-.3-.1-.5-.4-.5s-.6.2-.8.5z" fill="white"/>
                          </svg>
                        </div>
                      </label>
                      
                      {/* Stripe Payment Form for PayPal */}
                      {formData.selectedPaymentMethod === "paypal" && (
                        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                          {isLoading && !clientSecret ? (
                            <div className="flex flex-col items-center justify-center py-6">
                              <div className="w-8 h-8 border-4 border-[#B01E23] border-t-transparent rounded-full animate-spin mb-2"></div>
                              <p className="text-gray-600 text-sm">Initializing payment...</p>
                            </div>
                          ) : stripePromise && clientSecret ? (
                            <Elements
                              stripe={stripePromise}
                              options={{
                                clientSecret,
                                appearance: {
                                  theme: "stripe",
                                  variables: {
                                    colorPrimary: "#000000",
                                    colorBackground: "#ffffff",
                                    colorText: "#30313d",
                                  },
                                },
                              }}
                            >
                              <PaymentForm
                                clientSecret={clientSecret}
                                orderId={orderId!}
                                onSuccess={handlePaymentSuccess}
                                onBack={() => setActiveStep("address")}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                              />
                            </Elements>
                          ) : (
                            <div className="text-center py-6">
                              <p className="text-red-500 text-sm">Failed to load payment form. Please try again.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Credit Card */}
                    <div>
                      <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                        <div className="flex items-center">
                          <div className="relative">
                            <input
                              type="radio"
                              name="selectedPaymentMethod"
                              value="CREDIT_CARD"
                              checked={formData.selectedPaymentMethod === "CREDIT_CARD"}
                              onChange={handleInputChange}
                              className="sr-only" />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${ // Custom radio button styling
                              formData.selectedPaymentMethod === "CREDIT_CARD" 
                                ? "bg-black border-black" 
                                : "border-gray-300"
                            }`}>
                              {formData.selectedPaymentMethod === "CREDIT_CARD" && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                          <span className="ml-3 text-sm font-medium">Credit Card</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                            <rect width="32" height="20" rx="2" fill="#EB001B"/>
                            <circle cx="12" cy="10" r="6" fill="#FF5F00"/>
                            <circle cx="20" cy="10" r="6" fill="#F79E1B"/>
                          </svg>
                          <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                            <rect width="32" height="20" rx="2" fill="#1A1F71"/>
                            <path d="M13.5 6h5l-2.5 8h-5l2.5-8z" fill="white"/>
                          </svg>
                          <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                            <rect width="32" height="20" rx="2" fill="#006FCF"/>
                            <path d="M8 6h3l2 8h-3l-2-8zm8 0h3l-1 8h-3l1-8z" fill="white"/>
                          </svg>
                        </div>
                      </label>
                      
                      {/* Stripe Payment Form for Credit Card */}
                      {formData.selectedPaymentMethod === "CREDIT_CARD" && (
                        <div className="mt-4 p-4  rounded-lg bg-gray-50">
                          
                          {isLoading && !clientSecret ? (
                            <div className="flex flex-col items-center justify-center py-6">
                              <div className="w-8 h-8 border-4 border-[#B01E23] border-t-transparent rounded-full animate-spin mb-2"></div>
                              <p className="text-gray-600 text-sm">Initializing payment...</p>
                            </div>
                          ) : stripePromise && clientSecret ? (
                            <Elements
                              stripe={stripePromise}
                              options={{
                                clientSecret,
                                appearance: {
                                  theme: "stripe",
                                  variables: {
                                    colorPrimary: "#000000",
                                    colorBackground: "#ffffff",
                                    colorText: "#30313d",
                                  },
                                },
                              }}
                            >
                              <PaymentForm
                                clientSecret={clientSecret}
                                orderId={orderId!}
                                onSuccess={handlePaymentSuccess}
                                onBack={() => setActiveStep("address")}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                              />
                            </Elements>
                          ) : (
                            <div className="text-center py-6">
                              <p className="text-red-500 text-sm">Failed to load payment form. Please try again.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Klarna */}
                    <div>
                      <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                        <div className="flex items-center">
                          <div className="relative">
                            <input
                              type="radio"
                              name="selectedPaymentMethod"
                              value="klarna"
                              checked={formData.selectedPaymentMethod === "klarna"}
                              onChange={handleInputChange}
                              className="sr-only" // Hidden radio button
                            />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.selectedPaymentMethod === "klarna" 
                                ? "bg-black border-black" 
                                : "border-gray-300"
                            }`}>
                              {formData.selectedPaymentMethod === "klarna" && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                          <span className="ml-3 text-sm font-medium">Klarna - Slice it</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-16 h-8" viewBox="0 0 64 20" fill="none">
                            <rect width="64" height="20" rx="4" fill="#FFB3C7"/>
                            <path d="M8 5h2v10H8V5zm4 0h2v4l3-4h2.5l-3.5 4.5L20 15h-2.5l-3.5-4.5V15H12V5zm8 0h2v2h-2V5zm0 3h2v7h-2V8zm4 0h2c2 0 3 1 3 3.5S26 15 24 15h-2V8zm2 2v3c.5 0 1-.5 1-1.5S26.5 10 26 10zm4-2h2v1c.5-.7 1.2-1 2-1v2c-.8 0-1.5.5-1.5 1.5V15h-2V8z" fill="black"/>
                          </svg>
                        </div>
                      </label>
                      
                      {/* Stripe Payment Form for Klarna */}
                      {formData.selectedPaymentMethod === "klarna" && (
                        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                          {isLoading && !clientSecret ? (
                            <div className="flex flex-col items-center justify-center py-6">
                              <div className="w-8 h-8 border-4 border-[#B01E23] border-t-transparent rounded-full animate-spin mb-2"></div>
                              <p className="text-gray-600 text-sm">Initializing payment...</p>
                            </div>
                          ) : stripePromise && clientSecret ? (
                            <Elements
                              stripe={stripePromise}
                              options={{
                                clientSecret,
                                appearance: {
                                  theme: "stripe",
                                  variables: {
                                    colorPrimary: "#000000",
                                    colorBackground: "#ffffff",
                                    colorText: "#30313d",
                                  },
                                },
                              }}
                            >
                              <PaymentForm
                                clientSecret={clientSecret}
                                orderId={orderId!}
                                onSuccess={handlePaymentSuccess}
                                onBack={() => setActiveStep("address")}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                              />
                            </Elements>
                          ) : (
                            <div className="text-center py-6">
                              <p className="text-red-500 text-sm">Failed to load payment form. Please try again.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Methods */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Select delivery method</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={formData.shippingMethod === "standard"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-[#B01E23] focus:ring-[#B01E23]"
                        />
                        <span className="ml-3 text-sm font-medium">Shipping</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">Free Shipping</span>
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={formData.shippingMethod === "express"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-[#B01E23] focus:ring-[#B01E23]"
                        />
                        <span className="ml-3 text-sm font-medium">2nd Day Express</span>
                      </div>
                      <span className="text-sm font-medium">($15.00)</span>
                    </label>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-[#B01E23] mr-2" />
                    <p className="text-sm text-gray-700">
                      Your payment information is secure. We use encryption to protect your data.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-6">
              {/* Desktop Header for Order Summary */}
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
                {/* Cart Items in Order Summary */}
                <div className="space-y-4 mb-6 max-h-[28rem] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border-b">
                      <div className="relative w-32 h-36 flex-shrink-0">
                        <Image
                          src={item.product.images?.[0]?.image?.url || "/placeholder.svg"}
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
                            Color: {item.product.colorDetails?.[0]?.name || 'Black'}
                          </p>
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

                {/* Order Totals */}
                <div className="bg-gray-100 p-4 rounded">
                  <table className="w-full">
                    <thead className="hidden">
                      <tr className="border-b border-gray-300">
                        <th className="text-left pb-2" colSpan={2}>
                          <strong className="text-lg font-bold text-black">
                            Order overview 
                          </strong>
                          <span className="text-sm font-normal text-gray-600 ml-2">
                            ({items.length} Items)
                          </span>
                        </th>
                      </tr>
                    </thead>
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

                {/* Voucher Code */}
                <div className="mt-6">
                  <button
                    type="button"
                    className="text-sm font-medium text-black mb-2 w-full text-left"
                  >
                    <strong>Redeem a voucher code</strong>
                  </button>
                  <div className="flex space-x-2">
                    <input type="text"
                      placeholder="Voucher code"
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B01E23]"
                    />
                    <Button className="bg-black hover:bg-gray-800 text-white">Apply</Button>
                  </div>
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