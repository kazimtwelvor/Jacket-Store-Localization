"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Heart, Truck, RotateCcw, ChevronRight } from "lucide-react";
import type { Product } from "@/types";
import Currency from "../../ui/currency";
import { useCart } from "../../contexts/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentRequestButtonElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import GooglePayWithPaypal from "../GooglePayWithPaypal";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalButtons from "../cart/PayPalButtons";
import { decrypt } from "../../utils/decrypt";
import PaymentProcessingModal from "../PaymentProcessingModal";
import { trackBeginCheckout } from "../../lib/analytics";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const StripeExpressCheckout = ({
  totalAmount,
  onSuccess,
  items,
  setPaymentModal,
}: {
  totalAmount: number;
  onSuccess: (orderId?: string) => void;
  items: any[];
  setPaymentModal: (modal: {
    isOpen: boolean;
    status: "processing" | "success" | "error";
    message: string;
  }) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleExpressCheckout = async (event: any) => {
    if (!stripe || !elements) return;


    setPaymentModal({
      isOpen: true,
      status: "processing",
      message: "Processing payment...",
    });

    try {
      const response = await fetch(`/api/stripe/express-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            quantity: i.quantity,
            price: i.unitPrice,
            size: i.size,
            color: i.selectedColor,
          })),
          totalAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret, paymentIntentId } = await response.json();

      // ✅ Use confirmPayment with elements instead of payment_method
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation?paymentIntentId=${paymentIntentId}&success=1`,
        },
        redirect: "if_required",
      });

      if (error) {
        setPaymentModal({
          isOpen: true,
          status: "error",
          message: error.message || "Payment failed",
        });
        setTimeout(
          () =>
            setPaymentModal({
              isOpen: false,
              status: "processing",
              message: "",
            }),
          3000
        );
      } else {
        // Call checkout API after successful payment
        const checkoutResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productIds: items.map((item) => item.product.id),
              paymentMethod: "stripe_express",
              customerEmail: event.billingDetails?.email || "",
              customerName:
                event.billingDetails?.name || event.shippingAddress?.name || "",
              phone: event.billingDetails?.phone || "",
              address: `${event.shippingAddress?.address?.line1 || ""}, ${
                event.shippingAddress?.address?.city || ""
              }, ${event.shippingAddress?.address?.state || ""}, ${
                event.shippingAddress?.address?.postal_code || ""
              }, ${event.shippingAddress?.address?.country || "US"}`,
              billingAddress: `${
                event.billingDetails?.address?.line1 ||
                event.shippingAddress?.address?.line1 ||
                ""
              }, ${
                event.billingDetails?.address?.city ||
                event.shippingAddress?.address?.city ||
                ""
              }, ${
                event.billingDetails?.address?.state ||
                event.shippingAddress?.address?.state ||
                ""
              }, ${
                event.billingDetails?.address?.postal_code ||
                event.shippingAddress?.address?.postal_code ||
                ""
              }, ${
                event.billingDetails?.address?.country ||
                event.shippingAddress?.address?.country ||
                "US"
              }`,
              shippingAddress: `${
                event.shippingAddress?.address?.line1 || ""
              }, ${event.shippingAddress?.address?.city || ""}, ${
                event.shippingAddress?.address?.state || ""
              }, ${event.shippingAddress?.address?.postal_code || ""}, ${
                event.shippingAddress?.address?.country || "US"
              }`,
              zipCode: event.shippingAddress?.address?.postal_code || "",
              city: event.shippingAddress?.address?.city || "",
              state: event.shippingAddress?.address?.state || "",
              country: event.shippingAddress?.address?.country || "US",
              embedded: true,
              totalAmount: totalAmount,
              discountAmount: 0,
              voucherCode: null,
              paymentIntentId,
              paymentStatus: paymentIntent?.status || "succeeded",
            }),
          }
        );

        if (checkoutResponse.ok) {
          const { orderId } = await checkoutResponse.json();
          await fetch("/api/orders/send-order-emails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerEmail: event.billingDetails?.email,
              customerName:
                event.billingDetails?.name || event.shippingAddress?.name,
              orderNumber: orderId || "unknown",
              orderTotal: totalAmount,
              items: items.map((item) => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.unitPrice,
              })),
            }),
          });
          setPaymentModal({
            isOpen: true,
            status: "success",
            message: "Payment successful! Redirecting...",
          });
          setTimeout(() => {
            setPaymentModal({
              isOpen: false,
              status: "processing",
              message: "",
            });
            onSuccess(orderId);
          }, 2000);
        } else {
          const errorData = await checkoutResponse.json();
          setPaymentModal({
            isOpen: true,
            status: "error",
            message: `Order creation failed: ${
              errorData.message || "Unknown error"
            }`,
          });
        }
      }
    } catch (error) {
      setPaymentModal({
        isOpen: true,
        status: "error",
        message: "Payment failed. Please try again.",
      });
      setTimeout(
        () =>
          setPaymentModal({ isOpen: false, status: "processing", message: "" }),
        3000
      );
    }
  };

  return (
    <div className="space-y-2">
      <ExpressCheckoutElement
        onConfirm={handleExpressCheckout}
        options={{
          paymentMethods: {
            applePay: "auto",
            googlePay: "auto",
            link: "auto",
          },
          layout: {
            maxColumns: 1,
            maxRows: 1,
          },
          emailRequired: true,
          phoneNumberRequired: true,
          shippingAddressRequired: true,
        }}
      />
    </div>
  );
};

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const [showVoucherField, setShowVoucherField] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherApplying, setVoucherApplying] = useState(false);
  const [voucherMessage, setVoucherMessage] = useState("");
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    status: "processing" as "processing" | "success" | "error",
    message: "",
  });
  const router = useRouter();
  const isStripe = process.env.NEXT_PUBLIC_USE_STRIPE === "true";
  const shippingPrice = totalPrice > 100 ? 0 : 10;
  const taxRate = 0.08;
  const taxAmount = 0;
  const grandTotal = totalPrice + shippingPrice + taxAmount;
  const effectiveGrandTotal = Math.max(0, grandTotal - discountAmount);

  useEffect(() => {
    const initializePayments = async () => {
      try {
        // Initialize Stripe
        const stripeResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stripe-publishable-key`
        );
        if (stripeResponse.ok) {
          const stripeData = await stripeResponse.json();
          const stripe = await loadStripe(stripeData.publishableKey);
          setStripePromise(stripe);
        }

        // Initialize PayPal for Google Pay
        const paypalResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payment-settings`
        );
        if (paypalResponse.ok) {
          const paypalData = await paypalResponse.json();
          const encryptionKey = "a7b9c2d4e6f8g1h3j5k7m9n2p4q6r8s0";
          const decryptedClientId = decrypt(
            paypalData.paypalClientId,
            encryptionKey
          );
          setPaypalClientId(decryptedClientId);
        }
      } catch (error) {
      }
    };

    initializePayments();
  }, []);

  const handlePaymentSuccess = (orderId?: string) => {
    setPaymentModal({
      isOpen: true,
      status: "success",
      message: "Payment successful! Redirecting...",
    });
    setTimeout(() => {
      setPaymentModal({ isOpen: false, status: "processing", message: "" });
      onClose();
      const url = orderId
        ? `/checkout/confirmation?orderId=${orderId}&success=1`
        : "/checkout/confirmation?success=1";
      router.push(url);
    }, 2000);
  };

  const handleExpressPayment = async (paymentMethod: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              id: i.product.id,
              name: i.product.name,
              price: i.unitPrice,
              quantity: i.quantity,
            })),
            shippingPrice,
            taxAmount,
            discountAmount,
            paymentMethod: paymentMethod.toLowerCase().replace(" ", ""),
          }),
        }
      );

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        toast.error(`${paymentMethod} checkout failed`);
      }
    } catch (error) {
      toast.error(`${paymentMethod} checkout failed`);
    }
  };

  const handleApplyVoucher = async () => {
    try {
      if (!couponCode.trim()) {
        toast.error("Enter a voucher code");
        return;
      }
      setVoucherApplying(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/confirm-voucher`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: couponCode.trim(),
            orderTotal: grandTotal,
            items: items.map((i) => ({
              id: i.product.id,
              price: i.unitPrice,
              quantity: i.quantity,
            })),
          }),
        }
      );
      const data = await response.json();
      if (data.valid) {
        setDiscountAmount(Number(data.discount) || 0);
        setVoucherMessage(data.message || "Voucher applied");
        toast.success(data.message || "Voucher applied");
      } else {
        setDiscountAmount(0);
        setVoucherMessage(data.message || "Invalid voucher code");
        toast.error(data.message || "Invalid voucher code");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to apply voucher");
    } finally {
      setVoucherApplying(false);
    }
  };

  const getDeliveryDates = () => {
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);

    startDate.setDate(today.getDate() + 3);
    endDate.setDate(today.getDate() + 4);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
      });
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 bg- z-[10000] hidden lg:flex"
      onClick={onClose}
    >
      <div
        className="ml-auto w-[600px] h-full bg-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">MY SHOPPING CART</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                onClose();
                router.push("/cart");
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              SEE DETAILS
            </button>
            <button onClick={onClose} className="p-1">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length > 0 && (
            <div className="bg-gray-400 p-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-black">GOOD CHOICE!</p>
                <p className="text-sm text-black">
                  Your item was added to the shopping cart
                </p>
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border-b border-gray-200 relative"
                >
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded z-10"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>

                  <div className="flex gap-4">
                    <div className="relative w-32 aspect-[3/5] flex-shrink-0">
                      <Image
                        src={
                          item.product.images?.[0]?.url || "/placeholder.svg"
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                      <button className="absolute top-1 left-1 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm">
                        <Heart className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-black mb-2 uppercase text-sm">
                        <Link href={`/product/${item.product.id}`}>
                          {item.product.name}
                        </Link>
                      </h3>

                      <div className="space-y-1 mb-3">
                        <p className="text-xs text-black">
                          <span className="font-medium">Color:</span>{" "}
                          {item.selectedColor ||
                            (item.product as any).color?.name ||
                            (item.product as any).colors?.[0]?.name ||
                            "Default"}
                        </p>
                        <p className="text-xs text-black">
                          <span className="font-medium">Size:</span> {item.size}
                        </p>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center border border-gray-300 w-fit">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-1 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-black font-medium min-w-[2rem] text-center border-l border-r border-gray-300 text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-left">
                        <div className="mb-2">
                          <p className="text-xs text-black">Unit Price</p>
                          <div className="flex items-center gap-2">
                            {item.product.salePrice ? (
                              <>
                                <span className="text-xs text-gray-400 line-through">
                                  <Currency
                                    value={Number(item.product.price)}
                                  />
                                </span>
                                <span className="text-sm font-bold text-black">
                                  <Currency
                                    value={Number(item.product.salePrice)}
                                  />
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-bold text-black">
                                <Currency value={item.unitPrice} />
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Price</p>
                          <p className="text-sm font-bold text-black">
                            <Currency value={item.unitPrice * item.quantity} />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4">
                <div className="bg-gray-100 p-4">
                  <h2 className="text-sm font-bold text-black mb-4">
                    ORDER OVERVIEW
                  </h2>

                  <div className="space-y-1 mb-6">
                    <div className="flex justify-between">
                      <p className="text-sm text-black">Subtotal</p>
                      <p className="font-bold text-sm text-black">
                        <Currency value={totalPrice} />
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-black">Shipping</p>
                      <p className="font-bold text-sm text-black">
                        {shippingPrice === 0 ? (
                          "Free"
                        ) : (
                          <Currency value={shippingPrice} />
                        )}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-black">Estimated Tax</p>
                      <p className="font-bold text-sm text-black">
                        <Currency value="0" />
                      </p>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between">
                        <p className="text-sm text-black">Discount</p>
                        <p className="font-bold text-sm text-green-600">
                          -<Currency value={discountAmount} />
                        </p>
                      </div>
                    )}
                    <div className="border-t border-gray-300 pt-3 flex justify-between">
                      <p className="text-sm font-bold text-black">
                        Total price
                      </p>
                      <p className="text-sm font-bold text-black">
                        <Currency value={effectiveGrandTotal} />
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 p-6 text-xs text-black">
                  <Truck className="h-3 w-3" />
                  <span>
                    Delivery approx. <strong>{getDeliveryDates()}</strong>
                  </span>
                </div>

                <div className="mb-6">
                  <button
                    onClick={() => setShowVoucherField(!showVoucherField)}
                    className="w-full text-left p-3 bg-gray-100 text-sm font-extrabold text-black flex justify-between items-center"
                  >
                    <span>REDEEM A VOUCHER CODE</span>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        showVoucherField ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {showVoucherField && (
                    <div className="mt-3">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Enter voucher code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <button
                          onClick={handleApplyVoucher}
                          disabled={voucherApplying}
                          className="bg-black hover:bg-gray-800 text-white px-4 disabled:opacity-50"
                        >
                          {voucherApplying ? "Applying..." : "Apply"}
                        </button>
                      </div>
                      {voucherMessage && (
                        <div
                          className={`mt-2 p-2 text-sm text-center ${
                            discountAmount > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {voucherMessage}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-6 relative">
                  <p className="text-xs text-black mb-2">
                    <span className="underline cursor-pointer hover:text-gray-600">
                      Click
                    </span>{" "}
                    to see what payment options are available.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-t  p-4">
          <button
            onClick={() => {
              trackBeginCheckout(items);
              onClose();
              router.push("/checkout");
            }}
            className="w-full bg-black text-white py-3 font-semibold text-lg mb-3"
          >
            CHECKOUT
          </button>

          <p className="text-center text-sm text-gray-600 mb-4">
            Express checkout options
          </p>

          <div className="space-y-2 mb-4">
            {isStripe ? (
              <>
                {/* Stripe Express Checkout Elements */}
                {stripePromise && (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      mode: "payment",
                      amount: Math.round(effectiveGrandTotal * 100),
                      currency: "usd",
                      appearance: {
                        theme: "stripe",
                      },
                    }}
                  >
                    <StripeExpressCheckout
                      totalAmount={effectiveGrandTotal}
                      onSuccess={handlePaymentSuccess}
                      items={items}
                      setPaymentModal={setPaymentModal}
                    />
                  </Elements>
                )}
              </>
            ) : (
              <>
                {/* Google Pay via PayPal */}
                {paypalClientId && (
                  <PayPalScriptProvider
                    options={{
                      "client-id": paypalClientId,
                      currency: "USD",
                      components: "googlepay",
                    }}
                  >
                    <div className="border border-gray-300 rounded">
                      <GooglePayWithPaypal
                        totalAmount={effectiveGrandTotal}
                        onCaptureSuccess={handlePaymentSuccess}
                        termsAccepted={true}
                        onTermsError={(message) => toast.error(message)}
                      />
                    </div>
                  </PayPalScriptProvider>
                )}

                {/* PayPal Express */}
                {/* {paypalClientId && (
                  <PayPalScriptProvider
                    options={{
                      "client-id": paypalClientId,
                      currency: "USD",
                    }}
                  >
                    <div className="border border-gray-300 rounded p-1">
                      <PayPalButtons
                        items={items.map((i) => ({
                          id: i.product.id,
                          quantity: i.quantity,
                        }))}
                        onApproveSuccess={handlePaymentSuccess}
                      />
                    </div>
                  </PayPalScriptProvider>
                )} */}
              </>
            )}
          </div>
        </div>
      </div>

      <PaymentProcessingModal
        isOpen={paymentModal.isOpen}
        status={paymentModal.status}
        message={paymentModal.message}
      />
    </div>
  );
};

export default CartSidebar;
