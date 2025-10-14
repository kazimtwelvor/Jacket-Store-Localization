"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, X, ChevronLeft, ShoppingCart, Trash2 } from "lucide-react"
import Container from "@/src/app/ui/container"
import useWishlist from "@/src/app/hooks/use-wishlist"
import { useCart } from "@/src/app/contexts/CartContext"
import Currency from "@/src/app/ui/currency"
import Button from "@/src/app/ui/button"
import getProducts from "@/src/app/actions/get-products"
import { toast } from "react-hot-toast"

const WishlistPage = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([])
  const [sizeErrors, setSizeErrors] = useState<{[key: string]: string}>({})
  const wishlist = useWishlist()
  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)

    const fetchRecommendedProducts = async () => {
      try {
        const products = await getProducts({ isFeatured: true })
        setRecommendedProducts(Array.isArray(products) ? products.slice(0, 4) : [])
      } catch (error) {
      }
    }

    fetchRecommendedProducts()
  }, [])

  if (!isMounted) {
    return null
  }

  const handleRemoveItem = (productId: string) => {
    wishlist.removeItem(productId)
  }

  const handleAddToCart = (product: any) => {
    
    if (product.sizeDetails && product.sizeDetails.length > 0 && (!product.size || product.size === '')) {
      setSizeErrors(prev => ({...prev, [product.id]: 'Please select a size to add the product to the cart'}))
      return
    }
    
    // Clear any existing error for this product
    setSizeErrors(prev => {
      const newErrors = {...prev}
      delete newErrors[product.id]
      return newErrors
    })
    

    try {
      // Convert wishlist item to product format expected by CartContext
      const productForCart = {
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        images: product.images,
        storeId: product.storeId,
        category: product.category,
        isFeatured: product.isFeatured,
        isPublished: product.isPublished,
        colors: (product as any).colors,
        colorDetails: product.colorDetails,
        sizeDetails: product.sizeDetails,
        // Add the actual selected color from wishlist
        color: ((product as any).colorDetails && (product as any).colorDetails[0]) || ((product as any).colors && (product as any).colors[0])
      }
      // Only add to cart if size is selected
      if ((product as any).size) {
        addToCart(productForCart, (product as any).size)
      }
      wishlist.removeItem(product.id)
      toast.success('Item moved to cart!')
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.')
    }
  }

  const handleContinueShopping = () => {
    router.push("/us/shop")
  }

  if (wishlist.items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-4 py-16 sm:px-6 lg:px-8 min-h-[70vh] flex flex-col items-center justify-center"
          >
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-gray-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
              <p className="text-gray-500 pt-4 mb-8">
                Save items you love for later by clicking the heart icon on any product.
              </p>
              <Button
                onClick={handleContinueShopping}
                variant="blackInvert"
                className="mt-4"
              >
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        </Container>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-4 pt-16 pb-4 sm:px-6 md:px-8 sm:pt-20 md:pt-24 sm:pb-6"
        >
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black text-center mt-8 mb-4">MY WISHLIST</h1>
            
            {/* Back Button and Register Button */}
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={handleContinueShopping}
                className="group flex items-center text-black hover:text-gray-600 transition-colors font-medium text-sm border border-gray-300 px-4 py-2"
              >
                <ChevronLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                BACK
              </button>
              
              <button
                onClick={() => router.push('/auth/login')}
                className="hidden lg:flex items-center text-white bg-black hover:bg-gray-800 transition-colors font-medium text-sm px-4 py-2"
              >
                REGISTER
              </button>
            </div>

            {/* Product Cards */}
            <div className="space-y-4">
              {wishlist.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex gap-2 sm:gap-3 md:gap-5">
                    {/* Product Image - always 3/5 aspect ratio, responsive width */}
                    <div className="aspect-[3/5] w-28 sm:w-32 md:w-24 flex-shrink-0 relative overflow-hidden rounded">
                      <Image
                        src={(item.images?.[0] as any)?.url || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 relative">
                      {/* Delete Icon */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute -top-1 -right-1 text-black hover:text-red-500 transition-colors p-1"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Product Name */}
                      <h3 className="font-bold text-black text-sm sm:text-base mb-3 uppercase tracking-wide pr-8">
                        {item.name}
                      </h3>
                      
                      {/* Color Selection */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: ((item as any).colorDetails && (item as any).colorDetails[0]?.value) || ((item as any).colors && (item as any).colors[0]?.value) || '#8FBC8F' }}
                          />
                          <span className="text-sm text-gray-700">
                            {((item as any).colorDetails && (item as any).colorDetails[0]?.name) || ((item as any).colors && (item as any).colors[0]?.name) || 'Light Green'}
                          </span>
                        </div>
                      </div>

                      {/* Size Selection */}
                      <div className="mb-3">
                        <label className="text-sm text-gray-600 block mb-1">Size</label>
                        <select 
                          value={(item as any).size || ''}
                          onChange={(e) => {
                            wishlist.updateItemSize(item.id, e.target.value)
                            // Clear error when size is selected
                            setSizeErrors(prev => {
                              const newErrors = {...prev}
                              delete newErrors[item.id]
                              return newErrors
                            })
                          }}
                          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzM3NDE1MSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-no-repeat bg-[center_right_0.75rem] pr-8 w-32"
                        >
                          <option value="" disabled>Select Size</option>
                          {((item as any).sizeDetails || []).map((size: any) => (
                            <option key={size.id || size.name} value={size.name}>
                              {size.name}
                            </option>
                          ))}
                        </select>
                        {sizeErrors[item.id] && (
                          <p className="text-red-600 text-sm mt-1">{sizeErrors[item.id]}</p>
                        )}
                      </div>

                      {/* Price and Add to Cart Row */}
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <p className="text-sm text-gray-600">Unit Price:</p>
                          <p className="text-lg font-bold text-black">
                            <Currency value={Number(item.price)} />
                          </p>
                        </div>
                        
                        {/* Mobile/Tablet: Cart Icon */}
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="lg:hidden bg-black text-white p-2 rounded hover:bg-gray-800 transition-colors ml-2"
                          title="Add to cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                        
                        {/* Desktop/Laptop: Full Button */}
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="hidden lg:flex items-center gap-1 bg-black text-white px-4 py-2 -mb-3 hover:bg-gray-800 transition-colors ml-2"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Section */}
            <div className="mt-6 pt-4 ">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Articles on your wishlist can unfortunately not be reserved for you.
                </p>
                <button
                  onClick={() => {
                    
                    const itemsWithSizeOptions = wishlist.items.filter(item => 
                      item.sizeDetails && item.sizeDetails.length > 0
                    )
                    
                    const itemsWithoutSelectedSize = itemsWithSizeOptions.filter(item => !item.size)
                    if (itemsWithoutSelectedSize.length > 0) {
                      itemsWithoutSelectedSize.forEach(item => {
                        setSizeErrors(prev => ({...prev, [item.id]: 'Please select a size to add the product to the cart'}))
                      })
                      return
                    }
                    
                    wishlist.items.forEach((item) => {
                      const product = {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        salePrice: item.salePrice,
                        images: item.images,
                        storeId: item.storeId,
                        category: item.category,
                        isFeatured: item.isFeatured,
                        isPublished: item.isPublished,
                        colors: (item as any).colors,
                        colorDetails: item.colorDetails,
                        sizeDetails: item.sizeDetails,
                        color: ((item as any).colorDetails && (item as any).colorDetails[0]) || ((item as any).colors && (item as any).colors[0])
                      }
                      if ((item as any).size) {
                        addToCart(product, (item as any).size)
                      }
                    })
                    
                    wishlist.clearWishlist()
                    toast.success('All items added to cart!')
                  }}
                  className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors"
                >
                  ADD ALL TO CART 
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  )
}

export default WishlistPage