import type { Metadata } from "next";
import TrackOrderClient from "./TrackOrderClient";

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const { country: countryCode } = params;
  
  return {
    title: "Track Your Order Status | Fineyst Jackets",
    description: "Track your FINEYST order in real-time with our secure tracking system. Get instant updates on shipping status, delivery estimates, and package location. Enter your order number now.",
    alternates: {
      canonical: `https://www.fineystjackets.com/${countryCode}/track-order`
    }
  };
}

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
