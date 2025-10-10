"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useViewTracking } from "@/src/app/hooks/use-view-tracking";
import { getStoreId, isTrackingEnabled } from "@/src/app/utils/store-config";
import { trackViewContent } from "@/src/app/lib/analytics";

interface ProductPageClientProps {
  productId?: string;
  product?: any;
}

export default function ProductPageClient({ productId, product }: ProductPageClientProps) {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  
  useEffect(() => {
    if (typeof window !== 'undefined' && document.referrer.includes('/us/shop')) {
      sessionStorage.setItem('lastShopUrl', document.referrer);
    }
  }, []);

  const { trackView, hasTracked } = useViewTracking({
    storeId: getStoreId(),
    entityId: productId || slug || '',
    entityType: 'product',
    enabled: isTrackingEnabled() && !!(productId || slug),
    delay: 2000 // Track after 2 seconds to ensure user is actually viewing
  });

  useEffect(() => {
    if (productId || slug) {
    }
  }, [product]);

  return null;
}