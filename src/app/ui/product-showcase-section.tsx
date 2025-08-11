"use client"

import type React from "react"
import type { Product } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import Currency from "@/components/ui/currency"
import { useRouter } from "next/navigation"
import useCart from "@/hooks/use-cart"

interface ProductShowcaseSectionProps {
  title: string
  products: Product[]
  backgroundColor: string
  textColor: string
}

const ProductShowcaseSection: React.FC<ProductShowcaseSectionProps> = ({
  title,
  products,
  backgroundColor,
  textColor,
}) => {
  const router = useRouter()
  const cart = useCart()

  return (
    <div className="w-full relative overflow-hidden">
      <div className="relative w-full" style={{ backgroundColor }}>
        {/* Mobile-optimized layout */}
        <div className="md:hidden py-12 px-4 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">{title}</h2>
          <div className="grid grid-cols-1 gap-4">
            {products.slice(0, 2).map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
                <Link href={`/product/${product.id}`}>
                  <Image
                    src={product.images[0]?.url || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={400}
                    className="object-cover"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mt-2">{product.name}</h3>
                  <p className="text-gray-600">
                    <Currency value={product.price} />
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop version - hidden on mobile */}
        <div className="hidden md:block py-24">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-bold mb-6 text-center"
              style={{ color: textColor }}
            >
              {title}
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2b2b2b]/5 via-transparent to-[#2b2b2b]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="relative aspect-[3/4] cursor-pointer overflow-hidden">
                      <Image
                        src={product.images[0]?.url || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            cart.addItem(product)
                            router.push("/cart")
                          }}
                          className="w-full bg-white text-black hover:bg-gray-100 py-2 shadow-md"
                        >
                          <ShoppingCart size={14} className="mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 group-hover:text-[#2b2b2b] transition-colors duration-300 line-clamp-2 h-12">
                        {product.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        <div className="font-bold">
                          <Currency value={product.price} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductShowcaseSection