"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { avertaBlack, avertaBold } from "@/src/lib/fonts"

const reviews = [
    {
        id: 1,
        name: "Sarah J.",
        rating: 5,
        date: "May 15, 2023",
        text: "The quality of these clothes is exceptional! I've been wearing the jeans for months and they still look brand new.",
        image: "/images/reviews/sarah-j.webp",
    },
    {
        id: 2,
        name: "Michael T.",
        rating: 5,
        date: "April 3, 2023",
        text: "Fast shipping and the fit is perfect. Will definitely be ordering more items soon!",
        image: "/images/reviews/michael-t.webp",
    },
    {
        id: 3,
        name: "Emma R.",
        rating: 4,
        date: "June 20, 2023",
        text: "Love the style and comfort of their t-shirts. The only reason for 4 stars is that I wish they had more color options.",
        image: "/images/reviews/emma-r.webp",
    },
    {
        id: 4,
        name: "David L.",
        rating: 5,
        date: "March 12, 2023",
        text: "The attention to detail in these clothes is amazing. Worth every penny!",
        image: "/images/reviews/david-l.webp",
    },
    {
        id: 5,
        name: "Jessica M.",
        rating: 5,
        date: "July 8, 2023",
        text: "I've received so many compliments on my new dress. The fabric is high quality and the design is unique.",
        image: "/images/reviews/jessica-m.webp",
    },
    {
        id: 6,
        name: "Robert K.",
        rating: 5,
        date: "February 28, 2023",
        text: "Great customer service! Had an issue with sizing and they helped me exchange it with no hassle.",
        image: "/images/reviews/robert-k.webp",
    },
    {
        id: 7,
        name: "Olivia P.",
        rating: 4,
        date: "August 5, 2023",
        text: "The sweater I ordered is so cozy and stylish. Perfect for fall weather!",
        image: "/images/reviews/olivia-p.webp",
    },
    {
        id: 8,
        name: "James H.",
        rating: 5,
        date: "January 17, 2023",
        text: "These are the best fitting jeans I've ever owned. Will be buying more pairs in different colors.",
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
        text: "Beautiful design and comfortable fit. The material feels premium and looks elegant.",
        image: "/images/reviews/sophia-l.webp",
    },
    {
        id: 11,
        name: "Ryan K.",
        rating: 5,
        date: "November 5, 2023",
        text: "Perfect for both casual and formal occasions. The versatility of this piece is amazing.",
        image: "/images/reviews/ryan-k.webp",
    },
    {
        id: 12,
        name: "Maya S.",
        rating: 5,
        date: "December 1, 2023",
        text: "Love the attention to detail and the sustainable materials used. Highly recommend!",
        image: "/images/reviews/maya-s.webp",
    },
    {
        id: 13,
        name: "Ethan W.",
        rating: 4,
        date: "December 15, 2023",
        text: "Great value for money. The fit is perfect and the style is exactly what I was looking for.",
        image: "/images/reviews/ethan-w.webp",
    },
    {
        id: 14,
        name: "Zoe P.",
        rating: 5,
        date: "January 3, 2024",
        text: "Absolutely love this purchase! The quality is exceptional and it arrived quickly.",
        image: "/images/reviews/zoe-p.webp",
    },
    {
        id: 15,
        name: "Noah B.",
        rating: 5,
        date: "January 20, 2024",
        text: "This has become my go-to piece. The comfort and style combination is unbeatable.",
        image: "/images/reviews/noah-b.webp",
    },
    {
        id: 16,
        name: "Ava R.",
        rating: 4,
        date: "February 8, 2024",
        text: "Really impressed with the quality and the customer service. Will definitely shop here again.",
        image: "/images/reviews/ava-r.webp",
    },
]

