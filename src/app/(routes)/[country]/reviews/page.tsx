
import ReviewsClient from "./reviews-client"

export const metadata = {
  title: "Customer Reviews and Testimonials | Fineyst",
  description: "Read what our customers are saying about their experience with our products and service.",
  alternates: {
    canonical: "https://www.fineystjackets.com/us/reviews"
  }
}

export default function ReviewsPage() {
  return <ReviewsClient />
}
