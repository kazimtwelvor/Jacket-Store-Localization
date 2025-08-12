

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export default function WelcomeAccordionSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const contentRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [readMoreExpanded, setReadMoreExpanded] = useState(false)

  const [accordions, setAccordions] = useState({
    expensive: false,
    bestLeather: false,
    rightStyle: false,
    colors: false,
  })

  const toggleAccordion = (key: string) => {
    setAccordions((prev) => ({
      ...prev,
      [key]: !(prev as any)[key],
    }))
  }

  const toggleMainAccordion = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setIsExpanded(!isExpanded)
    setTimeout(() => {
      setIsAnimating(false)
    }, 700)
  }

  return (
    <section className="w-full pt-4 sm:pt-5 lg:pt-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-6">

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2b2b2b] mb-3 sm:mb-4 leading-tight">
            WELCOME TO FINEYST
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 max-w-3xl mx-auto mb-3 sm:mb-4 px-2 sm:px-0">
            Your Destination for Timeless, Custom, and Everyday Leather Jackets
          </p>

          {/* V-Shape Arrow Toggle Button */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <button
              onClick={toggleMainAccordion}
              className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-all duration-300 focus:outline-none active:scale-95"
              aria-expanded={isExpanded}
              aria-controls="accordion-content"
            >
              <ChevronDown
                className={`w-6 h-5 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-500 ease-in-out ${isExpanded ? "rotate-180" : ""
                  }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Expandable Content */}
        <div
          id="accordion-content"
          className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          style={{
            maxHeight: isExpanded ? "none" : "0px",
          }}
          aria-hidden={!isExpanded}
        >
          <div className=" rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Hero Content */}
              <div className="text-center mb-8 sm:mb-10">
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-0 px-2 sm:px-0">
                  At FINEYST, we craft authentic leather jackets with real cowhide, lambskin, goatskin, and suede—built for durability, comfort, and lasting style.
                  {!readMoreExpanded && (
                    <button
                      onClick={() => setReadMoreExpanded(true)}
                      className="ml-1 text-black font-medium underline hover:opacity-80 transition"
                    >
                      Read more
                    </button>
                  )}
                </p>

                {/* Hidden paragraphs */}
                <div className={`transition-all duration-500 ${readMoreExpanded ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 overflow-hidden opacity-0"} px-2 sm:px-0`}>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
                    Explore biker, bomber, custom, cropped, and trench styles in men's, women's, and unisex fits. Choose from classic black, deep brown, or standout shades like burgundy, olive, and distressed finishes.
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-8">
                    Each jacket is hand-finished to wear well and age even better.
                  </p>
                </div>
              </div>

              {/* Educational Accordions */}
              <div className="mb-8 sm:mb-10">
                <h3 className="text-base sm:text-lg text-black mb-4 sm:mb-6 text-center px-2 sm:px-0">
                  Things to Know About Leather Jackets
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  {/* Why Expensive Accordion */}
                  <div className="rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleAccordion("expensive")}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none active:bg-gray-300"
                      aria-expanded={accordions.expensive}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm sm:text-base text-gray-800 pr-2">Why Are Leather Jackets Expensive?</h4>
                        <ChevronDown
                          className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${accordions.expensive ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${accordions.expensive ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <div className="px-4 sm:px-6 py-3 sm:py-4">
                        <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                          A real leather jacket is more than a garment — it's an investment. Here's why prices vary:
                        </p>
                        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>High-Quality Leather:</strong> Full-grain cowhide and lambskin are premium hides
                              that last for years, age beautifully, and offer unmatched strength and texture.
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Skilled Craftsmanship:</strong> Our jackets are handmade by expert artisans using
                              traditional methods — precision cutting, reinforced stitching, and detailed finishing.
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Time-Intensive Production:</strong> From ethical sourcing to tanning to
                              construction, each jacket takes time — especially for complex or custom pieces.
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Hardware & Lining Quality:</strong> We only use durable zippers, breathable
                              linings, and solid inner structure — because longevity matters.
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Brand Transparency:</strong> Unlike fast fashion, we don't cut corners — FINEYST
                              prioritizes real leather, ethical labor, and transparent practices.
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Best Leather Accordion */}
                  <div className="rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleAccordion("bestLeather")}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none active:bg-gray-300"
                      aria-expanded={accordions.bestLeather}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm sm:text-base text-gray-800 pr-2">What's the Best Leather for Jackets?</h4>
                        <ChevronDown
                          className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${accordions.bestLeather ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${accordions.bestLeather ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <div className="px-4 sm:px-6 py-3 sm:py-4">
                        <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">It depends on the fit, feel, and use case:</p>
                        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Cowhide:</strong> Rugged, weather-resistant, ideal for biker and bomber jackets.
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Lambskin:</strong> Lightweight, buttery soft, best for fitted and everyday wear.
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Goatskin:</strong> Durable and flexible with a pebbled finish.
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Suede:</strong> Smooth, matte texture for streetwear or vintage aesthetics.
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Distressed & Washed Leathers:</strong> Adds character and edge with worn-in looks.
                            </div>
                          </li>
                        </ul>
                        <p className="text-[#b01e23] font-semibold mt-3 sm:mt-4 text-sm sm:text-base">
                          At FINEYST, we use only full-grain hides — no PU or bonded leather. Every jacket is made to
                          endure.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Style Accordion */}
                  <div className="rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleAccordion("rightStyle")}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none active:bg-gray-300"
                      aria-expanded={accordions.rightStyle}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm sm:text-base text-gray-800 pr-2">What Style Is Right for You?</h4>
                        <ChevronDown
                          className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${accordions.rightStyle ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${accordions.rightStyle ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <div className="px-4 sm:px-6 py-3 sm:py-4">
                        <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">Our range covers both classic and modern looks:</p>
                        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Biker Jackets:</strong> Asymmetrical zip, attitude built in
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Bomber Jackets:</strong> Heritage aviation meets everyday comfort
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Racer Jackets:</strong> Minimalist, close-cut, versatile
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Trench & Long Coats:</strong> Full-coverage, structured silhouettes
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Cropped, Oversized, Custom:</strong> Fashion-forward and personalized
                            </div>
                          </li>
                        </ul>
                        <p className="text-sm sm:text-base text-gray-700 mt-3 sm:mt-4">
                          We make jackets for men, women, and all body types — because leather belongs to everyone.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Popular Colors Accordion */}
                  <div className="rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleAccordion("colors")}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none active:bg-gray-300"
                      aria-expanded={accordions.colors}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm sm:text-base text-gray-800 pr-2">Popular Colors We Offer</h4>
                        <ChevronDown
                          className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${accordions.colors ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${accordions.colors ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <div className="px-4 sm:px-6 py-3 sm:py-4">
                        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Black:</strong> Always in, forever iconic
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Brown & Tan:</strong> Timeless and rugged
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Burgundy / Red / Olive:</strong> For standout personalities
                            </div>
                          </li>
                          <li className="flex items-start gap-2 sm:gap-3">
                            <span className="text-[#b01e23] font-bold flex-shrink-0">•</span>
                            <div>
                              <strong>Two-tone / Distressed:</strong> Vintage feel, modern attitude
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}