"use client"
import Currency from "@/components/ui/currency"
import type React from "react"

import IconButton from "@/components/ui/icon-button"
import { useCart } from "@/contexts/CartContext"
import { X } from "lucide-react"
import Image from "next/image"
import type { CartItem } from "@/contexts/CartContext"

interface CartItemProps {
  data: CartItem
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const { removeFromCart } = useCart()

  const onRemove = () => {
    removeFromCart(data.id)
  }

  return (
    <li className="flex py-6 border-b">
      <div className="relative w-24 h-24 overflow-hidden rounded-md sm:h-48 sm:w-48">
        <Image fill src={(data.product.images[0] as any)?.url || '/placeholder.svg'} alt="" className="object-cover object-center" />
      </div>
      <div className="relative flex flex-col justify-between flex-1 ml-4 sm:ml-6">
        <div className="absolute top-0 right-0 z-10">
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-black">{data.product.name}</p>
          </div>
          <div className="flex mt-1 text-sm">
            <p className="text-gray-500">{data.selectedColor || (data.product as any).color?.name || (data.product as any).colors?.[0]?.name || (data.product as any).colorDetails?.[0]?.name || 'Default'}</p>
            <p className="pl-4 ml-4 text-gray-500 border-l border-gray-200">{data.size || 'Default'}</p>
          </div>
          <Currency value={data.unitPrice} />
        </div>
      </div>
    </li>
  )
}

export default CartItem
