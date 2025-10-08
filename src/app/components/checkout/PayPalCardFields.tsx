"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Shield, CreditCard } from "lucide-react";
import Button from "../../ui/button";
import { toast } from "react-hot-toast";
import { loadPayPalSDK } from "../../lib/paypal-sdk-loader";

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalCardFieldsProps {
  orderId: string;
  onSuccess: () => void;
  onBack: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  totalAmount: number;
  items: Array<{ id: string; product: { id: string }; quantity: number }>;
}

export default function PayPalCardFields({
  orderId,
  onSuccess,
  onBack,
  isLoading,
  setIsLoading,
  totalAmount,
  items,
}: PayPalCardFieldsProps) {
  const [cardFields, setCardFields] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const cardNumberRef = useRef<HTMLDivElement>(null);
  const expiryDateRef = useRef<HTMLDivElement>(null);
  const cvvRef = useRef<HTMLDivElement>(null);
  const cardholderNameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function initPayPalCardFields() {
      try {
        setIsLoading(true);
        setError(null);

        const storeId = process.env.NEXT_PUBLIC_STORE_ID;
        const apiBase = process.env.NEXT_PUBLIC_API_URL;
        if (!apiBase || !storeId) {
          throw new Error("Missing API URL or STORE_ID");
        }

        const settingsRes = await fetch(`${apiBase}/payment-settings`, {
          cache: "no-store",
        });
        
        if (!settingsRes.ok) {
          const errorText = await settingsRes.text();
          throw new Error(`Failed to fetch payment settings: ${settingsRes.status}`);
        }
        
        const settings = await settingsRes.json();
        
        if (!settings.paypalClientId || !settings.paypalEnabled) {
          throw new Error("PayPal not enabled or client ID not available");
        }

        const clientId = process.env.PAYPAL_CLIENT_ID || 
          "AeKwi5cd2n548mXRZMVpMtOqVpJn2gv8kO5h4Q8xgK9upG14c5zyYo7LJHnx9BNMI-GqknLfJbYxQHnm";

        await loadPayPalSDK(clientId, ['card-fields']);

        if (!isMounted || !window.paypal) return;

        // Initialize PayPal Card Fields
        const fields = window.paypal.CardFields({
          createOrder: async () => {
            try {
              const orderData = {
                items: items.map((item) => ({
                  id: item.product.id,
                  quantity: item.quantity
                }))
              };
              
              
              const res = await fetch(`/api/paypal/create-order`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
              });


              if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to create PayPal order: ${res.status} - ${errorText}`);
              }

              const data = await res.json();
              return data.orderId;
            } catch (error) {
              throw error;
            }
          },
          onApprove: async (data: any) => {
            try {
              const res = await fetch(`/api/paypal/capture-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID: data.orderID }),
              });
              
              if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`PayPal capture failed: ${JSON.stringify(errorData)}`);
              }
              
              const captureData = await res.json();
              toast.success("Payment successful!");
              onSuccess();
            } catch (error) {
              toast.error("Payment failed. Please try again.");
            }
          },
          onError: (err: any) => {
            setError("Payment failed. Please check your card details and try again.");
            toast.error("Payment failed. Please try again.");
          },
        });

        if (isMounted) {
          setCardFields(fields);
          
          if (cardNumberRef.current) {
            fields.CardNumber().render(cardNumberRef.current);
          }
          if (expiryDateRef.current) {
            fields.ExpiryDate().render(expiryDateRef.current);
          }
          if (cvvRef.current) {
            fields.CVV().render(cvvRef.current);
          }
          if (cardholderNameRef.current) {
            fields.CardholderName().render(cardholderNameRef.current);
          }
        }
      } catch (e: any) {
        setError(e.message || "Failed to initialize PayPal card fields");
        toast.error("Failed to load payment form. Please try again.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initPayPalCardFields();

    return () => {
      isMounted = false;
    };
  }, [orderId, totalAmount, onSuccess, setIsLoading, items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardFields) {
      toast.error("Payment form not ready. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await cardFields.submit();
    } catch (err) {
      setError("Payment failed. Please try again.");
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name *
          </label>
          <div 
            ref={cardholderNameRef}
            className="border rounded-md p-3 border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number *
          </label>
          <div 
            ref={cardNumberRef}
            className="border rounded-md p-3 border-gray-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date *
            </label>
            <div 
              ref={expiryDateRef}
              className="border rounded-md p-3 border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV *
            </label>
            <div 
              ref={cvvRef}
              className="border rounded-md p-3 border-gray-300"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <div className="flex items-center">
          <Shield className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-sm text-gray-700">
            Your payment information is secure. We use PayPal's secure card processing.
          </span>
        </div>
      </div>

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
          disabled={isLoading || !cardFields || isSubmitting}
          className="bg-black hover:bg-black text-white"
        >
          {isSubmitting ? (
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
  );
}
