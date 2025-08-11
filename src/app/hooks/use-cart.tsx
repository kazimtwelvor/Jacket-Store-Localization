import { create } from "zustand"
import type { Product } from "@/types"
import { persist, createJSONStorage } from "zustand/middleware"
import { toast } from "react-hot-toast"

interface CartItem extends Product {
  color: any
  size: any
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (data: Product, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  removeAll: () => void
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product, quantity = 1) => {
        // Make sure we have the storeId
        const productWithStoreId = {
          ...data,
          storeId: data.storeId || "default-store-id",
        }

        // Check if the item already exists with same id, size, and color
        const currentItems = [...get().items]
        const existingItemIndex = currentItems.findIndex((item) => {
          const sameId = item.id === data.id
          const sameSize = (!item.size && !data.size) || 
                          (item.size?.name === data.size?.name || item.size?.name === data.size)
          const sameColor = (!item.color && !data.color) || 
                           (item.color?.name === data.color?.name)
          return sameId && sameSize && sameColor
        })

        if (existingItemIndex !== -1) {
          // If item exists with same size/color, update its quantity
          currentItems[existingItemIndex].quantity += quantity
          set({ items: currentItems })
          toast.success(`Updated quantity in cart (${currentItems[existingItemIndex].quantity}).`)
        } else {
          // If item doesn't exist or has different size/color, add it as new item
          const newItem = {
            ...productWithStoreId,
            quantity: quantity,
          } as CartItem

          set({ items: [...currentItems, newItem] })
          toast.success("Item added to cart.")
        }
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] })
        toast.success("Item removed from cart.")
      },
      updateQuantity: (id: string, quantity: number) => {
        const currentItems = [...get().items]
        const itemIndex = currentItems.findIndex((item) => item.id === id)

        if (itemIndex !== -1) {
          // Ensure quantity is at least 1
          const newQuantity = Math.max(1, quantity)
          currentItems[itemIndex].quantity = newQuantity
          set({ items: currentItems })
        }
      },
      increaseQuantity: (id: string) => {
        const currentItems = [...get().items]
        const itemIndex = currentItems.findIndex((item) => item.id === id)

        if (itemIndex !== -1) {
          currentItems[itemIndex].quantity += 1
          set({ items: currentItems })
        }
      },
      decreaseQuantity: (id: string) => {
        const currentItems = [...get().items]
        const itemIndex = currentItems.findIndex((item) => item.id === id)

        if (itemIndex !== -1) {
          // Ensure quantity doesn't go below 1
          if (currentItems[itemIndex].quantity > 1) {
            currentItems[itemIndex].quantity -= 1
            set({ items: currentItems })
          }
        }
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useCart
