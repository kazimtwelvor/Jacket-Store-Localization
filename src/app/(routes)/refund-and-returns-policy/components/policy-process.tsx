"use client"

import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { PackageCheck, ClipboardList, Truck, RotateCcw, CreditCard } from "lucide-react"

export default function PolicyProcess() {
  const [isMounted, setIsMounted] = useState(false)
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  useEffect(() => {
    setIsMounted(true)
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const steps = [
    {
      icon: <ClipboardList className="h-6 w-6 text-white" />,
      title: "Request a Return",
      description:
        "Log into your account and navigate to your order history. Select the item you wish to return and follow the prompts to initiate the return process.",
      color: "bg-[#EAEAEA]",
      staticIcon: "📋",
    },
    {
      icon: <PackageCheck className="h-6 w-6 text-white" />,
      title: "Package Your Item",
      description:
        "Carefully pack the item in its original packaging with all tags attached. Include your order number and return form in the package.",
      color: "bg-[#EAEAEA]",
      staticIcon: "📦",
    },
    {
      icon: <Truck className="h-6 w-6 text-white" />,
      title: "Ship Your Return",
      description:
        "Use the prepaid shipping label provided in your return confirmation email. Drop off your package at any authorized shipping location.",
      color: "bg-[#EAEAEA]",
      staticIcon: "🚚",
    },
    {
      icon: <RotateCcw className="h-6 w-6 text-white" />,
      title: "Return Processing",
      description:
        "Once we receive your return, our team will inspect the item and process your return within 1-2 business days.",
      color: "bg-[#EAEAEA]",
      staticIcon: "🔄",
    },
    {
      icon: <CreditCard className="h-6 w-6 text-white" />,
      title: "Receive Your Refund",
      description:
        "After your return is approved, we'll issue a refund to your original payment method. This typically takes 5-7 business days to appear on your statement.",
      color: "bg-[#EAEAEA]",
      staticIcon: "💳",
    },
  ]

  // Non-JavaScript fallback
  if (!isMounted) {
    return (
      <section id="process" className="scroll-mt-24">
        <h2 className="text-3xl font-bold tracking-tight text-[#2b2b2b] mb-8">Return Process</h2>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[39px] top-0 bottom-0 w-1 bg-[#EAEAEA] hidden md:block -z-10" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 flex md:block">
                  <div
                    className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center shadow-lg z-10`}
                  >
                    <span className="text-white text-xl">{step.staticIcon}</span>
                  </div>
                  <div className="ml-6 md:hidden text-2xl font-bold text-[#2b2b2b]">{index + 1}</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#2b2b2b] flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-[#2b2b2b]">{step.title}</h3>
                  <p className="text-[#333333]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Enhanced version with JavaScript
  return (
    <motion.section
      id="process"
      className="scroll-mt-24"
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <motion.h2 className="text-3xl font-bold tracking-tight text-[#2b2b2b] mb-8" variants={itemVariants}>
        Return Process
      </motion.h2>

      <motion.div className="relative" variants={itemVariants}>
        {/* Connecting line */}
        <div className="absolute left-[39px] top-0 bottom-0 w-1 bg-[#EAEAEA] hidden md:block -z-10" />

        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div key={index} className="flex flex-col md:flex-row gap-6" variants={itemVariants}>
              <div className="flex-shrink-0 flex md:block">
                <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center shadow-lg z-10`}>
                  {step.icon}
                </div>
                <div className="ml-6 md:hidden text-2xl font-bold text-[#2b2b2b]">{index + 1}</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#2b2b2b] flex-1">
                <h3 className="text-xl font-semibold mb-2 text-[#2b2b2b]">{step.title}</h3>
                <p className="text-[#333333]">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  )
}
