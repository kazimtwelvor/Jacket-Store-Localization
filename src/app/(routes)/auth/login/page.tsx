"use client";

import type React from "react";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Info,
  ChevronDown,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Calendar,
  Shield,
} from "lucide-react";
import Link from "next/link";
import useAuth from "@/src/app/hooks/use-auth";
import { toast } from "react-hot-toast";
import { getCountryDataList } from "countries-list";
import GoogleSignUp from "@/src/app/components/GoogleSignUp";
import EmailVerification from "@/src/app/components/EmailVerification";

function LoginContent() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [addLocation, setAddLocation] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [zipError, setZipError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [stateError, setStateError] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<any>(null);

  // Create countries list from the package
  const countriesList = getCountryDataList()
    .map((country) => ({
      code: country.iso2,
      name: country.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // States data for major countries
  const statesData: Record<string, Array<{ code: string; name: string }>> = {
    US: [
      { code: "AL", name: "Alabama" },
      { code: "AK", name: "Alaska" },
      { code: "AZ", name: "Arizona" },
      { code: "AR", name: "Arkansas" },
      { code: "CA", name: "California" },
      { code: "CO", name: "Colorado" },
      { code: "CT", name: "Connecticut" },
      { code: "DE", name: "Delaware" },
      { code: "FL", name: "Florida" },
      { code: "GA", name: "Georgia" },
      { code: "HI", name: "Hawaii" },
      { code: "ID", name: "Idaho" },
      { code: "IL", name: "Illinois" },
      { code: "IN", name: "Indiana" },
      { code: "IA", name: "Iowa" },
      { code: "KS", name: "Kansas" },
      { code: "KY", name: "Kentucky" },
      { code: "LA", name: "Louisiana" },
      { code: "ME", name: "Maine" },
      { code: "MD", name: "Maryland" },
      { code: "MA", name: "Massachusetts" },
      { code: "MI", name: "Michigan" },
      { code: "MN", name: "Minnesota" },
      { code: "MS", name: "Mississippi" },
      { code: "MO", name: "Missouri" },
      { code: "MT", name: "Montana" },
      { code: "NE", name: "Nebraska" },
      { code: "NV", name: "Nevada" },
      { code: "NH", name: "New Hampshire" },
      { code: "NJ", name: "New Jersey" },
      { code: "NM", name: "New Mexico" },
      { code: "NY", name: "New York" },
      { code: "NC", name: "North Carolina" },
      { code: "ND", name: "North Dakota" },
      { code: "OH", name: "Ohio" },
      { code: "OK", name: "Oklahoma" },
      { code: "OR", name: "Oregon" },
      { code: "PA", name: "Pennsylvania" },
      { code: "RI", name: "Rhode Island" },
      { code: "SC", name: "South Carolina" },
      { code: "SD", name: "South Dakota" },
      { code: "TN", name: "Tennessee" },
      { code: "TX", name: "Texas" },
      { code: "UT", name: "Utah" },
      { code: "VT", name: "Vermont" },
      { code: "VA", name: "Virginia" },
      { code: "WA", name: "Washington" },
      { code: "WV", name: "West Virginia" },
      { code: "WI", name: "Wisconsin" },
      { code: "WY", name: "Wyoming" },
      { code: "DC", name: "District of Columbia" },
    ],
    CA: [
      { code: "AB", name: "Alberta" },
      { code: "BC", name: "British Columbia" },
      { code: "MB", name: "Manitoba" },
      { code: "NB", name: "New Brunswick" },
      { code: "NL", name: "Newfoundland and Labrador" },
      { code: "NS", name: "Nova Scotia" },
      { code: "ON", name: "Ontario" },
      { code: "PE", name: "Prince Edward Island" },
      { code: "QC", name: "Quebec" },
      { code: "SK", name: "Saskatchewan" },
      { code: "NT", name: "Northwest Territories" },
      { code: "NU", name: "Nunavut" },
      { code: "YT", name: "Yukon" },
    ],
    GB: [
      { code: "ENG", name: "England" },
      { code: "SCT", name: "Scotland" },
      { code: "WLS", name: "Wales" },
      { code: "NIR", name: "Northern Ireland" },
    ],
    AU: [
      { code: "NSW", name: "New South Wales" },
      { code: "VIC", name: "Victoria" },
      { code: "QLD", name: "Queensland" },
      { code: "WA", name: "Western Australia" },
      { code: "SA", name: "South Australia" },
      { code: "TAS", name: "Tasmania" },
      { code: "ACT", name: "Australian Capital Territory" },
      { code: "NT", name: "Northern Territory" },
    ],
    DE: [
      { code: "BW", name: "Baden-Württemberg" },
      { code: "BY", name: "Bavaria" },
      { code: "BE", name: "Berlin" },
      { code: "BB", name: "Brandenburg" },
      { code: "HB", name: "Bremen" },
      { code: "HH", name: "Hamburg" },
      { code: "HE", name: "Hesse" },
      { code: "NI", name: "Lower Saxony" },
      { code: "MV", name: "Mecklenburg-Vorpommern" },
      { code: "NW", name: "North Rhine-Westphalia" },
      { code: "RP", name: "Rhineland-Palatinate" },
      { code: "SL", name: "Saarland" },
      { code: "SN", name: "Saxony" },
      { code: "ST", name: "Saxony-Anhalt" },
      { code: "SH", name: "Schleswig-Holstein" },
      { code: "TH", name: "Thuringia" },
    ],
    FR: [
      { code: "ARA", name: "Auvergne-Rhône-Alpes" },
      { code: "BFC", name: "Bourgogne-Franche-Comté" },
      { code: "BRE", name: "Bretagne" },
      { code: "CVL", name: "Centre-Val de Loire" },
      { code: "COR", name: "Corse" },
      { code: "GES", name: "Grand Est" },
      { code: "HDF", name: "Hauts-de-France" },
      { code: "IDF", name: "Île-de-France" },
      { code: "NOR", name: "Normandie" },
      { code: "NAQ", name: "Nouvelle-Aquitaine" },
      { code: "OCC", name: "Occitanie" },
      { code: "PDL", name: "Pays de la Loire" },
      { code: "PAC", name: "Provence-Alpes-Côte d'Azur" },
    ],
    IN: [
      { code: "AP", name: "Andhra Pradesh" },
      { code: "AR", name: "Arunachal Pradesh" },
      { code: "AS", name: "Assam" },
      { code: "BR", name: "Bihar" },
      { code: "CT", name: "Chhattisgarh" },
      { code: "GA", name: "Goa" },
      { code: "GJ", name: "Gujarat" },
      { code: "HR", name: "Haryana" },
      { code: "HP", name: "Himachal Pradesh" },
      { code: "JH", name: "Jharkhand" },
      { code: "KA", name: "Karnataka" },
      { code: "KL", name: "Kerala" },
      { code: "MP", name: "Madhya Pradesh" },
      { code: "MH", name: "Maharashtra" },
      { code: "MN", name: "Manipur" },
      { code: "ML", name: "Meghalaya" },
      { code: "MZ", name: "Mizoram" },
      { code: "NL", name: "Nagaland" },
      { code: "OR", name: "Odisha" },
      { code: "PB", name: "Punjab" },
      { code: "RJ", name: "Rajasthan" },
      { code: "SK", name: "Sikkim" },
      { code: "TN", name: "Tamil Nadu" },
      { code: "TS", name: "Telangana" },
      { code: "TR", name: "Tripura" },
      { code: "UP", name: "Uttar Pradesh" },
      { code: "UT", name: "Uttarakhand" },
      { code: "WB", name: "West Bengal" },
    ],
  };

  // Sample cities for major states
  const citiesData = {
    CA: [
      "Los Angeles",
      "San Francisco",
      "San Diego",
      "Sacramento",
      "Fresno",
      "Long Beach",
      "Oakland",
    ],
    NY: [
      "New York City",
      "Buffalo",
      "Rochester",
      "Syracuse",
      "Albany",
      "Yonkers",
      "New Rochelle",
    ],
    TX: [
      "Houston",
      "Dallas",
      "Austin",
      "San Antonio",
      "Fort Worth",
      "El Paso",
      "Arlington",
    ],
    FL: [
      "Miami",
      "Orlando",
      "Tampa",
      "Jacksonville",
      "Fort Lauderdale",
      "Tallahassee",
      "Gainesville",
    ],
    IL: [
      "Chicago",
      "Springfield",
      "Peoria",
      "Rockford",
      "Naperville",
      "Champaign",
      "Bloomington",
    ],
    PA: [
      "Philadelphia",
      "Pittsburgh",
      "Allentown",
      "Erie",
      "Reading",
      "Scranton",
      "Bethlehem",
    ],
    OH: [
      "Columbus",
      "Cleveland",
      "Cincinnati",
      "Toledo",
      "Akron",
      "Dayton",
      "Parma",
    ],
    MI: [
      "Detroit",
      "Grand Rapids",
      "Warren",
      "Sterling Heights",
      "Lansing",
      "Ann Arbor",
      "Flint",
    ],
    GA: [
      "Atlanta",
      "Augusta",
      "Columbus",
      "Macon",
      "Savannah",
      "Athens",
      "Sandy Springs",
    ],
    NC: [
      "Charlotte",
      "Raleigh",
      "Greensboro",
      "Durham",
      "Winston-Salem",
      "Fayetteville",
      "Cary",
    ],
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, register, googleRegister } = useAuth();

  const redirectTo = searchParams?.get("redirectTo") || "/account";

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  // Reset dependent fields when country changes
  useEffect(() => {
    if (country) {
      setState("");
      setCity("");
    }
  }, [country]);

  // Reset city when state changes
  useEffect(() => {
    if (state) {
      setCity("");
    }
  }, [state]);

  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      const result = await login(email, password);

      if (result.success) {
        toast.success("Login successful");
        router.push(redirectTo);
      } else {
        setLoginError("Invalid email or password");
        toast.error(result.message);
      }
    } catch (error) {
      setLoginError("Invalid email or password");
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (password: string): boolean => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!?%&@#$^*~]/.test(password);
    const isValidLength = password.length >= 8 && password.length <= 20;

    if (!isValidLength) {
      setPasswordError("Password must be 8-20 characters");
      return false;
    }

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      setPasswordError(
        "Password must include uppercase, lowercase, number, and special character"
      );
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      toast.error(passwordError);
      return;
    }

    // Validate state for countries without predefined states
    if (country && !statesData[country] && state) {
      // For countries without predefined states, we'll accept any non-empty value
      // but could add more specific validation here if needed
    } else if (country && statesData[country] && state && state !== "other") {
      const validState = statesData[country].find((s) => s.code === state);
      if (!validState) {
        setStateError(
          "Please select a valid state/province for the selected country"
        );
        return;
      }
    }

    setIsLoading(true);

    try {
      // Store user data and send verification code
      const userData = {
        email,
        password,
        firstName,
        lastName,
        phone,
        address: addLocation
          ? addressLine1 + (addressDetails ? `, ${addressDetails}` : "")
          : "",
        city: addLocation ? city : "",
        state: addLocation ? state : "",
        zipCode: addLocation ? zipCode : "",
        country: addLocation ? country : "",
      };

      // Generate and send verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store code
      await fetch('/api/auth/verify-code', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      // Send email
      const emailResponse = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (emailResponse.ok) {
        setPendingUserData(userData);
        setShowVerification(true);
        toast.success("Verification code sent to your email!");
      } else {
        // Still show verification page even if email fails
        setPendingUserData(userData);
        setShowVerification(true);
        toast.error("Email sending failed, but you can still proceed with verification");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerified = async () => {
    if (!pendingUserData) return;

    setIsLoading(true);
    try {
      const result = await register(pendingUserData);

      if (result.success) {
        toast.success("Registration successful!");
        setActiveTab("login");
        setShowVerification(false);
        setPendingUserData(null);
      } else {
        if (result.message === "Email already in use") {
          setEmailError("Email already registered");
        }
        toast.error(result.message);
        setShowVerification(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
      setShowVerification(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with Logo */}
        <div className="bg-[#2B2B2B] text-white p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">F</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">FINEYST EXPERIENCE</h1>
          <p className="text-gray-200 text-lg">Premium Fashion & Lifestyle</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100">
          <button
            className={`flex-1 py-2 px-3 md:py-4 md:px-6 font-semibold text-center transition-all duration-200 ${
              activeTab === "login"
                ? "bg-white text-gray-900 border-b-2 border-gray-800 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("login")}
          >
            <Lock className="w-4 h-4 md:w-5 md:h-5 inline mr-1 md:mr-2" />
            <span className="text-sm md:text-base">Sign In</span>
          </button>
          <button
            className={`flex-1 py-2 px-3 md:py-4 md:px-6 font-semibold text-center transition-all duration-200 ${
              activeTab === "register"
                ? "bg-white text-gray-900 border-b-2 border-gray-800 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("register")}
          >
            <User className="w-4 h-4 md:w-5 md:h-5 inline mr-1 md:mr-2" />
            <span className="text-sm md:text-base">Create Account</span>
          </button>
        </div>

        <div className="p-4">
          {activeTab === "login" && (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600">Sign in to your FINEYST account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {loginError && (
                    <p className="text-sm text-red-600 mt-2 text-center">
                      {loginError}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-gray-800 focus:ring-gray-800 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-gray-800 hover:text-gray-900 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#2B2B2B] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#1c1c1c] focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setActiveTab("register")}
                    className="text-gray-800 hover:text-gray-900 font-semibold hover:underline transition-colors"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          )}

          {activeTab === "register" && !showVerification && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Create Your Account
                </h2>
                <p className="text-gray-600">
                  Join FINEYST and unlock exclusive benefits
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-800" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    {emailError && (
                      <p className="text-sm text-red-600 mb-2">{emailError}</p>
                    )}
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError("");
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 ${
                          emailError ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(
                            /[^0-9+\s-]/g,
                            ""
                          );
                          if (value.length <= 15) {
                            setPhone(value);
                          }
                        }}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="+1 123 456 7890"
                        maxLength={15}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Format: +1 123 456 7890
                    </p>
                  </div>
                </div>

                {/* Security Section */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-gray-800" />
                    Security
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            validatePassword(e.target.value);
                          }}
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 ${
                            passwordError ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Create a strong password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {passwordError && (
                        <p className="text-sm text-red-600 mt-1">
                          {passwordError}
                        </p>
                      )}
                      {/* Password requirement hint removed per request */}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 ${
                            password !== confirmPassword && confirmPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {password !== confirmPassword && confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">
                          Passwords do not match
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gray-800" />
                    Location
                  </h3>

                  <div className="flex items-center mb-4">
                    <input
                      id="addLocation"
                      type="checkbox"
                      className="h-4 w-4 text-gray-800 focus:ring-gray-800 border-gray-300 rounded"
                      checked={addLocation}
                      onChange={(e) => setAddLocation(e.target.checked)}
                    />
                    <label htmlFor="addLocation" className="ml-2 text-sm text-gray-700">
                      Add location details
                    </label>
                  </div>

                  {addLocation && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country *
                          </label>
                          <div className="relative">
                            <select
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 appearance-none"
                              required
                            >
                              <option value="" disabled>
                                Select country
                              </option>
                              {countriesList.map((countryItem) => (
                                <option
                                  key={countryItem.code}
                                  value={countryItem.code}
                                >
                                  {countryItem.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                          </div>
                        </div>

                        {country && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State/Province *
                            </label>
                            <div className="relative">
                              <select
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 appearance-none"
                                required
                              >
                                <option value="" disabled>
                                  Select state
                                </option>
                                {statesData[country] ? (
                                  statesData[country].map((stateItem) => (
                                    <option
                                      key={stateItem.code}
                                      value={stateItem.code}
                                    >
                                      {stateItem.name}
                                    </option>
                                  ))
                                ) : (
                                  <option value="other">
                                    Other (please specify)
                                  </option>
                                )}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>
                          </div>
                        )}
                      </div>

                      {country && (state === "other" || !statesData[country]) && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State/Province/Region *
                          </label>
                          <input
                            type="text"
                            value={state === "other" ? "" : state}
                            onChange={(e) => {
                              setState(e.target.value);
                              setStateError("");
                            }}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 ${
                              stateError ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Enter state/province/region"
                            required
                          />
                          {stateError && (
                            <p className="text-sm text-red-600 mt-1">
                              {stateError}
                            </p>
                          )}
                        </div>
                      )}

                      {state && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                            placeholder="Enter city"
                            required
                          />
                        </div>
                      )}

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                          placeholder="Street address"
                          maxLength={100}
                          required
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Address Details
                        </label>
                        <input
                          type="text"
                          value={addressDetails}
                          onChange={(e) => setAddressDetails(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                          placeholder="Apartment, suite, etc. (optional)"
                          maxLength={100}
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP/Postal Code{" "}
                          {(country === "US" || country === "CA") && "*"}
                        </label>
                        <input
                          type="text"
                          value={zipCode}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            if (value.length <= 5) {
                              setZipCode(value);
                            }

                            if (value && country === "US") {
                              const usZipRegex = /^\d{5}$/;
                              setZipError(
                                usZipRegex.test(value)
                                  ? ""
                                  : "Invalid US ZIP code format (12345)"
                              );
                            } else if (value && country === "CA") {
                              const caPostalRegex =
                                /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
                              setZipError(
                                caPostalRegex.test(value)
                                  ? ""
                                  : "Invalid Canadian postal code format (A1A 1A1)"
                              );
                            } else {
                              setZipError("");
                            }
                          }}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 ${
                            zipError ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder={
                            country === "US"
                              ? "12345"
                              : country === "CA"
                              ? "A1A 1A1"
                              : "ZIP or postal code"
                          }
                          maxLength={5}
                          required={country === "US" || country === "CA"}
                        />
                        {zipError && (
                          <p className="text-sm text-red-600 mt-1">{zipError}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Google Sign-Up Section */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Quick Sign-Up
                  </h3>
                  <GoogleSignUp
                    onSuccess={(userData) => {
                      googleRegister(userData.user, userData.token);
                      router.push("/account");
                    }}
                    onError={(error) => {
                      toast.error(error);
                    }}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                  />
                  
                  <div className="flex items-center my-4">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-sm text-gray-500">or continue with email</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                </div>

                {/* Terms Section */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Terms & Conditions
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        className="mt-1 h-4 w-4 text-gray-800 focus:ring-gray-800 border-gray-300 rounded"
                        required
                      />
                      <label
                        htmlFor="terms"
                        className="ml-3 text-sm text-gray-700"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms-conditions"
                          className="text-gray-800 hover:underline font-medium"
                        >
                          Terms and Conditions
                        </Link>{" "}
                        for participation in FINEYST EXPERIENCE.
                      </label>
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="privacy"
                        checked={privacyAgreed}
                        onChange={(e) => setPrivacyAgreed(e.target.checked)}
                        className="mt-1 h-4 w-4 text-gray-800 focus:ring-gray-800 border-gray-300 rounded"
                        required
                      />
                      <label
                        htmlFor="privacy"
                        className="ml-3 text-sm text-gray-700"
                      >
                        I agree to the{" "}
                        <Link
                          href="/privacy-policy"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Privacy Policy
                        </Link>{" "}
                        of FINEYST USA.
                      </label>
                    </div>
                  </div>
                </div>

                                 <button
                   type="submit"
                   disabled={isLoading}
                   className="w-full bg-[#2B2B2B] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#1c1c1c] focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                 >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => setActiveTab("login")}
                    className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          )}

          {activeTab === "register" && showVerification && (
            <EmailVerification
              email={email}
              onVerified={handleEmailVerified}
              onBack={() => {
                setShowVerification(false);
                setPendingUserData(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
