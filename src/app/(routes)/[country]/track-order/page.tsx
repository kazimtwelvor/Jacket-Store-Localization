import type { Metadata } from "next";
import TrackOrderClient from "./TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order Status | Fineyst Jackets",
  description: "Track your FINEYST order in real-time with our secure tracking system. Get instant updates on shipping status, delivery estimates, and package location. Enter your order number now.",
  alternates: {
    canonical: "https://www.fineystjackets.com/us/track-order"
  }
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
