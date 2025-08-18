"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Sliders,
  Package,
  Heart,
  ArrowRight,
  Clock,
  XCircle,
  Truck,
  Calendar,
  Container,
  Badge,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
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

export default function OrderHistoryPage() {
  const { user, isAuthenticated, token, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("online");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !token) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load your orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-purple-500">Shipped</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge className="bg-gray-500">{status || "Unknown"}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500">{status || "Unknown"}</Badge>;
    }
  };

  return (
    <Container>
      <section className="min-h-screen py-6 md:py-8 lg:py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-64 mb-6 md:mb-0">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col space-y-1">
                  <Link
                    href="/account"
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium flex items-center"
                  >
                    <span>Overview</span>
                  </Link>
                  <Link
                    href="/account/my-data"
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium flex items-center"
                  >
                    <span>My Data</span>
                    <User className="ml-auto h-4 w-4" />
                  </Link>
                  <Link
                    href="/account/preferences"
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium flex items-center"
                  >
                    <span>My Preferences</span>
                    <Sliders className="ml-auto h-4 w-4" />
                  </Link>
                  <Link
                    href="/account/orders"
                    className="py-2 px-4 bg-gray-200 rounded text-sm uppercase font-medium flex items-center"
                  >
                    <span>Order History</span>
                    <Package className="ml-auto h-4 w-4" />
                  </Link>
                  <Link
                    href="/account/wishlist"
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium flex items-center"
                  >
                    <span>My Wishlist</span>
                    <Heart className="ml-auto h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium text-left flex items-center"
                  >
                    <span>Log Out</span>
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 md:ml-8">
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-6 shadow-md">
                    <Package
                      className="h-10 w-10 text-black"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">ORDER HISTORY</h1>
                    <p className="text-gray-600">Review your past orders</p>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 mb-6">
                <div className="flex">
                  <button
                    className={`py-3 px-6 font-medium text-sm uppercase ${
                      activeTab === "online"
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("online")}
                  >
                    Online
                  </button>
                  <button
                    className={`py-3 px-6 font-medium text-sm uppercase ${
                      activeTab === "retail"
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("retail")}
                  >
                    Retail
                  </button>
                </div>
              </div>

              <div className="py-4">
                {activeTab === "online" && (
                  <>
                    {isLoading ? (
                      <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="border rounded-lg p-4">
                            <div className="flex justify-between mb-4">
                              <Skeleton className="h-6 w-32" />
                              <Skeleton className="h-6 w-24" />
                            </div>
                            <div className="border-t pt-4">
                              <div className="flex items-center">
                                <Skeleton className="h-16 w-16 rounded" />
                                <div className="ml-4 flex-1">
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
                      <div className="text-center py-8">
                        <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                        <p className="text-gray-600">{error}</p>
                        <button
                          onClick={() => router.refresh()}
                          className="mt-4 px-4 py-2 bg-black text-white rounded-md"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <Package
                          className="mx-auto h-16 w-16 text-gray-400 mb-4"
                          strokeWidth={1}
                        />
                        <p className="text-gray-600">
                          You have not placed any orders yet.
                        </p>
                        <Link
                          href="/"
                          className="mt-4 inline-block px-4 py-2 bg-black text-white rounded-md"
                        >
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="border rounded-lg overflow-hidden"
                          >
                            <div className="bg-gray-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                              <div className="mb-2 md:mb-0">
                                <p className="text-sm text-gray-500">
                                  Order placed
                                </p>
                                <p className="font-medium">
                                  {format(
                                    new Date(order.createdAt),
                                    "MMMM d, yyyy"
                                  )}
                                </p>
                              </div>
                              <div className="mb-2 md:mb-0">
                                <p className="text-sm text-gray-500">
                                  Order number
                                </p>
                                <p className="font-medium">
                                  {order.id.substring(0, 8).toUpperCase()}
                                </p>
                              </div>
                              <div className="mb-2 md:mb-0">
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="font-medium">
                                  ${order.total}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                {getStatusBadge(order.status)}
                                {getPaymentStatusBadge(order.paymentStatus)}
                              </div>
                            </div>

                            <div className="p-4">
                              {order.orderItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex py-4 border-b last:border-b-0"
                                >
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                      src={
                                        item.product.images[0]?.url ||
                                        "/placeholder.svg?height=96&width=96"
                                      }
                                      alt={item.product.name}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>
                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <Link
                                            href={`/product/${item.productId}`}
                                          >
                                            {item.product.name}
                                          </Link>
                                        </h3>
                                        <p className="ml-4">
                                          ${item.price}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <p className="text-gray-500">
                                        Qty {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="bg-gray-50 p-4 flex flex-wrap gap-4 items-center justify-between">
                              <div className="flex items-center">
                                {order.paymentMethod && (
                                  <div className="flex items-center mr-4">
                                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                      {order.paymentMethod.toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                {order.trackingNumber && (
                                  <div className="flex items-center">
                                    <Truck className="h-4 w-4 mr-1 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                      Tracking: {order.trackingNumber}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {order.estimatedDelivery && (
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                  <span className="text-sm text-gray-600">
                                    Est. delivery:{" "}
                                    {format(
                                      new Date(order.estimatedDelivery),
                                      "MMM d, yyyy"
                                    )}
                                  </span>
                                </div>
                              )}
                              <Link
                                href={`/account/orders/${order.id}`}
                                className="text-sm font-medium text-black hover:underline"
                              >
                                View order details
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {activeTab === "retail" && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      You have not placed any retail orders yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
