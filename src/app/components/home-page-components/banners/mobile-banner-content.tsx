"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import ResponsiveContainer from "@/src/app/ui/responsive-container"
import { avertaBlack } from "@/src/lib/fonts"
import { useCountry } from "@/src/hooks/use-country"

export const MobileBannerContent = () => {
    const { countryCode } = useCountry()
    
    return (
        <ResponsiveContainer>
            <section
                className="py-24 sm:py-28 text-center flex flex-col items-center justify-end mx-auto min-h-[600px] sm:min-h-[720px] relative z-10 transform-gpu pb-16"
                style={{ width: "100%", maxWidth: "480px" }}
            >
                <motion.h1
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0 }}
                    className={`${avertaBlack.className} text-[36px] sm:text-[48px] font-bold mb-5 leading-tight tracking-tight text-center w-full`}
                >
                    FINEYST JACKETS
                </motion.h1>

                <motion.p
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0 }}
                    className="text-sm sm:text-base px-6 mb-10 mx-auto text-center w-full"
                >
                    <span className={`${avertaBlack.className} font-black`}>Where Leather Meets Legacy.</span>
                </motion.p>

                <motion.section
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0 }}
                    className="flex justify-center gap-5 w-full"
                >
                    <Link href={`/${countryCode}/collections/leather-bomber-jacket-mens`} aria-label="Shop men's collection">
                        <button className={`${avertaBlack.className} bg-[#2b2b2b] text-white font-bold py-3 px-8 text-sm uppercase block min-w-[120px]`}>
                            SHOP MEN
                        </button>
                    </Link>
                    <Link href={`/${countryCode}/collections/womens-leather-bomber-jackets`} aria-label="Shop women's collection">
                        <button className={`${avertaBlack.className} bg-[#2b2b2b] text-white font-bold py-3 px-8 text-sm uppercase block min-w-[120px]`}>
                            SHOP WOMEN
                        </button>
                    </Link>
                </motion.section>
            </section>
        </ResponsiveContainer>
    )
}
