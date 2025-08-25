"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import Container from "@/src/app/ui/container";
import Link from "next/link";
import Image from "next/image";
import useAuth from "@/src/app/hooks/use-auth";

export default function MyDataPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("my-data");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Use actual user data or provide fallbacks based on available User interface
  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.username || user?.email?.split('@')[0] || "User";
  const displayEmail = user?.email || "No email provided";
  const displayCustomerNumber = user?.id || "N/A";

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
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium"
                  >
                    Overview
                  </Link>
                  <Link
                    href="/account/my-data"
                    className="py-2 px-4 bg-gray-200 rounded text-sm uppercase font-medium"
                  >
                    My Data
                  </Link>
                  <Link
                    href="/account/preferences"
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium"
                  >
                    My Preferences
                  </Link>
                  <Link
                    href="/account/orders"
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium"
                  >
                    Order History
                  </Link>
                  <Link
                    href="/account/wishlist"
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium"
                  >
                    My Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      useAuth.getState().logout();
                      router.push("/");
                    }}
                    className="py-2 px-4 hover:bg-gray-100 rounded text-sm uppercase font-medium text-left"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 md:ml-8">
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mr-6">
                  <svg
                    className="w-10 h-10 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">MY DATA</h1>
                  <p className="text-gray-600">
                    Personal data, address and payment methods
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="font-bold text-lg mb-4">MY DATA</h2>
                  <div className="space-y-2 mb-6">
                    <p>
                      <span className="font-medium">
                        {displayName}
                      </span>
                    </p>
                    <p>{displayEmail}</p>
                    <p>Date of birth not provided</p>
                    <p>Phone number not provided</p>
                    <p className="mt-4">
                      Customer Number: {displayCustomerNumber}
                    </p>
                  </div>
                  <button className="flex items-center text-sm font-medium hover:underline">
                    <Pencil size={16} className="mr-1" /> EDIT
                  </button>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/congrateslogo-yBvFCOSuSBXoEWkhcGFRP9baaxsmmi.svg"
                        alt="Diamond icon"
                        width={96}
                        height={96}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold mb-2">
                      Congratulations! You are a FINEYST EXPERIENCE member and
                      can benefit from our exclusive services.
                    </p>
                    <button className="flex items-center text-sm font-medium hover:underline mx-auto mt-4">
                      Discover more
                    </button>
                  </div>
                </div>

                {/* Invoice Address div */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="font-bold text-lg mb-4">INVOICE ADDRESS</h2>
                  <div className="mb-2">
                    <h3 className="font-medium text-sm uppercase mb-1">
                      INVOICE ADDRESS
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>{displayName}</p>
                      <p>Street address not provided</p>
                      <p>City not provided</p>
                      <p>State not provided</p>
                      <p>Country not provided</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      ✓ Preferred Billing Address
                    </p>
                  </div>
                  <div className="flex flex-col space-y-3 mt-4">
                    <button className="flex items-center text-sm font-medium hover:underline">
                      <Pencil size={16} className="mr-1" /> EDIT
                    </button>
                    <button className="flex items-center text-sm font-medium hover:underline">
                      <Plus size={16} className="mr-1" /> ADD ADDRESS
                    </button>
                  </div>
                </div>

                {/* Credit Card div */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="font-bold text-lg mb-4">
                    CREDIT CARD INFORMATION
                  </h2>
                  <p className="text-sm mb-6">
                    You have not saved any credit card information.
                  </p>
                  <button className="flex items-center text-sm font-medium hover:underline">
                    <Plus size={16} className="mr-1" /> ADD CARD
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
