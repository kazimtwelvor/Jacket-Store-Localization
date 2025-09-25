import type { Metadata } from "next";
import TrackOrderClient from "./TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Order | Fineyst Jackets",
  description: "Track your order with Fineyst Jackets",
  alternates: {
    canonical: "https://www.fineystjackets.com/us/track-order"
  }
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
