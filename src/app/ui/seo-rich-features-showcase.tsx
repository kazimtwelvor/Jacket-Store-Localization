"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion"
import { useCountry } from "@/src/hooks/use-country"
import {
  Truck,
  CreditCard,
  RefreshCw,
  Clock,
  Shield,
  Gift,
  ChevronRight,
  ChevronLeft,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Star,
  Users,
  Award,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/src/app/lib/utils"

// Schema.org JSON-LD markup for SEO
const ProductFeatureSchema = () => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Free Express Shipping",
              description:
                "Get your order delivered within 2-3 business days with our complimentary express shipping on all orders over $100.",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Secure Payment",
              description:
                "Shop with confidence using our encrypted payment system that supports all major credit cards and digital wallets.",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Easy Returns",
              description:
                "Not completely satisfied? Return your items within 30 days for a full refund or exchange with our hassle-free return policy.",
            },
            {
              "@type": "ListItem",
              position: 4,
              name: "24/7 Customer Support",
              description:
                "Our dedicated support team is available around the clock to assist you with any questions or concerns about your order.",
            },
            {
              "@type": "ListItem",
              position: 5,
              name: "Quality Guarantee",
              description:
                "Every product undergoes rigorous quality checks to ensure you receive only the best. We stand behind our quality with a 100% satisfaction guarantee.",
            },
            {
              "@type": "ListItem",
              position: 6,
              name: "Gift Services",
              description:
                "Make your gift special with our premium gift wrapping service, personalized message cards, and elegant packaging options.",
            },
          ],
        }),
      }}
    />
  )
}

