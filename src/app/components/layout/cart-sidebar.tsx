"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Heart, Truck, RotateCcw, ChevronRight } from "lucide-react"
import type { Product } from "@/types"
import Currency from "../../ui/currency"
import { useCart } from "../../contexts/CartContext"

interface CartSidebarProps {
    isOpen: boolean
    onClose: () => void
}

const CartSidebar: React.FC<CartSidebarProps> = ({
    isOpen,
    onClose
}) => {
    const { items, updateQuantity, removeFromCart, totalPrice } = useCart()
    const [showVoucherField, setShowVoucherField] = useState(false)
    const [couponCode, setCouponCode] = useState("")

    const shippingPrice = totalPrice > 100 ? 0 : 10
    const taxRate = 0.08
    const taxAmount = totalPrice * taxRate
    const grandTotal = totalPrice + shippingPrice + taxAmount

    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY
            document.body.style.position = 'fixed'
            document.body.style.top = `-${scrollY}px`
            document.body.style.width = '100%'
        } else {
            const scrollY = document.body.style.top
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
            window.scrollTo(0, parseInt(scrollY || '0') * -1)
        }
        return () => {
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 bg- z-[10000] hidden lg:flex" onClick={onClose}>
            <div className="ml-auto w-[600px] h-full bg-white flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">MY SHOPPING CART</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.location.href = '/cart'}
                            className="text-sm text-gray-600 hover:text-gray-800"
                        >
                            SEE DETAILS
                        </button>
                        <button onClick={onClose} className="p-1">
                            <X size={20} />
                        </button>
                    </div>
                </div>



                <div className="flex-1 overflow-y-auto">

                    {items.length > 0 && (
                        <div className="bg-gray-400 p-3 flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-black">GOOD CHOICE!</p>
                                <p className="text-sm text-black">Your item was added to the shopping cart</p>
                            </div>
                        </div>
                    )}

                    {items.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            Your cart is empty
                        </div>
                    ) : (
                        <>
                            {items.map((item) => (
                                <div key={item.id} className="p-4 border-b border-gray-200 relative">
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded z-10"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>

                                    <div className="flex gap-4">
                                        <div className="relative w-32 aspect-[3/5] flex-shrink-0">
                                            <Image
                                                src={item.product.images?.[0]?.url || "/placeholder.svg"}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <button className="absolute top-1 left-1 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm">
                                                <Heart className="w-3 h-3" />
                                            </button>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-bold text-black mb-2 uppercase text-sm">
                                                <Link href={`/product/${item.product.id}`}>{item.product.name}</Link>
                                            </h3>

                                            <div className="space-y-1 mb-3">
                                                <p className="text-xs text-black">
                                                    <span className="font-medium">Color:</span> {item.selectedColor || (item.product as any).color?.name || (item.product as any).colors?.[0]?.name || 'Default'}
                                                </p>
                                                <p className="text-xs text-black">
                                                    <span className="font-medium">Size:</span> {item.size}
                                                </p>
                                            </div>

                                            <div className="mb-3">
                                                <div className="flex items-center border border-gray-300 w-fit">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="px-2 py-1 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-3 py-1 text-black font-medium min-w-[2rem] text-center border-l border-r border-gray-300 text-sm">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-2 py-1 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors text-sm"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-left">
                                                <div className="mb-2">
                                                    <p className="text-xs text-black">Unit Price</p>
                                                    <div className="flex items-center gap-2">
                                                        {item.product.salePrice ? (
                                                            <>
                                                                <span className="text-xs text-gray-400 line-through">
                                                                    <Currency value={Number(item.product.price)} />
                                                                </span>
                                                                <span className="text-sm font-bold text-black">
                                                                    <Currency value={Number(item.product.salePrice)} />
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-sm font-bold text-black">
                                                                <Currency value={item.unitPrice} />
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Total Price</p>
                                                    <p className="text-sm font-bold text-black">
                                                        <Currency value={item.unitPrice * item.quantity} />
                                                    </p>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="p-4">
                                <div className="bg-gray-100 p-4">
                                    <h2 className="text-sm font-bold text-black mb-4">
                                        ORDER OVERVIEW
                                    </h2>

                                    <div className="space-y-1 mb-6">
                                        <div className="flex justify-between">
                                            <p className="text-sm text-black">Subtotal</p>
                                            <p className="font-bold text-sm text-black">
                                                <Currency value={totalPrice} />
                                            </p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-sm text-black">Shipping</p>
                                            <p className="font-bold text-sm text-black">
                                                {shippingPrice === 0 ? "Free" : <Currency value={shippingPrice} />}
                                            </p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-sm text-black">Estimated Tax</p>
                                            <p className="font-bold text-sm text-black">
                                                <Currency value={taxAmount} />
                                            </p>
                                        </div>
                                        <div className="border-t border-gray-300 pt-3 flex justify-between">
                                            <p className="text-sm font-bold text-black">Total price</p>
                                            <p className="text-sm font-bold text-black">
                                                <Currency value={grandTotal} />
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2 p-6 text-xs text-black">
                                    <Truck className="h-3 w-3" />
                                    <span>Delivery approx. <strong>August 06 - August 12</strong></span>
                                </div>

                                <div className="mb-6">
                                    <button
                                        onClick={() => setShowVoucherField(!showVoucherField)}
                                        className="w-full text-left p-3 bg-gray-100 text-sm font-extrabold text-black flex justify-between items-center"
                                    >
                                        <span>REDEEM A VOUCHER CODE</span>
                                        <ChevronRight className={`h-4 w-4 transition-transform ${showVoucherField ? 'rotate-90' : ''}`} />
                                    </button>
                                    {showVoucherField && (
                                        <div className="mt-3 flex space-x-2">
                                            <input
                                                type="text"
                                                placeholder="Enter voucher code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                            />
                                            <button className="bg-black hover:bg-gray-800 text-white px-4">
                                                Apply
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-6 relative">
                                    <p className="text-xs text-black mb-2">
                                        <span className="underline cursor-pointer hover:text-gray-600">
                                            Click
                                        </span> to see what payment options are available.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="border-t  p-4">
                    <button
                        onClick={() => {
                            onClose()
                            window.location.href = '/checkout'
                        }}
                        className="w-full bg-black text-white py-3 font-semibold text-lg mb-3"
                    >
                        CHECKOUT
                    </button>

                    <p className="text-center text-sm text-gray-600 mb-4">Express checkout options</p>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <button className="border border-gray-300 py-2 px-3 text-sm font-medium flex items-center justify-center bg-white hover:bg-gray-50">
                            PayPal
                        </button>
                        <button className="border border-gray-300 py-2 px-3 text-sm font-medium flex items-center justify-center bg-white hover:bg-gray-50">
                            G Pay
                        </button>
                        <button className="border border-gray-300 py-2 px-3 text-sm font-medium flex items-center justify-center bg-white hover:bg-gray-50">
                            amazon pay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartSidebar