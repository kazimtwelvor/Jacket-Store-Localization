"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, ArrowLeft, Calendar, Truck, DollarSign } from "lucide-react";
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

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-500 text-white">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-purple-500 text-white">Shipped</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500 text-white">Cancelled</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status || "Unknown"}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return <Badge className="bg-green-500 text-white">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500 text-white">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status || "Unknown"}</Badge>;
    }
  };

  return (
    <Container>
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/account"
              className="inline-flex items-center text-gray-600 hover:text-black mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Account
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">View and track your order history</p>
          </div>

          {/* Orders Content */}
          <div className="space-y-6">
            {isLoading ? (
              // Loading skeletons
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-16 w-16 rounded" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Error state
              <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
                <Package className="mx-auto h-16 w-16 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Orders</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => router.refresh()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            ) : orders.length === 0 ? (
              // Empty state
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                <Package className="mx-auto h-20 w-20 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              // Orders list
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                  >
                    {/* Order header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              ${order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(order.status)}
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-xs text-gray-500">Order #{order.id.substring(0, 8).toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={
                                  item.product.images[0]?.url ||
                                  "/placeholder.svg?height=80&width=80"
                                }
                                alt={item.product.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                <Link
                                  href={`/product/${item.productId}`}
                                  className="hover:text-blue-600"
                                >
                                  {item.product.name}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {order.trackingNumber && (
                            <div className="flex items-center space-x-2">
                              <Truck className="h-4 w-4" />
                              <span>Tracking: {order.trackingNumber}</span>
                            </div>
                          )}
                          {order.estimatedDelivery && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
