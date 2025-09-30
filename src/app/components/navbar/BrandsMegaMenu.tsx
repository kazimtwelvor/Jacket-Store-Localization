import Link from "next/link";
import { X } from "lucide-react";

interface BrandsMegaMenuProps {
  onClose: () => void;
}

export default function BrandsMegaMenu({ onClose }: BrandsMegaMenuProps) {
  return (
    <div className="fixed left-0 right-0 top-16 w-screen z-[9001]">
      <div className="relative bg-[#1c1c1c] border-t border-gray-800 shadow-2xl max-h-[80vh] overflow-y-auto mega-menu-scrollbar">
        <div
          onClick={onClose}
          className="sticky top-9 right-8 float-right bg-white text-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors z-20 mr-8 mt-6 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </div>
        <div className="w-full max-w-screen-2xl mx-auto px-8 lg:px-16 pb-8">
          <div className="flex justify-center pt-8">
            <div className="grid grid-cols-3 gap-8 max-w-4xl">
            <div className="space-y-4">
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-gray-700 pb-2 w-fit">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/blogs"
                    className="mega-menu-link text-gray-100 hover:text-white transition-all duration-300 text-sm font-semibold hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about-us"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-gray-700 pb-2 w-fit">
                SUPPORT
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/faqs"
                    className="mega-menu-link text-gray-100 hover:text-white transition-all duration-300 text-sm font-semibold hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reviews"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/size-guide"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-gray-700 pb-2 w-fit">
                HELP
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="mega-menu-link text-gray-100 hover:text-white transition-all duration-300 text-sm font-semibold hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-conditions"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping-and-delivery-policy"
                    className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    onClick={onClose}
                  >
                    Shipping & Delivery
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
