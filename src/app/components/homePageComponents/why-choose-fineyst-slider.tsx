
// "use client"

// import { useState, useEffect } from "react"
// import { ChevronLeft, ChevronRight } from "lucide-react"

// const slides = [
//   {
//     id: 1,
//     title: "Unmatched Craftsmanship",
//     description:
//       "Hours of artisan detail go into every jacket. From reinforced stitching to premium hardware, we build jackets that stand the test of time.",
//     features: [
//       "Reinforced stitching techniques",
//       "Premium YKK zippers",
//       "Quality lining materials",
//       "Artisan-level attention to detail",
//     ],
//     imageUrl: "https://jacket.us.com/uploads/2025/craftmanship_banner_2.webp",
//   },
//   {
//     id: 3,
//     title: "Premium Materials",
//     description:
//       "We don't mass-produce. We craft. Every FINEYST jacket starts with ethically sourced full-grain leather, precision cuts, and hours of artisan detail.",
//     features: [
//       "Ethically sourced full-grain leather",
//       "Premium lambskin and suede options",
//       "Distressed finishes for authentic look",
//       "Quality tested for durability",
//     ],
//     imageUrl: "/images/option_1.webp",
//   },
//   {
//     id: 2,
//     title: "Tailored Fit",
//     description:
//       "Whether you're buying a ready-to-wear bomber or designing a custom jacket from scratch, you're investing in precision-crafted fit.",
//     features: [
//       "Standard sizes available",
//       "Made-to-measure options",
//       "Perfect fit guarantee",
//       "Custom sizing consultations",
//     ],
//     imageUrl: "https://jacket.us.com/uploads/2025/Tailored_fit_section_1.webp",
//   },
//   {
//     id: 4,
//     title: "USA Fulfillment",
//     description:
//       "Fast, reliable shipping with hassle-free returns. We stand behind every jacket we make with comprehensive customer support.",
//     features: [
//       "Free shipping across USA",
//       "24-48 hour processing",
//       "14-day easy returns",
//       "Dedicated customer support",
//     ],
//     imageUrl: "/images/usa_fulfillment_banner.webp",
//   },
// ]

// export default function WhyChooseFineystSlider() {
//   const [currentSlide, setCurrentSlide] = useState(0)
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true)

//   useEffect(() => {
//     if (!isAutoPlaying) return

//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length)
//     }, 5000)

//     return () => clearInterval(interval)
//   }, [isAutoPlaying])

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length)
//     setIsAutoPlaying(false)
//   }

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
//     setIsAutoPlaying(false)
//   }

//   const goToSlide = (index: number) => {
//     setCurrentSlide(index)
//     setIsAutoPlaying(false)
//   }

//   return (
//     <section className="py-12 bg-black text-white relative">
//       {/* Full Background Image - Hidden on mobile/tablet */}
//       <div className="absolute inset-0 z-0 hidden md:block">
//         <img 
//           src={slides[currentSlide].imageUrl}
//           alt={slides[currentSlide].title}
//           className="w-full h-full object-contain object-right transition-all duration-500"
//         />
//         {/* Dark overlay for better text readability */}
//         <div className="absolute inset-0 bg-black/10"></div>
//       </div>

//       {/* Background Pattern (on top of image) */}
//       <div className="absolute inset-0 z-10 opacity-10">
//         <div className="absolute inset-0 bg-gradient-to-r from-[#2b2b2b]/20 to-transparent"></div>
//         <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.05%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
//       </div>

//       {/* Full Width Slider Container */}
//       <div className="relative w-full z-20">
//         {/* Navigation Arrows - Different positioning for mobile/desktop */}
//         <button
//           onClick={prevSlide}
//           className="absolute left-5 md:top-1/2 top-[68%] -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-300 group z-30"
//         >
//           <ChevronLeft className="w-5 h-5 text-white group-hover:text-[#2b2b2b]" />
//         </button>
//         <button
//           onClick={nextSlide}
//           className="absolute right-6 md:top-1/2 top-[68%] -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-300 group z-30"
//         >
//           <ChevronRight className="w-5 h-5 text-white group-hover:text-[#2b2b2b]" />
//         </button>

//         {/* Slider Container */}
//         <div className="relative">
//           {/* Main Slide Content */}
//           <div className="min-h-[500px] flex items-center">
//             <div className="container mx-auto px-4">
//               {/* Mobile & Tablet: Vertical Stack */}
//               <div className="md:hidden space-y-6">
//                 {/* Content Above Image */}
//                 <div className="text-center space-y-4 px-4">
//                   <div className="flex items-center justify-center gap-3">
//                     <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight text-center">
//                       {slides[currentSlide].title}
//                     </h2>
//                   </div>

//                   <p className="text-gray-300 leading-relaxed text-center max-w-lg mx-auto">{slides[currentSlide].description}</p>
//                 </div>

//                 {/* Image - Full width rectangular for mobile/tablet */}
//                 <div className="w-full h-64 sm:h-80 bg-gray-800 overflow-hidden">
//                   <img
//                     src={slides[currentSlide].imageUrl}
//                     alt={slides[currentSlide].title}
//                     className="w-full h-full object-cover object-right"
//                   />
//                 </div>

//                 {/* Key Features Below Image - Hidden on mobile and laptop */}
//                 <div className="space-y-2 pt-2 hidden">
//                   <h4 className="text-xl font-semibold text-white">Key Features:</h4>
//                   <div className="space-y-2">
//                     {slides[currentSlide].features.map((feature, index) => (
//                       <div key={index} className="flex items-center space-x-2">
//                         <div className="w-2 h-2 bg-[#2b2b2b] rounded-full flex-shrink-0"></div>
//                         <span className="text-gray-300">{feature}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Desktop: Side-by-side layout (current design) */}
//               <div className="hidden md:grid md:grid-cols-2 gap-8 items-center">
//                 {/* Left Side - Content */}
//                 <div className="text-center md:text-left space-y-4">
//                   <div className="flex items-center gap-3 justify-center md:justify-start">
//                     <h2 className="text-white font-bold text-[2.5rem] leading-none">
//                       {slides[currentSlide].title}
//                     </h2>
//                   </div>

//                   <p className="text-gray-300 leading-relaxed">{slides[currentSlide].description}</p>
                  
//                   {/* Key Features - Only show on desktop screens larger than laptop */}
//                   <div className="space-y-2 pt-2 hidden xl:block">
//                     <h4 className="text-xl font-semibold text-white">Key Features:</h4>
//                     <div className="space-y-2">
//                       {slides[currentSlide].features.map((feature, index) => (
//                         <div key={index} className="flex items-center space-x-2">
//                           <div className="w-2 h-2 bg-[#2b2b2b] rounded-full flex-shrink-0"></div>
//                           <span className="text-gray-300">{feature}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Side - Empty (image is background) */}
//                 <div className="hidden md:block"></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Slide Indicators - Hidden on mobile/tablet, visible on laptop/desktop */}
//         <div className="hidden lg:flex justify-center space-x-2 mt-8 relative z-20">
//           {slides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => goToSlide(index)}
//               className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
//                 index === currentSlide ? "bg-white w-4" : "bg-gray-600 hover:bg-gray-500"
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }