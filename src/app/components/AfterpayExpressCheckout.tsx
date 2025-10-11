"use client";
import React, { useState, useEffect, useCallback } from "react";
// import { useCart } from "@/hooks/use-cart";
// import { generateInvoiceId } from "@/lib/invoice-utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { generateInvoiceId } from "../lib/invoice-utils";

declare global {
  interface Window {
    Afterpay: any;
    AfterPay?: any;
  }
}

interface AfterpayExpressCheckoutProps {
  onCaptureSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  setIsOrderConfirming: (confirming: boolean) => void;
  totalAmount: number;
  currencyCode?: string;
  countryCode?: string;
  termsAccepted?: boolean;
  onTermsError?: (error: string) => void;
  invoiceId?: string;
  coupon?: any;
  discountAmount?: number;
}

// Shipping options for different regions
const SHIPPING_OPTIONS = {
  US: [
    {
      id: "standard-us",
      name: "Standard Shipping",
      description: "5-7 business days",
      shippingAmount: { amount: "0.00", currency: "USD" },
      taxAmount: { amount: "0.00", currency: "USD" },
      orderAmount: { amount: "0.00", currency: "USD" }, // Will be calculated dynamically
    },
  ],
  AU: [
    {
      id: "standard-au",
      name: "Standard Shipping",
      description: "5-7 business days",
      shippingAmount: { amount: "0.00", currency: "AUD" },
      taxAmount: { amount: "0.00", currency: "AUD" },
      orderAmount: { amount: "0.00", currency: "AUD" },
    },
  ],
  // Add more regions as needed
};

