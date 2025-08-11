"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  User2,
  Heart,
  X,
  ChevronRight,
  Menu,
} from "lucide-react";
import Button from "../../ui/button";
import { useCart } from "../../contexts/CartContext";
import useAuth from "../../hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import useWishlist from "../../hooks/use-wishlist";
import { useEffect, useRef, useState } from "react";
import { CapsuleNav } from "./CapsuleNav";
import dynamic from "next/dynamic";
const MegaMenuCarousel = dynamic(() => import("./MegaMenuCarousal"), {
  ssr: false,
});
const MobileMenu = dynamic(() => import("../../utils/mobileMenu"), {
  ssr: false,
});
const AnimatedMenuIcon = dynamic(() => import("../../utils/animatedMenuIcon"), {
  ssr: false,
});
import { cn } from "../../lib/utils";
export const revalidate = 0;

const MegaMenuScrollbarStyle = () => (
  <style>{`
    /* Custom scrollbar for WebKit browsers (Chrome, Safari) */
    .mega-menu-scrollbar::-webkit-scrollbar {
      height: 10px;
      width: 10px;
      background-color: #1c1c1c;
    }

    .mega-menu-scrollbar::-webkit-scrollbar-track {
      background: #1c1c1c;
      border-radius: 10px;
      margin: 0 1rem;
    }

    .mega-menu-scrollbar::-webkit-scrollbar-thumb {
      background-color: #555;
      border-radius: 10px;
      border: 2px solid #1c1c1c;
    }

    .mega-menu-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: #777;
    }

    /* Custom scrollbar for Firefox */
    .mega-menu-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #555 #1c1c1c;
    }
  `}</style>
);

