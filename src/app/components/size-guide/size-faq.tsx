"use client"

import { motion } from "framer-motion"

export default function SizeFAQ() {

  const faqs = [
    {
      question: "How do I know which size to choose?",
      answer:
        "We recommend taking your measurements and comparing them to our size charts. If you're between sizes, we generally recommend sizing up for a more comfortable fit. You can also check the fit description on each product page for specific guidance.",
    },
    {
      question: "Do your clothes run true to size?",
      answer:
        "Our sizing is designed to be consistent with standard industry measurements. However, fit can vary slightly between different styles and fabrics. We recommend checking the specific product description and reviews for insights on how each item fits.",
    },
    {
      question: "What if my measurements fall between two sizes?",
      answer:
        "If you're between sizes, we generally recommend sizing up for a more comfortable fit. However, this can depend on the specific garment and your personal preference for how fitted you like your clothes to be.",
    },
    {
      question: "How do I measure myself accurately?",
      answer:
        "For the most accurate measurements, use a soft measuring tape and have someone help you if possible. Measure directly against your body, not over clothes. Stand straight with feet together and breathe normally. Check our 'How to Measure' section for detailed guidance on measuring specific body parts.",
    },
    {
      question: "Do you offer petite or tall sizes?",
      answer:
        "Yes, we offer petite sizes for those 5'4\" and under, and tall sizes for those 5'9\" and above in select styles. Look for the 'petite' or 'tall' designation in the product description or filter your search results by these categories.",
    },
    {
      question: "What size should I choose if I'm pregnant?",
      answer:
        "For maternity wear, we recommend selecting your pre-pregnancy size as our maternity items are designed to accommodate your changing body. For non-maternity items, we suggest sizing up based on your current measurements and choosing styles with stretch or a relaxed fit.",
    },
    {
      question: "How do I convert my international size?",
      answer:
        "You can use our size conversion chart in the 'Size Conversion' section to find your equivalent size across different international sizing systems. If you're still unsure, please contact our customer service team for assistance.",
    },
    {
      question: "What if the item I ordered doesn't fit?",
      answer:
        "If your item doesn't fit, you can return or exchange it within 30 days of purchase, provided it's unworn, unwashed, and has all original tags attached. Please visit our Returns & Exchanges page for more information on our return policy.",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-[#2b2b2b]">Frequently Asked Questions</h2>
      <p className="text-[#666666] max-w-3xl mb-6">Find answers to common questions about sizing and fit.</p>

      <div className="bg-white rounded-lg border border-[#2b2b2b] shadow-sm overflow-hidden">
        <div className="divide-y">
          {faqs.map((faq, index) => (
            <details key={index} className="group">
              <summary className="px-6 py-4 cursor-pointer list-none text-left flex items-center justify-between hover:bg-[#F6F6F6]/50">
                <span className="text-[#333333] font-medium">{faq.question}</span>
                <span className="ml-4 transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="px-6 pb-6 pt-3 text-[#666666]">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="p-4 bg-[#2b2b2b]/10 rounded-lg border border-[#2b2b2b]/20 flex items-start">
        <div className="mr-3 mt-1 text-[#2b2b2b]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        </div>
        <div>
          <p className="text-sm text-[#666666]">
            Still have questions about finding your perfect size? Our customer service team is here to help! Contact us
            at{" "}
            <a href="mailto:info@fineystjackets.com" className="text-[#2b2b2b] underline">
            info@fineystjackets.com
            </a>{" "}
            or call us at{" "}
            <a href="tel:+18888400885" className="text-[#2b2b2b] underline">
            +1 (888) 840-0885
            </a>
            .
          </p>
        </div>
      </div>
    </motion.div>
  )
}
