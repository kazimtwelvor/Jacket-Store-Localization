"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Package, ArrowRight, Clock, Calendar, ShoppingBag } from "lucide-react"
import Container from "@/src/app/ui/container"
import Button from "@/src/app/ui/button"
import Currency from "@/src/app/ui/currency"
import { Skeleton } from "@/src/app/ui/skeleton"
import { toast } from "react-hot-toast"

interface OrderItem {
  id: string
  name: string
  price: string
  quantity: number
  color?: string
  size?: string
  images?: { url: string }[]
}

interface OrderDetails {
  id: string
  orderNumber: string
  createdAt: string
  items: OrderItem[]
  totalPrice: string
  shippingAddress?: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentMethod?: string
  status: string
}

const ConfirmationPage = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  const orderId = searchParams.get("orderId")
  const success = searchParams.get("success") === "1"

  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 10)
  const formattedDeliveryDate = estimatedDelivery.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  useEffect(() => {
    setIsMounted(true)

    if (!orderId) {
      setError("No order ID provided")
      setIsLoading(false)
      return
    }

    if (!success) {
      setError("Payment was not successful")
      setIsLoading(false)
      return
    }

    const fetchOrder = async () => {
      try {

        const pathArray = window.location.pathname.split("/")
        const storeId = pathArray[1] === "checkout" ? "default" : pathArray[1]
        const response = await fetch(`/api/${storeId}/orders/${orderId}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`Error response: ${response.status} - ${errorText}`)
          throw new Error(`Failed to fetch order details: ${response.status}`)
        }

        const data = await response.json()

        let calculatedTotalPrice = data.totalPrice

        if (!calculatedTotalPrice || calculatedTotalPrice === "0" || Number.parseFloat(calculatedTotalPrice) === 0) {
          if (data.orderItems && data.orderItems.length > 0) {
            calculatedTotalPrice = data.orderItems
              .reduce((total: number, item: any) => {
                const itemPrice = Number.parseFloat(item.product?.price || "0")
                const quantity = item.quantity || 1
                return total + itemPrice * quantity
              }, 0)
              .toString()

          }
        }

        const formattedOrder = {
          id: data.id,
          orderNumber: data.id.substring(0, 8).toUpperCase(),
          createdAt: data.createdAt,
          status: data.status || "processing",
          totalPrice: calculatedTotalPrice || "0",
          items:
            data.orderItems?.map((item: any) => ({
              id: item.id,
              name: item.product?.name || "Product",
              price: item.product?.price?.toString() || "0",
              quantity: item.quantity || 1,
              color: item.product?.color?.name,
              size: item.product?.size?.name,
              images: item.product?.images || [],
            })) || [],
          shippingAddress: data.address
            ? {
                line1: data.address.line1 || "",
                line2: data.address.line2,
                city: data.address.city || "",
                state: data.address.state || "",
                postalCode: data.address.postalCode || "",
                country: data.address.country || "",
              }
            : undefined,
          paymentMethod: data.paymentMethod || "Credit Card",
        }

        setOrder(formattedOrder)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Could not load order details. Please check your order history.")
        toast.error("Failed to load order details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, success])

  const calculateSubtotal = () => {
    if (!order?.items || order.items.length === 0) {
      return order?.totalPrice || "0"
    }

    return order.items
      .reduce((total, item) => {
        const itemPrice = Number.parseFloat(item.price || "0")
        const quantity = item.quantity || 1
        return total + itemPrice * quantity
      }, 0)
      .toString()
  }

  const subtotal = calculateSubtotal()

  if (!isMounted) {
    return null
  }

  if (error) {
    return (
      <section className="bg-gray-50 min-h-screen">
        <Container>
          <section className="px-4 py-16 sm:px-6 lg:px-8">
            <section className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h1>
              <p className="text-lg text-gray-600 mb-8">{error}</p>
              <Button onClick={() => router.push("/")} className="bg-[#B01E23] hover:bg-[#8a1a1e] text-white">
                Return to home
              </Button>
            </section>
          </section>
        </Container>
      </section>
    )
  }

  const orderNumber = order?.orderNumber || orderId?.substring(0, 8).toUpperCase() || "Unknown"

  return (
    <section className="bg-gray-50 min-h-screen">
      <Container>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-16 sm:px-6 lg:px-8"
        >
          <section className="max-w-3xl mx-auto">
            <section className="text-center mb-12">
              <section className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </section>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
              <p className="text-lg text-gray-600 mb-2">Thank you for your purchase. Your order has been received.</p>
              <p className="text-gray-500">
                Order #<span className="font-medium">{orderNumber}</span>
              </p>
            </section>

            {isLoading ? (
              <section className="space-y-6">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-60 w-full rounded-lg" />
              </section>
            ) : (
              <>
                <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-[#B01E23]" />
                    Order Details
                  </h2>

                  <section className="space-y-6">
                    <section className="flex items-start">
                      <section className="flex-shrink-0 w-10 h-10 bg-[#B01E23]/10 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-[#B01E23]" />
                      </section>
                      <section className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Order Date</h3>
                        <p className="text-sm text-gray-500">
                          {order?.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                        </p>
                      </section>
                    </section>

                    <section className="flex items-start">
                      <section className="flex-shrink-0 w-10 h-10 bg-[#B01E23]/10 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-[#B01E23]" />
                      </section>
                      <section className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Estimated Delivery</h3>
                        <p className="text-sm text-gray-500">{formattedDeliveryDate}</p>
                      </section>
                    </section>

                    <section className="flex items-start">
                      <section className="flex-shrink-0 w-10 h-10 bg-[#B01E23]/10 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-[#B01E23]" />
                      </section>
                      <section className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Shipping Method</h3>
                        <p className="text-sm text-gray-500">Standard Shipping (3-5 business days)</p>
                      </section>
                    </section>
                  </section>
                </section>

                <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200 flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2 text-[#B01E23]" />
                    Order Summary
                  </h2>

                  <section className="divide-y divide-gray-200">
                    {order?.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <section key={item.id || index} className="py-4 flex">
                          <section className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                            {item.images && item.images[0] ? (
                              <img
                                src={item.images[0].url || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <section className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="h-8 w-8" />
                              </section>
                            )}
                          </section>
                          <section className="ml-4 flex-1">
                            <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                            <section className="mt-1 flex text-xs text-gray-500">
                              {item.size && <span className="mr-2">Size: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                            </section>
                            <section className="mt-1 flex justify-between">
                              <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                              <Currency value={item.price} />
                            </section>
                          </section>
                        </section>
                      ))
                    ) : (
                      <section className="py-4">
                        <p className="text-sm text-gray-500">
                          Your order has been confirmed. Details will be available soon.
                        </p>
                      </section>
                    )}

                    <section className="py-4">
                      <section className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">Subtotal</span>
                        <Currency value={subtotal} />
                      </section>
                      <section className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">Shipping</span>
                        <span className="text-sm text-gray-500">Free</span>
                      </section>
                      <section className="flex justify-between font-medium">
                        <span>Total</span>
                        <Currency value={subtotal} />
                      </section>
                    </section>
                  </section>
                </section>

                <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
                  <section className="space-y-4">
                    <section className="flex items-center">
                      <section className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">1</span>
                      </section>
                      <p className="text-gray-600">You'll receive a confirmation email with your order details.</p>
                    </section>
                    <section className="flex items-center">
                      <section className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">2</span>
                      </section>
                      <p className="text-gray-600">We'll notify you when your order ships.</p>
                    </section>
                    <section className="flex items-center">
                      <section className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">3</span>
                      </section>
                      <p className="text-gray-600">
                        You can track your order in the "Order History" section of your account.
                      </p>
                    </section>
                  </section>
                </section>

                <section className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => router.push("/")}
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    onClick={() => router.push("/account/orders")}
                    className="bg-[#B01E23] hover:bg-[#8a1a1e] text-white"
                  >
                    View Order History
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </section>
              </>
            )}
          </section>
        </motion.section>
      </Container>
    </section>
  )
}

export default ConfirmationPage
