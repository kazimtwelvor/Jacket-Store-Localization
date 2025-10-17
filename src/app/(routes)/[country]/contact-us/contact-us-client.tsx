"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Mail,
  Phone,
  Clock,
  Instagram,
  Twitter,
  Facebook,
  MessageSquare,
  HeadphonesIcon,
  ShieldCheck,
  Clock8,
} from "lucide-react"
import Container from "@/src/app/ui/container"
import { Button } from "@/src/app/ui/button"
import ContactFAQ from "@/src/app/components/contact/contact-faq"
import ContactForm from "./components/contact-form"
import { useCountry } from "@/src/hooks/use-country"
import { getContactData, ContactData } from "./data/contact-data-by-country"

interface ContactUsClientProps {
  initialData?: ContactData
}

export default function ContactUsClient({ initialData }: ContactUsClientProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { countryCode } = useCountry()

  const contactData = initialData || getContactData(countryCode)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Us - Fineyst",
    "description": "Get in touch with our team for any questions, feedback, or support.",
    "url": `https://www.fineystjackets.com/${countryCode}/contact-us`
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Fineyst",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": contactData.phone,
        "contactType": "customer service",
        "email": contactData.email,
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

  const iconMap = {
    "Mail": Mail,
    "Phone": Phone,
    "MessageSquare": MessageSquare,
    "Clock": Clock,
    "HeadphonesIcon": HeadphonesIcon,
    "ShieldCheck": ShieldCheck,
    "Clock8": Clock8,
    "Instagram": Instagram,
    "Twitter": Twitter,
    "Facebook": Facebook,
    "Pinterest": () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.562-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.001 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
    "24/7 Support": HeadphonesIcon,
    "Quick Response": Clock,
    "Expert Help": ShieldCheck,
    "Multiple Channels": MessageSquare
  }

  if (!isMounted) {
    return (
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
                {contactData.title}
              </h1>
              <p className="text-lg md:text-xl text-[#333333] mb-6">
                {contactData.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {contactData.heroFeatures.map((feature, i) => {
                  const IconComponent = iconMap[feature as keyof typeof iconMap] || HeadphonesIcon
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-[#EAEAEA] flex items-center justify-center mb-3 shadow-md">
                        <IconComponent className="w-7 h-7 text-[2b2b2b]" />
                      </div>
                      <p className="font-medium text-[#333333]">{feature}</p>
                    </div>
                  )
                })}
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
                  {contactData.contactMethods.map((method, index) => {
                    const IconComponent = iconMap[method.icon as keyof typeof iconMap] || Mail
                    return (
                      <div key={index} className="flex items-start">
                        <div className="bg-[#EAEAEA] p-3 rounded-full mr-4">
                          <IconComponent className="h-6 w-6 text-[#2b2b2b]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{method.title}</h3>
                          <p className="text-muted-foreground mb-1">{method.description}</p>
                          <p className="text-muted-foreground">
                            {method.link ? (
                              <a href={method.link} className="hover:text-[#2b2b2b] transition-colors">
                                {method.contact}
                              </a>
                            ) : (
                              method.contact
                            )}
                          </p>
                          {method.hours && (
                            <p className="text-muted-foreground mt-1">
                              <a href={method.link} className="text-[#2b2b2b] hover:underline">
                                {method.hours}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-12">
                  <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {contactData.socialLinks.map((social, index) => {
                      const IconComponent = iconMap[social.icon as keyof typeof iconMap] || Instagram
                      return (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-background hover:bg-[#EAEAEA] p-3 rounded-full transition-colors"
                        >
                          <IconComponent className="h-6 w-6" />
                        </a>
                      )
                    })}
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
              <h2 className="text-3xl font-bold mb-4">Our Customer Support</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're committed to providing exceptional customer service through multiple support channels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactData.supportFeatures.map((feature, index) => {
                const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || HeadphonesIcon
                return (
                  <div key={index} className="bg-white p-8 rounded-xl shadow-sm text-center">
                    <div className="mx-auto w-16 h-16 bg-[#EAEAEA] rounded-full flex items-center justify-center mb-6">
                      <IconComponent className="h-8 w-8 text-[#2b2b2b]" />
                    </div>
                    <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    <p className="text-sm font-medium">
                      {feature.metric} <span className="text-[#2b2b2b]">{feature.metricValue}</span>
                    </p>
                  </div>
                )
              })}
            </div>
          </Container>
        </div>

        <div className="bg-gray-50 py-16">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
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
                <a href={`mailto:${contactData.email}`}>Contact Support</a>
              </Button>
            </div>
          </Container>
        </div>
      </section>
    )
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
                {contactData.title}
              </h1>
              <p className="text-lg md:text-xl text-[#333333] mb-6">
                {contactData.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {contactData.heroFeatures.map((feature, i) => {
                  const IconComponent = iconMap[feature as keyof typeof iconMap] || HeadphonesIcon
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-[#EAEAEA] flex items-center justify-center mb-3 shadow-md">
                        <IconComponent className="w-7 h-7 text-[2b2b2b]" />
                      </div>
                      <p className="font-medium text-[#333333]">{feature}</p>
                    </div>
                  )
                })}
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
                  {contactData.contactMethods.map((method, index) => {
                    const IconComponent = iconMap[method.icon as keyof typeof iconMap] || Mail
                    return (
                      <div key={index} className="flex items-start">
                        <div className="bg-[#EAEAEA] p-3 rounded-full mr-4">
                          <IconComponent className="h-6 w-6 text-[#2b2b2b]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{method.title}</h3>
                          <p className="text-muted-foreground mb-1">{method.description}</p>
                          <p className="text-muted-foreground">
                            {method.link ? (
                              <a href={method.link} className="hover:text-[#2b2b2b] transition-colors">
                                {method.contact}
                              </a>
                            ) : (
                              method.contact
                            )}
                          </p>
                          {method.hours && (
                            <p className="text-muted-foreground mt-1">
                              <a href={method.link} className="text-[#2b2b2b] hover:underline">
                                {method.hours}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-12">
                  <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {contactData.socialLinks.map((social, index) => {
                      const IconComponent = iconMap[social.icon as keyof typeof iconMap] || Instagram
                      return (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-background hover:bg-[#EAEAEA] p-3 rounded-full transition-colors"
                        >
                          <IconComponent className="h-6 w-6" />
                        </a>
                      )
                    })}
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
              <h2 className="text-3xl font-bold mb-4">Our Customer Support</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're committed to providing exceptional customer service through multiple support channels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactData.supportFeatures.map((feature, index) => {
                const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || HeadphonesIcon
                return (
                  <div key={index} className="bg-white p-8 rounded-xl shadow-sm text-center">
                    <div className="mx-auto w-16 h-16 bg-[#EAEAEA] rounded-full flex items-center justify-center mb-6">
                      <IconComponent className="h-8 w-8 text-[#2b2b2b]" />
                    </div>
                    <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    <p className="text-sm font-medium">
                      {feature.metric} <span className="text-[#2b2b2b]">{feature.metricValue}</span>
                    </p>
                  </div>
                )
              })}
            </div>
          </Container>
        </div>

        <div className="bg-gray-50 py-16">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
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
                <a href={`mailto:${contactData.email}`}>Contact Support</a>
              </Button>
            </div>
          </Container>
        </div>
      </section>
    </>
  )
}
