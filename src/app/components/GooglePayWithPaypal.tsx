"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { usePayPal3DS } from "../hooks/usePaypal3DS";
import { useCart } from "../contexts/CartContext";

declare global {
  interface Window {
    google?: any;
    paypal_sdk?: any;
  }
}

// Global variables following best practices
let paymentsClient: any = null;
let googlepayConfig: any = null;

type GooglePayWithPayPalProps = {
  onCaptureSuccess?: (orderId?: string) => void;
  totalAmount: number;
  currencyCode?: string;
  termsAccepted?: boolean;
  onTermsError?: (message: string) => void;
  showPaymentStatus?: boolean;
  setShowPaymentStatus?: (show: boolean) => void;
  setCurrentPayPalOrderId?: (orderId: string | null) => void;
  setIsOrderConfirming?: (confirming: boolean) => void;
  scaMethod?: "SCA_ALWAYS" | "SCA_WHEN_REQUIRED";
  invoiceId?: string;
  coupon?: { code: string; id: number; description?: string } | null;
  discountAmount?: number;
};

/**
 * Fetch the Google Pay Config From PayPal following best practices
 */
async function getGooglePayConfig() {
  if (googlepayConfig === null) {
    let paypalGooglePay;
    try {
      if ((window.paypal as any)?.Googlepay) {
        paypalGooglePay = (window.paypal as any).Googlepay();
      } else {
        const paypalNS = (window as any).paypal_sdk;
        if (paypalNS?.Googlepay) {
          paypalGooglePay = paypalNS.Googlepay();
        } else {
          throw new Error(
            "PayPal Google Pay module not found in any namespace"
          );
        }
      }

      if (!paypalGooglePay) {
        throw new Error("PayPal Google Pay module not available");
      }

      googlepayConfig = await paypalGooglePay.config();
      console.log("===== Google Pay Config Fetched =====");
    } catch (error) {
      console.error("Error accessing PayPal Google Pay module:", error);
      throw new Error(
        "PayPal Google Pay module not available. Ensure components=googlepay is loaded."
      );
    }
  }
  return googlepayConfig;
}

/**
 * Return an active PaymentsClient or initialize following best practices
 */
function getGooglePaymentsClient(
  environment: string,
  onPaymentAuthorized: any
) {
  if (paymentsClient === null) {
    paymentsClient = new window.google.payments.api.PaymentsClient({
      environment,
      paymentDataCallbacks: {
        onPaymentAuthorized: onPaymentAuthorized,
      },
    });
  }
  return paymentsClient;
}

/**
 * Configure support for the Google Pay API following best practices
 */
async function getGooglePaymentDataRequest(
  totalAmount: number,
  currencyCode: string
) {
  const config = (await getGooglePayConfig()) as any;
  const {
    allowedPaymentMethods,
    merchantInfo,
    apiVersion,
    apiVersionMinor,
    countryCode,
  } = config;

  const baseRequest = {
    apiVersion,
    apiVersionMinor,
  };

  const paymentDataRequest = Object.assign({}, baseRequest) as any;
  paymentDataRequest.allowedPaymentMethods = allowedPaymentMethods;
  paymentDataRequest.transactionInfo = {
    countryCode: countryCode || "US",
    currencyCode,
    totalPriceStatus: "FINAL",
    totalPrice: totalAmount.toFixed(2),
    totalPriceLabel: "Total",
  };
  paymentDataRequest.merchantInfo = merchantInfo;
  paymentDataRequest.callbackIntents = ["PAYMENT_AUTHORIZATION"];
  paymentDataRequest.emailRequired = true;
  paymentDataRequest.shippingAddressRequired = true;
  paymentDataRequest.shippingAddressParameters = {
    phoneNumberRequired: true,
  };

  return paymentDataRequest;
}

const loadGooglePayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.payments) return resolve();

    const existingScript = document.querySelector(
      'script[src="https://pay.google.com/gp/p/js/pay.js"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () =>
        reject(new Error("Failed to load Google Pay SDK"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://pay.google.com/gp/p/js/pay.js";
    script.async = true;
    script.onload = () => {
      console.log("Google Pay SDK loaded successfully");
      resolve();
    };
    script.onerror = (error) => {
      console.error("Failed to load Google Pay SDK:", error);
      reject(
        new Error(
          "Failed to load Google Pay SDK. Please check your internet connection and try again."
        )
      );
    };
    document.head.appendChild(script);
  });
};

