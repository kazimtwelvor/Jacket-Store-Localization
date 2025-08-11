"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductPageClient() {
  const router = useRouter();
  
  useEffect(() => {
    // Store the referrer URL when the product page loads
    if (typeof window !== 'undefined' && document.referrer.includes('/shop')) {
      sessionStorage.setItem('lastShopUrl', document.referrer);
    }
  }, []);
  
  return null;
}