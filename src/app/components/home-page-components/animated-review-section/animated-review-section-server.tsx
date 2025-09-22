import { unstable_cache } from "next/cache";
import AnimatedReviewSectionClient from "@/src/app/components/home-page-components/animated-review-section/animated-review-section-client";

export const revalidate = 3600;

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  text: string;
  image: string;
}

const getCachedReviewData = unstable_cache(
  async (): Promise<Review[]> => {
    return [
      {
        id: 1,
        name: "Sarah J.",
        rating: 5,
        date: "May 15, 2023",
        text: "This jacket is absolutely stunning. The stitching and material feel premium, and it keeps me warm without being bulky.",
        image: "/images/reviews/sarah-j.webp",
      },
      {
        id: 2,
        name: "Michael T.",
        rating: 5,
        date: "April 3, 2023",
        text: "Super fast delivery and the jacket fits like it was tailored for me. I'm already eyeing another one in a different color.",
        image: "/images/reviews/michael-t.webp",
      },
      {
        id: 3,
        name: "Emma R.",
        rating: 4,
        date: "June 20, 2023",
        text: "Love the look and feel of this jacket. I just wish there were more lightweight options for spring.",
        image: "/images/reviews/emma-r.webp",
      },
      {
        id: 4,
        name: "David L.",
        rating: 5,
        date: "March 12, 2023",
        text: "The craftsmanship on this jacket is next level. The inner lining and zipper quality really stand out.",
        image: "/images/reviews/david-l.webp",
      },
      {
        id: 5,
        name: "Jessica M.",
        rating: 5,
        date: "July 8, 2023",
        text: "I've received compliments every time I wear this jacket. It's stylish, functional, and feels luxurious.",
        image: "/images/reviews/jessica-m.webp",
      },
      {
        id: 6,
        name: "Robert K.",
        rating: 5,
        date: "February 28, 2023",
        text: "Had a sizing issue and the support team was incredibly helpful with the exchange. Love my new jacket!",
        image: "/images/reviews/robert-k.webp",
      },
      {
        id: 7,
        name: "Olivia P.",
        rating: 4,
        date: "August 5, 2023",
        text: "The jacket is cozy and perfect for chilly mornings. Only downside is it runs slightly big.",
        image: "/images/reviews/olivia-p.webp",
      },
      {
        id: 8,
        name: "James H.",
        rating: 5,
        date: "January 17, 2023",
        text: "This is hands down the best jacket I've ever owned. Sleek design and it pairs well with everything.",
        image: "/images/reviews/james-h.webp",
      },
      {
        id: 9,
        name: "Alex M.",
        rating: 5,
        date: "September 10, 2023",
        text: "Outstanding quality and craftsmanship. The jacket exceeded my expectations in every way!",
        image: "/images/reviews/alex-m.webp",
      },
      {
        id: 10,
        name: "Sophia L.",
        rating: 4,
        date: "October 22, 2023",
        text: "Elegant design and very comfortable to wear. Would love to see more color options in this style.",
        image: "/images/reviews/sophia-l.webp",
      },
      {
        id: 11,
        name: "Ryan K.",
        rating: 5,
        date: "November 5, 2023",
        text: "Perfect jacket for both casual outings and more dressed-up looks. Super versatile.",
        image: "/images/reviews/ryan-k.webp",
      },
      {
        id: 12,
        name: "Maya S.",
        rating: 5,
        date: "December 1, 2023",
        text: "Impressed by the sustainable materials used. It's warm, stylish, and environmentally friendly!",
        image: "/images/reviews/maya-s.webp",
      },
      {
        id: 13,
        name: "Ethan W.",
        rating: 4,
        date: "December 15, 2023",
        text: "Great value for the price. The fit is spot-on and it's become a staple in my wardrobe.",
        image: "/images/reviews/ethan-w.webp",
      },
      {
        id: 14,
        name: "Zoe P.",
        rating: 5,
        date: "January 3, 2024",
        text: "Absolutely in love with this jacket! It's comfortable, stylish, and arrived in perfect condition.",
        image: "/images/reviews/zoe-p.webp",
      },
      {
        id: 15,
        name: "Noah B.",
        rating: 5,
        date: "January 20, 2024",
        text: "This jacket goes with everything. I wear it almost daily and it still looks brand new.",
        image: "/images/reviews/noah-b.webp",
      },
      {
        id: 16,
        name: "Ava R.",
        rating: 4,
        date: "February 8, 2024",
        text: "Fantastic customer service and the jacket is top quality. I'll definitely be back for more.",
        image: "/images/reviews/ava-r.webp",
      },
    ];
  },
  ['animated-reviews'],
  { revalidate: 3600, tags: ['reviews'] }
);

export default async function AnimatedReviewSectionServer() {
  const reviews = await getCachedReviewData();

  return <AnimatedReviewSectionClient reviews={reviews} />;
}
