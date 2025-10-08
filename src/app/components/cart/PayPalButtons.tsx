"use client";

import { useEffect, useRef, useState } from "react";
import { decrypt } from "../../utils/decrypt";
import { loadPayPalSDK } from "../../lib/paypal-sdk-loader";

type CartItem = {
  id: string;
  quantity: number;
};

type PayPalButtonsProps = {
  items: CartItem[];
  onApproveSuccess: (orderId?: string) => void;
  orderId?: string;
};

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalButtons({
  items,
  onApproveSuccess,
  orderId,
}: PayPalButtonsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        await loadPayPalSDK(decryptedClientId, ['buttons']);

        if (!isMounted || !containerRef.current) return;

        window?.paypal
          ?.Buttons({
            style: {
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "paypal",
            },
            funding: {
              allowed: [
                window.paypal.FUNDING.PAYPAL,
                window.paypal.FUNDING.PAYLATER,
                window.paypal.FUNDING.CARD,
              ],
              disallowed: [window.paypal.FUNDING.VENMO],
            },
            createOrder: async () => {
              try {
                const res = await fetch(`/api/paypal/create-order`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ items }),
                });
                if (!res.ok) {
                  const errorText = await res.text();
                  throw new Error(
                    `Failed to create PayPal order: ${res.status}`
                  );
                }
                const data = await res.json();
                return data.orderId;
              } catch (error) {
                throw error;
              }
            },
            onApprove: async (data: any) => {
              const res = await fetch(`/api/paypal/capture-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID: data.orderID, orderId }),
              });
              if (!res.ok) throw new Error("Failed to capture PayPal order");
              onApproveSuccess(data.orderID);
            },
            onError: (err: any) => {
              setError("PayPal failed. Please try another method.");
            },
          })
          .render(containerRef.current);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to initialize PayPal");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();
    return () => {
      isMounted = false;
    };
  }, [items]);

  return (
    <div>
      {loading && <div className="text-sm text-gray-600">Loading PayPal…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div ref={containerRef} />
    </div>
  );
}
