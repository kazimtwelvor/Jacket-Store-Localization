
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Sliders, Package, Heart, ArrowRight } from "lucide-react"
import useAuth from "@/src/app/hooks/use-auth"
import Container from "@/src/app/ui/container"
import Link from "next/link"

import TrendingProducts from "../../../components/account/wishlist/trending-products-client"

export default function WishlistPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const username = user?.email?.split("@")[0]?.toUpperCase() || "USER"

  return (
    <Container>
      <section className="min-h-screen py-6 md:py-8 lg:py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-64 mb-6 md:mb-0">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col space-y-1">
                  <Link
                    href="/account"
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium flex items-center"
                  >
                    <span>Overview</span>
                  </Link>
                  <Link
                    href="/account/my-data"
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium flex items-center"
                  >
                    <span>My Data</span>
                    <User className="ml-auto h-4 w-4" />
                  </Link>
                  <Link
                    href="/account/preferences"
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium flex items-center"
                  >
                    <span>My Preferences</span>
                    <Sliders className="ml-auto h-4 w-4" />
                  </Link>
                  <Link
                    href="/account/orders"
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium flex items-center"
                  >
                    <span>Order History</span>
                    <Package className="ml-auto h-4 w-4" />
                  </Link>
                  <Link
                    href="/account/wishlist"
                    className="py-2 px-4 bg-gray-200 rounded text-sm uppercase font-medium flex items-center"
                  >
                    <span>My Wishlist</span>
                    <Heart className="ml-auto h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      router.push("/")
                    }}
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium text-left flex items-center"
                  >
                    <span>Log Out</span>
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 md:ml-8">
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-6 shadow-md">
                    <Heart className="h-10 w-10 text-black" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">WISHLIST OF {username}</h1>
                    <p className="text-gray-600">Save your favorite items</p>
                  </div>
                </div>
              </div>

              <div className="py-6 border-b border-gray-200">
                <p className="text-gray-600">There are no items in your wishlist.</p>
              </div>

              <TrendingProducts />
            </div>
          </div>
        </div>
      </section>
    </Container>
  )
}