export default function GooglePayWithPayPal({
  onCaptureSuccess,
  totalAmount,
  currencyCode = "USD",
  termsAccepted,
  onTermsError,
  showPaymentStatus = false,
  setShowPaymentStatus,
  setCurrentPayPalOrderId,
  setIsOrderConfirming,
  scaMethod = "SCA_WHEN_REQUIRED",
  invoiceId,
  coupon,
  discountAmount,
}: GooglePayWithPayPalProps) {
  const { items, appliedCoupon, couponDiscount } = useCart();
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPayPalOrderId, setCurrentPayPalOrderIdLocal] = useState<
    string | null
  >(null);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [{ isResolved, options }] = usePayPalScriptReducer();

  const currentCouponRef = useRef(coupon);
  const currentDiscountAmountRef = useRef(discountAmount);
  const currentTotalAmountRef = useRef(totalAmount);

  currentCouponRef.current = coupon;
  currentDiscountAmountRef.current = discountAmount;
  currentTotalAmountRef.current = totalAmount;

  const {
    isAuthenticating,
    authenticationStatus,
    handle3DSFlow,
    reset: reset3DS,
  } = usePayPal3DS({
    onSuccess: (result) => {
      console.log("Google Pay 3DS authentication successful:", result);
      setProcessing(false);
      if (onCaptureSuccess) {
        onCaptureSuccess(result.orderId || result.order_id);
      }
    },
    onError: (error) => {
      console.error("Google Pay 3DS authentication failed:", error);
      setProcessing(false);
      setError(error.message);
    },
    onAuthenticationRequired: (orderId) => {
      console.log("Google Pay 3DS authentication required for order:", orderId);
    },
  });

  const itemsSnapshotRef = useRef<any[]>([]);
  const totalAmountSnapshotRef = useRef<number>(0);

  useEffect(() => {
    if (Array.isArray(items) && items.length > 0) {
      itemsSnapshotRef.current = [...items];
    }
    if (totalAmount > 0) {
      totalAmountSnapshotRef.current = totalAmount;
    }
  }, [items, totalAmount]);

  const googleEnvironment = useMemo(
    () => (process.env.NODE_ENV === "production" ? "PRODUCTION" : "TEST"),
    []
  );

  const onPaymentAuthorized = useCallback((paymentData: any) => {
    setShowPaymentStatusModal(true);
    processPayment(paymentData).catch((error) => {
      console.error("Payment processing failed:", error);
      setShowPaymentStatusModal(false);
    });
    return Promise.resolve({ transactionState: "SUCCESS" });
  }, []);

  const processPayment = useCallback(
    async (paymentData: any) => {
      try {
        // if (typeof termsAccepted !== "undefined" && !termsAccepted) {
        //   const msg = "Please accept the terms and conditions to continue";
        //   setError(msg);
        //   if (onTermsError) onTermsError(msg);
        //   throw new Error(msg);
        // }

        const itemsToProcess =
          itemsSnapshotRef.current.length > 0
            ? itemsSnapshotRef.current
            : items;
        const totalToProcess =
          totalAmountSnapshotRef.current > 0
            ? totalAmountSnapshotRef.current
            : totalAmount;

        if (!Array.isArray(itemsToProcess) || itemsToProcess.length === 0) {
          const msg =
            "Invalid or empty items array - no items available for payment";
          setError(msg);
          throw new Error(msg);
        }

        if (!totalToProcess || totalToProcess <= 0) {
          const msg = "Invalid total amount for payment";
          setError(msg);
          throw new Error(msg);
        }

        const orderInvoiceId =
          invoiceId ||
          `GP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setCurrentInvoiceId(orderInvoiceId);

        const currentCoupon = currentCouponRef.current;
        const currentDiscountAmount = currentDiscountAmountRef.current;
        const currentTotalAmount = currentTotalAmountRef.current;

        const effectiveCoupon =
          currentCoupon !== undefined ? currentCoupon : appliedCoupon;
        const effectiveDiscountAmount =
          currentDiscountAmount !== undefined
            ? currentDiscountAmount
            : couponDiscount;

        const itemsTotal = itemsToProcess.reduce(
          (sum, item) => sum + (item.unitPrice || item.price) * item.quantity,
          0
        );
        const actualDiscountAmount =
          effectiveDiscountAmount ||
          Math.max(0, itemsTotal - currentTotalAmount);

        const orderResponse = await fetch(
          "/api/paypal/create-google-pay-order",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: itemsToProcess.map((item) => ({
                id: item.product?.id || item.id,
                name: item.product?.name || item.name,
                quantity: item.quantity,
                price: item.unitPrice || item.price,
                pa_size: item.size,
                pa_gender: item.gender,
              })),
              total_amount: itemsTotal,
              coupon: effectiveCoupon,
              discount_amount: actualDiscountAmount,
              invoice_id: orderInvoiceId,
              sca_method: scaMethod,
            }),
          }
        );

        const orderData = await orderResponse.json();
        if (!orderResponse.ok) {
          throw new Error(orderData?.error || "Failed to create PayPal order");
        }

        const orderId = orderData.id;
        setCurrentPayPalOrderIdLocal(orderId);

        let paypalGooglePay;
        if ((window.paypal as any)?.Googlepay) {
          paypalGooglePay = (window.paypal as any).Googlepay();
        } else {
          const paypalNS = (window as any).paypal_sdk;
          paypalGooglePay = paypalNS?.Googlepay();
        }

        if (!paypalGooglePay) {
          throw new Error(
            "PayPal Google Pay module not available for payment confirmation"
          );
        }

        try {
          const confirmResult = await paypalGooglePay.confirmOrder({
            orderId,
            paymentMethodData: paymentData.paymentMethodData,
          });

          if (confirmResult?.status === "COMPLETED") {
            setProcessing(false);
            if (onCaptureSuccess) {
              onCaptureSuccess(orderId);
            }
            return { transactionState: "SUCCESS" };
          } else if (confirmResult?.status === "APPROVED") {
            const shippingAddress = paymentData?.shippingAddress;
            const billingAddress =
              paymentData?.paymentMethodData?.info?.billingAddress;

            const mappedShipping = shippingAddress
              ? {
                  first_name: shippingAddress.name?.split(" ")[0] || "Guest",
                  last_name:
                    shippingAddress.name?.split(" ").slice(1).join(" ") ||
                    "User",
                  address_1: shippingAddress.address1 || "",
                  address_2: shippingAddress.address2 || "",
                  city: shippingAddress.locality || "",
                  state: shippingAddress.administrativeArea || "",
                  postcode: shippingAddress.postalCode || "",
                  country: shippingAddress.countryCode || "US",
                  phone: shippingAddress.phoneNumber || "",
                  email: paymentData?.email || "",
                }
              : null;

            const mappedBilling = billingAddress
              ? {
                  first_name: billingAddress.name?.split(" ")[0] || "Guest",
                  last_name:
                    billingAddress.name?.split(" ").slice(1).join(" ") ||
                    "User",
                  address_1: billingAddress.address1 || "",
                  address_2: billingAddress.address2 || "",
                  city: billingAddress.locality || "",
                  state: billingAddress.administrativeArea || "",
                  postcode: billingAddress.postalCode || "",
                  country: billingAddress.countryCode || "US",
                  phone: billingAddress.phoneNumber || "",
                  email: paymentData?.email || "",
                }
              : null;

            const captureResponse = await fetch("/api/paypal/capture-google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paypal_order_id: orderId,
                orderPayload: {
                  items: itemsToProcess.map((item) => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size,
                    gender: item.gender,
                    pa_size: item.size,
                    pa_gender: item.gender,
                  })),
                  total: currentTotalAmount,
                  original_total: itemsToProcess.reduce(
                    (sum, item) =>
                      sum + (item.unitPrice || item.price) * item.quantity,
                    0
                  ),
                  coupon_code: effectiveCoupon?.code,
                  coupon_discount: actualDiscountAmount,
                  customer: {
                    email: paymentData?.email || "",
                    first_name: mappedShipping?.first_name || "Guest",
                    last_name: mappedShipping?.last_name || "User",
                  },
                  shipping: mappedShipping,
                  billing: mappedBilling,
                  invoice_id: orderInvoiceId,
                },
              }),
            });

            if (!captureResponse.ok) {
              const errorData = await captureResponse.json();
              throw new Error(errorData.error || "Payment capture failed");
            }

            const captureResult = await captureResponse.json();
            setProcessing(false);
            if (onCaptureSuccess) {
              onCaptureSuccess(captureResult.orderId || orderId);
            }
            return { transactionState: "SUCCESS" };
          } else if (confirmResult?.status === "PAYER_ACTION_REQUIRED") {
            throw new Error("3DS_REQUIRED");
          } else {
            throw new Error(
              "Google Pay confirmation returned unexpected status: " +
                confirmResult?.status
            );
          }
        } catch (nativeError: any) {
          if (
            nativeError.message === "3DS_REQUIRED" ||
            nativeError.contingency === "BUYER_NOT_SET" ||
            nativeError.data?.name === "BUYER_NOT_SET" ||
            nativeError.message === "APPROVE_GOOGLE_PAY_VALIDATION_ERROR" ||
            nativeError.contingency ||
            nativeError.errors?.[0]?.data?.errors?.[0]?.issue ===
              "INVALID_GOOGLE_PAY_TOKEN"
          ) {
            const approveResponse = await fetch(
              "/api/payments/paypal/approve-google-pay-order",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  order_id: orderId,
                  google_pay_data: paymentData.paymentMethodData,
                  sca_method: scaMethod,
                }),
              }
            );

            const approveResult = await approveResponse.json();

            if (approveResult.status === "PAYER_ACTION_REQUIRED") {
              reset3DS();
              await handle3DSFlow(orderId, scaMethod);
              return;
            } else if (
              approveResult.status === "COMPLETED" ||
              approveResult.status === "APPROVED"
            ) {
              setProcessing(false);
              setShowPaymentStatusModal(false);
              if (onCaptureSuccess) {
                onCaptureSuccess(orderId);
              }
              return { transactionState: "SUCCESS" };
            } else {
              throw new Error(approveResult.error || "3DS approval failed");
            }
          } else {
            throw nativeError;
          }
        }
      } catch (err: any) {
        console.error("Google Pay payment error:", err);
        setError(err.message || "Payment failed");
        setProcessing(false);
        setShowPaymentStatusModal(false);
        return {
          transactionState: "ERROR",
          error: {
            message: err.message,
          },
        };
      }
    },
    [items, totalAmount, termsAccepted, onTermsError, onCaptureSuccess]
  );

  const renderButton = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const itemsToCheck =
        itemsSnapshotRef.current.length > 0 ? itemsSnapshotRef.current : items;
      const totalToCheck =
        totalAmountSnapshotRef.current > 0
          ? totalAmountSnapshotRef.current
          : totalAmount;

      if (!Array.isArray(itemsToCheck) || itemsToCheck.length === 0) {
        setError("No items in cart to process payment");
        return;
      }

      if (!totalToCheck || totalToCheck <= 0) {
        setError("Invalid total amount for payment");
        return;
      }

      await loadGooglePayScript();

      if (!window.google?.payments?.api?.PaymentsClient) {
        throw new Error("Google Pay SDK not properly loaded");
      }

      if (!isResolved) {
        setTimeout(() => {
          if (isResolved) {
            renderButton();
          }
        }, 1000);
        return;
      }

      let paypalGooglePayCtor;
      try {
        if ((window.paypal as any)?.Googlepay) {
          paypalGooglePayCtor = (window.paypal as any).Googlepay;
        } else {
          const namespace = (options as any)?.dataNamespace || "paypal_sdk";
          const paypalNS = (window as any)[namespace];
          paypalGooglePayCtor = paypalNS?.Googlepay;
        }

        if (!paypalGooglePayCtor) {
          throw new Error(
            "PayPal Google Pay module not available. Ensure components=googlepay is loaded."
          );
        }
      } catch (error) {
        throw new Error(
          "PayPal Google Pay module not available. Ensure components=googlepay is loaded."
        );
      }

      await getGooglePayConfig();
      const { allowedPaymentMethods, apiVersion, apiVersionMinor } =
        googlepayConfig as any;

      const paymentsClient = getGooglePaymentsClient(
        googleEnvironment,
        onPaymentAuthorized
      );

      const isReady = await paymentsClient.isReadyToPay({
        allowedPaymentMethods,
        apiVersion,
        apiVersionMinor,
      });

      if (!isReady.result) {
        setError(
          "Google Pay is not available on this device/browser. This may be due to browser compatibility or payment method availability."
        );
        return;
      }

      const button = paymentsClient.createButton({
        onClick: async () => {
          if (processing) return;

          try {
            setProcessing(true);
            setLoading(true);
            setError(null);

            const paymentDataRequest = await getGooglePaymentDataRequest(
              totalToCheck,
              currencyCode
            );
            await paymentsClient.loadPaymentData(paymentDataRequest);
          } catch (err: any) {
            console.error("Google Pay payment error:", err);
            setError(err.message || "Payment failed");
            setLoading(false);
            setProcessing(false);
          }
        },
        buttonType: "pay",
        buttonColor: "default",
        buttonSizeMode: "fill",
      });

      if (buttonContainerRef.current) {
        buttonContainerRef.current.innerHTML = "";
        buttonContainerRef.current.appendChild(button);
      }
    } catch (err: any) {
      console.error("Google Pay setup error:", err);
      setError(err.message || "Failed to initialize Google Pay");
    } finally {
      setLoading(false);
    }
  }, [
    items,
    totalAmount,
    isResolved,
    options,
    currencyCode,
    googleEnvironment,
    processing,
    onPaymentAuthorized,
  ]);

  useEffect(() => {
    renderButton();
  }, [renderButton]);

  if (error) {
    return (
      <div className="text-red-600 text-sm p-2 border border-red-200 rounded">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        {(loading || processing) && (
          <div className="text-center text-gray-600 mb-2">
            {processing ? "Processing payment..." : "Loading..."}
          </div>
        )}
        <div
          ref={buttonContainerRef}
          className="w-full"
          style={{ pointerEvents: processing ? "none" : "auto" }}
        />
      </div>
    </>
  );
}
