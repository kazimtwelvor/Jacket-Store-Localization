import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  Mail,
  Phone,
  Clock,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  MessageSquare,
  HeadphonesIcon,
  ShieldCheck,
  Clock8,
} from "lucide-react"
import Container from "@/src/app/ui/container"
import { Button } from "@/src/app/ui/button"
import ContactFAQ from "../../components/contact/contact-faq"
import ContactForm from "./components/contact-form"

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with Our Team | Fineyst",
  description: "Contact FINEYST's expert support team 24/7. Get help with orders, returns, sizing, or product questions. Email, phone, live chat available. Fast response guaranteed.",
  alternates: {
    canonical: "https://www.fineystjackets.com/us/contact-us"
  }
}

export default function ContactUsPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Us - Fineyst",
    "description": "Get in touch with our team for any questions, feedback, or support.",
    "url": "https://www.fineystjackets.com/us/contact-us"
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Fineyst",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+1 (888) 840-0885",
        "contactType": "customer service",
        "email": "info@fineystjackets.com",
        "availableLanguage": "English",
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      },
      {
        "@type": "ContactPoint",
        "telephone": "+1 (888) 840-0885",
        "contactType": "customer service",
        "email": "info@fineystjackets.com",
        "availableLanguage": "English",
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <section className="bg-background pb-20">
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-10">
          <div
            style={{
              backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
              backgroundSize: `40px 40px`,
            }}
            className="w-full h-full"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl text-[#333333] mb-6">
              We'd love to hear from you. Our team is always here to help.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { icon: HeadphonesIcon, text: "24/7 Support" },
                { icon: Clock, text: "Quick Response" },
                { icon: ShieldCheck, text: "Expert Help" },
                { icon: MessageSquare, text: "Multiple Channels" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#EAEAEA] flex items-center justify-center mb-3 shadow-md">
                    <item.icon className="w-7 h-7 text-[2b2b2b]" />
                  </div>
                  <p className="font-medium text-[#333333]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Container>
        <div className="py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Contact Information</h2>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-[#EAEAEA] p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-[#2b2b2b]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email Us</h3>
                    <p className="text-muted-foreground">
                      <a href="mailto:info@fineystjackets.com" className="hover:text-[#2b2b2b] transition-colors">
                      info@fineystjackets.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#EAEAEA] p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-[#2b2b2b]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Call Us</h3>
                    <p className="text-muted-foreground">
                      <a href="tel:+18888400885" className="hover:text-[#2b2b2b] transition-colors">
                      +1 (888) 840-0885
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#EAEAEA] p-3 rounded-full mr-4">
                    <MessageSquare className="h-6 w-6 text-[#2b2b2b]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Live Chat</h3>
                    <p className="text-muted-foreground">
                      Available Monday - Friday
                      <br />
                      9:00 AM - 6:00 PM CST
                      <br />
                      <a href="#" className="text-[#2b2b2b] hover:underline">
                        Start a chat now
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#EAEAEA] p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-[#2b2b2b]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Support Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM CST
                      <br />
                      Saturday: 10:00 AM - 4:00 PM CST
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-background hover:bg-[#EAEAEA] p-3 rounded-full transition-colors"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-background hover:bg-[#EAEAEA] p-3 rounded-full transition-colors"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-background hover:bg-[#EAEAEA] p-3 rounded-full transition-colors"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-background hover:bg-[#EAEAEA] p-3 rounded-full transition-colors"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </Container>

      <div className="bg-[#eaeaea] py-16">
        <Container>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Our Customer Support</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing exceptional customer service through multiple support channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="mx-auto w-16 h-16 bg-[#EAEAEA] rounded-full flex items-center justify-center mb-6">
                <HeadphonesIcon className="h-8 w-8 text-[#2b2b2b]" />
              </div>
              <h4 className="text-xl font-bold mb-3">24/7 Support</h4>
              <p className="text-muted-foreground mb-4">
                Our dedicated team is available around the clock to assist you with any questions or concerns.
              </p>
              <p className="text-sm font-medium">
                Average response time: <span className="text-[#2b2b2b]">Under 2 hours</span>
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="mx-auto w-16 h-16 bg-[#EAEAEA] rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-[#2b2b2b]" />
              </div>
              <h4 className="text-xl font-bold mb-3">Satisfaction Guarantee</h4>
              <p className="text-muted-foreground mb-4">
                Not happy with your purchase? Our hassle-free return policy ensures your complete satisfaction.
              </p>
              <p className="text-sm font-medium">
                Return window: <span className="text-[#2b2b2b]">30 days</span>
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="mx-auto w-16 h-16 bg-[#EAEAEA] rounded-full flex items-center justify-center mb-6">
                <Clock8 className="h-8 w-8 text-[#2b2b2b]" />
              </div>
              <h4 className="text-xl font-bold mb-3">Fast Resolution</h4>
              <p className="text-muted-foreground mb-4">
                We pride ourselves on quick issue resolution and personalized attention to every customer inquiry.
              </p>
              <p className="text-sm font-medium">
                Resolution rate: <span className="text-[#2b2b2b]">95% within 24 hours</span>
              </p>
            </div>
          </div>
        </Container>
      </div>

      <div className="bg-gray-50 py-16">
        <Container>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Frequently Asked Questions</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to common questions about our services.
            </p>
          </div>

          <ContactFAQ />

          <div className="mt-12 text-center">
            <p className="text-black mb-4">
              Still have questions? Our customer service team is here to help.
            </p>
            <Button variant="blackInvert" asChild>
              <a href="mailto:info@fineystjackets.com">Contact Support</a>
            </Button>
          </div>
        </Container>
      </div>
    </section>
    </>
  )
}
