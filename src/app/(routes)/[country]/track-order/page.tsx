import type { Metadata } from "next";
import TrackOrderClient from "./TrackOrderClient";
import { generateHreflangLinks, getCanonicalUrl } from "@/src/lib/hreflang-helper";

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const { country: countryCode } = params;
  
  return {
    title: "Track Your Order Status | Fineyst Jackets",
    description: "Track your FINEYST order in real-time with our secure tracking system. Get instant updates on shipping status, delivery estimates, and package location. Enter your order number now.",
    alternates: {
      canonical: getCanonicalUrl(countryCode, '/track-order'),
      languages: generateHreflangLinks({ path: '/track-order', currentCountry: countryCode })
    }
  };
}

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
