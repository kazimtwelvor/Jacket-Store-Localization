"use client"

import { Product } from '@/types'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface CartItem {
  id: string
  product: Product
  size: string
  selectedColor?: string
  quantity: number
  unitPrice: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, size: string, selectedColor?: string) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_EXPIRY_DAYS = 30

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cart-items')
      if (saved) {
        try {
          const cartData = JSON.parse(saved)
          if (cartData.timestamp) {
            const isExpired = Date.now() - cartData.timestamp > (CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
            if (!isExpired) {
              setItems(cartData.items || [])
            }
          }
        } catch (error) {
          // ignore errors
        }
      }
    }
  }, [])

  const addToCart = (product: Product, size: string, selectedColor?: string) => {
    const itemId = `${product.id}-${size}-${selectedColor || 'default'}`
    const unitPrice = product.salePrice && Number(product.salePrice) > 0
      ? Number(product.salePrice)
      : Number(product.price || 0)

    setItems(prev => {
      const existingItem = prev.find(item => item.id === itemId)
      let newItems
      if (existingItem) {
        newItems = prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...prev, {
          id: itemId,
          product: {
            ...product,
            price: Number(product.price || 0),
            salePrice: product.salePrice && Number(product.salePrice) > 0 ? Number(product.salePrice) : undefined
          },
          size,
          selectedColor,
          quantity: 1,
          unitPrice
        }]
      }
      const cartData = {
        items: newItems,
        timestamp: Date.now()
      }
      localStorage.setItem('cart-items', JSON.stringify(cartData))
      return newItems
    })
  }

  const removeFromCart = (id: string) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.id !== id)
      const cartData = {
        items: newItems,
        timestamp: Date.now()
      }
      localStorage.setItem('cart-items', JSON.stringify(cartData))
      return newItems
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setItems(prev => {
      const newItems = prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
      const cartData = {
        items: newItems,
        timestamp: Date.now()
      }
      localStorage.setItem('cart-items', JSON.stringify(cartData))
      return newItems
    })
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem('cart-items')
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}