export default function AfterpayExpressCheckout({
  onCaptureSuccess,
  onError,
  setIsOrderConfirming,
  totalAmount,
  currencyCode = "USD",
  countryCode = "US",
  termsAccepted = false,
  onTermsError,
  invoiceId: providedInvoiceId,
  coupon,
  discountAmount = 0,
}: AfterpayExpressCheckoutProps) {
  const { items } = useCart();
  const [invoiceId] = useState(() => providedInvoiceId || generateInvoiceId());
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAfterpayScript = () => {
      if (window.Afterpay) {
        setIsScriptLoaded(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src*="afterpay.js"]'
      );
      if (existingScript) {
        if (window.Afterpay) {
          setIsScriptLoaded(true);
          return;
        }

        existingScript.addEventListener("load", () => {
          setTimeout(() => {
            if (window.Afterpay) {
              setIsScriptLoaded(true);
            } else {
              setError("Failed to load Afterpay properly");
            }
          }, 100);
        });
        return;
      }
      const afterpayScriptUrl =
        process.env.AFTERPAY_SCRIPT_URL ||
        "https://portal.sandbox.afterpay.com/afterpay.js";
      const script = document.createElement("script");
      script.src = afterpayScriptUrl;
      script.async = true;

      script.onload = () => {
        const afterpayGlobal = window.Afterpay || window.AfterPay;

        if (afterpayGlobal) {
          if (!window.Afterpay && window.AfterPay) {
            window.Afterpay = window.AfterPay;
          }
          setIsScriptLoaded(true);
        } else {
          let attempts = 0;
          const maxAttempts = 10;

          const checkForGlobal = () => {
            attempts++;
            const global = window.Afterpay || window.AfterPay;
            if (global) {
              if (!window.Afterpay && window.AfterPay) {
                window.Afterpay = window.AfterPay;
              }
              setIsScriptLoaded(true);
            } else if (attempts < maxAttempts) {
              setTimeout(checkForGlobal, attempts * 50);
            } else {
              setError("Failed to initialize Afterpay - object not found");
            }
          };

          checkForGlobal();
        }
      };

      script.onerror = (e) => {
        setError("Failed to load Afterpay script");
      };
      document.head.appendChild(script);
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    };

    loadAfterpayScript();
  }, []);

  const calculateShippingOptions = useCallback(
    async (address: any, baseTotal: number) => {
      try {
        const response = await fetch("/api/shipping/calculate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address,
            items,
            currency: currencyCode,
            orderTotal: baseTotal,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to calculate shipping");
        }

        const data = await response.json();
        return data.shippingOptions;
      } catch (error) {
        const fallbackOptions =
          SHIPPING_OPTIONS[
            address.countryCode as keyof typeof SHIPPING_OPTIONS
          ] || SHIPPING_OPTIONS.US;
        return fallbackOptions.map((option) => ({
          ...option,
          orderAmount: {
            ...option.orderAmount,
            amount: (
              baseTotal +
              parseFloat(option.shippingAmount.amount) +
              parseFloat(option.taxAmount.amount)
            ).toFixed(2),
          },
        }));
      }
    },
    [items, currencyCode]
  );
  const createAfterpayToken = useCallback(async () => {
    try {
      const response = await fetch("/api/afterpay/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.unitPrice,
            quantity: item.quantity,
          })),
          amount: {
            amount: totalAmount.toFixed(2),
            currency: currencyCode,
          },
          mode: "express",
          merchant: {
            popupOriginUrl: window.location.origin,
          },
          coupon,
          discount_amount: discountAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to create Afterpay checkout"
        );
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      throw error;
    }
  }, [items, totalAmount, currencyCode, invoiceId, coupon, discountAmount]);
  const onShippingAddressChange = useCallback(
    async (data: any, actions: any) => {
      try {
        // Validate address
        if (!data.countryCode) {
          actions.reject(
            window.Afterpay.CONSTANTS.SHIPPING_ADDRESS_UNRECOGNIZED
          );
          return;
        }

        const shippingOptions = await calculateShippingOptions(
          data,
          totalAmount
        );

        if (!shippingOptions || shippingOptions.length === 0) {
          actions.reject(
            window.Afterpay.CONSTANTS.SHIPPING_ADDRESS_UNSUPPORTED
          );
          return;
        }

        actions.resolve(shippingOptions);
      } catch (error) {

        if (error instanceof Error) {
          if (error.message.includes("SHIPPING_UNSUPPORTED")) {
            actions.reject(
              window.Afterpay.CONSTANTS.SHIPPING_ADDRESS_UNSUPPORTED
            );
          } else if (error.message.includes("SHIPPING_ADDRESS_UNSUPPORTED")) {
            actions.reject(
              window.Afterpay.CONSTANTS.SHIPPING_ADDRESS_UNSUPPORTED
            );
          } else if (error.message.includes("SHIPPING_ADDRESS_UNRECOGNIZED")) {
            actions.reject(
              window.Afterpay.CONSTANTS.SHIPPING_ADDRESS_UNRECOGNIZED
            );
          } else {
            actions.reject(window.Afterpay.CONSTANTS.SERVICE_UNAVAILABLE);
          }
        } else {
          actions.reject(window.Afterpay.CONSTANTS.SERVICE_UNAVAILABLE);
        }
      }
    },
    [totalAmount, calculateShippingOptions]
  );

  const onShippingOptionChange = useCallback((data: any, actions?: any) => {

    if (actions) {
      actions.resolve({
        id: data.id,
        shippingAmount: data.shippingAmount,
        taxAmount: data.taxAmount,
        orderAmount: data.orderAmount,
      });
    }
  }, []);

  const onComplete = useCallback(
    async (event: any) => {
      if (event.data.status === "SUCCESS") {
        setIsOrderConfirming(true);

        try {
          const orderDetailsResponse = await fetch(
            `/api/afterpay/get-checkout/${event.data.orderToken}`
          );
          if (!orderDetailsResponse.ok) {
            throw new Error("Failed to retrieve order details");
          }

          const orderDetails = await orderDetailsResponse.json();

          // Capture payment
          const captureResponse = await fetch("/api/afterpay/capture", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderToken: event.data.orderToken,
              orderInfo: event.data.orderInfo,
              items,
              coupon,
              discount_amount: discountAmount,
              orderDetails,
            }),
          });

          if (!captureResponse.ok) {
            const errorData = await captureResponse.json();
            throw new Error(errorData.error || "Payment capture failed");
          }

          const result = await captureResponse.json();
          onCaptureSuccess(result.orderId);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Payment failed";
          onError(errorMessage);
          toast.error("Payment failed. Please try again.");
        } finally {
          setIsOrderConfirming(false);
        }
      } else {
        setIsOrderConfirming(false);
      }
    },
    [
      items,
      invoiceId,
      coupon,
      discountAmount,
      onCaptureSuccess,
      onError,
      setIsOrderConfirming,
    ]
  );

  const onCommenceCheckout = useCallback(
    async (actions: any) => {
      try {
        if (!termsAccepted && onTermsError) {
          onTermsError("Please accept the terms and conditions to continue");
          actions.reject && actions.reject();
          return;
        }

        setLoading(true);
        const token = await createAfterpayToken();
        if (actions && actions.resolve) {
          actions.resolve(token);
        } else {
          const checkoutBaseURL =
            process.env.AFTERPAY_CHECKOUT ||
            "https://portal.sandbox.afterpay.com/checkout";
          window.location.href = `${checkoutBaseURL}/?token=${token}`;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to start checkout";
        setError(errorMessage);
        onError(errorMessage);

        if (actions && actions.reject) {
          actions.reject();
        }
      } finally {
        setLoading(false);
      }
    },
    [termsAccepted, onTermsError, createAfterpayToken, onError]
  );

  useEffect(() => {
    if (!isScriptLoaded || isInitialized) {
      return;
    }

    const initTimer = setTimeout(() => {
      let attempts = 0;
      const maxAttempts = 5;

      const checkAfterpay = () => {
        attempts++;
        if (window.Afterpay) {
          initializeAfterpay();
        } else if (attempts < maxAttempts) {
          setTimeout(checkAfterpay, attempts * 100);
        } else {
          setError("Afterpay failed to load. Please refresh the page.");
        }
      };

      const initializeAfterpay = () => {
        Object.keys(window.Afterpay).forEach((key) => {
          const value = window.Afterpay[key];
          if (typeof value === "object" && value !== null) {
          }
        });

        try {
          let addressMode;
          if (
            window.Afterpay.ADDRESS_MODES &&
            window.Afterpay.ADDRESS_MODES.ADDRESS_WITH_SHIPPING_OPTIONS
          ) {
            addressMode =
              window.Afterpay.ADDRESS_MODES.ADDRESS_WITH_SHIPPING_OPTIONS;
          } else {
            addressMode = "ADDRESS_WITH_SHIPPING_OPTIONS";
          }

          const targetElement = document.getElementById(
            "afterpay-express-button"
          );
          if (!targetElement) {
            setError("Button element not ready");
            return;
          }

          const availableMethods = Object.keys(window.Afterpay).filter(
            (key) => typeof window.Afterpay[key] === "function"
          );

          let initSuccess = false;

          if (typeof window.Afterpay.initializeForPopup === "function") {
            try {
              const config = {
                countryCode: countryCode,
                target: "#afterpay-express-button",
                addressMode: addressMode,
                buyNow: true,
                onCommenceCheckout: onCommenceCheckout,
                onComplete: onComplete,
                onShippingAddressChange: onShippingAddressChange,
                onShippingOptionChange: onShippingOptionChange,
              };

              window.Afterpay.initializeForPopup(config);
              initSuccess = true;
            } catch (error) {
            }
          }

          if (
            !initSuccess &&
            typeof window.Afterpay.initialize === "function"
          ) {
            try {
              window.Afterpay.initialize({
                countryCode: countryCode,
                onCommenceCheckout: onCommenceCheckout,
                onComplete: onComplete,
                onShippingAddressChange: onShippingAddressChange,
                onShippingOptionChange: onShippingOptionChange,
              });
              initSuccess = true;
            } catch (error) {
            }
          }

          if (!initSuccess && typeof window.Afterpay.redirect === "function") {
            try {
              const button = document.getElementById("afterpay-express-button");
              if (button) {
                button.addEventListener("click", async (e) => {
                  e.preventDefault();

                  try {
                    const token = await createAfterpayToken();
                    const checkoutBaseURL =
                      process.env.AFTERPAY_CHECKOUT ||
                      "https://portal.sandbox.afterpay.com/checkout";
                    const checkoutUrl = `${checkoutBaseURL}/?token=${token}`;
                    window.location.href = checkoutUrl;
                  } catch (error) {
                    setError("Failed to start checkout");
                  }
                });
                initSuccess = true;
              }
            } catch (error) {
            }
          }

          if (!initSuccess) {
            setError(
              "Unable to initialize Afterpay - incompatible API version"
            );
            return;
          }

          setIsInitialized(true);
        } catch (error) {
          setError(
            `Failed to initialize Afterpay: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      };

      checkAfterpay();
    }, 300); // Increased delay to ensure DOM and script are ready

    return () => clearTimeout(initTimer);
  }, [
    isScriptLoaded,
    isInitialized,
    countryCode,
    onCommenceCheckout,
    onComplete,
    onShippingAddressChange,
    onShippingOptionChange,
  ]);

  // Error handler for Afterpay messages
  useEffect(() => {
    if (window.Afterpay && isScriptLoaded) {
      window.Afterpay.onMessage = (payload: any) => {
        if (payload.severity === "error") {
          setError(payload.message);
        } else if (payload.severity === "warning") {
          console.warn("Afterpay warning:", payload.message);
        } else {
        }
      };
    }
  }, [isScriptLoaded]);

  const handleButtonClick = useCallback(async () => {
    if (!isInitialized) {
      setError("Afterpay not ready. Please refresh the page.");
      return;
    }

    if (!window.Afterpay) {
      setError("Afterpay not loaded. Please refresh the page.");
      return;
    }

    try {
      await onCommenceCheckout({
        resolve: (token: string) => {
          const checkoutBaseURL =
            process.env.AFTERPAY_CHECKOUT ||
            "https://portal.sandbox.afterpay.com/checkout";
          window.location.href = `${checkoutBaseURL}/?token=${token}`;
        },
        reject: () => {
          setError("Checkout was cancelled");
        },
      });
    } catch (error) {
      setError("Failed to start checkout");
    }
  }, [isScriptLoaded, isInitialized, loading, onCommenceCheckout]);

  if (items.length === 0) {
    return null;
  }

  if (error) {
    return (
      <div className="p-3 bg-red-50 border border-red-200 rounded text-center">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!isScriptLoaded) {
    return (
      <div className="h-[50px] w-full flex items-center justify-center bg-gray-100 rounded animate-pulse">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
          <span className="text-gray-500 text-sm">Loading Afterpay...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Debug info */}
      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
          Debug: Script: {isScriptLoaded ? "✓" : "✗"} | Init:{" "}
          {isInitialized ? "✓" : "✗"} | Afterpay: {window.Afterpay ? "✓" : "✗"}{" "}
          | Loading: {loading ? "✓" : "✗"}
        </div>
      )}

      <button
        id="afterpay-express-button"
        data-afterpay-entry-point="cart"
        data-afterpay-checkout-button-label="Check out using Afterpay Express"
        disabled={loading || !isInitialized}
        onClick={(e) => {
          e.preventDefault();
          handleButtonClick();
        }}
        className="w-full h-[50px] bg-[#b2fce3] rounded hover:bg-[#9ff2d8] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
        style={{
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "22.75px",
          color: "rgb(38, 38, 38)",
        }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <span>Buy now with</span>
            <span className="font-bold">afterpay</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="28"
              height="28"
              viewBox="0 0 48 48"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="#b2fce3"
                d="M44,24c0,11.044-8.956,20-20,20S4,35.044,4,24S12.956,4,24,4S44,12.956,44,24z"
              ></path>
              <path
                fill="#000100"
                d="M23.913,36.113c-0.714,0.427-1.506,0.637-2.291,0.637c-0.771,0-1.534-0.196-2.235-0.602l-7.159-4.133	c-1.422-0.82-2.256-2.291-2.228-3.937c0.028-1.639,0.904-3.089,2.354-3.86l6.907-3.706c1.415-0.757,3.061-0.75,4.399,0.021	c1.268,0.736,2.059,2.073,2.109,3.58c0.028,0.967-0.729,1.779-1.695,1.807c-0.995,0.028-1.779-0.729-1.807-1.695	c-0.007-0.301-0.133-0.525-0.357-0.658c-0.28-0.161-0.651-0.147-0.995,0.035L14.008,27.3c-0.448,0.245-0.504,0.665-0.504,0.834	c-0.007,0.168,0.035,0.595,0.476,0.848l7.159,4.133c0.441,0.252,0.827,0.077,0.974-0.007c0.147-0.091,0.483-0.35,0.469-0.855	l-0.054-1.228c-0.025-0.558,0.581-0.919,1.06-0.632l1.849,1.107c0.207,0.124,0.342,0.348,0.343,0.59	C25.786,33.945,25.236,35.316,23.913,36.113z"
              ></path>
              <path
                fill="#000100"
                d="M38,20.232c-0.028,1.639-0.911,3.082-2.361,3.86l-6.907,3.706c-0.708,0.378-1.464,0.567-2.214,0.567	c-0.757,0-1.499-0.196-2.165-0.574c-1.261-0.729-2.038-2.059-2.087-3.566c-0.028-0.967,0.729-1.779,1.695-1.807h0.107	c0.955,0,1.644,0.787,1.702,1.741c0.017,0.277,0.128,0.479,0.334,0.599c0.266,0.154,0.63,0.133,0.974-0.049l6.907-3.699	c0.455-0.245,0.504-0.665,0.511-0.834c0-0.175-0.042-0.595-0.483-0.848l-7.152-4.133c-0.441-0.252-0.834-0.077-0.974,0.007	c-0.147,0.091-0.483,0.343-0.469,0.855c0.031,0.441,0.057,0.803,0.078,1.1c0.04,0.57-0.582,0.945-1.067,0.645l-1.848-1.144	c-0.197-0.122-0.328-0.333-0.335-0.564c-0.046-1.551,0.423-3.047,1.842-3.897c1.408-0.841,3.096-0.855,4.525-0.035l7.152,4.133	C37.187,17.115,38.021,18.586,38,20.232z"
              ></path>
            </svg>
          </>
        )}
      </button>

      {/* Afterpay messaging */}
      <div className="text-center text-xs text-gray-600">
        <p>4 interest-free payments of ${(totalAmount / 4).toFixed(2)}</p>
        <p>No fees when you pay on time</p>
      </div>
    </div>
  );
}
