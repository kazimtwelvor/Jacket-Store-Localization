import Link from "next/link";
import { X } from "lucide-react";
import dynamic from "next/dynamic";

const MegaMenuCarousel = dynamic(() => import("./MegaMenuCarousal"), {
  ssr: false,
});

interface WomensMegaMenuProps {
  onClose: () => void;
}

export default function WomensMegaMenu({ onClose }: WomensMegaMenuProps) {
  return (
    <div className="fixed left-0 right-0 top-16 w-screen z-[9001]">
      <div className="relative bg-[#1c1c1c] border-t border-gray-800 shadow-2xl max-h-[80vh] overflow-y-auto mega-menu-scrollbar">
        <button
          onClick={onClose}
          className="sticky top-9 right-8 float-right bg-white text-black rounded-full p-1 flex items-center justify-center hover:bg-gray-200 transition-colors z-20 mr-8 mt-6"
          aria-label="Close menu"
        >
          <X className="h-8 w-8" />
        </button>
        <div className="w-full max-w-screen-2xl mx-auto px-8 lg:px-16 pb-8">
          <div className="flex justify-center pt-8">
            <div className="grid grid-cols-4 gap-8 max-w-6xl">
            <div className="space-y-4">
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-gray-700 pb-2 w-fit">
                LEATHER JACKETS
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/us/collections/womens-leather-bomber-jackets"
                    className="mega-menu-link text-gray-100 hover:text-white transition-all duration-300 text-sm font-semibold hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Leather Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-fashion-leather-jackets"
                    className="mega-menu-link text-gray-200 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Fashion Leather Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-leather-bomber-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Leather Bomber Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-leather-biker-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Leather Biker Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-suede-leather-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Suede Leather Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-leather-blazers"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Leather Blazers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-leather-vests"
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
                    href="/us/collections/womens-shearling-coats"
                    className="mega-menu-link text-gray-100 hover:text-white transition-all duration-300 text-sm font-semibold hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Shearling Coats
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-trench-coats"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Trench Coats
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-winter-coats"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Winter Coats
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-rain-coats"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Rain Coats
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-puffer-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Puffer Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-quilted-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Quilted Jackets
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
                    href="/us/collections/womens-cropped-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Cropped Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-pilot-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Pilot & Aviator Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-varsity-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Varsity Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-letterman-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Letterman Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-denim-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Denim Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/collections/womens-anorak-jackets"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Anorak & Ski Jackets
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
                    href="/us/collections/womens-puffer-vests"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Puffer Vests
                  </Link>
                </li>            
              </ul>
            </div>
            </div>
          </div>         
        </div>
      </div>
    </div>
  );
}
