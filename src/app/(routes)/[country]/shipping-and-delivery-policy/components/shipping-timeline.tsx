"use client"

import { useRef, useEffect, useState } from "react"
import { useInView } from "framer-motion"
import { ShoppingBag, Package, Truck, CheckCircle } from "lucide-react"

export default function ShippingTimeline() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    // This ensures we're fully mounted
    setIsMounted(true)
  }, [])

  const steps = [
    {
      icon: ShoppingBag,
      title: "Order Placed",
      description: "Your order is confirmed and payment is processed",
    },
    {
      icon: Package,
      title: "Order Processing",
      description: "Items are picked, packed and prepared for shipping",
    },
    {
      icon: Truck,
      title: "Order Shipped",
      description: "Your package is on its way with tracking information sent to you",
    },
    {
      icon: CheckCircle,
      title: "Order Delivered",
      description: "Your package has been delivered to your specified address",
    },
  ]

  return (
    <section className="py-8 sm:py-16" ref={ref}>
      <div className="mb-8 sm:mb-16 text-center px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Shipping Process
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          From the moment you place your order to delivery at your doorstep, here's what happens.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Timeline line - Hidden on mobile, shown on tablet and up */}
        <div
          className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#eaeaea] transform -translate-x-1/2 origin-top"
          style={{ height: "calc(100% - 80px)" }}
        />

        {/* Mobile timeline line */}
        <div
          className="sm:hidden absolute left-8 top-0 bottom-0 w-0.5 bg-[#eaeaea]"
          style={{ height: "calc(100% - 40px)" }}
        />

        <div className="relative z-10">
          {steps.map((step, index) => (
            <div key={index} className="mb-12 sm:mb-24 last:mb-0">
              {/* Mobile Layout */}
              <div className="sm:hidden flex items-start">
                <div
                  className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full 
                  bg-white border-2 border-[#eaeaea] shadow-md flex-shrink-0 mr-4"
                >
                  <step.icon className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center justify-center">
                {index % 2 === 0 ? (
                  <>
                    <div className="w-[calc(50%-2rem)] pr-8">
                      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-left">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>

                    <div
                      className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full 
                      bg-white border-2 border-[#eaeaea] shadow-md flex-shrink-0"
                    >
                      <step.icon className="w-8 h-8 text-black" />
                    </div>

                    <div className="w-[calc(50%-2rem)] pl-8" />
                  </>
                ) : (
                  <>
                    <div className="w-[calc(50%-2rem)] pr-8" />

                    <div
                      className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full 
                      bg-white border-2 border-[#eaeaea] shadow-md flex-shrink-0"
                    >
                      <step.icon className="w-8 h-8 text-black" />
                    </div>

                    <div className="w-[calc(50%-2rem)] pl-8">
                      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-left">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
