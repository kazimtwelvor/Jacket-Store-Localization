"use client";

import FAQ from "@/src/app/ui/faq";
import { avertaBlack } from "@/src/lib/fonts";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQClientProps {
  faqItems: FAQItem[];
}

export default function FAQClient({ faqItems }: FAQClientProps) {
  return (
    <>
      <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mt-10 mb-4 sm:mb-6 ${avertaBlack.className}`}>
        FREQUENTLY ASKED QUESTIONS
      </h2>
      <FAQ
        items={faqItems}
        maxColumns={2}
      />
    </>
  );
}
