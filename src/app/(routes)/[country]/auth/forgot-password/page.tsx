"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "react-hot-toast"
import useAuth from "@/src/app/hooks/use-auth"
import { useCountry } from "@/src/hooks/use-country"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()
  const { forgotPassword } = useAuth()
  const { countryCode } = useCountry()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await forgotPassword(email)

      if (result.success) {
        setIsSubmitted(true)
        toast.success("Password reset email sent. Please check your inbox.")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-white py-12 flex items-center justify-center">
      <div className="w-[90%] md:w-[60%] lg:w-[40%] border border-gray-200">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-2">FORGOT YOUR PASSWORD?</h1>

          {!isSubmitted ? (
            <>
              <p className="text-gray-700 mb-6">
                Enter your email address below and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                      placeholder="* Email Address"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 px-4 font-medium hover:bg-gray-900 transition-colors disabled:opacity-70"
                >
                  {isLoading ? "SENDING..." : "RESET PASSWORD"}
                </button>

                <div className="mt-4 text-center">
                  <Link href={`/${countryCode}/auth/login`} className="text-sm text-gray-700 hover:underline">
                    Back to login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-700 mb-4">
                We've sent a password reset link to <strong>{email}</strong>.
              </p>
              <p className="text-gray-700 mb-6">
                Please check your email and follow the instructions to reset your password.
              </p>
              <Link href={`/${countryCode}/auth/login`} className="text-sm text-gray-700 hover:underline">
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
