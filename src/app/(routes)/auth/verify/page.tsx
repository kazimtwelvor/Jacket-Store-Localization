"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import useAuth from "@/src/app/hooks/use-auth"
import { CheckCircle, XCircle } from "lucide-react"

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyEmail } = useAuth()

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams?.get("token")

      if (!token) {
        setIsLoading(false)
        setErrorMessage("Invalid verification link. No token provided.")
        return
      }

      try {
        const result = await verifyEmail(token)

        if (result.success) {
          setIsVerified(true)
        } else {
          setErrorMessage(result.message)
        }
      } catch (error) {
        setErrorMessage("An error occurred during verification. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [searchParams, verifyEmail])

  return (
    <section className="min-h-screen bg-white py-12 flex items-center justify-center">
      <div className="w-[90%] md:w-[60%] lg:w-[40%] border border-gray-200">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-6">EMAIL VERIFICATION</h1>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-t-black border-r-gray-200 border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-700">Verifying your email...</p>
            </div>
          ) : isVerified ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Email Verified Successfully!</h2>
              <p className="text-gray-700 mb-6">Your email has been verified. You can now log in to your account.</p>
              <Link
                href="/auth/login"
                className="bg-black text-white py-3 px-6 font-medium hover:bg-gray-900 transition-colors"
              >
                LOG IN
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
              <p className="text-gray-700 mb-6">
                {errorMessage || "We couldn't verify your email. The link may have expired or is invalid."}
              </p>
              <Link
                href="/auth/login"
                className="bg-black text-white py-3 px-6 font-medium hover:bg-gray-900 transition-colors"
              >
                BACK TO LOGIN
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
