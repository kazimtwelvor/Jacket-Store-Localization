
"use client"

import type React from "react"
import { avertaBlack } from "@/src/lib/fonts"
import ProductCategory from "./product-category"

const colorCollectionMen = [
  {
    id: "color-black-men",
    name: "BLACK JACKETS",
    imageUrl: "/images/color-collection/Black.webp",
    href: "/collections/leather-bomber-jacket-mens",
  },
  {
    id: "color-brown-men",
    name: "BROWN JACKETS",
    imageUrl: "/images/color-collection/Brown .webp",
    href: "/collections/mens-suede-jackets",
  },
  {
    id: "color-red-women",
    name: "RED JACKETS",
    imageUrl: "/images/color-collection/Red.webp",
    href: "/collections/mens-suede-jackets",
  },
  {
    id: "color-white-men",
    name: "WHITE JACKETS",
    imageUrl: "/images/color-collection/White .webp",
    href: "/collections/mens-denim-jackets",
  },
  {
    id: "color-pink-men",
    name: "PINK JACKETS",
    imageUrl: "/images/color-collection/Pink.webp",
    href: "/collections/mens-suede-jackets",
  },
  {
    id: "color-blue-men",
    name: "BLUE JACKETS",
    imageUrl: "/images/color-collection/Blue.webp",
    href: "/collections/mens-puffer-jackets",
  },
  {
    id: "color-green-women",
    name: "GREEN JACKETS",
    imageUrl: "/images/color-collection/Green.webp",
    href: "/collections/mens-suede-jackets",
  },


  {
    id: "color-yellow-men",
    name: "YELLOW JACKETS",
    imageUrl: "/images/color-collection/Yellow .webp",
    href: "/collections/mens-suede-jackets",
  },


];



export default function JacketColorCollection() {
  return (
    <section className="w-full bg-[#2B2B2B] text-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>
      <div className="w-full  px-4 pt-10 pb-12 md:pb-20 relative z-10">
        <div className="text-center mb-20">
          <h2 className={`text-2xl text-white sm:text-3xl md:text-4xl mb-6 tracking-tight leading-tight ${avertaBlack.className}`}>
            OUR COLOR COLLECTION
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our exclusive range of premium jackets across different styles.
          </p>
        </div>

        <ProductCategory
          bg="bg-[#2B2B2B]"
          arrowBgColor="bg-white"
          arrowTextColor="text-black"
          arrowHoverBgColor="hover:bg-gray-200"
          tabTextColor="text-gray-600"
          tabActiveColor="border-black text-black"
          tabHoverColor="hover:text-black"
          showTabs={false}
          categories={{
            men: colorCollectionMen,
            women: colorCollectionMen
          }}
        />
      </div>
    </section>
  )
}