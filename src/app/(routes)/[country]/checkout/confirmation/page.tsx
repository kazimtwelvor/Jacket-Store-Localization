"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  ArrowRight,
  Clock,
  Calendar,
  ShoppingBag,
} from "lucide-react";

import { toast } from "react-hot-toast";
import Button from "@/src/app/ui/button";
import Container from "@/src/app/ui/container";
import { Skeleton } from "@/src/app/ui/skeleton";
import Currency from "@/src/app/ui/currency";
import { trackPurchase, clearCheckoutTracking } from "@/src/app/lib/analytics";
import { useCountry } from "@/src/hooks/use-country";

interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  color?: string;
  size?: string;
  images?: { url: string }[];
  product?: {
    id: string;
    name: string;
    price: string;
    images: Array<{ image?: { url: string }; url?: string } | string>;
    color?: { name: string };
    size?: { name: string };
  };
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  totalPrice: string;
  discountAmount?: string;
  voucherCode?: string;
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod?: string;
  status: string;
}

const ConfirmationPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { countryCode } = useCountry();

  const orderId = searchParams.get("orderId");
  const success = searchParams.get("success") === "1";
  const customerEmail = searchParams.get("email");
  const customerName = searchParams.get("name");
  const orderTotal = searchParams.get("total");
  const itemsParam = searchParams.get("items");

  // Format date for estimated delivery (5 days from now)
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 10);
  const formattedDeliveryDate = estimatedDelivery.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    setIsMounted(true);

    // Scroll to top when the page loads
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    // Check if this page has been visited before in this session
    // const hasVisited = sessionStorage.getItem('confirmation-visited');
    // if (hasVisited) {
    //   router.push('/');
    //   return;
    // }
    // // Mark as visited
    // sessionStorage.setItem('confirmation-visited', 'true');

    // if (!orderId) {
    //   setError("No order ID provided");
    //   setIsLoading(false);
    //   return;
    // }

    // if (!success) {
    //   setError("Payment was not successful");
    //   setIsLoading(false);
    //   return;
    // }

    setIsLoading(false)

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch order details: ${response.status}`);
        }

        const data = await response.json();
        let calculatedTotalPrice = data.totalPrice;
        if (
          !calculatedTotalPrice ||
          calculatedTotalPrice === "0" ||
          Number.parseFloat(calculatedTotalPrice) === 0
        ) {
          if (data.orderItems && data.orderItems.length > 0) {
            calculatedTotalPrice = data.orderItems
              .reduce((total: number, item: any) => {
                const itemPrice = Number.parseFloat(item.product?.price || "0");
                const quantity = item.quantity || 1;
                return total + itemPrice * quantity;
              }, 0)
              .toString();
          }
        }
        const formattedOrder = {
          id: data.id,
          orderNumber: data.id,
          createdAt: data.createdAt,
          status: data.status || "processing",
          totalPrice:
            data.total?.toString() ||
            data.totalAmount ||
            calculatedTotalPrice ||
            "0",
          discountAmount:
            data.discount?.toString() || data.discountAmount || "0",
          voucherCode: data.voucherCode,
          items:
            data.orderItems?.map((item: any) => ({
              id: item.id,
              name: item.product?.name || "Product",
              price: item.product?.price?.toString() || "0",
              quantity: item.quantity || 1,
              color: item.product?.color?.name,
              size: item.product?.size?.name,
              images: item.product?.images || [],
              product: item.product, // Keep the full product object for better image access
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
        };

        setOrder(formattedOrder);
        
        const trackedOrders = JSON.parse(localStorage.getItem('tracked-purchase-orders') || '[]');
        if (!trackedOrders.includes(data.id)) {
          trackPurchase(data.id, formattedOrder.items, calculatedTotalPrice || '0');
          trackedOrders.push(data.id);
          localStorage.setItem('tracked-purchase-orders', JSON.stringify(trackedOrders));
        }
        
        // Scroll to top again when order data is loaded to ensure user sees the confirmation
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        
        // Note: Emails are already sent from the checkout page after successful payment
        // No need to send emails again here to avoid duplicates
      } catch (err) {
        setError(
          "Could not load order details. Please check your order history."
        );
        toast.error("Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, success]);

  // Additional effect to scroll to top when orderId or success changes
  useEffect(() => {
    if (orderId && success) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [orderId, success]);
  const calculateSubtotal = () => {
    if (!order?.items || order.items.length === 0) {
      return order?.totalPrice || "0";
    }

    return order.items
      .reduce((total, item) => {
        const itemPrice = Number.parseFloat(item.price || "0");
        const quantity = item.quantity || 1;
        return total + itemPrice * quantity;
      }, 0)
      .toString();
  };

  const subtotal = calculateSubtotal();

  if (!isMounted) {
    return null;
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Container>
          <div className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Something went wrong
              </h1>
              <p className="text-lg text-gray-600 mb-8">{error}</p>
              <Button
                onClick={() => router.push(`/${countryCode}/`)}
                className="bg-[#B01E23] hover:bg-[#8a1a1e] text-white"
              >
                Return to home
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // If we don't have order data yet, we can still show the confirmation with the order ID
  const orderNumber = order?.orderNumber || orderId || "Unknown";

  return (
    <div className="bg-gray-50 min-h-screen">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Order Confirmed!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for your purchase. Your order has been received.
              </p>

              {/* Prominent Order ID Display */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6 inline-block">
                <p className="text-sm text-blue-700 font-medium mb-1">
                  Your Order ID
                </p>
                <p className="text-2xl font-bold text-blue-900 tracking-wider">
                  {orderNumber}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Save this ID to track your order
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-60 w-full rounded-lg" />
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-[#B01E23]" />
                    Order Details
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-[#B01E23]/10 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-[#B01E23]" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          Order Date
                        </h3>
                        <p className="text-sm text-gray-500">
                          {order?.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-[#B01E23]/10 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-[#B01E23]" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          Estimated Delivery
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formattedDeliveryDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-[#B01E23]/10 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-[#B01E23]" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          Shipping Method
                        </h3>
                        <p className="text-sm text-gray-500">
                          Standard Shipping (3-5 business days)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-200 flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2 text-[#B01E23]" />
                    Order Summary
                  </h2>

                  <div className="divide-y divide-gray-200">
                    {/* If we have order items, display them */}
                    {order?.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div key={item.id || index} className="py-4 flex">
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                            {(() => {
                              // Try multiple ways to get the image URL
                              let imageUrl = null;
                              
                              // Method 1: Nested structure (most likely)
                              const firstImage = item.product?.images?.[0];
                              if (firstImage && typeof firstImage === 'object' && firstImage.image?.url) {
                                imageUrl = firstImage.image.url;
                              }
                              
                              // Method 2: Direct URL structure
                              if (!imageUrl && firstImage && typeof firstImage === 'object' && firstImage.url) {
                                imageUrl = firstImage.url;
                              }
                              
                              // Method 3: From item.images directly
                              if (!imageUrl && item.images?.[0]?.url) {
                                imageUrl = item.images[0].url;
                              }
                              
                              // Method 4: String array
                              if (!imageUrl && firstImage && typeof firstImage === 'string') {
                                imageUrl = firstImage;
                              }
                              
                              // Fallback to placeholder
                              if (!imageUrl) {
                                imageUrl = "/placeholder.svg";
                              }
                              
                              return imageUrl !== "/placeholder.svg" ? (
                                <img
                                  src={imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Package className="h-8 w-8" />
                                </div>
                              );
                            })()}
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <div className="mt-1 flex text-xs text-gray-500">
                              {item.size && (
                                <span className="mr-2">Size: {item.size}</span>
                              )}
                              {item.color && <span>Color: {item.color}</span>}
                            </div>
                            <div className="mt-1 flex justify-between">
                              <span className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </span>
                              <Currency
                                value={Number(item.price) * item.quantity}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-4">
                        <p className="text-sm text-gray-500">
                          Your order has been confirmed. Details will be
                          available soon.
                        </p>
                      </div>
                    )}

                    <div className="py-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">Subtotal</span>
                        <Currency value={subtotal} />
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-500">Shipping</span>
                        <span className="text-sm text-gray-500">Free</span>
                      </div>
                      {order?.discountAmount &&
                        Number(order.discountAmount) > 0 && (
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-500">
                              Discount{" "}
                              {order.voucherCode && `(${order.voucherCode})`}
                            </span>
                            <span className="text-sm text-green-600">
                              -<Currency value={order.discountAmount} />
                            </span>
                          </div>
                        )}
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <Currency value={order?.totalPrice || subtotal} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">1</span>
                      </div>
                      <p className="text-gray-600">
                        You'll receive a confirmation email with your order
                        details.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">2</span>
                      </div>
                      <p className="text-gray-600">
                        We'll notify you when your order ships.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">3</span>
                      </div>
                      <p className="text-gray-600">
                        You can track your order in the "Order History" section
                        of your account.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => {
                      clearCheckoutTracking();
                      router.push(`/${countryCode}/`)}
                    }
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    onClick={() => router.push(`/${countryCode}/account/orders`)}
                    className="bg-[#B01E23] hover:bg-[#8a1a1e] text-white"
                  >
                    View Order History
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default ConfirmationPage;
