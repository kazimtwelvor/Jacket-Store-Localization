"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUp } from "lucide-react"
import Container from "@/src/app/ui/container"
import { Button } from "@/src/app/ui/button"
import Script from "next/script"

export default function PrivacyPolicyClient() {
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initFixedSticky = () => {
      if (window.jQuery && sidebarRef.current) {
        window.jQuery(sidebarRef.current).fixedsticky()
      }
    }

    if (window.jQuery) {
      const checkFixedStickyInterval = setInterval(() => {
        if (window.jQuery.fn.fixedsticky) {
          clearInterval(checkFixedStickyInterval)
          initFixedSticky()
        }
      }, 100)
      setTimeout(() => clearInterval(checkFixedStickyInterval), 5000)
    }

    return () => {
    }
  }, [])

  return (
    <section className="bg-background pb-20">
      <Script src="https://code.jquery.com/jquery-3.6.0.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/fixed-sticky@0.1.7/fixedsticky.min.js" strategy="beforeInteractive" />
      <Container>
        <div className="max-w-3xl mx-auto text-center pt-16 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[#2b2b2b] mb-6">Privacy Policy</h1>
          <p className="text-lg md:text-xl text-[#1B1B1B] mb-8">
            How we collect, use, and protect your personal information
          </p>
        </div>
      </Container>

      <Container>
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="lg:w-1/4">
            <div
              ref={sidebarRef}
              className="sidebar fixedsticky bg-muted p-6 rounded-lg shadow-md border border-black"
            >
              <h2 className="text-xl font-bold mb-4 border-black">Contents</h2>
              <ul className="space-y-3">
                {[
                  { id: "information-we-collect", title: "Information We Collect" },
                  { id: "how-we-use-information", title: "How We Use Your Information" },
                  { id: "sharing-your-information", title: "Sharing Your Information" },
                  { id: "cookies", title: "Cookies and Tracking Technologies" },
                  { id: "data-retention", title: "Data Retention" },
                  { id: "your-rights", title: "Your Rights" },
                  { id: "childrens-privacy", title: "Children's Privacy" },
                  { id: "changes", title: "Changes to This Privacy Policy" },
                  { id: "contact-us", title: "Contact Us" },
                ].map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="flex items-center p-2 rounded-md hover:bg-gray-100 text-black hover:border-black transition-colors"
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b2b2b2] mr-2"></span>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-black">
                <Button
                  variant="blackInvert"
                  size="sm"
                  asChild
                  className="w-full"
                >
                  <Link href="/us/contact-us">Questions? Contact Us</Link>
                </Button>
              </div>
            </div>
          </aside>

          <div className="lg:w-3/4 mb-12">
            <div className="prose prose-lg max-w-none">
              <div id="information-we-collect" className="scroll-mt-24">
                <div className="bg-white p-8 rounded-lg shadow-md mb-8 border border-black hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-bold mb-4 border-black">1. Information We Collect</h2>

                  <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800">Personal Information</h3>
                  <p className="text-gray-600 mb-4">
                    When you visit the Site, we automatically collect certain information about your device, including
                    information about your web browser, IP address, time zone, and some of the cookies that are
                    installed on your device.
                  </p>

                  <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800">Order Information</h3>
                  <p className="text-gray-600 mb-4">
                    When you make a purchase or attempt to make a purchase through the Site, we collect certain
                    information from you, including your name, billing address, shipping address, payment information
                    (including credit card numbers), email address, and phone number.
                  </p>

                  <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800">Device Information</h3>
                  <p className="text-gray-600">We collect device information using the following technologies:</p>
                  <ul className="list-disc pl-6 mt-2 mb-4 text-gray-600">
                    <li className="mb-2">
                      <strong>Cookies</strong> are data files that are placed on your device or computer and often
                      include an anonymous unique identifier.
                    </li>
                    <li className="mb-2">
                      <strong>Log files</strong> track actions occurring on the Site, and collect data including your IP
                      address, browser type, Internet service provider, referring/exit pages, and date/time stamps.
                    </li>
                    <li>
                      <strong>Web beacons, tags, and pixels</strong> are electronic files used to record information
                      about how you browse the Site.
                    </li>
                  </ul>
                </div>
              </div>

              <div id="how-we-use-information" className="scroll-mt-24">
                <div className="bg-white p-8 rounded-lg shadow-md mb-8 border border-black hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-bold mb-4 border-black">2. How We Use Your Information</h2>

                  <p className="text-gray-600 mb-4">
                    We use the Order Information that we collect generally to fulfill any orders placed through the Site
                    (including processing your payment information, arranging for shipping, and providing you with
                    invoices and/or order confirmations).
                  </p>

                  <p className="text-gray-600 mb-4">Additionally, we use this Order Information to:</p>
                  <ul className="list-disc pl-6 mt-2 mb-4 text-gray-600">
                    <li className="mb-2">Communicate with you about your order</li>
                    <li className="mb-2">Screen our orders for potential risk or fraud</li>
                    <li className="mb-2">
                      Provide you with information or advertising relating to our products or services
                    </li>
                    <li>Improve and optimize our store and customer experience</li>
                  </ul>

                  <p className="text-gray-600">
                    We use the Device Information that we collect to help us screen for potential risk and fraud (in
                    particular, your IP address), and more generally to improve and optimize our Site.
                  </p>
                </div>
              </div>

              <div id="sharing-your-information" className="scroll-mt-24">
                <div className="bg-white p-8 rounded-lg shadow-md mb-8 border border-black hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-bold mb-4 border-black">3. Sharing Your Information</h2>

                  <p className="text-gray-600 mb-4">
                    We share your Personal Information with third parties to help us use your Personal Information, as
                    described above.
                  </p>

                  <p className="text-gray-600 mb-4">
                    We use Google Analytics to help us understand how our customers use the Site. You can read more
                    about how Google uses your Personal Information here:{" "}
                    <a
                      href="https://www.google.com/intl/en/policies/privacy/"
                      className="border-black hover:underline"
                    >
                      https://www.google.com/intl/en/policies/privacy/
                    </a>
                    .
                  </p>

                  <p className="text-gray-600 mb-4">
                    We may also share your Personal Information to comply with applicable laws and regulations, to
                    respond to a subpoena, search warrant or other lawful request for information we receive, or to
                    otherwise protect our rights.
                  </p>
                </div>
              </div>

              <div id="cookies" className="scroll-mt-24">
                <div className="bg-white p-8 rounded-lg shadow-md mb-8 border border-black hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-bold mb-4 border-black">4. Cookies and Tracking Technologies</h2>

                  <p className="text-gray-600 mb-4">
                    Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set
                    your browser to remove or reject browser cookies. Please note that if you choose to remove or reject
                    cookies, this could affect certain features or services of our Site.
                  </p>

                  <p className="text-gray-600">
                    We honor Do Not Track signals and do not track, plant cookies, or use advertising when a Do Not
                    Track (DNT) browser mechanism is in place.
                  </p>
                </div>
              </div>

              <div id="data-retention" className="scroll-mt-24">
                <div className="bg-white p-8 rounded-lg shadow-md mb-8 border border-black hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-bold mb-4 border-black">5. Data Retention</h2>

                  <p className="text-gray-600">
                    When you place an order through the Site, we will maintain your Order Information for our records
                    unless and until you ask us to delete this information. We store your Personal Information for as
                    long as needed to provide you with our services and to comply with our legal obligations.
                  </p>
                </div>
              </div>

              <div id="your-rights" className="scroll-mt-24">
                <div className="bg-white p-8 rounded-lg shadow-md mb-8 border border-black hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-bold mb-4 border-black">6. Your Rights</h2>

                  <p className="text-gray-600 mb-4">
                    If you are a European resident, you have the right to access personal information we hold about you
                    and to ask that your personal information be corrected, updated, or deleted. If you would like to
                    exercise this right, please contact us.
                  </p>

                  <p className="text-gray-600 mb-4">
                    Additionally, if you are a European resident, we note that we are processing your information in
                    order to fulfill contracts we might have with you, or otherwise to pursue our legitimate business
                    interests listed above.
                  </p>

                  <p className="text-gray-600">
                    For California residents, the California Consumer Privacy Act (CCPA) provides additional rights
                    regarding personal information. To learn more about your California privacy rights, visit our CCPA
                    Privacy Notice for California Residents.
                  </p>
                </div>
              </div>

              <div id="childrens-privacy" className="scroll-mt-24">
                <div className="bg-white p-8 rounded-lg shadow-md mb-8 border border-black hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-bold mb-4 border-black">7. Children's Privacy</h2>

                  <p className="text-gray-600">
                    Our Site is not intended for individuals under the age of 16. We do not knowingly collect personal
                    information from children under 16. If you are a parent or guardian and you are aware that your
                    child has provided us with personal information, please contact us so that we can take necessary
                    actions.
                  </p>
                </div>
              </div>

              <div id="changes" className="scroll-mt-24">
                <div className="bg-white p-8 rounded-lg shadow-md mb-8 border border-black hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-bold mb-4 border-black">8. Changes to This Privacy Policy</h2>

                  <p className="text-gray-600">
                    We may update this privacy policy from time to time in order to reflect, for example, changes to our
                    practices or for other operational, legal or regulatory reasons. We will notify you of any changes
                    by posting the new privacy policy on this page and updating the "Last Updated" date at the top of
                    this page.
                  </p>
                </div>
              </div>

              <div id="contact-us" className="scroll-mt-24">
                <div className="bg-white p-8 rounded-lg shadow-md border border-black hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-bold mb-4 border-black">9. Contact Us</h2>

                  <p className="text-gray-600 mb-6">
                    For more information about our privacy practices, if you have questions, or if you would like to
                    make a complaint, please contact us by e-mail at info@fineystjackets.com or by mail using the details
                    provided below:
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Top Button */}
            <div className="text-center mt-12">
              <Button
                variant="blackInvert"
                size="sm"
                className="rounded-full h-12 w-12 p-0"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {/* CSS for fixedsticky - exactly as in the sample */}
      <style jsx global>{`
        /* Fixed-sticky CSS from the sample */
        @media (min-width: 43.75em) {
          .fixedsticky {
            top: 0;
          }
        }
        
        /* Basic fixedsticky CSS */
        .fixedsticky {
          position: -webkit-sticky;
          position: sticky;
        }
        
        /* When position: sticky is supported but native behavior is ignored */
        .fixedsticky-withoutfixedfixed .fixedsticky-off,
        .fixed-supported .fixedsticky-on {
          position: static;
        }
        
        .fixedsticky-withoutfixedfixed .fixedsticky-on,
        .fixed-supported .fixedsticky-on {
          position: fixed;
        }
        
        .fixedsticky-dummy {
          display: none;
        }
        
        .fixedsticky-on + .fixedsticky-dummy {
          display: block;
        }
      `}</style>
    </section>
  )
}

// Add TypeScript interface for jQuery with fixedsticky
declare global {
  interface JQuery {
    fixedsticky: () => JQuery
  }

  interface Window {
    jQuery: any
  }
}
