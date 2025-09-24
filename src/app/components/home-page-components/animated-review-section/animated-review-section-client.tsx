"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { avertaBlack, avertaBold } from "@/src/lib/fonts";

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  text: string;
  image: string;
}

interface AnimatedReviewSectionClientProps {
  reviews: Review[];
}

const ReviewCard = ({ review, showH3 = true }: { review: Review; showH3?: boolean }) => {
  const router = useRouter();

  return (
    <section
      className="bg-[#F6F6F6] p-8 rounded-lg shadow-md mx-6 my-6 flex flex-col justify-center h-[200px] sm:h-[220px] md:h-[240px] cursor-pointer hover:scale-105 hover:shadow-lg"
      style={{ minWidth: '350px', width: '55vw', maxWidth: '650px' }}
      onClick={() => router.push("/reviews")}
      role="button"
      tabIndex={0}
      aria-label={`Read review by ${review.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          router.push("/reviews");
        }
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-left ">
          <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
            <Image src={review.image || "/placeholder.svg"} alt={review.name} fill className="object-cover" />
          </div>
          <div>
            <div className="flex mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < review.rating ? "text-[#1B1B1B] fill-[#1B1B1B]" : "text-gray-600"} />
              ))}
            </div>
            {showH3 ? (
              <div className="font-extrabold text-black " style={{ fontFamily: 'AvertaPe, sans-serif' }}>{review.name.toUpperCase()}</div>
            ) : (
              <div className="font-extrabold text-black" style={{ fontFamily: 'AvertaPe, sans-serif' }}>{review.name.toUpperCase()}</div>
            )}
          </div>
        </div>
        <div className="relative w-20 h-12">
          <Image src="/images/reviews/google-trusted-badge.png" alt="Google Trusted Reviews" fill className="object-contain" />
        </div>
      </div>
      <div className="mb-3 mt-3">
        <div className="flex items-center text-sm w-fit gap-2">
          <div className="relative w-5 h-5">
            <svg className="w-5 h-5 text-[#1B1B1B]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5.83l-2.83-2.83-1.41 1.41L12 17.17l6.24-6.24-1.41-1.41L12 14.17z" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor" strokeWidth="4">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          </div>
          <span className={`text-black ${avertaBold.className}`}>Verified buyer</span>
        </div>
      </div>
      <div className="flex-grow flex items-center">
        <p className="text-black text-sm line-clamp-4">{review.text}</p>
      </div>
    </section>
  );
};

export default function AnimatedReviewSectionClient({ reviews }: AnimatedReviewSectionClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (isMounted && isMobile) {
      const forceAnimation = () => {
        if (topRowRef.current) {
          topRowRef.current.style.animationPlayState = 'running';
        }
        if (bottomRowRef.current) {
          bottomRowRef.current.style.animationPlayState = 'running';
        }
      };

      forceAnimation();

      const handleVisibilityChange = () => {
        if (!document.hidden) {
          setTimeout(forceAnimation, 100);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', forceAnimation);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', forceAnimation);
      };
    }
  }, [isMounted, isMobile]);

  if (!isMounted) {
    return (
      <div className="py-16 bg-[#EAEAEA]">
        <div className="container mx-auto px-4">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-black">OUR PRODUCTS BACKED BY INCREDIBLE REVIEWS</div>
          <p className="text-center text-black mb-12">Verified Feedback From Authentic Customers</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((review) => (
              <div key={review.id} className="bg-[#1a1a1a] p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image src={review.image || "/placeholder.svg"} alt={review.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{review.name}</h3>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? "text-[#1B1B1B] fill-[#1B1B1B]" : "text-gray-600"}
                    />
                  ))}
                </div>
                <p className="text-gray-300 text-sm">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-[#EAEAEA] overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center text-black mb-2 ${avertaBlack.className}`}>OUR PRODUCTS BACKED BY INCREDIBLE REVIEWS</h2>
        <p className="text-center text-gray-600 mb-12">Verified Feedback from Authentic Customers</p>
      </div>

      <div className="relative mb-4 md:mb-8 overflow-hidden">
        <div
          ref={topRowRef}
          className="flex animate-scroll-left"
          style={{
            willChange: "transform",
            animation: "scroll-left 30s linear infinite",
            animationPlayState: "running",
          }}
        >
          {[...reviews, ...reviews].map((review, index) => {
            const isFirstInstance = index < reviews.length;
            return (
              <ReviewCard
                key={`top-${review.id}-${index}`}
                review={review}
                showH3={isFirstInstance}
              />
            );
          })}
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={bottomRowRef}
          className="flex animate-scroll-right"
          style={{
            willChange: "transform",
            animation: "scroll-right 30s linear infinite",
            animationPlayState: "running",
          }}
        >
          {[...reviews.slice(4), ...reviews.slice(0, 4), ...reviews.slice(4), ...reviews.slice(0, 4)].map(
            (review, index) => {
              const isFirstInstance = index < 8;
              return (
                <ReviewCard
                  key={`bottom-${review.id}-${index}`}
                  review={review}
                  showH3={false}
                />
              );
            }
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        
        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }
      `}</style>
    </section>
  );
}

