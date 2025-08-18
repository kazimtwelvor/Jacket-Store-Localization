
"use client"

import type React from "react"
import { avertaBlack } from "@/src/lib/fonts"
import ProductCategory from "./product-category"

export default function JacketColorCollection() {
  return (
    <section className="w-full bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>
      <div className="w-full  px-4 pt-10 pb-12 md:pb-20 relative z-10">
        <div className="text-center mb-20">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl mb-6 tracking-tight leading-tight ${avertaBlack.className}`}>
            OUR COLOR COLLECTION
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover our exclusive range of premium jackets across different styles.
          </p>
        </div>
        
        <ProductCategory 
          bg="bg-black" 
          arrowBgColor="bg-white"
          arrowTextColor="text-black"
          arrowHoverBgColor="hover:bg-gray-200"
          tabTextColor="text-gray-300"
          tabActiveColor="border-white text-white"
          tabHoverColor="hover:text-white"
        />
      </div>
    </section>
  )
}