"use client"

import FAQ from "@/src/app/ui/faq"
import { avertaBlack } from "@/src/lib/fonts"

const faqItems = [
    {
        question: "What is your return policy?",
        answer:
            "We offer a 30-day return policy for all unworn items in their original condition with tags attached. Returns are processed within 14 business days of receipt.",
    },
    {
        question: "How do I track my order?",
        answer:
            "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by logging into your account and viewing your order history.",
    },
    {
        question: "Do you ship internationally?",
        answer:
            "Yes, we ship to over 100 countries worldwide. International shipping times vary by location, typically taking 7-14 business days.",
    },
    {
        question: "How do I care for my garments?",
        answer:
            "Each item comes with specific care instructions on the label. Generally, we recommend washing in cold water and hanging to dry to preserve the quality and fit of your garments.",
    },
    {
        question: "Do you offer size exchanges?",
        answer:
            "Yes, we offer free size exchanges within 30 days of purchase. Simply initiate an exchange through your account or contact our customer service team.",
    },
    {
        question: "Can I modify my order after placing it?",
        answer:
            "Orders can be modified within 1 hour of placement. After that, our fulfillment process begins and changes cannot be made. Please contact customer service immediately for assistance.",
    },
    {
        question: "Do you offer gift wrapping?",
        answer:
            "Yes, we offer premium gift wrapping services for an additional $5 per item. You can select this option during checkout and include a personalized message.",
    },
    {
        question: "What payment methods do you accept?",
        answer:
            "We accept all major credit cards, PayPal, Apple Pay, Google Pay, and Shop Pay. For select countries, we also offer buy-now-pay-later options like Klarna and Afterpay.",
    },
    {
        question: "How can I contact customer service?",
        answer:
            "Our customer service team is available via live chat on our website, email at support@fineyst.com, or by phone at 1-800-FINEYST from Monday to Friday, 9am-6pm EST.",
    },
    {
        question: "Do you have a loyalty program?",
        answer:
            "Yes, our Fineyst Rewards program allows you to earn points on every purchase that can be redeemed for discounts on future orders. You also receive exclusive access to member-only sales.",
    },
]

export default function HomeFAQ() {
    return (
        <>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mt-10 mb-4 sm:mb-6 ${avertaBlack.className}`}>FREQUENTLY ASKED QUESTIONS</h2>
            <FAQ
                items={faqItems}
                maxColumns={2}
            />
        </>
    )
}