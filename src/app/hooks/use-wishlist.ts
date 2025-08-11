"use client"

import { create } from "zustand"
import type { Product } from "@/types"
import { persist, createJSONStorage } from "zustand/middleware"
import { toast } from "react-hot-toast"

interface CartProduct extends Product {
  quantity: number
  size?: string
}

interface WishlistStore {
  items: CartProduct[]
  addItem: (data: Product) => void
  removeItem: (id: string) => void
  removeAll: () => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  updateItemSize: (id: string, size: string) => void
}

const useWishlist = create(
  persist<WishlistStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.id === data.id)

        if (existingItem) {
          // If item already exists in wishlist, increase quantity
          return get().increaseQuantity(data.id)
        }

        // Add new item with quantity 1
        const productWithQuantity = {
          ...data,
          quantity: 1,
        }

        set({ items: [...get().items, productWithQuantity] })
        toast.success("Item added to wishlist.")
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] })
        toast.success("Item removed from wishlist.")
      },
      removeAll: () => set({ items: [] }),
      isInWishlist: (id: string) => {
        return get().items.some((item) => item.id === id)
      },
      clearWishlist: () => set({ items: [] }),
      increaseQuantity: (id: string) => {
        const currentItems = get().items
        const updatedItems = currentItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 }
          }
          return item
        })

        set({ items: updatedItems })
      },
      decreaseQuantity: (id: string) => {
        const currentItems = get().items
        const itemToUpdate = currentItems.find((item) => item.id === id)

        if (itemToUpdate && itemToUpdate.quantity === 1) {
          // Remove item if quantity would become 0
          return get().removeItem(id)
        }

        const updatedItems = currentItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 }
          }
          return item
        })

        set({ items: updatedItems })
      },
      setQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          return get().removeItem(id)
        }

        const currentItems = get().items
        const updatedItems = currentItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: quantity }
          }
          return item
        })

        set({ items: updatedItems })
      },
      updateItemSize: (id: string, size: string) => {
        const currentItems = get().items
        const updatedItems = currentItems.map((item) => {
          if (item.id === id) {
            return { ...item, size: size }
          }
          return item
        })

        set({ items: updatedItems })
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useWishlist
