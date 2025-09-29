"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../../ui/button";
import { toast } from "react-hot-toast";
import { decrypt } from "../../utils/decrypt";
import { loadPayPalSDK } from "../../lib/paypal-sdk-loader";

type PayPalCardFieldsProps = {
  onSuccess: () => void;
  onBack: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  items: any[];
  formData: any;
  effectiveGrandTotal: number;
  discountAmount: number;
  voucherCode: string;
};

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalCardFields({
  onSuccess,
  onBack,
  isLoading,
  setIsLoading,
  items,
  formData,
  effectiveGrandTotal,
  discountAmount,
  voucherCode,
}: PayPalCardFieldsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardFieldsComponent, setCardFieldsComponent] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        setLoading(true);
        setError(null);

        const storeId = process.env.NEXT_PUBLIC_STORE_ID;
        const apiBase = process.env.NEXT_PUBLIC_API_URL;
        if (!apiBase || !storeId)
          throw new Error("Missing API URL or STORE_ID");

        // fetch payment settings to get encrypted client id
        const settingsRes = await fetch(`${apiBase}/payment-settings`, {
          cache: "no-store",
        });
        if (!settingsRes.ok)
          throw new Error("Failed to fetch payment settings");
        const settings = await settingsRes.json();
        if (!settings.paypalClientId || !settings.paypalEnabled)
          throw new Error("PayPal not enabled");

        const encryptionKey = "a7b9c2d4e6f8g1h3j5k7m9n2p4q6r8s0";
        const decryptedClientId = decrypt(settings.paypalClientId, encryptionKey);
        
        await loadPayPalSDK(decryptedClientId, ['card-fields']);

        if (!isMounted || !containerRef.current) return;

        const cardFields = window.paypal.CardFields({
          createOrder: async () => {
            try {
              const res = await fetch(`/api/paypal/create-order`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                  items: items.map((i) => ({
                    id: i.product.id,
                    quantity: i.quantity,
                  }))
                }),
              });

              if (!res.ok) {
                throw new Error("Failed to create PayPal order");
              }

              const data = await res.json();
              return data.orderId;
            } catch (error) {
              console.error("PayPal createOrder error:", error);
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
              
              if (!res.ok) throw new Error("Failed to capture PayPal order");
              
              toast.success("Payment successful!");
              onSuccess();
            } catch (error) {
              console.error("PayPal capture error:", error);
              toast.error("Payment failed. Please try again.");
            }
          },
          onError: (err: any) => {
            console.error("PayPal card fields error", err);
            setError("Payment failed. Please try another method.");
            toast.error("Payment failed. Please try again.");
          },
        });

        if (cardFields.isEligible()) {
          const nameField = cardFields.NameField();
          nameField.render("#card-name-field-container");

          const numberField = cardFields.NumberField();
          numberField.render("#card-number-field-container");

          const cvvField = cardFields.CVVField();
          cvvField.render("#card-cvv-field-container");

          const expiryField = cardFields.ExpiryField();
          expiryField.render("#card-expiry-field-container");

          setCardFieldsComponent(cardFields);
        } else {
          throw new Error("PayPal card fields not available");
        }
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to initialize PayPal card fields");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();
    return () => {
      isMounted = false;
    };
  }, [items, formData, effectiveGrandTotal, discountAmount, voucherCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardFieldsComponent) {
      toast.error("Payment form not ready");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await cardFieldsComponent.submit();
    } catch (err: any) {
      console.error("Payment submission error:", err);
      setError("Payment failed. Please check your card details and try again.");
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-10 h-10 border-4 border-gray-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-700 text-sm font-medium">
            Loading PayPal card fields...
          </p>
        </div>
      )}
      
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      
      {!loading && !error && (
        <div className="space-y-4" ref={containerRef}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <div id="card-name-field-container" className="border border-gray-300 rounded-md p-3 min-h-[48px]"></div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <div id="card-number-field-container" className="border border-gray-300 rounded-md p-3 min-h-[48px]"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <div id="card-expiry-field-container" className="border border-gray-300 rounded-md p-3 min-h-[48px]"></div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <div id="card-cvv-field-container" className="border border-gray-300 rounded-md p-3 min-h-[48px]"></div>
            </div>
          </div>
        </div>
      )}
      
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
          disabled={isLoading || loading || !!error}
          className="bg-black hover:bg-black text-white"
        >
          {isLoading ? (
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