"use client"

import { useState, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Container from "@/src/app/ui/container"
import { avertaBlack, avertaBold } from "@/src/lib/fonts"

interface FAQItem {
    question: string
    answer: string
}

const faqItemsLeft: FAQItem[] = [
    {
        question: "WHAT IS YOUR RETURN POLICY?",
        answer:
            "We offer a 30-day return policy for all unworn items in their original condition with tags attached. Returns are processed within 14 business days of receipt.",
    },
    {
        question: "HOW DO I TRACK MY ORDER?",
        answer:
            "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by logging into your account and viewing your order history.",
    },
    {
        question: "DO YOU SHIP INTERNATIONALLY?",
        answer:
            "Yes, we ship to over 100 countries worldwide. International shipping times vary by location, typically taking 7-14 business days.",
    },
    {
        question: "HOW DO I CARE FOR MY GARMENTS?",
        answer:
            "Each item comes with specific care instructions on the label. Generally, we recommend washing in cold water and hanging to dry to preserve the quality and fit of your garments.",
    },
    {
        question: "DO YOU OFFER SIZE EXCHANGES?",
        answer:
            "Yes, we offer free size exchanges within 30 days of purchase. Simply initiate an exchange through your account or contact our customer service team.",
    },
]

const faqItemsRight: FAQItem[] = [
    {
        question: "CAN I MODIFY MY ORDER AFTER PLACING IT?",
        answer:
            "Orders can be modified within 1 hour of placement. After that, our fulfillment process begins and changes cannot be made. Please contact customer service immediately for assistance.",
    },
    {
        question: "DO YOU OFFER GIFT WRAPPING?",
        answer:
            "Yes, we offer premium gift wrapping services for an additional $5 per item. You can select this option during checkout and include a personalized message.",
    },
    {
        question: "WHAT PAYMENT METHODS DO YOU ACCEPT?",
        answer:
            "We accept all major credit cards, PayPal, Apple Pay, Google Pay, and Shop Pay. For select countries, we also offer buy-now-pay-later options like Klarna and Afterpay.",
    },
    {
        question: "HOW CAN I CONTACT CUSTOMER SERVICE?",
        answer:
            "Our customer service team is available via live chat on our website, email at support@fineyst.com, or by phone at 1-800-FINEYST from Monday to Friday, 9am-6pm EST.",
    },
    {
        question: "DO YOU HAVE A LOYALTY PROGRAM?",
        answer:
            "Yes, our Fineyst Rewards program allows you to earn points on every purchase that can be redeemed for discounts on future orders. You also receive exclusive access to member-only sales.",
    },
]

export default function FAQ() {
    const [openIndexLeft, setOpenIndexLeft] = useState<number | null>(null)
    const [openIndexRight, setOpenIndexRight] = useState<number | null>(null)

    const faqRef = useRef<HTMLDivElement>(null)

    const toggleFAQLeft = (index: number) => {
        setOpenIndexLeft(openIndexLeft === index ? null : index)
    }

    const toggleFAQRight = (index: number) => {
        setOpenIndexRight(openIndexRight === index ? null : index)
    }



    return (
        <section className="relative overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
                {true && (
                    <motion.section
                        ref={faqRef}
                        key="faq-section"
                        initial={{ opacity: 0, x: "-100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="py-16 bg-gray-50 overflow-hidden"
                    >
                        <Container>
                            <section className="max-w-6xl mx-auto relative px-4 sm:px-6 lg:px-8">
                                <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 ${avertaBlack.className}`}>FREQUENTLY ASKED QUESTIONS</h2>

                                <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                                    <section className="space-y-4">
                                        {faqItemsLeft.map((item, index) => (
                                            <section key={`left-${index}`} className="relative">
                                                <section
                                                    className={`border border-gray-200 rounded-lg overflow-hidden bg-white transition-all duration-300 ${openIndexLeft === index ? "shadow-md" : "hover:shadow-sm"
                                                        }`}
                                                >
                                                    <button
                                                        className="flex justify-between items-center w-full p-4 pl-5 text-left font-medium relative"
                                                        onClick={() => toggleFAQLeft(index)}
                                                    >
                                                        <section className={`absolute left-0 top-0 bottom-0 w-1  rounded-l-lg ${avertaBlack.className}`} />
                                                        <h3 className={`${avertaBlack.className}`}>{item.question}</h3>
                                                        <motion.section
                                                            animate={{ rotate: openIndexLeft === index ? 180 : 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className={`flex items-center justify-center h-6 w-6 rounded-full ${openIndexLeft === index ? "bg-black text-white" : "bg-[#F6F6F6]"
                                                                }`}
                                                        >
                                                            <ChevronDown className="h-4 w-4" />
                                                        </motion.section>
                                                    </button>
                                                    <AnimatePresence>
                                                        {openIndexLeft === index && (
                                                            <motion.section
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <section className="px-4 py-5 bg-[#F6F6F6] text-gray-800 border-t border-gray-100 min-h-[80px] flex items-center justify-center">
                                                                    <p className="my-2">{item.answer}</p>
                                                                </section>
                                                            </motion.section>
                                                        )}
                                                    </AnimatePresence>
                                                </section>
                                            </section>
                                        ))}
                                    </section>

                                    <section className="space-y-4">
                                        {faqItemsRight.map((item, index) => (
                                            <section key={`right-${index}`} className="relative">
                                                <section
                                                    className={`border border-gray-200 rounded-lg overflow-hidden bg-white transition-all duration-300 ${openIndexRight === index ? "shadow-md" : "hover:shadow-sm"
                                                        }`}
                                                >
                                                    <button
                                                        className="flex justify-between items-center w-full p-4 pl-5 text-left font-medium relative"
                                                        onClick={() => toggleFAQRight(index)}
                                                    >
                                                        <section className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${avertaBlack.className}`} />
                                                        <h3 className={`${avertaBlack.className}`}>{item.question}</h3>
                                                        <motion.section
                                                            animate={{ rotate: openIndexRight === index ? 180 : 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className={`flex items-center justify-center h-6 w-6 rounded-full ${openIndexRight === index ? "bg-black text-white" : "bg-[#F6F6F6]"
                                                                }`}
                                                        >
                                                            <ChevronDown className="h-4 w-4" />
                                                        </motion.section>
                                                    </button>
                                                    <AnimatePresence>
                                                        {openIndexRight === index && (
                                                            <motion.section
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <section className="px-4 py-5 bg-[#F6F6F6] text-gray-800 border-t border-gray-100 min-h-[80px] flex items-center justify-center">
                                                                    <p className="my-2">{item.answer}</p>
                                                                </section>
                                                            </motion.section>
                                                        )}
                                                    </AnimatePresence>
                                                </section>
                                            </section>
                                        ))}
                                    </section>
                                </section>
                            </section>
                        </Container>
                    </motion.section>
                )}
            </AnimatePresence>
        </section>
    )
}



// "use client"

// import { useState, useRef } from "react"
// import { ChevronDown } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import Container from "@/src/app/ui/container"

// interface FAQItem {
//     question: string
//     answer: string
// }

// const faqItemsLeft: FAQItem[] = [
//     {
//         question: "What is your return policy?",
//         answer:
//             "We offer a 30-day return policy for all unworn items in their original condition with tags attached. Returns are processed within 14 business days of receipt.",
//     },
//     {
//         question: "How do I track my order?",
//         answer:
//             "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by logging into your account and viewing your order history.",
//     },
//     {
//         question: "Do you ship internationally?",
//         answer:
//             "Yes, we ship to over 100 countries worldwide. International shipping times vary by location, typically taking 7-14 business days.",
//     },
//     {
//         question: "How do I care for my garments?",
//         answer:
//             "Each item comes with specific care instructions on the label. Generally, we recommend washing in cold water and hanging to dry to preserve the quality and fit of your garments.",
//     },
//     {
//         question: "Do you offer size exchanges?",
//         answer:
//             "Yes, we offer free size exchanges within 30 days of purchase. Simply initiate an exchange through your account or contact our customer service team.",
//     },
// ]

// const faqItemsRight: FAQItem[] = [
//     {
//         question: "Can I modify my order after placing it?",
//         answer:
//             "Orders can be modified within 1 hour of placement. After that, our fulfillment process begins and changes cannot be made. Please contact customer service immediately for assistance.",
//     },
//     {
//         question: "Do you offer gift wrapping?",
//         answer:
//             "Yes, we offer premium gift wrapping services for an additional $5 per item. You can select this option during checkout and include a personalized message.",
//     },
//     {
//         question: "What payment methods do you accept?",
//         answer:
//             "We accept all major credit cards, PayPal, Apple Pay, Google Pay, and Shop Pay. For select countries, we also offer buy-now-pay-later options like Klarna and Afterpay.",
//     },
//     {
//         question: "How can I contact customer service?",
//         answer:
//             "Our customer service team is available via live chat on our website, email at support@fineyst.com, or by phone at 1-800-FINEYST from Monday to Friday, 9am-6pm EST.",
//     },
//     {
//         question: "Do you have a loyalty program?",
//         answer:
//             "Yes, our Fineyst Rewards program allows you to earn points on every purchase that can be redeemed for discounts on future orders. You also receive exclusive access to member-only sales.",
//     },
// ]

// export default function FAQ() {
//     const [openIndexLeft, setOpenIndexLeft] = useState<number | null>(null)
//     const [openIndexRight, setOpenIndexRight] = useState<number | null>(null)

//     const faqRef = useRef<HTMLDivElement>(null)

//     const toggleFAQLeft = (index: number) => {
//         setOpenIndexLeft(openIndexLeft === index ? null : index)
//     }

//     const toggleFAQRight = (index: number) => {
//         setOpenIndexRight(openIndexRight === index ? null : index)
//     }



//     return (
//         <section className="relative overflow-hidden">
//             <AnimatePresence initial={false} mode="wait">
//                 {true && (
//                     <motion.section
//                         ref={faqRef}
//                         key="faq-section"
//                         initial={{ opacity: 0, x: "-100%" }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: "-100%" }}
//                         transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                         className="py-16 bg-gray-50 overflow-hidden"
//                     >
//                         <Container>
//                             <section className="max-w-6xl mx-auto relative px-4 sm:px-6 lg:px-8">
//                                 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12" style={{ fontFamily: 'AvertaPe, sans-serif' }}>FREQUENTLY ASKED QUESTIONS</h2>

//                                 <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
//                                     <section className="space-y-4">
//                                         {faqItemsLeft.map((item, index) => (
//                                             <section key={`left-${index}`} className="relative">
//                                                 <section
//                                                     className={`border rounded-lg overflow-hidden bg-white transition-all duration-300 ${openIndexLeft === index ? "shadow-md" : "hover:shadow-sm"
//                                                         }`}
//                                                 >
//                                                     <button
//                                                         className="flex justify-between items-center w-full p-4 pl-5 text-left font-medium relative"
//                                                         onClick={() => toggleFAQLeft(index)}
//                                                     >
//                                                         <section className="absolute left-0 top-0 bottom-0 w-1  rounded-l-lg" />
//                                                         <h3>{item.question}</h3>
//                                                         <motion.section
//                                                             animate={{ rotate: openIndexLeft === index ? 180 : 0 }}
//                                                             transition={{ duration: 0.3 }}
//                                                             className={`flex items-center justify-center h-6 w-6 rounded-full ${openIndexLeft === index ? "bg-black text-white" : "bg-[#F6F6F6]"
//                                                                 }`}
//                                                         >
//                                                             <ChevronDown className="h-4 w-4" />
//                                                         </motion.section>
//                                                     </button>
//                                                     <AnimatePresence>
//                                                         {openIndexLeft === index && (
//                                                             <motion.section
//                                                                 initial={{ height: 0, opacity: 0 }}
//                                                                 animate={{ height: "auto", opacity: 1 }}
//                                                                 exit={{ height: 0, opacity: 0 }}
//                                                                 transition={{ duration: 0.3 }}
//                                                                 className="overflow-hidden"
//                                                             >
//                                                                 <section className="px-4 py-5 bg-[#F6F6F6] text-gray-800 border-t border-gray-100 min-h-[80px] flex items-center justify-center">
//                                                                     <p className="my-2">{item.answer}</p>
//                                                                 </section>
//                                                             </motion.section>
//                                                         )}
//                                                     </AnimatePresence>
//                                                 </section>
//                                             </section>
//                                         ))}
//                                     </section>

//                                     <section className="space-y-4">
//                                         {faqItemsRight.map((item, index) => (
//                                             <section key={`right-${index}`} className="relative">
//                                                 <section
//                                                     className={`border rounded-lg overflow-hidden bg-white transition-all duration-300 ${openIndexRight === index ? "shadow-md" : "hover:shadow-sm"
//                                                         }`}
//                                                 >
//                                                     <button
//                                                         className="flex justify-between items-center w-full p-4 pl-5 text-left font-medium relative"
//                                                         onClick={() => toggleFAQRight(index)}
//                                                     >
//                                                         <section className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" />
//                                                         <h3>{item.question}</h3>
//                                                         <motion.section
//                                                             animate={{ rotate: openIndexRight === index ? 180 : 0 }}
//                                                             transition={{ duration: 0.3 }}
//                                                             className={`flex items-center justify-center h-6 w-6 rounded-full ${openIndexRight === index ? "bg-black text-white" : "bg-[#F6F6F6]"
//                                                                 }`}
//                                                         >
//                                                             <ChevronDown className="h-4 w-4" />
//                                                         </motion.section>
//                                                     </button>
//                                                     <AnimatePresence>
//                                                         {openIndexRight === index && (
//                                                             <motion.section
//                                                                 initial={{ height: 0, opacity: 0 }}
//                                                                 animate={{ height: "auto", opacity: 1 }}
//                                                                 exit={{ height: 0, opacity: 0 }}
//                                                                 transition={{ duration: 0.3 }}
//                                                                 className="overflow-hidden"
//                                                             >
//                                                                 <section className="px-4 py-5 bg-[#F6F6F6] text-gray-800 border-t border-gray-100 min-h-[80px] flex items-center justify-center">
//                                                                     <p className="my-2">{item.answer}</p>
//                                                                 </section>
//                                                             </motion.section>
//                                                         )}
//                                                     </AnimatePresence>
//                                                 </section>
//                                             </section>
//                                         ))}
//                                     </section>
//                                 </section>


//                             </section>
//                         </Container>
//                     </motion.section>
//                 )}
//             </AnimatePresence>
//         </section>
//     )
// }
