"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import ResponsiveContainer from "@/src/app/ui/responsive-container"

export const MobileBannerContent = () => {
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
                    className="text-[36px] sm:text-[48px] font-bold mb-5 leading-tight tracking-tight text-center w-full"
                    style={{ fontFamily: 'var(--font-averta-black)' }}
                >
                    FINEYST SALE
                </motion.h1>

                <motion.p
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0 }}
                    style={{ fontFamily: 'var(--font-averta-default)' }}
                    className="text-sm sm:text-base px-6 mb-10 mx-auto text-center w-full"
                >
                    UP TO <span className="font-black">50%</span> OFF + CODE: <span className="font-black">STREET15</span>
                </motion.p>

                <motion.section
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0 }}
                    className="flex justify-center gap-5 w-full"
                >
                    <Link href="/shop" aria-label="Shop men's collection">
                        <button className="bg-[#2b2b2b] text-white font-bold py-3 px-8 text-sm uppercase block min-w-[120px]">
                            SHOP MEN
                        </button>
                    </Link>
                    <Link href="/shop" aria-label="Shop women's collection">
                        <button className="bg-[#2b2b2b] text-white font-bold py-3 px-8 text-sm uppercase block min-w-[120px]">
                            SHOP WOMEN
                        </button>
                    </Link>
                </motion.section>
            </section>
        </ResponsiveContainer>
    )
}
