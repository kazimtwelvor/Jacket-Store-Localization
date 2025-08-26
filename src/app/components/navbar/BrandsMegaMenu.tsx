import Link from "next/link"
import { X } from "lucide-react"
import dynamic from "next/dynamic"

const MegaMenuCarousel = dynamic(() => import("./MegaMenuCarousal"), {
  ssr: false,
})

interface BrandsMegaMenuProps {
  onClose: () => void
}

export default function BrandsMegaMenu({ onClose }: BrandsMegaMenuProps) {
  return (
    <div className="fixed left-0 right-0 top-16 w-screen z-[9001]">
      <div className="relative bg-[#1c1c1c] border-t border-gray-800 shadow-2xl h-screen overflow-y-auto mega-menu-scrollbar">
        <button
          onClick={onClose}
          className="sticky top-6 right-8 float-right bg-white text-black rounded-full p-1 flex items-center justify-center hover:bg-gray-200 transition-colors z-20 mr-8 mt-6"
          aria-label="Close menu"
        >
          <X className="h-8 w-8" />
        </button>
        <div className="w-full max-w-screen-2xl mx-auto px-8 lg:px-16 py-16">
          <div className="grid grid-cols-6 gap-4 pt-8">
            <div className="space-y-4">
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-gray-700 pb-2 w-fit">
                PREMIUM BRANDS
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/brands/fineyst"
                    className="mega-menu-link text-gray-100 hover:text-white transition-all duration-300 text-sm font-semibold hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Fineyst
                  </Link>
                </li>
                <li>
                  <Link
                    href="/brands/leather-craft"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Leather Craft
                  </Link>
                </li>
                <li>
                  <Link
                    href="/brands/vintage-collection"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Vintage Collection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/brands/urban-style"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Urban Style
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-gray-700 pb-2 w-fit">
                LUXURY BRANDS
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/brands/elite-leather"
                    className="mega-menu-link text-gray-100 hover:text-white transition-all duration-300 text-sm font-semibold hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Elite Leather
                  </Link>
                </li>
                <li>
                  <Link
                    href="/brands/premium-craft"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Premium Craft
                  </Link>
                </li>
                <li>
                  <Link
                    href="/brands/heritage-collection"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Heritage Collection
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-20">
            <h3 className="font-bold text-white mb-8 text-4xl uppercase tracking-widest text-left">
              Brand Collections
            </h3>
            <MegaMenuCarousel />
          </div>
        </div>
      </div>
    </div>
  )
}