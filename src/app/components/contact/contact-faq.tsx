"use client"

import FAQ from "../../ui/faq"

const contactFaqItems = [
  {
    question: "What are your shipping options?",
    answer:
      "We offer standard shipping (3-5 business days), express shipping (1-2 business days), and international shipping (7-14 business days). Free shipping is available on orders over $100.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive a confirmation email with a tracking number. You can also track your order by logging into your account on our website.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Please visit our Returns page for more information.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship to most countries worldwide. International shipping typically takes 7-14 business days, and customs fees may apply depending on your location.",
  },
  {
    question: "How can I change or cancel my order?",
    answer:
      "You can request changes or cancellations within 1 hour of placing your order by contacting our customer service team. After this window, we may not be able to modify orders that have entered processing.",
  },
  {
    question: "Do you have a loyalty program?",
    answer:
      "Yes, our Rewards program allows you to earn points on every purchase that can be redeemed for discounts on future orders. You also receive exclusive access to member-only sales.",
  },
]

export default function ContactFAQ() {
  return (
    <FAQ
      items={contactFaqItems}
      title="CONTACT & SUPPORT FAQ"
      maxColumns={2}
      className="bg-transparent"
    />
  )
}