const ReviewCard = ({ review, showH3 = true }: { review: (typeof reviews)[0]; showH3?: boolean }) => {
    const router = useRouter()

    return (
        <section
            className="bg-[#F6F6F6] p-8 rounded-lg shadow-md mx-6 my-6 flex flex-col justify-center h-[200px] sm:h-[220px] md:h-[240px] cursor-pointer  hover:scale-105 hover:shadow-lg"
            style={{ minWidth: '350px', width: '55vw', maxWidth: '650px' }}
            onClick={() => router.push("/reviews")}
            role="button"
            tabIndex={0}
            aria-label={`Read review by ${review.name}`}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    router.push("/reviews")
                }
            }}
        >
            <section className="flex justify-between items-center mb-4">
                <section className="flex items-left ">
                    <section className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                        <Image src={review.image || "/placeholder.svg"} alt={review.name} fill className="object-cover" />
                    </section>
                    <section>
                        <section className="flex mb-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className={i < review.rating ? "text-[#1B1B1B] fill-[#1B1B1B]" : "text-gray-600"} />
                            ))}
                        </section>
                        {showH3 ? (
                            <section className="font-extrabold text-black " style={{ fontFamily: 'AvertaPe, sans-serif' }}>{review.name.toUpperCase()}</section>
                        ) : (
                            <section className="font-extrabold text-black" style={{ fontFamily: 'AvertaPe, sans-serif' }}>{review.name.toUpperCase()}</section>
                        )}
                    </section>
                </section>
                <section className="relative w-20 h-12">
                    <Image src="/images/reviews/google-trusted-badge.png" alt="Google Trusted Reviews" fill className="object-contain" />
                </section>
            </section>
            <section className="mb-3 mt-3">
                <section className="flex items-center text-sm w-fit gap-2">
                    <section className="relative w-5 h-5">
                        <svg className="w-5 h-5 text-[#1B1B1B]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5.83l-2.83-2.83-1.41 1.41L12 17.17l6.24-6.24-1.41-1.41L12 14.17z" />
                        </svg>
                        <section className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor" strokeWidth="4">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        </section>
                    </section>
                    <span className={`text-black ${avertaBold.className}`}>Verified buyer</span>
                </section>
            </section>
            <section className="flex-grow flex items-center">
                <p className="text-black text-sm line-clamp-4">{review.text}</p>
            </section>
        </section>
    )
}

export default function AnimatedReviewsSection() {
    const [isMounted, setIsMounted] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const topRowRef = useRef<HTMLDivElement>(null)
    const bottomRowRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setIsMounted(true)
        setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }, [])

    useEffect(() => {
        if (isMounted && isMobile) {
            const forceAnimation = () => {
                if (topRowRef.current) {
                    topRowRef.current.style.animationPlayState = 'running'
                }
                if (bottomRowRef.current) {
                    bottomRowRef.current.style.animationPlayState = 'running'
                }
            }

            forceAnimation()

            const handleVisibilityChange = () => {
                if (!document.hidden) {
                    setTimeout(forceAnimation, 100)
                }
            }

            document.addEventListener('visibilitychange', handleVisibilityChange)
            window.addEventListener('focus', forceAnimation)

            return () => {
                document.removeEventListener('visibilitychange', handleVisibilityChange)
                window.removeEventListener('focus', forceAnimation)
            }
        }
    }, [isMounted, isMobile])

    if (!isMounted) {
        return (
            <section className="py-16 bg-[#EAEAEA]">
                <section className="container mx-auto px-4">
                    <section className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-black">OUR PRODUCTS BACKED BY INCREDIBLE REVIEWS</section>
                    <p className="text-center text-black mb-12">Verified Feedback From Authentic Customers</p>
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.slice(0, 6).map((review) => (
                            <section key={review.id} className="bg-[#1a1a1a] p-6 rounded-lg shadow-md">
                                <section className="flex items-center mb-4">
                                    <section className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                                        <Image src={review.image || "/placeholder.svg"} alt={review.name} fill className="object-cover" />
                                    </section>
                                    <section>
                                        <h3 className="font-semibold text-white">{review.name}</h3>
                                        <p className="text-xs text-gray-400">{review.date}</p>
                                    </section>
                                </section>
                                <section className="flex mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={i < review.rating ? "text-[#1B1B1B] fill-[#1B1B1B]" : "text-gray-600"}
                                        />
                                    ))}
                                </section>
                                <p className="text-gray-300 text-sm">{review.text}</p>
                            </section>
                        ))}
                    </section>
                </section>
            </section>
        )
    }

    return (
        <section className="py-16 bg-[#EAEAEA] overflow-hidden">
            <section className="container mx-auto px-4 mb-12">
                <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center text-black mb-2 ${avertaBlack.className}`}>OUR PRODUCTS BACKED BY INCREDIBLE REVIEWS</h2>
                <p className="text-center text-gray-600 mb-12">Verified Feedback from Authentic Customers</p>
            </section>

            <section className="relative mb-4 md:mb-8 overflow-hidden">
                <section
                    ref={topRowRef}
                    className="flex animate-scroll-left"
                    style={{
                        willChange: "transform",
                        animation: "scroll-left 30s linear infinite",
                        animationPlayState: "running",
                    }}
                >
                    {[...reviews, ...reviews].map((review, index) => {
                        const isFirstInstance = index < reviews.length
                        return (
                            <ReviewCard
                                key={`top-${review.id}-${index}`}
                                review={review}
                                showH3={isFirstInstance}
                            />
                        )
                    })}
                </section>
            </section>

            <section className="relative overflow-hidden">
                <section
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
                            const isFirstInstance = index < 8
                            return (
                                <ReviewCard
                                    key={`bottom-${review.id}-${index}`}
                                    review={review}
                                    showH3={false}
                                />
                            )
                        }
                    )}
                </section>
            </section>

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
    )
}
