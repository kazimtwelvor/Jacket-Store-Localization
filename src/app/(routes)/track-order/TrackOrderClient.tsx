"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";

interface OrderStatus {
  id: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  orderDate: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  shippingAddress: string;
  timeline: Array<{
    status: string;
    date: string;
    description: string;
    completed: boolean;
  }>;
}

export default function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderData, setOrderData] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) {
      setError("Please enter an order number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/orders/${orderNumber.trim()}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError(
            "Order not found. Please verify your order number is correct and try again."
          );
        } else if (response.status === 400) {
          setError(
            "Invalid order number format. Please check your order ID and try again."
          );
        } else if (response.status === 500) {
          setError("Server error. Please try again in a few minutes.");
        } else {
          setError(
            "Unable to retrieve order information. Please check your order number or try again later."
          );
        }
        setOrderData(null);
        return;
      }

      const data = await response.json();

      const transformedOrder: OrderStatus = {
        id: data.id,
        status: data.status || "processing",
        items:
          data.orderItems?.map((item: any) => ({
            name: item.product?.name || "Product",
            quantity: item.quantity || 1,
            price: parseFloat(item.product?.price || "0"),
          })) || [],
        orderDate: data.createdAt,
        estimatedDelivery: new Date(
          new Date(data.createdAt).getTime() + 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        trackingNumber: data.trackingNumber,
        shippingAddress: data.shippingAddress || "Address not available",
        timeline: [
          {
            status: "Order Placed",
            date: data.createdAt,
            description: "Your order has been confirmed",
            completed: true,
          },
          {
            status: "Processing",
            date: data.createdAt,
            description: "Order is being prepared",
            completed: data.status !== "pending",
          },
          {
            status: "Shipped",
            date: data.shippedAt || "",
            description: "Package is on its way",
            completed: ["shipped", "delivered"].includes(data.status),
          },
          {
            status: "Out for Delivery",
            date: "",
            description: "Package will be delivered today",
            completed: data.status === "delivered",
          },
          {
            status: "Delivered",
            date: data.deliveredAt || "",
            description: "Package delivered successfully",
            completed: data.status === "delivered",
          },
        ],
      };

      setOrderData(transformedOrder);
      setError("");
    } catch (err) {
      console.error("Error fetching order:", err);
      if (err instanceof TypeError && (err as TypeError).message.includes("fetch")) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        setError(
          "Something went wrong while retrieving your order. Please try again later."
        );
      }
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "text-yellow-600";
      case "shipped":
        return "text-blue-600";
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-5 w-5" />;
      case "shipped":
        return <Truck className="h-5 w-5" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl mt-[35px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Track Your Order
          </h1>
          <h2 className="text-lg text-gray-700 mb-4">
            Real-Time Order Tracking System
          </h2>
          <p className="text-gray-600 mb-4">
            Welcome to our comprehensive order tracking system, designed to keep you informed every step of the way. Simply enter your unique order number below to access detailed information about your purchase, including current status, shipping progress, and estimated delivery date.
          </p>
          <p className="text-gray-600 mb-4">
            Our advanced tracking technology provides real-time updates from the moment your order is confirmed until it reaches your doorstep. You'll receive detailed information about processing times, shipping carrier details, and precise location updates throughout the delivery journey.
          </p>
          <p className="text-gray-600 mb-4">
            For your convenience, we also send automated email notifications at key milestones, including order confirmation, shipping dispatch, and delivery completion. Our customer service team monitors all shipments to ensure timely delivery and can assist with any questions or concerns.
          </p>
          <p className="text-gray-600">
            Your order number can be found in your confirmation email or account dashboard. If you experience any issues with tracking or need additional assistance, our dedicated support team is available to help ensure your complete satisfaction with your Fineyst shopping experience.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter your order number (e.g., ORD-2024-001)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && handleTrackOrder()}
              />
            </div>
            <button
              onClick={handleTrackOrder}
              disabled={loading}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Track Order
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {orderData && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Order #{orderData.id}
                </h2>
                <div
                  className={`flex items-center gap-2 ${getStatusColor(
                    orderData.status
                  )} font-semibold`}
                >
                  {getStatusIcon(orderData.status)}
                  <span className="capitalize">{orderData.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Order Date</p>
                  <p className="font-semibold">
                    {new Date(orderData.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Estimated Delivery</p>
                  <p className="font-semibold">
                    {new Date(orderData.estimatedDelivery).toLocaleDateString()}
                  </p>
                </div>
                {orderData.trackingNumber && (
                  <div>
                    <p className="text-gray-600">Tracking Number</p>
                    <p className="font-semibold">{orderData.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Order Items
              </h3>
              <div className="space-y-3">
                {orderData.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-600 text-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </h3>
              <p className="text-gray-700">{orderData.shippingAddress}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Order Timeline
              </h3>
              <div className="space-y-4">
                {orderData.timeline.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-current"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h4
                          className={`font-semibold ${
                            step.completed ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {step.status}
                        </h4>
                        {step.date && (
                          <span className="text-sm text-gray-500">
                            {new Date(step.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          step.completed ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Internal Links Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/us/shipping-and-delivery-policy" className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <h3 className="font-semibold text-gray-900 mb-2">Shipping Policy</h3>
              <p className="text-sm text-gray-600">Learn about our shipping methods and delivery timeframes</p>
            </a>
            <a href="/us/refund-and-returns-policy" className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <h3 className="font-semibold text-gray-900 mb-2">Returns Policy</h3>
              <p className="text-sm text-gray-600">Information about returns, exchanges, and refunds</p>
            </a>
            <a href="/us/contact-us" className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-sm text-gray-600">Get help from our customer service team</p>
            </a>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Where can I find my order number?</h3>
              <p className="text-gray-600">Your order number can be found in your confirmation email or on your order confirmation page after completing your purchase.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">How long does shipping take?</h3>
              <p className="text-gray-600">Standard shipping typically takes 3-4 business days. You can view detailed shipping information on our <a href="/us/shipping-and-delivery-policy" className="text-blue-600 hover:underline">Shipping Policy</a> page.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">What if my order shows as delivered but I haven't received it?</h3>
              <p className="text-gray-600">Please check with neighbors, building management, or other household members. If you still can't locate your package, <a href="/us/contact-us" className="text-blue-600 hover:underline">contact our support team</a> within 48 hours.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Can I change my shipping address after placing an order?</h3>
              <p className="text-gray-600">Address changes are only possible if your order hasn't been processed yet. Please <a href="/us/contact-us" className="text-blue-600 hover:underline">contact us immediately</a> if you need to update your shipping address.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What should I do if my tracking shows no updates?</h3>
              <p className="text-gray-600">Tracking information may take 24-48 hours to update after shipping. If there are no updates after this time, please reach out to our <a href="/us/contact-us" className="text-blue-600 hover:underline">customer service team</a> for assistance.</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
          <h4 className="font-semibold text-blue-900 mb-2">
            Need help finding your order?
          </h4>
          <p className="text-sm text-blue-800">
            Your order ID can be found in your confirmation email or on your
            order confirmation page.
          </p>
        </div>
      </div>
    </div>
  );
}