// FAQ Accordion Component for SEO-rich content
const FeatureFAQ = ({ feature, isOpen, toggleOpen }) => {
  const faqs = [
    {
      question: `How does the ${feature.title.toLowerCase()} work?`,
      answer: feature.faqContent.how,
    },
    {
      question: `What makes our ${feature.title.toLowerCase()} different?`,
      answer: feature.faqContent.unique,
    },
    {
      question: `Common questions about ${feature.title.toLowerCase()}`,
      answer: feature.faqContent.common,
    },
  ]

  return (
    <div className="mt-6 border-t border-gray-100 pt-4">
      <motion.button
        onClick={toggleOpen}
        className="flex w-full justify-between items-center text-left"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <h3 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h3>
        {isOpen ? <ChevronUp className="h-5 w-5 text-red-500" /> : <ChevronDown className="h-5 w-5 text-red-500" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <h4 className="font-medium text-gray-800 mb-2">{faq.question}</h4>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Detailed Feature Content Component
const FeatureDetailContent = ({ feature }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Description */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
        <p className="text-gray-700">{feature.description}</p>
        <p className="text-gray-700 mt-2">{feature.extendedDescription}</p>
      </div>

      {/* Key Benefits */}
      <div>
        <h4 className="font-medium text-lg mb-3 text-gray-800">Key Benefits:</h4>
        <ul className="space-y-3">
          {feature.benefits.map((benefit, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              className="flex items-start"
            >
              <div className="bg-black-100 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                <Check className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <span className="text-gray-800 font-medium">{benefit.title}</span>
                <p className="text-gray-600 text-sm mt-1">{benefit.description}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Expandable Sections */}
      <div className="space-y-3">
        {/* How It Works */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("howItWorks")}
            className={cn(
              "w-full px-4 py-3 flex justify-between items-center",
              expandedSection === "howItWorks" ? "bg-black-50" : "bg-white",
            )}
          >
            <h4 className="font-medium text-gray-900">How It Works</h4>
            {expandedSection === "howItWorks" ? (
              <ChevronUp className="h-5 w-5 text-red-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === "howItWorks" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 bg-white">
                  <p className="text-gray-700 text-sm">{feature.howItWorks}</p>

                  {feature.steps && (
                    <ol className="mt-3 space-y-2 list-decimal list-inside text-sm text-gray-700">
                      {feature.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Customer Stories */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("customerStories")}
            className={cn(
              "w-full px-4 py-3 flex justify-between items-center",
              expandedSection === "customerStories" ? "bg-black-50" : "bg-white",
            )}
          >
            <h4 className="font-medium text-gray-900">Customer Stories</h4>
            {expandedSection === "customerStories" ? (
              <ChevronUp className="h-5 w-5 text-red-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === "customerStories" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 bg-white">
                  {feature.customerStory && (
                    <div className="border-l-4 border-red-200 pl-3 italic text-gray-600 text-sm">
                      "{feature.customerStory.quote}"
                      <div className="mt-2 font-medium text-gray-700 not-italic">
                        — {feature.customerStory.name}, {feature.customerStory.location}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Related Resources */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection("resources")}
            className={cn(
              "w-full px-4 py-3 flex justify-between items-center",
              expandedSection === "resources" ? "bg-black-50" : "bg-white",
            )}
          >
            <h4 className="font-medium text-gray-900">Related Resources</h4>
            {expandedSection === "resources" ? (
              <ChevronUp className="h-5 w-5 text-red-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === "resources" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-3 bg-white">
                  <ul className="space-y-2">
                    {feature.resources.map((resource, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <ExternalLink className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                        <Link href={resource.url} className="text-red-600 hover:underline">
                          {resource.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Main Component
const SEORichFeaturesShowcase = () => {
  const { countryCode } = useCountry()
  const [activeFeature, setActiveFeature] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [openFAQ, setOpenFAQ] = useState(false)
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const [slideDirection, setSlideDirection] = useState(1)

  // Rich SEO content for features
  const features = [
    {
      id: 1,
      title: "Free Express Shipping",
      description:
        "Get your order delivered within 2-3 business days with our complimentary express shipping on all orders over $100.",
      extendedDescription:
        "Our premium shipping service ensures your purchases arrive quickly and safely. We partner with top-tier logistics providers to offer reliable tracking and careful handling of your items.",
      icon: Truck,
      color: "bg-gradient-to-br from-red-500 to-red-700",
      image: "/placeholder.svg?height=400&width=600",
      benefits: [
        {
          title: "Free shipping on orders over $100",
          description: "Enjoy complimentary shipping on all qualifying orders with no hidden fees or surcharges.",
        },
        {
          title: "Express 2-3 day delivery",
          description:
            "Our expedited shipping ensures your items arrive quickly, perfect for time-sensitive purchases.",
        },
        {
          title: "International shipping available",
          description: "We ship to over 100 countries worldwide with competitive rates and reliable delivery times.",
        },
        {
          title: "Real-time tracking updates",
          description: "Follow your package's journey with detailed tracking information updated in real-time.",
        },
      ],
      stats: { value: "2-3", unit: "Days", label: "Average Delivery Time" },
      howItWorks:
        "Our shipping process is designed for efficiency and reliability. Once your order is placed, it's processed within 24 hours and handed to our shipping partners for express delivery.",
      steps: [
        "Order is received and verified within minutes",
        "Items are picked and packed by our expert team",
        "Quality control check ensures perfect condition",
        "Package is handed to our premium shipping partners",
        "Real-time tracking begins and updates are sent to you",
        "Delivery is made within the promised timeframe",
      ],
      customerStory: {
        quote:
          "I ordered a dress for a special event and was worried it wouldn't arrive in time. Not only did it come in just 2 days, but the packaging was immaculate and the dress was perfect!",
        name: "Sarah Johnson",
        location: "New York, NY",
      },
      resources: [
        { title: "Shipping Policy Details", url: "/shipping-policy" },
        { title: "International Shipping Guide", url: "/international-shipping" },
        { title: "Tracking Your Order", url: "/order-tracking" },
      ],
      faqContent: {
        how: "Our express shipping service automatically applies to orders over $100. Once your order is placed, it's processed within 24 hours and shipped via premium carriers like FedEx and UPS with tracking information sent directly to your email.",
        unique:
          "Unlike competitors who offer 5-7 day shipping, our express service guarantees delivery within 2-3 business days. We also provide real-time tracking updates and specialized packaging to ensure items arrive in perfect condition.",
        common:
          "Yes, international shipping is available to over 100 countries. Delivery times vary by location but typically range from 5-10 business days. All shipments are fully insured and come with detailed tracking information.",
      },
      keywords: [
        "express shipping",
        "free shipping",
        "fast delivery",
        "order tracking",
        "international shipping",
        "premium delivery service",
      ],
    },
    {
      id: 2,
      title: "Secure Payment",
      description:
        "Shop with confidence using our encrypted payment system that supports all major credit cards and digital wallets.",
      extendedDescription:
        "Your financial security is our priority. Our payment system employs bank-level encryption and multiple security protocols to ensure your sensitive information remains protected throughout the transaction process.",
      icon: CreditCard,
      color: "bg-gradient-to-br from-red-600 to-red-800",
      image: "/placeholder.svg?height=400&width=600",
      benefits: [
        {
          title: "256-bit SSL encryption",
          description:
            "Bank-grade security protocols protect your personal and financial information during every transaction.",
        },
        {
          title: "Multiple payment options",
          description:
            "Choose from credit cards, digital wallets, buy-now-pay-later services, and more for your convenience.",
        },
        {
          title: "Fraud protection guarantee",
          description:
            "Our advanced fraud detection systems and zero-liability policy keep you protected against unauthorized charges.",
        },
        {
          title: "Secure checkout process",
          description:
            "Our streamlined checkout process maintains security while providing a smooth, hassle-free experience.",
        },
      ],
      stats: { value: "100%", unit: "", label: "Secure Transactions" },
      howItWorks:
        "Our payment system uses advanced encryption and security measures to protect your information. When you enter payment details, they're immediately encrypted and processed through secure channels that comply with PCI DSS standards.",
      steps: [
        "Enter your payment information in our secure form",
        "Data is instantly encrypted using 256-bit SSL technology",
        "Multiple verification checks confirm transaction legitimacy",
        "Payment is processed through secure payment gateways",
        "Real-time fraud detection systems monitor for suspicious activity",
        "Confirmation is sent once payment is securely processed",
      ],
      customerStory: {
        quote:
          "As someone who's experienced credit card fraud before, I'm extremely cautious about online shopping. This store's secure payment system gave me peace of mind, and the detailed receipt and transaction updates were reassuring.",
        name: "Michael Chen",
        location: "San Francisco, CA",
      },
      resources: [
        { title: "Our Security Measures", url: "/payment-security" },
        { title: "Accepted Payment Methods", url: "/payment-options" },
        { title: "Fraud Protection Policy", url: "/fraud-protection" },
      ],
      faqContent: {
        how: "Our payment system uses 256-bit SSL encryption to protect your data. We support all major credit cards (Visa, Mastercard, American Express, Discover), digital wallets (Apple Pay, Google Pay, PayPal), and buy-now-pay-later options like Affirm and Klarna.",
        unique:
          "Our payment system goes beyond industry standards with real-time fraud detection, multi-factor authentication options, and a zero-liability policy that protects you from unauthorized charges. We also never store complete credit card information on our servers.",
        common:
          "Yes, all transactions are PCI DSS compliant and protected by multiple security layers. Your payment information is encrypted from the moment you enter it and is never stored in its complete form. We also offer guest checkout options if you prefer not to create an account.",
      },
      keywords: [
        "secure payment",
        "encrypted transactions",
        "payment security",
        "online payment protection",
        "credit card security",
        "digital wallet",
        "PCI compliance",
      ],
    },
    {
      id: 3,
      title: "Easy Returns",
      description:
        "Not completely satisfied? Return your items within 30 days for a full refund or exchange with our hassle-free return policy.",
      extendedDescription:
        "We stand behind every product we sell with our customer-friendly return policy. We understand that online shopping sometimes requires adjustments, which is why we've created a simple, transparent return process.",
      icon: RefreshCw,
      color: "bg-gradient-to-br from-red-700 to-red-900",
      image: "/placeholder.svg?height=400&width=600",
      benefits: [
        {
          title: "30-day return policy",
          description:
            "Enjoy a full month to decide if your purchase is right for you, giving you ample time to try items.",
        },
        {
          title: "Free return shipping",
          description:
            "We cover the cost of return shipping with prepaid labels, making returns completely free for you.",
        },
        {
          title: "Hassle-free process",
          description:
            "Our streamlined return process takes just minutes to initiate online, with no complicated forms or procedures.",
        },
        {
          title: "Quick refund processing",
          description: "Receive your refund within 3-5 business days of our warehouse receiving your return.",
        },
      ],
      stats: { value: "30", unit: "Days", label: "Return Window" },
      howItWorks:
        "Our return process is designed to be simple and convenient. You can initiate a return through your account dashboard, and we'll provide a prepaid shipping label. Once we receive the item, we process your refund quickly.",
      steps: [
        "Log into your account and select the order with items to return",
        "Select the items and reason for return",
        "Print the prepaid return shipping label we provide",
        "Package the items securely in their original packaging if possible",
        "Drop off the package at any authorized shipping location",
        "Receive confirmation when we receive your return",
        "Refund is processed to your original payment method within 3-5 business days",
      ],
      customerStory: {
        quote:
          "I ordered two sizes of the same jacket, planning to return the one that didn't fit. The return process was incredibly easy - I printed the label, dropped it off, and had my refund in just 4 days. No questions asked!",
        name: "Emily Rodriguez",
        location: "Chicago, IL",
      },
      resources: [
        { title: "Return Policy Details", url: "/return-policy" },
        { title: "How to Initiate a Return", url: "/returns-guide" },
        { title: "Exchange Process", url: "/exchanges" },
      ],
      faqContent: {
        how: "Our return process starts in your account dashboard where you select the items you wish to return. We generate a prepaid shipping label for you to print. Once you ship the items back, our team inspects them upon arrival and processes your refund within 3-5 business days to your original payment method.",
        unique:
          "Unlike many retailers who charge restocking fees or return shipping, our returns are completely free. We also offer a full 30-day window rather than the industry standard 14 days, and we process refunds faster than the industry average of 7-10 days.",
        common:
          "Items must be in their original condition with tags attached. While original packaging is preferred, it's not required. For hygiene reasons, certain items like underwear, swimwear, and beauty products cannot be returned unless defective. Exchanges can be processed simultaneously with your return.",
      },
      keywords: [
        "easy returns",
        "free returns",
        "return policy",
        "money-back guarantee",
        "hassle-free returns",
        "30-day returns",
        "return shipping",
      ],
    },
    {
      id: 4,
      title: "24/7 Customer Support",
      description:
        "Our dedicated support team is available around the clock to assist you with any questions or concerns about your order.",
      extendedDescription:
        "We believe exceptional customer service is the foundation of a great shopping experience. Our multilingual support team is trained to handle any situation with professionalism and care, ensuring you always receive the assistance you need.",
      icon: Clock,
      color: "bg-gradient-to-br from-red-500 to-red-700",
      image: "/placeholder.svg?height=400&width=600",
      benefits: [
        {
          title: "24/7 live chat support",
          description: "Connect with a real person anytime, day or night, through our convenient live chat system.",
        },
        {
          title: "Dedicated support team",
          description:
            "Our customer service representatives are highly trained product experts who can answer any question.",
        },
        {
          title: "Multilingual assistance",
          description: "Get help in your preferred language with support available in over 10 languages.",
        },
        {
          title: "Personalized service",
          description: "Receive customized solutions tailored to your specific needs and circumstances.",
        },
      ],
      stats: { value: "24/7", unit: "", label: "Support Availability" },
      howItWorks:
        "Our customer support system connects you with knowledgeable representatives through multiple channels. Whether you prefer live chat, email, phone, or social media, we're available 24/7 to assist with product questions, order issues, or general inquiries.",
      steps: [
        "Choose your preferred contact method: live chat, phone, email, or social media",
        "Connect with a support representative with minimal wait times",
        "Explain your question or concern to our trained specialist",
        "Receive personalized assistance and solutions",
        "Follow up available through the same ticket system if needed",
        "Rate your experience to help us continuously improve",
      ],
      customerStory: {
        quote:
          "I had a question about sizing at 2 AM before placing an order for an event. I was shocked to get an immediate response through live chat! The representative was knowledgeable and helped me choose the perfect size. That level of service earned my loyalty.",
        name: "Thomas Wright",
        location: "Austin, TX",
      },
      resources: [
        { title: "Contact Our Support Team", url: `/${countryCode}/contact-us` },
        { title: "Frequently Asked Questions", url: `/${countryCode}/faqs` },
        { title: "Order Assistance Guide", url: `/${countryCode}/order-help` },
      ],
      faqContent: {
        how: "Our customer support is available 24/7 through multiple channels. Live chat is accessible directly on our website and typically connects you with a representative in under 60 seconds. Phone support is available at our toll-free number, and email inquiries receive responses within 2 hours, even overnight.",
        unique:
          "Unlike many online retailers who use chatbots or limited-hours support, we provide round-the-clock access to real human representatives who are product experts. Our team undergoes extensive training on both technical product knowledge and customer service excellence.",
        common:
          "Yes, our support team can help with product recommendations, sizing advice, order modifications, tracking assistance, returns, technical issues, and any other questions you might have. For complex issues, we offer callback scheduling and dedicated case managers.",
      },
      keywords: [
        "24/7 customer support",
        "live chat support",
        "customer service",
        "help center",
        "customer assistance",
        "multilingual support",
        "order help",
      ],
    },
    {
      id: 5,
      title: "Quality Guarantee",
      description:
        "Every product undergoes rigorous quality checks to ensure you receive only the best. We stand behind our quality with a 100% satisfaction guarantee.",
      extendedDescription:
        "Quality is at the core of everything we offer. Each product in our catalog is carefully selected and tested to meet our exacting standards. We're so confident in our quality control process that we back every purchase with a comprehensive guarantee.",
      icon: Shield,
      color: "bg-gradient-to-br from-red-600 to-red-800",
      image: "/placeholder.svg?height=400&width=600",
      benefits: [
        {
          title: "100% satisfaction guarantee",
          description: "If you're not completely satisfied with your purchase for any reason, we'll make it right.",
        },
        {
          title: "Premium materials",
          description: "We source only the highest quality materials for durability, comfort, and performance.",
        },
        {
          title: "Rigorous quality control",
          description: "Every item undergoes multiple inspection points before being approved for sale.",
        },
        {
          title: "Authenticity verification",
          description: "All branded products are guaranteed authentic with verification processes in place.",
        },
      ],
      stats: { value: "100%", unit: "", label: "Quality Assurance" },
      howItWorks:
        "Our quality assurance process begins with careful supplier selection and continues through multiple inspection stages. Each product must pass our 27-point quality check before being approved for sale, ensuring you receive only items that meet our high standards.",
      steps: [
        "Products are sourced from trusted, vetted manufacturers",
        "Materials undergo laboratory testing for durability and safety",
        "Initial sample testing evaluates design and functionality",
        "Production batches are randomly inspected at multiple stages",
        "Final products undergo comprehensive 27-point quality check",
        "Continuous feedback monitoring identifies any potential issues",
        "Regular supplier audits maintain consistent quality standards",
      ],
      customerStory: {
        quote:
          "The quality of the leather bag I purchased exceeded my expectations. After six months of daily use, it still looks brand new. When a small issue developed with the zipper, they replaced the entire bag immediately, no questions asked.",
        name: "Rebecca Torres",
        location: "Denver, CO",
      },
      resources: [
        { title: "Our Quality Standards", url: "/quality-standards" },
        { title: "Satisfaction Guarantee", url: "/guarantee" },
        { title: "Product Care Guides", url: "/product-care" },
      ],
      faqContent: {
        how: "Our quality guarantee covers all products for defects in materials and workmanship. If you're not satisfied with your purchase for any reason, you can return it within 30 days for a full refund. For issues that develop after 30 days, we offer repair, replacement, or store credit options depending on the situation.",
        unique:
          "Our quality assurance goes beyond industry standards with a 27-point inspection process for every product. We also conduct regular laboratory testing of materials and maintain strict supplier certification requirements that exceed industry norms.",
        common:
          "The guarantee covers defects in materials and workmanship under normal use. It doesn't cover damage from accidents, improper care, or normal wear and tear. However, we evaluate each situation individually and often make exceptions to ensure customer satisfaction.",
      },
      keywords: [
        "quality guarantee",
        "product quality",
        "satisfaction guarantee",
        "premium quality",
        "quality assurance",
        "quality control",
        "product testing",
      ],
    },
    {
      id: 6,
      title: "Gift Services",
      description:
        "Make your gift special with our premium gift wrapping service, personalized message cards, and elegant packaging options.",
      extendedDescription:
        "Our comprehensive gift services transform ordinary purchases into memorable presents. Whether for birthdays, holidays, or special occasions, our attention to detail ensures your gifts make the perfect impression.",
      icon: Gift,
      color: "bg-gradient-to-br from-red-700 to-red-900",
      image: "/placeholder.svg?height=400&width=600",
      benefits: [
        {
          title: "Premium gift wrapping",
          description:
            "Choose from multiple designer wrapping paper options, ribbons, and decorative elements for a stunning presentation.",
        },
        {
          title: "Personalized message cards",
          description: "Add a custom handwritten note to convey your sentiments with our elegant message cards.",
        },
        {
          title: "Special occasion packaging",
          description:
            "Themed packaging for holidays, birthdays, weddings, and other special events adds a memorable touch.",
        },
        {
          title: "Corporate gifting options",
          description:
            "Bulk ordering with custom branding and presentation options perfect for client and employee gifts.",
        },
      ],
      stats: { value: "5★", unit: "", label: "Gift Service Rating" },
      howItWorks:
        "Our gift services can be added to any order during checkout. Simply select the gift option, choose your preferred wrapping style, add a personalized message, and we'll handle the rest. Recipients will receive a beautifully presented package that's ready to be given.",
      steps: [
        "Select 'This is a gift' during checkout",
        "Choose from premium wrapping options and color schemes",
        "Add a personalized message for the recipient",
        "Select gift box or specialty packaging if desired",
        "We carefully wrap each item by hand",
        "Quality check ensures perfect presentation",
        "Gift receipt included with no pricing information",
      ],
      customerStory: {
        quote:
          "I ordered a last-minute anniversary gift and selected the premium gift service. The presentation was so beautiful that my wife thought I'd purchased it from a high-end boutique. The handwritten note added such a personal touch!",
        name: "Daniel Martinez",
        location: "Miami, FL",
      },
      resources: [
        { title: "Gift Wrapping Options", url: "/gift-wrapping" },
        { title: "Corporate Gifting Program", url: "/corporate-gifts" },
        { title: "Gift Cards", url: "/gift-cards" },
      ],
      faqContent: {
        how: "Our gift services can be added to any order during checkout for a small additional fee. You can select from various wrapping styles, add a personalized message (up to 250 characters), and choose specialty packaging. We also offer gift receipts that don't show pricing information.",
        unique:
          "Unlike standard gift wrapping services, our premium option includes hand-wrapped packages using designer papers, satin ribbons, and decorative elements. Our gift messages are handwritten by calligraphers on premium cardstock, not printed on generic cards.",
        common:
          "Yes, we can wrap multiple items separately or together depending on your preference. For orders containing gifts for different recipients, you can specify which items should be wrapped together. Gift wrapping is available for all products except oversized items.",
      },
      keywords: [
        "gift wrapping",
        "gift services",
        "personalized gifts",
        "gift messaging",
        "premium packaging",
        "corporate gifts",
        "special occasion gifts",
      ],
    },
  ]

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  useEffect(() => {
    let interval
    if (autoplay) {
      interval = setInterval(() => {
        setSlideDirection(1)
        setActiveFeature((prev) => (prev === features.length - 1 ? 0 : prev + 1))
      }, 8000) // Longer interval for reading content
    }
    return () => clearInterval(interval)
  }, [autoplay, features.length])

  const nextFeature = () => {
    setAutoplay(false)
    setSlideDirection(1)
    setActiveFeature((prev) => (prev === features.length - 1 ? 0 : prev + 1))
  }

  const prevFeature = () => {
    setAutoplay(false)
    setSlideDirection(-1)
    setActiveFeature((prev) => (prev === 0 ? features.length - 1 : prev - 1))
  }

  const handleFeatureChange = (index: number) => {
    setSlideDirection(index > activeFeature ? 1 : -1)
    setActiveFeature(index)
    setAutoplay(false)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  }

  return (
    <section ref={ref} className="py-20 px-4 md:px-8 lg:px-16 bg-white relative overflow-hidden">
      {/* Schema.org markup for SEO */}
      <ProductFeatureSchema />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-black-500 opacity-10 pattern-dots pattern-size-2 pattern-opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            hidden: { opacity: 0, y: 20 },
          }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-black-100 text-red-600 rounded-full text-sm font-medium mb-4">
            PREMIUM EXPERIENCE
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Exceptional <span className="text-red-600">Services</span> For Our Customers
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the exceptional services and features that make shopping with us a truly premium experience. We go
            above and beyond to ensure your satisfaction with industry-leading policies and customer-focused solutions.
          </p>

          {/* SEO-rich introduction paragraph */}
          <div className="mt-6 max-w-4xl mx-auto text-left text-gray-700">
            <p>
              At our premium online store, we've reimagined the shopping experience with customer-centric services
              designed to exceed expectations. From the moment you browse our carefully curated selection to long after
              your purchase arrives, our comprehensive suite of services ensures complete satisfaction. We understand
              that exceptional quality, reliability, and customer care are the foundations of a superior shopping
              experience, which is why we've invested in creating industry-leading policies and systems that put you
              first.
            </p>
          </div>
        </motion.div>

        {/* Feature Showcase - Enhanced with SEO-rich content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Feature Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
              hidden: { opacity: 0, scale: 0.9 },
            }}
            className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl lg:col-span-5"
          >
            <AnimatePresence initial={false} custom={slideDirection}>
              <motion.div
                key={activeFeature}
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className={`absolute inset-0 ${features[activeFeature].color} opacity-80 z-10`}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 z-20"></div>
                <motion.div
                  className="absolute inset-0 bg-cover bg-center z-0"
                  style={{
                    backgroundImage: `url(${features[activeFeature].image})`,
                  }}
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.1 }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                ></motion.div>

                <div className="absolute bottom-0 left-0 right-0 p-8 z-30 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-white rounded-full p-3 mr-4">
                        {React.createElement(features[activeFeature].icon, { className: "w-6 h-6 text-red-600" })}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold">{features[activeFeature].title}</h2>
                    </div>
                    <p className="text-white/90 mb-6 max-w-lg">{features[activeFeature].description}</p>

                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg inline-block">
                      <div className="text-3xl font-bold">{features[activeFeature].stats.value}</div>
                      <div className="text-sm opacity-80">
                        {features[activeFeature].stats.unit} {features[activeFeature].stats.label}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 left-4 z-40 transform -translate-y-1/2">
              <motion.button
                onClick={prevFeature}
                whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/30 backdrop-blur-sm text-white p-3 rounded-full"
                aria-label="Previous feature"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
            </div>
            <div className="absolute top-1/2 right-4 z-40 transform -translate-y-1/2">
              <motion.button
                onClick={nextFeature}
                whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
                whileTap={{ scale: 0.9 }}
                className="bg-white/30 backdrop-blur-sm text-white p-3 rounded-full"
                aria-label="Next feature"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Feature Indicators */}
            <div className="absolute bottom-4 left-0 right-0 z-40 flex justify-center space-x-2">
              {features.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleFeatureChange(index)}
                  className={`w-3 h-3 rounded-full ${
                    activeFeature === index ? "bg-white" : "bg-white/40"
                  } transition-all duration-300`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.9 }}
                  animate={
                    activeFeature === index
                      ? { width: "2rem", backgroundColor: "#ffffff" }
                      : { width: "0.75rem", backgroundColor: "rgba(255, 255, 255, 0.4)" }
                  }
                  transition={{ duration: 0.3 }}
                  aria-label={`View ${features[index].title}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Feature Details Side - Enhanced with SEO content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
              hidden: { opacity: 0, x: 50 },
            }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 lg:col-span-7"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <FeatureDetailContent feature={features[activeFeature]} />

                {/* SEO Keywords Section */}
                <div className="mt-8 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Related Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    {features[activeFeature].keywords.map((keyword, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* FAQ Section for SEO */}
                <FeatureFAQ
                  feature={features[activeFeature]}
                  isOpen={openFAQ}
                  toggleOpen={() => setOpenFAQ(!openFAQ)}
                />

                <div className="mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#2b2b2b" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#2b2b2b] text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                  >
                    Learn More About {features[activeFeature].title}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Feature Navigation - Enhanced with thumbnails */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
            hidden: { opacity: 0, y: 30 },
          }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                  },
                },
              }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              onClick={() => handleFeatureChange(index)}
              className={`cursor-pointer rounded-xl p-4 text-center transition-all duration-300 border-2 ${
                activeFeature === index ? "border-red-500 bg-black-50" : "border-gray-100 bg-white"
              }`}
            >
              <motion.div
                className={`mx-auto rounded-full p-3 mb-2 ${activeFeature === index ? "bg-black-500" : "bg-gray-100"}`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className={`w-6 h-6 ${activeFeature === index ? "text-white" : "text-gray-600"}`} />
              </motion.div>
              <h3 className={`text-sm font-medium ${activeFeature === index ? "text-red-600" : "text-gray-700"}`}>
                {feature.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>

        {/* SEO-Rich Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } },
            hidden: { opacity: 0, y: 30 },
          }}
          className="mt-16 bg-gray-50 rounded-2xl p-8 border border-gray-100"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Our Services Make the Difference</h2>

            <div className="prose prose-red max-w-none text-gray-700">
              <p>
                In today's competitive online shopping landscape, exceptional service is what truly sets a premium
                retailer apart. Our comprehensive approach to customer satisfaction goes beyond the industry standard,
                creating a shopping experience that's memorable for all the right reasons. We've carefully designed each
                aspect of our service offerings based on extensive customer feedback and industry best practices.
              </p>

              <p>
                From the moment you place your order to long after your purchase arrives, our dedicated team works
                tirelessly to ensure your complete satisfaction. Our express shipping service leverages partnerships
                with premium carriers to deliver your items quickly and safely. Our secure payment system employs
                bank-level encryption to protect your sensitive information, while our hassle-free return policy gives
                you peace of mind with every purchase.
              </p>

              <p>
                What truly distinguishes our approach is our unwavering commitment to quality and customer care. Every
                product undergoes rigorous testing and inspection before it reaches you, and our 24/7 support team is
                always available to assist with any questions or concerns. Whether you're shopping for yourself or
                selecting the perfect gift, our premium services ensure a seamless, enjoyable experience from start to
                finish.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <Award className="h-6 w-6 text-red-500 mr-3" />
                    <h3 className="font-semibold text-lg">Award-Winning Service</h3>
                  </div>
                  <p className="text-gray-600">
                    Our customer service team has been recognized with multiple industry awards for excellence in
                    response time, problem resolution, and overall customer satisfaction. We continuously train and
                    develop our support specialists to ensure they provide knowledgeable, empathetic assistance for any
                    situation.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <Users className="h-6 w-6 text-red-500 mr-3" />
                    <h3 className="font-semibold text-lg">Customer-Driven Improvements</h3>
                  </div>
                  <p className="text-gray-600">
                    We actively collect and implement customer feedback to continuously enhance our services. Our recent
                    improvements include extending customer support hours, adding more shipping options, and
                    streamlining the return process based directly on suggestions from shoppers like you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Customer Testimonials Section - Enhanced for SEO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.6 } },
            hidden: { opacity: 0, y: 30 },
          }}
          className="mt-16 bg-white rounded-2xl p-8 border border-gray-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-black-100 rounded-full -mr-20 -mt-20 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-black-100 rounded-full -ml-20 -mb-20 opacity-50"></div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Our Customers Say</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl relative">
                <svg
                  className="w-10 h-10 text-red-200 absolute top-4 left-4"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>

                <div className="pt-8">
                  <p className="text-gray-700 italic mb-4">
                    "The customer service is exceptional! Their 24/7 support team helped me track my package and resolve
                    an issue with my order immediately. The quality of their products is unmatched, and the free
                    shipping was incredibly fast."
                  </p>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#2b2b2b] rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      JW
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">James Wilson</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">Verified Customer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl relative">
                <svg
                  className="w-10 h-10 text-red-200 absolute top-4 left-4"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>

                <div className="pt-8">
                  <p className="text-gray-700 italic mb-4">
                    "I had to return an item and was dreading the process, but it couldn't have been easier! The prepaid
                    return label was simple to use, and my refund was processed within days. Their commitment to
                    customer satisfaction is evident in everything they do."
                  </p>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#2b2b2b] rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      AL
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Amanda Lee</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">Verified Customer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/testimonials"
                className="inline-flex items-center text-red-600 font-medium hover:text-red-700"
              >
                Read more customer testimonials
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section for SEO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.7 } },
            hidden: { opacity: 0, y: 30 },
          }}
          className="mt-16 bg-white rounded-2xl p-8 border border-gray-100"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button className="w-full px-6 py-4 flex justify-between items-center bg-white text-left">
                  <h3 className="font-medium text-gray-900">How do I track my order?</h3>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-700">
                    Tracking your order is simple. Once your order ships, you'll receive a confirmation email with a
                    tracking number and link. You can also view tracking information by logging into your account and
                    visiting the "Order History" section. Our real-time tracking system provides detailed updates on
                    your package's journey from our warehouse to your doorstep.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button className="w-full px-6 py-4 flex justify-between items-center bg-white text-left">
                  <h3 className="font-medium text-gray-900">What payment methods do you accept?</h3>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-700">
                    We accept all major credit cards (Visa, Mastercard, American Express, Discover), digital wallets
                    (Apple Pay, Google Pay, PayPal), and buy-now-pay-later options like Affirm and Klarna. All
                    transactions are processed through our secure payment system with 256-bit SSL encryption to ensure
                    your financial information remains protected.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button className="w-full px-6 py-4 flex justify-between items-center bg-white text-left">
                  <h3 className="font-medium text-gray-900">How does your quality guarantee work?</h3>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>
                <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-700">
                    Our quality guarantee ensures your complete satisfaction with every purchase. If you're not happy
                    with your item for any reason, you can return it within 30 days for a full refund. For issues
                    related to product quality or defects that appear after the standard return period, we offer repair,
                    replacement, or store credit options depending on the situation. Every product undergoes a rigorous
                    27-point inspection before shipping to ensure it meets our high standards.
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link href="/faq" className="inline-flex items-center text-red-600 font-medium hover:text-red-700">
                  View all frequently asked questions
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, transition: { delay: 0.8 } },
            hidden: { opacity: 0 },
          }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#2b2b2b] text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Experience Premium Shopping</span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-500"
              initial={{ x: "100%", opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          <p className="mt-4 text-gray-500 text-sm">Join thousands of satisfied customers today</p>
        </motion.div>

        {/* SEO Footer Content */}
        <div className="mt-20 text-sm text-gray-600 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Shopping with Confidence</h2>
          <p className="mb-4">
            Our commitment to exceptional service extends beyond the purchase. From secure payment processing and
            lightning-fast shipping to hassle-free returns and dedicated customer support, we've designed every aspect
            of our service to provide you with a premium shopping experience. Our quality guarantee ensures that every
            product meets our rigorous standards, while our gift services add a special touch to your presents for any
            occasion.
          </p>
          <p>
            Whether you're a first-time shopper or a loyal customer, our comprehensive suite of services is designed to
            exceed your expectations at every step. Discover why thousands of customers trust us for their shopping
            needs and experience the difference that truly exceptional service makes.
          </p>
        </div>
      </div>
    </section>
  )
}

export default SEORichFeaturesShowcase

