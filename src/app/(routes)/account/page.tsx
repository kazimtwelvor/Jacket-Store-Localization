"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User, Sliders, Package, Heart } from "lucide-react"
import useAuth from "@/src/app/hooks/use-auth"
import Container from "@/src/app/ui/container"

export default function AccountPage() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <Container>
      <section className="min-h-screen py-6 md:py-8 lg:py-10">
        <section className="bg-black text-white py-10 md:py-12 lg:py-16 px-4 text-center mb-8 md:mb-10 lg:mb-12 w-full md:w-full lg:w-[65%] mx-auto relative">
          <section className="absolute top-4 right-4 md:top-6 md:right-6 lg:top-8 lg:right-8">
            <button
              onClick={handleLogout}
              className="flex items-center text-white hover:underline text-sm md:text-base"
            >
              LOG OUT <LogOut className="ml-2 h-3 w-3 md:h-4 md:w-4" />
            </button>
          </section>

          <section className="w-full md:w-full lg:w-[80%] mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">MY ACCOUNT</h1>
            <p className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
              Enter below for a chance to win one of our exciting sweepstakes exclusively for FINEYST Experience
              Members!
            </p>

            <section className="flex flex-col md:flex-row justify-center gap-4 mt-6 md:mt-8">
              <button className="bg-white text-black px-4 md:px-8 py-2 md:py-3 text-sm md:text-base font-bold hover:bg-gray-100 transition">
                FINEYST X SUITS LA SWEEPS
              </button>
              <button className="bg-white text-black px-4 md:px-8 py-2 md:py-3 text-sm md:text-base font-bold hover:bg-gray-100 transition">
                FINEYST X BARRY&apos;S SWEEPS
              </button>
            </section>
          </section>
        </section>

        <section className="max-w-5xl mx-auto px-4">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <section
              className="flex flex-col items-center text-center cursor-pointer"
              onClick={() => router.push("/account/my-data")}
            >
              <section className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-gray-100 flex items-center justify-center mb-3 md:mb-4 shadow-md">
                <User className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 text-black" strokeWidth={1} />
              </section>
              <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">MY DATA</h3>
              <p className="text-gray-600 text-sm md:text-base">Personal data, address and payment methods</p>
            </section>

            <section
              className="flex flex-col items-center text-center cursor-pointer"
              onClick={() => router.push("/account/preferences")}
            >
              <section className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-gray-100 flex items-center justify-center mb-3 md:mb-4 shadow-md">
                <Sliders className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 text-black" strokeWidth={1} />
              </section>
              <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">MY PREFERENCES</h3>
              <p className="text-gray-600 text-sm md:text-base">Choose your preferred communication channels</p>
            </section>

            <section
              className="flex flex-col items-center text-center cursor-pointer"
              onClick={() => router.push("/account/orders")}
            >
              <section className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-gray-100 flex items-center justify-center mb-3 md:mb-4 shadow-md">
                <Package className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 text-black" strokeWidth={1} />
              </section>
              <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">ORDER HISTORY</h3>
              <p className="text-gray-600 text-sm md:text-base">Review your past orders</p>
            </section>

            <section
              className="flex flex-col items-center text-center cursor-pointer"
              onClick={() => router.push("/account/wishlist")}
            >
              <section className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:w-36 rounded-full bg-gray-100 flex items-center justify-center mb-3 md:mb-4 shadow-md">
                <Heart className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 text-black" strokeWidth={1} />
              </section>
              <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">MY WISHLIST</h3>
              <p className="text-gray-600 text-sm md:text-base">Save your favorite items</p>
            </section>
          </section>
        </section>
      </section>
    </Container>
  )
}
