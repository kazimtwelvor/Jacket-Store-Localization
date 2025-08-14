"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Info, ChevronDown } from "lucide-react"
import Link from "next/link"
import useAuth from "@/src/app/hooks/use-auth"
import { toast } from "react-hot-toast"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressDetails, setAddressDetails] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [country, setCountry] = useState("")
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [privacyAgreed, setPrivacyAgreed] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated, register } = useAuth()

  const redirectTo = searchParams?.get("redirectTo") || "/account"

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, redirectTo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        toast.success("Login successful")
        router.push(redirectTo)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const validatePassword = (password: string): boolean => {
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
      const result = await register({
        email,
        password,
        firstName,
        lastName,
        phone,
        address: addressLine1 + (addressDetails ? `, ${addressDetails}` : ""),
        city,
        state,
        zipCode,
        country,
      })

      if (result.success) {
        toast.success("Registration successful! Please check your email to verify your account.")
        setActiveTab("login")
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-white py-12 flex items-center justify-center">
      <section className="w-[95%] md:w-[60%] lg:w-[50%] border border-gray-200">
        <section className="flex">
          <button
            className={`flex-1 py-3 font-medium text-center ${activeTab === "login" ? "border-b-2 border-black" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            LOG IN
          </button>
          <button
            className={`flex-1 py-3 font-medium text-center ${activeTab === "register" ? "border-b-2 border-black" : ""
              }`}
            onClick={() => setActiveTab("register")}
          >
            REGISTER
          </button>
        </section>

        <section className="p-8">
          {activeTab === "login" && (
            <section>
              <h1 className="text-2xl font-bold mb-2">LOG IN TO FINEYST EXPERIENCE</h1>
              <p className="text-gray-700 mb-6">
                Login and enjoy member-only benefits and promotions with FINEYST EXPERIENCE.
              </p>

              <p className="text-gray-700 mb-4">Please complete all fields marked with an *.</p>

              <form onSubmit={handleSubmit}>
                <section className="mb-4">
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

                <section className="mb-6">
                  <section className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                      placeholder="* Password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </section>
                </section>

                <section className="flex items-center justify-between mb-6">
                  <section className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="mr-2 h-4 w-4 border-gray-300 focus:ring-black"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-700">
                      Remember me
                    </label>
                  </section>
                  <Link href="/auth/forgot-password" className="text-sm text-gray-700 hover:underline">
                    Forgot your password?
                  </Link>
                </section>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 px-4 font-medium hover:bg-gray-900 transition-colors disabled:opacity-70"
                >
                  {isLoading ? "LOGGING IN..." : "LOGIN"}
                </button>
              </form>
            </section>
          )}

          {activeTab === "register" && (
            <section>
              <h1 className="text-2xl font-bold mb-2">SIGN UP TO FINEYST EXPERIENCE</h1>
              <p className="text-gray-700 mb-4">
                Join FINEYST EXPERIENCE! Create your account now and enjoy all the benefits of membership, including
                special offers for members.
              </p>

              <p className="text-gray-700 mb-4">Please complete all fields marked with an *.</p>

              <form onSubmit={handleRegisterSubmit}>
                <section className="mb-4">
                  <section className="relative">
                    <select
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black appearance-none"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Salutation
                      </option>
                      <option value="mr">Mr.</option>
                      <option value="mrs">Mrs.</option>
                      <option value="ms">Ms.</option>
                      <option value="dr">Dr.</option>
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                  </section>
                </section>

                <section className="grid grid-cols-2 gap-4 mb-4">
                  <section className="relative">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                      placeholder="* First Name"
                      required
                    />
                  </section>
                  <section className="relative">
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                      placeholder="* Last Name"
                      required
                    />
                  </section>
                </section>

                <section className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">BIRTHDAY</label>
                  <section className="grid grid-cols-3 gap-4">
                    <section className="relative">
                      <select
                        className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black appearance-none"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Year
                        </option>
                        {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                    </section>
                    <section className="relative">
                      <select
                        className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black appearance-none"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Month
                        </option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                    </section>
                    <section className="relative">
                      <select
                        className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black appearance-none"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Day
                        </option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                    </section>
                  </section>
                </section>

                <section className="mb-4">
                  <section className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                      placeholder="Phone"
                    />
                    <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </section>
                  <p className="text-xs text-gray-500 mt-1">Format: +1 123 456789</p>
                </section>

                <section className="mb-4">
                  <section className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black bg-blue-50"
                      placeholder="* Email"
                      required
                    />
                  </section>
                </section>

                <section className="mb-4">
                  <section className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        validatePassword(e.target.value)
                      }}
                      className={`w-full p-3 border ${passwordError ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:border-black`}
                      placeholder="* Password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </section>
                  {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
                  <ul className="text-xs text-gray-600 mt-2 space-y-1 list-inside">
                    <li>• 8 - 20 characters</li>
                    <li>• At least one uppercase letter, one lowercase letter and one number</li>
                    <li>• At least one special character (!?%&@#$^*~)</li>
                  </ul>
                </section>

                <section className="mb-4">
                  <section className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full p-3 border ${password !== confirmPassword && confirmPassword ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:border-black`}
                      placeholder="* Confirm Password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </section>
                  {password !== confirmPassword && confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </section>

                <section className="mb-4">
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                    placeholder="Address Line 1"
                  />
                </section>

                <section className="mb-4">
                  <section className="relative">
                    <input
                      type="text"
                      value={addressDetails}
                      onChange={(e) => setAddressDetails(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                      placeholder="Additional address details"
                    />
                    <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </section>
                </section>

                <section className="mb-4">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                    placeholder="City"
                  />
                </section>

                <section className="mb-4">
                  <section className="relative">
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black appearance-none"
                    >
                      <option value="" disabled>
                        State
                      </option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      {/* Add more states as needed */}
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                  </section>
                </section>

                <section className="mb-4">
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black"
                    placeholder="Zip Code"
                  />
                </section>

                <section className="mb-6">
                  <section className="relative">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black appearance-none"
                    >
                      <option value="" disabled>
                        Country
                      </option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                  </section>
                </section>

                <section className="mb-4 text-sm">
                  <p className="mb-2">
                    The{" "}
                    <Link href="#" className="underline">
                      Terms and Conditions
                    </Link>{" "}
                    as well as the associated{" "}
                    <Link href="#" className="underline">
                      Privacy Policy
                    </Link>{" "}
                    are applicable for participation in FINEYST EXPERIENCE.
                  </p>
                  <p className="mb-4">
                    By clicking "create account", I agree to the Terms and Conditions of FINEYST AG for participation in
                    FINEYST EXPERIENCE.
                  </p>

                  <section className="flex items-start mb-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      className="mt-1 mr-2 h-4 w-4 border-gray-300 focus:ring-black"
                      required
                    />
                    <label htmlFor="terms" className="text-sm">
                      I have read and agree to the{" "}
                      <Link href="#" className="underline">
                        Terms and Conditions
                      </Link>{" "}
                      for participation in FINEYST BOSS EXPERIENCE.
                    </label>
                  </section>

                  <section className="flex items-start mb-6">
                    <input
                      type="checkbox"
                      id="privacy"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      className="mt-1 mr-2 h-4 w-4 border-gray-300 focus:ring-black"
                      required
                    />
                    <label htmlFor="privacy" className="text-sm">
                      I have read and agree to the{" "}
                      <Link href="#" className="underline">
                        Privacy Policy
                      </Link>{" "}
                      of FINEYST USA.
                    </label>
                  </section>
                </section>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 px-4 font-medium hover:bg-gray-900 transition-colors disabled:opacity-70"
                >
                  {isLoading ? "CREATING ACCOUNT..." : "CREATE AN ACCOUNT"}
                </button>
              </form>
            </section>
          )}
        </section>
      </section>
    </section>
  )
}
