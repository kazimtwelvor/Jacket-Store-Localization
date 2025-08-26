"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ArrowLeft, Calendar, Truck, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Container from "@/src/app/ui/container";
import { Badge } from "@/src/app/ui/badge";
import Link from "next/link";
import useAuth from "@/src/app/hooks/use-auth";
import { Skeleton } from "@/src/app/ui/skeleton";

interface OrderItem {
  id: string;
  productId: string;
  orderId: string;
  quantity: number;
  price: number;
  total: number;
  product: {
    id: string;
    name: string;
    images: Array<{ url: string }>;
  };
}

interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  isPaid: boolean;
  phone: string;
  address: string;
  orderItems: OrderItem[];
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  paymentMethod: string;
  total: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export default function OrdersPage() {
  const { user, isAuthenticated, token, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const storeId = process.env.NEXT_PUBLIC_STORE_ID;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user?.email || !token) return;

      try {
        setIsLoading(true);
        const url = new URL(`https://d1.fineyst.com/api/users/orders`);
        if (storeId) {
          url.searchParams.set("storeId", storeId);
        }

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...(storeId ? { "X-Store-Id": storeId } : {}),
          },
        });

        if (response.status === 401) {
          await logout();
          router.push("/auth/login?redirectTo=/account/orders");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        } else {
          setOrders([]);
          try {
            const errData = await response.json();
            setError(errData?.error || errData?.message || "Failed to load orders.");
          } catch (_) {
            setError(`Failed to load orders (status ${response.status}).`);
          }
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load your orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user?.email, token]);

  if (!isAuthenticated) {
    return null;
  }

  const getOrderStatus = (order: Order) => {
    const status = order.status?.toLowerCase();
    const paymentStatus = order.paymentStatus?.toLowerCase();
    
    // Determine primary status based on both order and payment status
    if (status === "cancelled") return { status: "cancelled", label: "Cancelled", icon: XCircle, color: "bg-[#2B2B2B]" };
    if (status === "completed") return { status: "completed", label: "Delivered", icon: CheckCircle, color: "bg-[#2B2B2B]" };
    if (status === "shipped") return { status: "shipped", label: "Shipped", icon: Truck, color: "bg-[#2B2B2B]" };
    if (status === "processing") return { status: "processing", label: "Processing", icon: Clock, color: "bg-[#2B2B2B]" };
    if (paymentStatus === "pending") return { status: "pending", label: "Payment Pending", icon: AlertCircle, color: "bg-[#2B2B2B]" };
    if (status === "pending") return { status: "pending", label: "Pending", icon: Clock, color: "bg-[#2B2B2B]" };
    
    return { status: "unknown", label: "Unknown", icon: AlertCircle, color: "bg-[#2B2B2B]" };
  };

  const getOrderProgress = (order: Order) => {
    const status = order.status?.toLowerCase();
    const paymentStatus = order.paymentStatus?.toLowerCase();
    
    if (status === "cancelled") return 0;
    if (status === "completed") return 100;
    if (status === "shipped") return 75;
    if (status === "processing") return 50;
    if (paymentStatus === "pending" || status === "pending") return 25;
    
    return 0;
  };

  const getProgressStep = (order: Order) => {
    const status = order.status?.toLowerCase();
    const paymentStatus = order.paymentStatus?.toLowerCase();
    
    if (status === "cancelled") return 0;
    if (status === "completed") return 4;
    if (status === "shipped") return 3;
    if (status === "processing") return 2;
    if (paymentStatus === "pending" || status === "pending") return 1;
    
    return 0;
  };

  return (
    <Container>
      <div className="min-h-screen py-8 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/account"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Account</span>
            </Link>
            <div className="text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">My Orders</h1>
              <p className="text-lg text-gray-600 max-w-2xl">Track your orders and view your complete purchase history</p>
            </div>
          </div>

          {/* Orders Content */}
          <div className="space-y-6">
            {isLoading ? (
              // Enhanced loading skeletons
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-3">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-20 w-20 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Enhanced error state
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-300 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Orders</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{error}</p>
                <button
                  onClick={() => router.refresh()}
                  className="px-6 py-3 bg-[#2B2B2B] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : orders.length === 0 ? (
              // Enhanced empty state
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200 max-w-lg mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Ready to start building your wardrobe? Browse our latest collection and find your perfect style.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center px-8 py-4 bg-[#2B2B2B] text-white rounded-lg hover:bg-[#1a1a1a] transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Explore Collection
                  <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                </Link>
              </div>
            ) : (
              // Enhanced orders list
              <div className="space-y-6">
                {orders.map((order) => {
                  const orderStatus = getOrderStatus(order);
                  const progress = getOrderProgress(order);
                  const progressStep = getProgressStep(order);
                  const StatusIcon = orderStatus.icon;
                  
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
                    >
                      {/* Order header with progress bar */}
                      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-100">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-5 w-5 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-5 w-5 text-gray-500" />
                              <span className="text-lg font-bold text-gray-900">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={`${orderStatus.color} text-white px-4 py-2 text-sm font-medium flex items-center space-x-2`}>
                              <StatusIcon className="h-4 w-4" />
                              <span>{orderStatus.label}</span>
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Progress bar with circles */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                            <span>Order Placed</span>
                            <span>Processing</span>
                            <span>Shipped</span>
                            <span>Delivered</span>
                          </div>
                          <div className="relative">
                            {/* Progress track */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#2B2B2B] h-2 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            
                            {/* Progress circles */}
                            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
                              {/* Order Placed Circle */}
                              <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                                progressStep >= 1 
                                  ? 'bg-[#2B2B2B] border-[#2B2B2B]' 
                                  : 'bg-white border-gray-300'
                              }`} />
                              
                              {/* Processing Circle */}
                              <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                                progressStep >= 2 
                                  ? 'bg-[#2B2B2B] border-[#2B2B2B]' 
                                  : 'bg-white border-gray-300'
                              }`} />
                              
                              {/* Shipped Circle */}
                              <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                                progressStep >= 3 
                                  ? 'bg-[#2B2B2B] border-[#2B2B2B]' 
                                  : 'bg-white border-gray-300'
                              }`} />
                              
                              {/* Delivered Circle */}
                              <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                                progressStep >= 4 
                                  ? 'bg-[#2B2B2B] border-[#2B2B2B]' 
                                  : 'bg-white border-gray-300'
                              }`} />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 font-mono">
                            Order #{order.id.substring(0, 8).toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400">
                            {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Order items */}
                      <div className="p-6">
                        <div className="space-y-4">
                          {order.orderItems.map((item, index) => (
                            <div
                              key={item.id}
                              className={`flex items-center space-x-4 py-4 ${
                                index !== order.orderItems.length - 1 ? 'border-b border-gray-100' : ''
                              }`}
                            >
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                {item.product.images?.[0]?.url ? (
                                  <img
                                    src={item.product.images[0].url}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover object-center"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = "/placeholder.svg?height=96&width=96";
                                    }}
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <Package className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-gray-900 leading-tight mb-2">
                                  <Link
                                    href={`/product/${item.productId}`}
                                    className="hover:text-gray-700 transition-colors"
                                  >
                                    {item.product.name}
                                  </Link>
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                    <span>Qty: {item.quantity}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                    <span>${item.price.toFixed(2)} each</span>
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order footer */}
                      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            {order.trackingNumber && (
                              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                                <Truck className="h-4 w-4 text-gray-600" />
                                <span className="font-medium">Tracking: {order.trackingNumber}</span>
                              </div>
                            )}
                            {order.estimatedDelivery && (
                              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                                <Calendar className="h-4 w-4 text-gray-600" />
                                <span className="font-medium">
                                  Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="inline-flex items-center px-6 py-3 bg-[#2B2B2B] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors font-medium text-sm shadow-sm hover:shadow-md"
                          >
                            View Full Details
                            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
