"use client"

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Heart, X } from 'lucide-react'
import type { Product } from '@/types'

interface SuggestedProductsProps {
    isOpen: boolean
    onClose: () => void
    products: Product[]
}

const SuggestedProducts: React.FC<SuggestedProductsProps> = ({
    isOpen,
    onClose,
    products
}) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!isOpen) return null

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % Math.max(1, products.length - 1))
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + Math.max(1, products.length - 1)) % Math.max(1, products.length - 1))
    }

    return (
        <section className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center">
            <section className="bg-white w-[400px] max-h-[600px] overflow-hidden relative">
                <section className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold">SUGGESTED FOR YOU</h3>
                    <button onClick={onClose} className="p-1">
                        <X size={20} />
                    </button>
                </section>

                <section className="relative">
                    <section className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {products.map((product, index) => (
                            <section key={product.id} className="w-full flex-shrink-0 p-4">
                                <section className="relative">
                                    <Image
                                        src={product.images?.[0]?.image?.url || "/placeholder.svg"}
                                        alt={product.name}
                                        width={300}
                                        height={400}
                                        className="w-full h-80 object-cover"
                                    />
                                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow">
                                        <Heart size={16} />
                                    </button>
                                    {product.salePrice && (
                                        <section className="absolute top-2 left-2 bg-[#2b2b2b] text-white px-2 py-1 text-xs">
                                            Sale-{Math.round(((parseFloat(product.price) - parseFloat(product.salePrice)) / parseFloat(product.price)) * 100)}%
                                        </section>
                                    )}
                                </section>

                                <section className="mt-3">
                                    <p className="font-semibold text-sm mb-1">{product.brandName || 'FINEYST'}</p>
                                    <h4 className="text-sm font-medium mb-2">{product.name}</h4>
                                    <section className="flex items-center gap-2">
                                        {product.salePrice ? (
                                            <>
                                                <span className="text-gray-500 line-through text-sm">${parseFloat(product.price).toFixed(2)}</span>
                                                <span className="text-red-600 font-semibold">${parseFloat(product.salePrice).toFixed(2)}</span>
                                            </>
                                        ) : (
                                            <span className="font-semibold">${parseFloat(product.price).toFixed(2)}</span>
                                        )}
                                    </section>

                                    {product.colorDetails && (
                                        <section className="flex gap-1 mt-2">
                                            {product.colorDetails.slice(0, 3).map((color, idx) => (
                                                <section key={idx} className="flex items-center gap-1">
                                                    <section
                                                        className="w-4 h-4 rounded-full border"
                                                        style={{ backgroundColor: color.hex || '#000' }}
                                                    />
                                                    <span className="text-xs">{color.name}</span>
                                                </section>
                                            ))}
                                        </section>
                                    )}
                                </section>
                            </section>
                        ))}
                    </section>

                    {products.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </section>

                <section className="p-4 border-t">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-900 text-white py-3 font-medium hover:bg-gray-800"
                    >
                        CONTINUE SHOPPING
                    </button>
                </section>
            </section>
        </section>
    )
}

export default SuggestedProducts