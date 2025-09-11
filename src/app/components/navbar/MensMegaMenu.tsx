import Link from "next/link";
import { X } from "lucide-react";
import dynamic from "next/dynamic";

const MegaMenuCarousel = dynamic(() => import("./MegaMenuCarousal"), {
  ssr: false,
});

interface MensMegaMenuProps {
  onClose: () => void;
}

export default function MensMegaMenu({ onClose }: MensMegaMenuProps) {
  return (
    <div className="fixed left-0 right-0 top-16 w-screen z-[9001]">
      <div className="relative bg-[#1c1c1c] border-t border-gray-800 shadow-2xl h-screen overflow-y-auto mega-menu-scrollbar">
        <button
          onClick={onClose}
          className="sticky top-9 right-8 float-right bg-white text-black rounded-full p-1 flex items-center justify-center hover:bg-gray-200 transition-colors z-20 mr-8 mt-6"
          aria-label="Close menu"
        >
          <X className="h-8 w-8" />
        </button>
        <div className="w-full max-w-screen-2xl mx-auto px-8 lg:px-16 py-16">
          <div className="grid grid-cols-6 gap-4 pt-8">
            <div className="space-y-4">
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-gray-700 pb-2 w-fit">
                LEATHER JACKETS
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/collections/leather-bomber-jacket-mens"
                    className="mega-menu-link text-gray-100 hover:text-white transition-all duration-300 text-sm font-semibold hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Leather Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-leather-bomber-jackets"
                    className="mega-menu-link text-gray-200 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Leather Bomber Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-biker-moto-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Biker & Moto Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-aviator-flight-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Aviator & Flight Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-hooded-leather-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Hooded Leather Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-suede-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Suede Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-leather-vests"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Leather Vests
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-gray-700 pb-2 w-fit">
                COATS
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/collections/mens-leather-dusters"
                    className="mega-menu-link text-gray-100 hover:text-white transition-all duration-300 text-sm font-semibold hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Leather Dusters
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-long-leather-coats"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Long Leather Coats
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-shearling-coats"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Shearling Coats
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-winter-coats"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Winter Coats
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-puffer-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Puffer Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-fur-shearling-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Fur & Shearling Jackets
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-gray-700 pb-2 w-fit">
                STYLES
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/collections/mens-varsity-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Varsity Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-letterman-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Letterman Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-denim-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Denim Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-leather-blazers"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Leather Blazers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-lightweight-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Lightweight Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-soft-shell-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Soft Shell Jackets
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-gray-700 pb-2 w-fit">
                SPECIAL COLLECTIONS
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/collections/plus-size-leather-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Plus Size Leather Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collections/mens-puffer-vests"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Puffer Vests
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?genders=men&style=vintage"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Vintage Style
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?genders=men&price=luxury"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Luxury Collection
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-20">
            <h3 className="font-bold text-white mb-8 text-4xl uppercase tracking-widest text-left">
              Collection
            </h3>
            <MegaMenuCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}
