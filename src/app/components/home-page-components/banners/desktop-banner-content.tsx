"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import ResponsiveContainer from "@/src/app/ui/responsive-container"
import { avertaBlack } from "@/src/lib/fonts"

export const DesktopBannerContent = () => {
  return (
    <ResponsiveContainer>
      <section className="py-24 sm:py-32 md:py-40 lg:py-48 text-center relative">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${avertaBlack.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6 md:mb-8 tracking-tight`}
          >
            FINEYST SALE
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: 'var(--font-averta-default)' }}
            className="text-sm sm:text-base md:text-lg text-black lg:text-xl mb-8 md:mb-10 max-w-3xl mx-auto"
          >
            UP TO <span className={`${avertaBlack.className} font-black`}>50% OFF</span> + CODE: <span className={`${avertaBlack.className} font-black`}>STREET15</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${avertaBlack.className} flex flex-col sm:flex-row justify-center gap-4 sm:gap-5`}
          >
            <Link href="/shop" aria-label="Shop men's collection">
              <button className="relative overflow-hidden bg-[#2b2b2b] text-white font-bold py-4 px-8 md:px-10 text-sm md:text-base uppercase w-full sm:w-auto min-w-[180px] hover:shadow-lg transition-all duration-300 group cursor-pointer hover:scale-105 hover:bg-[#1a1a1a] active:scale-95">
                <span className="relative z-10">Shop Men</span>
                <div className="absolute inset-0 w-0 bg-[#1a1a1a] transition-all duration-300 group-hover:w-full"></div>
              </button>
            </Link>
            <Link href="/shop" aria-label="Shop women's collection">
              <button className="relative overflow-hidden bg-[#2b2b2b] text-white font-bold py-4 px-8 md:px-10 text-sm md:text-base uppercase w-full sm:w-auto min-w-[180px] hover:shadow-lg transition-all duration-300 group cursor-pointer hover:scale-105 hover:bg-[#1a1a1a] active:scale-95">
                <span className="relative z-10">Shop Women</span>
                <div className="absolute inset-0 w-0 bg-[#1a1a1a] transition-all duration-300 group-hover:w-full"></div>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </ResponsiveContainer>
  )
}
