"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductPageClient() {
  const router = useRouter();
  
  useEffect(() => {
    if (typeof window !== 'undefined' && document.referrer.includes('/us/shop')) {
      sessionStorage.setItem('lastShopUrl', document.referrer);
    }
  }, []);
  
  return null;
}