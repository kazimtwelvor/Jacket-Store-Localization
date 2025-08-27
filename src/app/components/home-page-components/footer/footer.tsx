"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, ChevronDown, Star, Phone, Mail } from "lucide-react"
import Image from "next/image"
import { avertaBlack, avertaBold } from "@/src/lib/fonts"



const Footer = () => {
    const [emailInput, setEmailInput] = useState("")
    const [expandedSection, setExpandedSection] = useState("")
    const [categories, setCategories] = useState<any[]>([])
    const currentYear = new Date().getFullYear()

    const toggleSection = (div: string) => {
        setExpandedSection(expandedSection === div ? "" : div)
    }

    const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        alert("Thank you for subscribing to our newsletter!")
        setEmailInput("")
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL
                if (!baseUrl) return
                const res = await fetch(`${baseUrl}/category-pages?all=true`, {
                    next: { revalidate: 0 },
                    cache: "no-store",
                    headers: { "Content-Type": "application/json" },
                })
                if (!res.ok) return
                const contentType = res.headers.get("content-type") || ""
                if (!contentType.includes("application/json")) return
                const data = await res.json()
                if (Array.isArray(data)) {
                    setCategories(data.slice(0, 8))
                }
            } catch {
                // ignore
            }
        }
        loadCategories()
    }, [])

    return (
        <footer className={` bg-[#F6F6F6] text-black pt-16 pb-8 px-5 md:px-0 relative`}>
            <section className="container mx-auto">
                <div className="flex flex-col md:flex-row md:justify-start md:gap-14 gap-14 mb-8">
                    <div className="space-y-4 flex-shrink-0 md:w-64 flex flex-col items-center md:items-start">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="mb-3 flex justify-center md:justify-start">
                                <Link href="/" className="flex items-center justify-center">
                                    <img
                                        src="/images/logo-footer.webp"
                                        alt="Fineyst Logo"
                                        style={{ display: 'block', maxWidth: '250px', width: '100%', height: 'auto' }}
                                    />
                                </Link>
                            </div>
                            <p className={`text-black ${avertaBold.className} text-sm mt-2 text-center md:text-left`}>Experience the finest quality and timeless design. Your destination for luxury.</p>
                        </div>
                        <div className="space-y-3 w-full flex flex-col items-center md:items-start">
                            <div className="flex items-center md:items-start">
                                <div className="text-black mr-3 mt-1 flex-shrink-0">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                </div>
                                <span className="text-black text-sm font-semibold text-center md:text-left">123 Fineyst St, Luxury City, LC 12345</span>
                            </div>

                            <div className="flex items-center md:items-start">
                                <div className="text-black mr-3 flex-shrink-0">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <Link href="tel:+18004846267" className="text-black font-semibold text-sm hover:font-bold transition-all">
                                    Call (800) 484-6267
                                </Link>
                            </div>

                            <div className="flex items-center md:items-start">
                                <div className="text-black mr-3 flex-shrink-0">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <Link href="mailto:support@fineyst.com" className="text-black font-semibold text-sm hover:font-bold transition-all">
                                    support@fineyst.com
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid md:grid-cols-2 lg:flex lg:flex-row gap-1 sm:gap-18 md:gap-10 lg:gap-20 xl:gap-24 2xl:gap-28 justify-center sm:justify-start md:justify-center lg:justify-end flex-1 mt-6 sm:mt-4 md:mt-6 lg:mt-0 md:mr-4 lg:mr-6">
                        <div className="md:border-0 md:pb-0 mb-1 md:mb-0 text-center md:text-left">
                            <button
                                className="flex bg[#efefef] lg:bg-transparent border border-gray-300 lg:border-none px-4 py-3 lg:px-0 lg:py-0 rounded-lg lg:rounded-none justify-between items-center w-full text-black font-semibold text-xl mb-0 lg:mb-4 lg:cursor-default text-center md:text-left"
                                onClick={() => toggleSection('shop')}
                            >
                                <h3 className={`w-full text-center md:text-left ${avertaBold.className}`}>SHOP</h3>
                                <ChevronDown className={`h-5 w-5 lg:hidden transition-transform text-black ${expandedSection === 'shop' ? 'rotate-180' : ''}`} />
                            </button>
                            <ul className={`${avertaBold.className} space-y-2 ${expandedSection === 'shop' ? 'block' : 'hidden'} lg:block bg-[#eaeaea] lg:bg-transparent px-4 py-3 lg:px-0 lg:py-0 rounded-b-lg lg:rounded-none text-center md:text-left`}>


                                <li>
                                    <Link href="/shop" className="text-black  hover:font-semibold transition-all" >
                                        Shop
                                    </Link>
                                </li>

                            </ul>
                        </div>
                        <div className="md:border-0 md:pb-0 mb-1 md:mb-0 text-center md:text-left">
                            <button
                                className="flex bg-[#efefef] lg:bg-transparent border border-gray-300 lg:border-none px-4 py-3 lg:px-0 lg:py-0 rounded-lg lg:rounded-none justify-between items-center w-full text-black font-semibold text-xl mb-0 lg:mb-4 lg:cursor-default text-center md:text-left"
                                onClick={() => toggleSection('categories')}
                            >
                                <h3 className={`w-full text-center md:text-left ${avertaBold.className}`}>CATEGORIES</h3>
                                <ChevronDown className={`h-5 w-5 lg:hidden transition-transform text-black ${expandedSection === 'categories' ? 'rotate-180' : ''}`} />
                            </button>
                            <ul className={`${avertaBold.className} space-y-2 ${expandedSection === 'categories' ? 'block' : 'hidden'} lg:block bg-[#eaeaea] lg:bg-transparent px-4 py-3 lg:px-0 lg:py-0 rounded-b-lg lg:rounded-none text-center md:text-left`}>
                                <li>
                                    <Link href="/collections/mens-leather-jackets" className="text-black hover:font-bold transition-all">
                                        Men's Leather Jackets
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/collections/mens-jackets" className="text-black hover:font-bold transition-all">
                                        Men's Jackets
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/collections/mens-letterman-jackets" className="text-black hover:font-bold transition-all">
                                        Men's Letterman Jackets
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/collections/mens-denim-jackets" className="text-black hover:font-bold transition-all">
                                        Men's Denim Jackets
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/collections" className="text-black  hover:font-bold transition-all">
                                        View All
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="md:border-0 md:pb-0 mb-1 md:mb-0 text-center md:text-left">
                            <button
                                className="flex bg-[#efefef] lg:bg-transparent border border-gray-300 lg:border-none px-4 py-3 lg:px-0 lg:py-0 rounded-lg lg:rounded-none justify-between items-center w-full text-black font-semibold text-xl mb-0 lg:mb-4 lg:cursor-default text-center md:text-left"
                                onClick={() => toggleSection('company')}
                            >
                                <h3 className={`w-full text-center md:text-left ${avertaBold.className}`}>COMPANY</h3>
                                <ChevronDown className={`h-5 w-5 lg:hidden transition-transform text-black ${expandedSection === 'company' ? 'rotate-180' : ''}`} />
                            </button>
                            <ul className={`${avertaBold.className} space-y-2 ${expandedSection === 'company' ? 'block' : 'hidden'} lg:block bg-[#eaeaea] lg:bg-transparent px-4 py-3 lg:px-0 lg:py-0 rounded-b-lg lg:rounded-none text-center md:text-left`}>
                                <li>
                                    <Link href="/blogs" className="text-black hover:font-bold transition-all">
                                        Blogs
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about-us" className="text-black hover:font-bold transition-all">
                                        About Us
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="md:border-0 md:pb-0 mb-1 md:mb-0 text-center md:text-left">
                            <button
                                className="flex bg-[#efefef] lg:bg-transparent border border-gray-300 lg:border-none px-4 py-3 lg:px-0 lg:py-0 rounded-lg lg:rounded-none justify-between items-center w-full text-black font-semibold text-xl mb-0 lg:mb-4 lg:cursor-default text-center md:text-left"
                                onClick={() => toggleSection('support')}
                            >
                                <h3 className={`w-full text-center md:text-left ${avertaBold.className}`}>SUPPORT</h3>
                                <ChevronDown className={`h-5 w-5 lg:hidden transition-transform text-black ${expandedSection === 'support' ? 'rotate-180' : ''}`} />
                            </button>
                            <ul className={`${avertaBold.className} space-y-2 ${expandedSection === 'support' ? 'block' : 'hidden'} lg:block bg-[#eaeaea] lg:bg-transparent px-4 py-3 lg:px-0 lg:py-0 rounded-b-lg lg:rounded-none text-center md:text-left`}>
                                <li>
                                    <Link href="/faqs" className="text-black hover:font-bold transition-all">
                                        FAQs
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/reviews" className="text-black hover:font-bold transition-all">
                                        Reviews
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact-us" className="text-black hover:font-bold transition-all">
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/size-guide" className="text-black hover:font-bold transition-all">
                                        Size Guide
                                    </Link>
                                </li>


                            </ul>
                        </div>
                        <div className="md:border-0 md:pb-0 mb-1 md:mb-0 text-center md:text-left">
                            <button
                                className="flex bg-[#efefef] lg:bg-transparent border border-gray-300 lg:border-none px-4 py-3 lg:px-0 lg:py-0 rounded-lg lg:rounded-none justify-between items-center w-full text-black font-semibold text-xl mb-0 lg:mb-4 lg:cursor-default text-center md:text-left"
                                onClick={() => toggleSection('help')}
                            >
                                <h3 className={`w-full text-center md:text-left ${avertaBold.className}`}>HELP</h3>
                                <ChevronDown className={`h-5 w-5 lg:hidden transition-transform text-black ${expandedSection === 'help' ? 'rotate-180' : ''}`} />
                            </button>
                            <ul className={`${avertaBold.className} space-y-2 ${expandedSection === 'help' ? 'block' : 'hidden'} lg:block bg-[#eaeaea] lg:bg-transparent px-4 py-3 lg:px-0 lg:py-0 rounded-b-lg lg:rounded-none text-center md:text-left`}>
                                <li>
                                    <Link href="/privacy-policy" className="text-black hover:font-bold transition-all">
                                        Privacy Policy
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/terms-conditions" className="text-black hover:font-bold transition-all">
                                        Terms & Conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/shipping-and-delivery-policy" className="text-black hover:font-bold transition-all">
                                        Shipping & Delivery
                                    </Link>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row  items-center mt-6 pt-6">
                    <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
                        <h3 className="text-black font-semibold mr-4 mb-3 md:mb-0">FOLLOW US</h3>
                        <div className="flex space-x-3">
                            <div className="w-10 h-10 bg-[#2b2b2b] rounded-full flex items-center justify-center">
                                <Link
                                    href="https://instagram.com/fineyst"
                                    className="p-2 hover:opacity-70 transition-opacity"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Follow us on Instagram"
                                >
                                    <Instagram size={20} className="text-[#dedddd]" strokeWidth={1.5} />
                                </Link>
                            </div>
                            <div className="w-10 h-10 bg-[#2b2b2b] rounded-full flex items-center justify-center">
                                <Link
                                    href="https://facebook.com/fineyst"
                                    className="p-2 hover:opacity-70 transition-opacity"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Follow us on Facebook"
                                >
                                    <Facebook size={20} className="text-[#dedddd]" strokeWidth={1.5} />
                                </Link>
                            </div>
                            <div className="w-10 h-10 bg-[#2b2b2b] rounded-full flex items-center justify-center">
                                <Link
                                    href="https://twitter.com/fineyst"
                                    className="p-2 hover:opacity-70 transition-opacity"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Follow us on Twitter"
                                >
                                    <Twitter size={20} className="text-[#dedddd]" strokeWidth={1.5} />
                                </Link>
                            </div>
                            <div className="w-10 h-10 bg-[#2b2b2b] rounded-full flex items-center justify-center">
                                <Link
                                    href="https://linkedin.com/company/fineyst"
                                    className="p-2 hover:opacity-70 transition-opacity"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Follow us on LinkedIn"
                                >
                                    <Linkedin size={20} className="text-[#dedddd]" strokeWidth={1.5} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Trust Signals Image */}
                    <div className="flex flex-col items-center my-4 md:my-0 md:mx-auto pl-0 md:pl-0 lg:pl-40">
                        <img
                            src="/images/trust-signals.webp"
                            alt="Trust Signals"
                            width="400"
                            height="130"
                            className="h-auto w-[250px] md:w-[320px]"
                        />
                    </div>

                    {/* Newsletter Signup */}
                    <div className="my-4 md:my-0 w-full md:w-auto px-4 md:text-right md:ml-auto flex-shrink-0">
                        <p className="text-black font-semibold mb-2 text-center md:text-right">Subscribe to Our Newsletter</p>
                        <p className="text-black font-semibold text-sm mb-3 text-center md:text-right">Get exclusive offers, design tips, and industry news</p>
                        <form onSubmit={handleSubscribe} className="flex md:justify-end">
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                required
                                className="bg-[#F6F6F6] border border-black rounded-l-md px-4 py-2 text-black w-full focus:outline-none focus:border-black"
                            />
                            <button
                                type="submit"
                                className="bg-[#2b2b2b] hover:bg-[black] text-[#dedddd] border-b border border-black font-medium px-4 py-2 rounded-r-md transition-colors"             >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
                <div className="border-t border-gray-600 mt-6 pt-4 px-4 md:px-0">
                    {/* Three-column layout for bottom footer */}
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        {/* Copyright - Left on desktop, hidden on mobile */}
                        <div className="hidden md:block md:mb-0 md:text-left md:w-1/3">
                            <p className="text-black font-semibold text-sm">© {currentYear} Fineyst. All rights reserved.</p>
                        </div>

                        {/* Legal Links - Center */}
                        <div className="mb-4 md:mb-0 md:w-1/3 flex justify-center">
                            <div className="flex flex-wrap justify-center gap-3 text-sm">
                                <Link href="/faqs" className="text-black font-semibold hover:font-bold transition-all mx-1">
                                    FAQs
                                </Link>
                                <Link href="/privacy-policy" className="text-black font-semibold hover:font-bold transition-all mx-1">
                                    Privacy
                                </Link>
                                <Link href="/terms-conditions" className="text-black font-semibold hover:font-bold transition-all mx-1">
                                    Terms
                                </Link>
                                <Link href="/shipping-and-delivery-policy" className="text-black font-semibold hover:font-bold transition-all mx-1">
                                    Shipping
                                </Link>
                                <Link href="/refund-and-returns-policy" className="text-black font-semibold hover:font-bold transition-all mx-1">
                                    Returns
                                </Link>
                            </div>
                        </div>
                        {/* Payment Methods - Right */}
                        <div className="text-center md:text-right md:w-1/3">
                            <p className="text-black font-semibold text-xs mb-2">Accepted Payment Methods</p>
                            <div className="flex justify-center md:justify-end">
                                <img
                                    src="/images/payment-methods.webp"
                                    alt="Accepted Payment Methods"
                                    width="400"
                                    height="50"
                                    className="h-8 w-auto"
                                />
                            </div>
                            {/* Copyright below payment methods on mobile only */}
                            <div className="mt-4 md:hidden">
                                <p className="text-black font-semibold text-sm">© {currentYear} Fineyst. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    )
}


export default Footer