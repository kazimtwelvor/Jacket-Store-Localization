"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import useAuth from "@/hooks/use-auth"
import { toast } from "react-hot-toast"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword } = useAuth()

  useEffect(() => {
    // Get token from URL query parameter
    const tokenParam = searchParams?.get("token")
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      toast.error("Invalid or missing reset token")
      router.push("/auth/login")
    }
  }, [searchParams, router])

  const validatePassword = (password: string): boolean => {
    // Password must be 8-20 characters, include uppercase, lowercase, number, and special char
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[!?%&@#$^*~]/.test(password)
    const isValidLength = password.length >= 8 && password.length <= 20

    if (!isValidLength) {
      setPasswordError("Password must be 8-20 characters")
      return false
    }

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      setPasswordError("Password must include uppercase, lowercase, number, and special character")
      return false
    }

    setPasswordError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error("Invalid reset token")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (!validatePassword(password)) {
      toast.error(passwordError)
      return
    }

    setIsLoading(true)

    try {
      const result = await resetPassword(token, password)

      if (result.success) {
        toast.success("Password reset successful")
        router.push("/auth/login")
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
    <div className="min-h-screen bg-white py-12 flex items-center justify-center">
      <div className="w-[90%] md:w-[60%] lg:w-[40%] border border-gray-200">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-2">RESET YOUR PASSWORD</h1>
          <p className="text-gray-700 mb-6">Please enter your new password below.</p>

          <form onSubmit={handleSubmit}>
            {/* Password */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    validatePassword(e.target.value)
                  }}
                  className={`w-full p-3 border ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-black`}
                  placeholder="* New Password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
              <ul className="text-xs text-gray-600 mt-2 space-y-1 list-inside">
                <li>• 8 - 20 characters</li>
                <li>• At least one uppercase letter, one lowercase letter and one number</li>
                <li>• At least one special character (!?%&@#$^*~)</li>
              </ul>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-3 border ${
                    password !== confirmPassword && confirmPassword ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-black`}
                  placeholder="* Confirm New Password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password !== confirmPassword && confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 px-4 font-medium hover:bg-gray-900 transition-colors disabled:opacity-70"
            >
              {isLoading ? "RESETTING..." : "RESET PASSWORD"}
            </button>

            <div className="mt-4 text-center">
              <Link href="/auth/login" className="text-sm text-gray-700 hover:underline">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
