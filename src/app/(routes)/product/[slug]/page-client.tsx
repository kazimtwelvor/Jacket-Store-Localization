"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useViewTracking } from "@/src/app/hooks/use-view-tracking";
import { getStoreId, isTrackingEnabled } from "@/src/app/utils/store-config";

interface ProductPageClientProps {
  productId?: string;
}

export default function ProductPageClient({ productId }: ProductPageClientProps) {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  
  useEffect(() => {
    if (typeof window !== 'undefined' && document.referrer.includes('/us/shop')) {
      sessionStorage.setItem('lastShopUrl', document.referrer);
    }
  }, []);

  // Track product view
  const { trackView, hasTracked } = useViewTracking({
    storeId: getStoreId(),
    entityId: productId || slug || '',
    entityType: 'product',
    enabled: isTrackingEnabled() && !!(productId || slug),
    delay: 2000 // Track after 2 seconds to ensure user is actually viewing
  });

  // Optional: Track view when component mounts (alternative to auto-tracking)
  useEffect(() => {
    if (productId || slug) {
      // The hook will auto-track, but we can also manually trigger if needed
      console.log('Product page loaded, tracking will start automatically');
    }
  }, [productId, slug]);

  return null;
}