const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [windowHeight, setWindowHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const navRef = useRef<HTMLDivElement>(null);
  const navHeight = useRef(0);
  const lastScrollY = useRef(0);
  const lastScrollYRef = useRef(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { items } = useCart();
  const totalItems = items.length;
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const wishlist = useWishlist();

  // ✅ Unified visibility state for fade animation
  const [isCapsuleVisible, setIsCapsuleVisible] = useState(true);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNav = (href: string) => {
    router.push(href);
    toggleMobileMenu();
  };

  useEffect(() => {
    setIsMounted(true);

    setWindowHeight(window.innerHeight);
    if (navRef.current) {
      navHeight.current = navRef.current.offsetHeight;
    }

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      if (navRef.current) {
        navHeight.current = navRef.current.offsetHeight;
      }
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const isCategoryPage = pathname.startsWith("/category/");
          const isShopPage = pathname === "/shop";
          const isCollectionsPage = pathname.startsWith("/collections/");
          const isMobileView = window.innerWidth < 1024;

          // ===== Header Visibility (mobile only) =====
          if (isMobileView) {
            if (isShopPage) {
              const scrollDiff = Math.abs(scrollTop - lastScrollY.current);
              if (scrollDiff > 5) {
                if (scrollTop > lastScrollY.current && scrollTop > 20) {
                  setScrollDirection("down");
                  setIsHeaderVisible(false);
                } else if (scrollTop < lastScrollY.current) {
                  setScrollDirection("up");
                  setIsHeaderVisible(true);
                }
              }
            } else if (isCategoryPage || isCollectionsPage) {
              const lowerContentSection = document.getElementById(
                "lower-content-section"
              );
              if (lowerContentSection) {
                const sectionTop = lowerContentSection.offsetTop;
                const headerHeight = navHeight.current || 88;
                if (scrollTop >= sectionTop - headerHeight) {
                  setIsHeaderVisible(false);
                } else {
                  if (scrollTop > lastScrollY.current && scrollTop > 100) {
                    setIsHeaderVisible(false);
                  } else {
                    setIsHeaderVisible(true);
                  }
                }
              } else {
                if (scrollTop > lastScrollY.current && scrollTop > 100) {
                  setIsHeaderVisible(false);
                } else {
                  setIsHeaderVisible(true);
                }
              }
            }
          } else {
            setIsHeaderVisible(true);
          }

          // ===== CapsuleNav: Show when at the top of any page (except excluded ones) =====
          if (
            !pathname.startsWith("/auth") &&
            !pathname.startsWith("/checkout") &&
            pathname !== "/cart"
          ) {
            setIsCapsuleVisible(scrollTop <= 10);
          }

          setIsSticky(true);
          setScrollY(scrollTop);
          lastScrollY.current = scrollTop <= 0 ? 0 : scrollTop;
          lastScrollYRef.current = scrollTop;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showMegaMenu &&
        megaMenuRef.current &&
        !megaMenuRef.current.contains(e.target as Node)
      ) {
        setShowMegaMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMegaMenu]);

  const itemCount = isMounted ? totalItems : 0;

  const handleLoginClick = () => {
    router.push("/auth/login");
  };

  const handleAccountClick = () => {
    if (isAuthenticated) {
      router.push("/account");
    } else {
      router.push("/auth/login");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const currentPath = window.location.pathname;
      const currentSearch = new URLSearchParams(window.location.search).get(
        "search"
      );

      if (
        currentPath === "/shop" &&
        currentSearch &&
        currentSearch !== searchQuery.trim()
      ) {
        window.location.href = `/shop?search=${encodeURIComponent(
          searchQuery.trim()
        )}`;
      } else {
        router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      }
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={navRef}>
      <MegaMenuScrollbarStyle />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={toggleMobileMenu}
        onNavigate={handleMobileNav}
      />

      <AnimatedMenuIcon
        isOpen={isMobileMenuOpen}
        onClick={toggleMobileMenu}
        className={cn(
          "fixed left-4 z-[9992] lg:hidden p-2 transition-all duration-300",
          isMobileMenuOpen ? "top-[0.8rem]" : "top-[0.8rem]",
          !isHeaderVisible && "hidden"
        )}
        color="white"
      />

      <div
        className={cn(
          "fixed left-0 right-0 z-[9001] w-full",
          !isHeaderVisible
            ? "transform -translate-y-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
            : "transform translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "top-0"
        )}
      >
        <header className="flex items-center bg-[#2B2B2B] h-16 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] w-full">
          <div className="lg:hidden flex items-center space-x-2">
            <div className="w-10 h-10" />
          </div>

          <div className="flex-1 flex justify-center lg:justify-start pr-5">
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/logo.webp"
                alt="Leather Jacket Logo"
                width={220}
                height={35}
                className="object-contain"
                priority
                loading="eager"
              />
            </Link>
          </div>

          <nav
            className={cn(
              "absolute left-0 right-0 mb-3 mx-auto hidden h-full items-center justify-center lg:flex lg:w-auto lg:max-w-[70%] lg:left-1/2 lg:-translate-x-1/2 transition-all duration-500",
              isSticky ? "nav_animate" : ""
            )}
          >
            <div className="flex space-x-8 text-xl">
              <Link href="/shop?category=leather-jackets">
                <Button
                  variant="ghost"
                  className="h-full rounded-none text-white hover:bg-[#8B0000] hover:text-white px-6 py-1"
                >
                  LEATHER JACKETS
                </Button>
              </Link>
              <Link href="/shop?category=womens-jackets">
                <Button
                  variant="ghost"
                  className="h-full rounded-none text-white hover:bg-[#8B0000] hover:text-white px-6 py-1"
                >
                  WOMEN'S JACKETS
                </Button>
              </Link>
              <Link href="/shop?category=mens-jackets">
                <Button
                  variant="ghost"
                  className="h-full rounded-none text-white hover:bg-[#8B0000] hover:text-white px-6 py-1"
                >
                  MEN'S JACKETS
                </Button>
              </Link>
              <div className="relative">
                <Button
                  variant="ghost"
                  className="h-full rounded-none text-white hover:bg-[#8B0000] hover:text-white px-6 py-1"
                  onClick={() => setShowMegaMenu(!showMegaMenu)}
                >
                  COATS
                </Button>
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-4 lg:space-x-6 z-10">
            {isAuthenticated ? (
              <div
                onClick={handleAccountClick}
                className="lg:flex items-center justify-center relative text-white hover:opacity-80 cursor-pointer"
              >
                <User2 className="h-6 w-6" />
                <div className="absolute -bottom-1 -right-1 rounded-full w-4 h-4 flex items-center justify-center border border-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="sr-only">Logged in as {user?.username}</span>
              </div>
            ) : (
              <div
                onClick={handleLoginClick}
                className="lg:flex items-center justify-center text-white hover:opacity-80 cursor-pointer"
              >
                <User2 className="h-6 w-6" />
                <span className="sr-only">Account</span>
              </div>
            )}

            <button
              className="text-white hover:opacity-80"
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-6 w-6" />
              <span className="sr-only">Search</span>
            </button>

            <button
              className="relative flex items-center text-white hover:opacity-80 hidden lg:flex"
              onClick={() => router.push("/wishlist")}
              aria-label="View wishlist"
            >
              <Heart className="h-6 w-6" strokeWidth={1.5} fill="none" />
              {wishlist.items.length > 0 && (
                <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#2B2B2B] text-[10px] sm:text-xs text-white font-bold border-2 border-white shadow-lg transform scale-100 hover:scale-110 transition-transform pointer-events-none">
                  {wishlist.items.length > 99 ? "99+" : wishlist.items.length}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
            </button>

            <button
              className="relative flex items-center text-white hover:opacity-80"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  router.push("/cart");
                } else {
                  window.dispatchEvent(new CustomEvent("openCart"));
                }
              }}
              aria-label="View cart"
            >
              <ShoppingCart className="h-6 w-6" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#2B2B2B] text-[10px] sm:text-xs text-white font-bold border-2 border-white shadow-lg transform scale-100 hover:scale-110 transition-transform pointer-events-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </button>
          </div>
        </header>
      </div>

      {/* Mega Menu */}
      <div
        className={`fixed left-0 right-0 top-[6.5rem] md:top-[5.5rem] w-screen z-[9001] ${
          showMegaMenu ? "block" : "hidden"
        }`}
        style={{ willChange: showMegaMenu ? "transform, opacity" : "auto" }}
      >
        <div
          ref={megaMenuRef}
          className="relative bg-[#1c1c1c] border-t border-gray-800 shadow-2xl max-h-[85vh] overflow-y-auto mega-menu-scrollbar"
        >
          <button
            onClick={() => setShowMegaMenu(false)}
            className="sticky top-6 right-8 float-right bg-white text-black rounded-full p-1 flex items-center justify-center hover:bg-gray-200 transition-colors z-20 mr-8 mt-6"
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
                      href="/shop?category=biker-jackets"
                      className="mega-menu-link text-gray-200 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Biker Jackets
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=bomber-jackets"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Bomber Jackets
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=moto-jackets"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Moto Jackets
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=racing-jackets"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Racing Jackets
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=vintage-leather"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Vintage Leather
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-gray-700 pb-2 w-fit">
                  COATS & OUTERWEAR
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/shop?category=trench-coats"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Trench Coats
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=wool-coats"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Wool Coats
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=puffer-jackets"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Puffer Jackets
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=peacoats"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Peacoats
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=parkas"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Parkas
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-gray-700 pb-2 w-fit">
                  SPECIALTY
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/shop?category=varsity-jackets"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Varsity Jackets
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=denim-jackets"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Denim Jackets
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=blazers"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Blazers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=windbreakers"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Windbreakers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=hooded-jackets"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Hooded Jackets
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest border-b-2 border-gray-700 pb-2 w-fit">
                  COLLECTIONS
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/shop?gender=mens"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-semibold hover:translate-x-1 block"
                    >
                      Men's Collection
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?gender=womens"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-semibold hover:translate-x-1 block"
                    >
                      Women's Collection
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?category=unisex"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Unisex Styles
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop?price=luxury"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Luxury Collection
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/size-guide"
                      className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                    >
                      Size Guide
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-20">
              <h3 className="font-bold text-white mb-8 text-4xl uppercase tracking-widest text-left">
                More Inspiration
              </h3>
              <MegaMenuCarousel />
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-[#B01E23] z-[9999] animate-in fade-in duration-300">
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4">
              <div className="bg-[#a01a1f] rounded-lg shadow-2xl h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] overflow-visible">
                <div className="flex flex-col h-full">
                  <div className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4">
                    <div className="relative w-full flex items-center border-b border-[#d04a4e] pb-3 sm:pb-4">
                      <form
                        onSubmit={handleSearch}
                        className="flex items-center w-full"
                      >
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search products..."
                          className="w-full bg-transparent text-white text-sm sm:text-base md:text-lg lg:text-xl outline-none placeholder-gray-200 pr-12 sm:pr-14 md:pr-16"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="text-white p-1.5 sm:p-2 absolute right-10 sm:right-12"
                        >
                          <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                        </button>
                      </form>
                      <button
                        onClick={() => setIsSearchOpen(false)}
                        className="absolute right-0 text-white p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Close search"
                      >
                        <X className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 px-3 sm:px-4 md:px-6 pb-4 sm:pb-5 md:pb-6">
                    <div className="text-white">
                      <h2 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4 tracking-wider">
                        SUGGESTIONS
                      </h2>
                      <div className="bg-[#8a1519] rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-center justify-between cursor-pointer hover:bg-[#7a1317] transition-colors">
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="mr-2 sm:mr-3 flex-shrink-0">
                            <svg
                              width="16"
                              height="16"
                              className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6Z"
                                stroke="white"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M16 14L19 17"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M3 10C3 4.5 5.5 3 12 3C18.5 3 21 4.5 21 10C21 15.5 18.5 17 12 17C5.5 17 3 15.5 3 10Z"
                                stroke="white"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-xs sm:text-sm md:text-base truncate">
                              Discover a better way to search
                            </p>
                            <p className="text-xs sm:text-sm text-gray-200 truncate">
                              Try Your Personal Stylist
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white flex-shrink-0 ml-1 sm:ml-2" />
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <div
                          className="flex items-center justify-between py-3 sm:py-4 border-b border-[#d04a4e] cursor-pointer hover:bg-[#8a1519] px-2 sm:px-3 rounded transition-colors"
                          onClick={() => {
                            router.push("/category/leather-jackets");
                            setIsSearchOpen(false);
                          }}
                        >
                          <span className="text-sm sm:text-base font-medium">
                            Leather Jackets
                          </span>
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                        </div>
                        <div
                          className="flex items-center justify-between py-3 sm:py-4 border-b border-[#d04a4e] cursor-pointer hover:bg-[#8a1519] px-2 sm:px-3 rounded transition-colors"
                          onClick={() => {
                            router.push("/category/womens-jackets");
                            setIsSearchOpen(false);
                          }}
                        >
                          <span className="text-sm sm:text-base font-medium">
                            Women's Jackets
                          </span>
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                        </div>
                        <div
                          className="flex items-center justify-between py-3 sm:py-4 border-b border-[#d04a4e] cursor-pointer hover:bg-[#8a1519] px-2 sm:px-3 rounded transition-colors"
                          onClick={() => {
                            router.push("/category/mens-jackets");
                            setIsSearchOpen(false);
                          }}
                        >
                          <span className="text-sm sm:text-base font-medium">
                            Men's Jackets
                          </span>
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ CapsuleNav: Show on all pages except excluded ones */}
      {!isMobileMenuOpen &&
        !pathname.startsWith("/auth") &&
        !pathname.startsWith("/checkout") &&
        pathname !== "/cart" && (
          <div
            className={cn(
              "fixed left-0 right-0 z-[9002] w-full flex justify-center",
              "top-16 transition-opacity duration-500 ease-in-out",
              isCapsuleVisible ? "opacity-100" : "opacity-0"
            )}
            style={{ pointerEvents: isCapsuleVisible ? "auto" : "none" }}
          >
            <CapsuleNav />
          </div>
        )}

      {/* Spacer */}
      <div style={{ height: "60px" }}></div>
    </div>
  );
};

export default Navbar;
