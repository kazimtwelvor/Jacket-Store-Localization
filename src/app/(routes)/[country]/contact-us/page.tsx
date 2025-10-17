import type { Metadata } from "next"
import ContactUsClient from "./contact-us-client"

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const { country } = await params
  const countryCode = country.toLowerCase()

  return {
    title: "Contact Us - Get in Touch with Our Team | Fineyst",
    description: "Contact FINEYST's expert support team 24/7. Get help with orders, returns, sizing, or product questions. Email, phone, live chat available. Fast response guaranteed.",
    alternates: {
      canonical: `https://www.fineystjackets.com/${countryCode}/contact-us`
    }
  }
}

export default function ContactUsPage() {
  return <ContactUsClient />
}
