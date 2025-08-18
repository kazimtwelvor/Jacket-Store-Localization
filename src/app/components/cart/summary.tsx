"use client";

"use client"

import Button from "@/src/app/ui/button"
import Currency from "@/src/app/ui/currency"
import { useCart } from "@/src/app/contexts/CartContext"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

const Summary = () => {
  const searchParams = useSearchParams();
  const { items, clearCart } = useCart();
  const totalPrice = items.reduce(
    (total, item) => total + Number(item.price),
    0
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      clearCart();
    }
    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, clearCart]);

  const onCheckout = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productIds: items.map((item) => item.id),
          paymentMethod: "stripe",
        }),
      })

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const data = await response.json();

      if (data.url) {
        router.push(data.url);
      } else {
        router.push("/checkout/success")
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 py-6 mt-16 rounded-lg bg-gray-50 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-base font-medium text-gray-400">Order Total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button disabled={items.length === 0 || loading} className="w-full mt-6" onClick={onCheckout}>
        Checkout
      </Button>
    </section>
  )
}

export default Summary;
