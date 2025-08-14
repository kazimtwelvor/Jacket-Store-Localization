"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "react-hot-toast"
import useAuth from "@/src/app/hooks/use-auth"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()
  const { forgotPassword } = useAuth()

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
      <section className="w-[90%] md:w-[60%] lg:w-[40%] border border-gray-200">
        <section className="p-8">
          <h1 className="text-2xl font-bold mb-2">FORGOT YOUR PASSWORD?</h1>

          {!isSubmitted ? (
            <>
              <p className="text-gray-700 mb-6">
                Enter your email address below and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit}>
                <section className="mb-6">
                  <section className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                      placeholder="* Email Address"
                      required
                    />
                  </section>
                </section>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 px-4 font-medium hover:bg-gray-900 transition-colors disabled:opacity-70"
                >
                  {isLoading ? "SENDING..." : "RESET PASSWORD"}
                </button>

                <section className="mt-4 text-center">
                  <Link href="/auth/login" className="text-sm text-gray-700 hover:underline">
                    Back to login
                  </Link>
                </section>
              </form>
            </>
          ) : (
            <section className="text-center">
              <p className="text-gray-700 mb-4">
                We've sent a password reset link to <strong>{email}</strong>.
              </p>
              <p className="text-gray-700 mb-6">
                Please check your email and follow the instructions to reset your password.
              </p>
              <Link href="/auth/login" className="text-sm text-gray-700 hover:underline">
                Back to login
              </Link>
            </section>
          )}
        </section>
      </section>
    </section>
  )
}
