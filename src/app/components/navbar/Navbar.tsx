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
  const [activeNavItem, setActiveNavItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  const [isMegaMenuHovered, setIsMegaMenuHovered] = useState(false);

  const { items } = useCart();
  const totalItems = items.length;
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const wishlist = useWishlist();

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
  }, []);

  useEffect(() => {
    if (!isMounted) return;

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
  }, [pathname, isMounted]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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
    if (!showMegaMenu) {
      setActiveNavItem(null);
    }
  }, [showMegaMenu]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMegaMenu && megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setShowMegaMenu(false);
        setActiveNavItem(null);
      }
    };

    if (showMegaMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMegaMenu]);

  useEffect(() => {
    setShowMegaMenu(false);
    setActiveNavItem(null);
  }, [pathname]);



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

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const params = new URLSearchParams({
        q: query.trim(),
        limit: "8",
      });

      if (selectedCategory) {
        params.append(
          "category",
          selectedCategory.toLowerCase().replace(/\s+/g, "-")
        );
      }

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data);
      } else {
        setSearchResults(null);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await performSearch(searchQuery);

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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(category);
  };

  const handleBackToSuggestions = () => {
    setSelectedCategory(null);
    setSearchQuery("");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("filterBarSticky", {
          detail: { isSticky: isSticky },
        })
      );
    }
  }, [isSticky]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("headerVisibilityChange", {
          detail: { isVisible: isHeaderVisible },
        })
      );
    }
  }, [isHeaderVisible]);

  return (
    <div className="relative w-full" ref={navRef}>
      <MegaMenuScrollbarStyle />

      {isMounted && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={toggleMobileMenu}
          onNavigate={handleMobileNav}
        />
      )}

      {isMounted && (
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
      )}

      <div
        className={cn(
          "fixed left-0 right-0 z-[9001] w-full",
          isMounted && !isHeaderVisible
            ? "transform -translate-y-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
            : "transform translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "top-0"
        )}
      >
        <header className="flex items-center px-5 md:px-10 bg-[#2B2B2B] h-16 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] w-full">
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

          <div
            className={cn(
              "absolute left-0 right-0 mb-3 mx-auto hidden h-full items-center justify-center lg:flex lg:w-auto lg:max-w-[70%] lg:left-1/2 lg:-translate-x-1/2 transition-all duration-500",
              isSticky ? "nav_animate" : ""
            )}
          >
            <nav>
              <div className="flex space-x-8 text-xl">
                <div className="relative">
                  <Link href="/shop?category=leather-jackets" prefetch={true}>
                    <Button
                      variant="ghost"
                      className="h-full rounded-none bg-transparent hover:bg-transparent text-white hover:text-white px-6 py-1 transition-all duration-300"
                      onClick={() => {
                        setShowMegaMenu(true);
                        setActiveNavItem("leather-jackets");
                      }}
                      onMouseEnter={() => setActiveNavItem("leather-jackets")}
                      onMouseLeave={() => {
                        if (!showMegaMenu) {
                          setActiveNavItem(null);
                        }
                      }}
                    >
                      LEATHER JACKETS
                    </Button>
                  </Link>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-all duration-300 origin-left ${activeNavItem === "leather-jackets" ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`} />
                </div>
                <div className="relative">
                  <Link href="/shop?category=womens-jackets" prefetch={true}>
                    <Button
                      variant="ghost"
                      className="h-full rounded-none bg-transparent hover:bg-transparent text-white hover:text-white px-6 py-1 transition-all duration-300"
                      onClick={() => {
                        setShowMegaMenu(true);
                        setActiveNavItem("womens-jackets");
                      }}
                      onMouseEnter={() => setActiveNavItem("womens-jackets")}
                      onMouseLeave={() => {
                        if (!showMegaMenu) {
                          setActiveNavItem(null);
                        }
                      }}
                    >
                      WOMEN'S JACKETS
                    </Button>
                  </Link>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-all duration-300 origin-left ${activeNavItem === "womens-jackets" ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`} />
                </div>
                <div className="relative">
                  <Link href="/shop?category=mens-jackets" prefetch={true}>
                    <Button
                      variant="ghost"
                      className="h-full rounded-none bg-transparent hover:bg-transparent text-white hover:text-white px-6 py-1 transition-all duration-300"
                      onClick={() => {
                        setShowMegaMenu(true);
                        setActiveNavItem("mens-jackets");
                      }}
                      onMouseEnter={() => setActiveNavItem("mens-jackets")}
                      onMouseLeave={() => {
                        if (!showMegaMenu) {
                          setActiveNavItem(null);
                        }
                      }}
                    >
                      MEN'S JACKETS
                    </Button>
                  </Link>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-all duration-300 origin-left ${activeNavItem === "mens-jackets" ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`} />
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="h-full rounded-none bg-transparent hover:bg-transparent text-white hover:text-white px-6 py-1 transition-all duration-300"
                    onClick={() => {
                      setShowMegaMenu(true);
                      setActiveNavItem("coats");
                    }}
                    onMouseEnter={() => setActiveNavItem("coats")}
                    onMouseLeave={() => {
                      if (!showMegaMenu) {
                        setActiveNavItem(null);
                      }
                    }}
                  >
                    COATS
                  </Button>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-all duration-300 origin-left ${activeNavItem === "coats" ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`} />
                </div>
              </div>
            </nav>
          </div>

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
              {isMounted && wishlist.items.length > 0 && (
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
              {isMounted && itemCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#2B2B2B] text-[10px] sm:text-xs text-white font-bold border-2 border-white shadow-lg transform scale-100 hover:scale-110 transition-transform pointer-events-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </button>
          </div>
        </header>
      </div>

      {isMounted && showMegaMenu && (
        <div
          className="fixed left-0 right-0 top-16 w-screen z-[9001]"
        >
          <div
            ref={megaMenuRef}
            className="relative bg-[#1c1c1c] border-t border-gray-800 shadow-2xl h-screen overflow-y-auto mega-menu-scrollbar"
          >
            <button
              onClick={() => {
                setShowMegaMenu(false);
                setActiveNavItem(null);
              }}
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
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Biker Jackets
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?category=bomber-jackets"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Bomber Jackets
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?category=moto-jackets"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Moto Jackets
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?category=racing-jackets"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Racing Jackets
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?category=vintage-leather"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
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
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Trench Coats
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?category=wool-coats"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Wool Coats
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?category=puffer-jackets"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Puffer Jackets
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?category=peacoats"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Peacoats
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?category=parkas"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
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
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Varsity Jackets
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?category=denim-jackets"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Denim Jackets
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?category=blazers"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Blazers
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?category=windbreakers"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Windbreakers
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?category=hooded-jackets"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
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
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Men's Collection
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?gender=womens"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-semibold hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Women's Collection
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?category=unisex"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Unisex Styles
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shop?price=luxury"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
                      >
                        Luxury Collection
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/size-guide"
                        className="mega-menu-link text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 block"
                        onClick={() => {
                          setShowMegaMenu(false);
                          setActiveNavItem(null);
                        }}
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
      )}

      {/* Search Overlay */}
      {isMounted && isSearchOpen && (
        <div className="fixed inset-0 bg-black max-h-[800px] z-[9999] animate-in fade-in duration-300">
          <div className="fixed inset-0 flex items-start justify-center pt-8">
            <div className="w-full max-w-4xl mx-auto px-4">
              <div className="bg-black w-full overflow-y-auto">
                <div className="flex flex-col w-full">
                  {/* Search Bar */}
                  <form
                    onSubmit={handleSearch}
                    className="relative w-full mb-8"
                  >
                    <div className="relative flex items-center border border-gray-600 rounded-lg bg-gray-800 p-4">
                      {selectedCategory && (
                        <button
                          type="button"
                          onClick={handleBackToSuggestions}
                          className="absolute left-4 text-white hover:bg-gray-700 rounded-full p-1 transition-colors"
                          aria-label="Back to suggestions"
                        >
                          <ChevronRight className="h-5 w-5 rotate-180" />
                        </button>
                      )}
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder={
                          selectedCategory
                            ? `Search in ${selectedCategory}...`
                            : "Search for jackets, coats, and more..."
                        }
                        className={cn(
                          "w-full bg-transparent text-white text-lg outline-none placeholder-gray-400",
                          selectedCategory ? "pl-12 pr-20" : "pr-20"
                        )}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSearch(e);
                          }
                        }}
                      />
                      {isSearching && (
                        <div className="absolute right-20 text-gray-400">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                        </div>
                      )}
                      <div className="absolute right-4 flex items-center space-x-3">
                        <button
                          type="submit"
                          className="text-white p-2 hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <Search className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSelectedCategory(null);
                            setSearchQuery("");
                            setSearchResults(null);
                          }}
                          className="text-white p-2 hover:bg-gray-700 rounded-full transition-colors"
                          aria-label="Close search"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="text-white p-2 hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <Menu className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Conditional Content Based on Selection */}
                  {!selectedCategory ? (
                    /* Initial Suggestions View */
                    <div className="text-white">
                      {searchQuery && searchResults ? (
                        /* Search Results View */
                        <div>
                          <h2 className="text-sm font-bold mb-6 tracking-wider uppercase">
                            SEARCH RESULTS FOR "{searchQuery.toUpperCase()}"
                          </h2>

                          {/* Products Section */}
                          {searchResults.products &&
                            searchResults.products.length > 0 && (
                              <div className="mb-8">
                                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                                  PRODUCTS ({searchResults.products.length})
                                </h3>
                                <div className="space-y-3">
                                  {searchResults.products.map(
                                    (product: any) => (
                                      <div
                                        key={product.id}
                                        className="flex items-center space-x-4 py-3 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                                        onClick={() => {
                                          router.push(
                                            `/shop?category=${product.category
                                            }&product=${product.name
                                              .toLowerCase()
                                              .replace(/\s+/g, "-")}`
                                          );
                                          setIsSearchOpen(false);
                                          setSelectedCategory(null);
                                          setSearchQuery("");
                                        }}
                                      >
                                        <div className="w-16 h-16 rounded flex-shrink-0 overflow-hidden">
                                          <Image
                                            src={
                                              product.image ||
                                              "/images/women-leather.webp"
                                            }
                                            alt={product.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              const target =
                                                e.target as HTMLImageElement;
                                              target.src =
                                                "/images/women-leather.webp";
                                            }}
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-white font-medium text-sm">
                                            {product.name}
                                          </p>
                                          <p className="text-gray-400 text-xs">
                                            {product.subcategory}
                                          </p>
                                          <p className="text-gray-500 text-xs">
                                            ${product.price}
                                          </p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-white" />
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Categories Section */}
                          {searchResults.categories &&
                            searchResults.categories.length > 0 && (
                              <div className="mb-8">
                                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                                  CATEGORIES ({searchResults.categories.length})
                                </h3>
                                <div className="space-y-2">
                                  {searchResults.categories.map(
                                    (category: string, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                                        onClick={() =>
                                          handleCategorySelect(category)
                                        }
                                      >
                                        <span className="text-white font-medium">
                                          {category}
                                        </span>
                                        <ChevronRight className="h-4 w-4 text-white" />
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                          {/* No Results */}
                          {(!searchResults.products ||
                            searchResults.products.length === 0) &&
                            (!searchResults.categories ||
                              searchResults.categories.length === 0) && (
                              <div className="text-center py-8">
                                <p className="text-gray-400">
                                  No results found for "{searchQuery}"
                                </p>
                                <p className="text-gray-500 text-sm mt-2">
                                  Try different keywords or browse categories
                                </p>
                              </div>
                            )}
                        </div>
                      ) : (
                        /* Default Suggestions View */
                        <div>
                          <h2 className="text-sm font-bold mb-6 tracking-wider uppercase">
                            SUGGESTIONS
                          </h2>
                          <div className="space-y-2">
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() =>
                                handleCategorySelect("Leather Jackets")
                              }
                            >
                              <span className="text-white font-medium">
                                Leather Jackets
                              </span>
                              <ChevronRight className="h-4 w-4 text-white" />
                            </div>
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() =>
                                handleCategorySelect("Women's Jackets")
                              }
                            >
                              <span className="text-white font-medium">
                                Women's Jackets
                              </span>
                              <ChevronRight className="h-4 w-4 text-white" />
                            </div>
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() =>
                                handleCategorySelect("Men's Jackets")
                              }
                            >
                              <span className="text-white font-medium">
                                Men's Jackets
                              </span>
                              <ChevronRight className="h-4 w-4 text-white" />
                            </div>
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() =>
                                handleCategorySelect("Biker Jackets")
                              }
                            >
                              <span className="text-white font-medium">
                                Biker Jackets
                              </span>
                              <ChevronRight className="h-4 w-4 text-white" />
                            </div>
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() =>
                                handleCategorySelect("Bomber Jackets")
                              }
                            >
                              <span className="text-white font-medium">
                                Bomber Jackets
                              </span>
                              <ChevronRight className="h-4 w-4 text-white" />
                            </div>
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() =>
                                handleCategorySelect("Moto Jackets")
                              }
                            >
                              <span className="text-white font-medium">
                                Moto Jackets
                              </span>
                              <ChevronRight className="h-4 w-4 text-white" />
                            </div>
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() =>
                                handleCategorySelect("Racing Jackets")
                              }
                            >
                              <span className="text-white font-medium">
                                Racing Jackets
                              </span>
                              <ChevronRight className="h-4 w-4 text-white" />
                            </div>
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() =>
                                handleCategorySelect("Trench Coats")
                              }
                            >
                              <span className="text-white font-medium">
                                Trench Coats
                              </span>
                              <ChevronRight className="h-4 w-4 text-white" />
                            </div>
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() => handleCategorySelect("Wool Coats")}
                            >
                              <span className="text-white font-medium">
                                Wool Coats
                              </span>
                              <ChevronRight className="h-4 w-4 text-white" />
                            </div>
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() =>
                                handleCategorySelect("Varsity Jackets")
                              }
                            >
                              <span className="text-white font-medium">
                                Varsity Jackets
                              </span>
                              <ChevronRight className="h-4 w-4 text-white" />
                            </div>
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() =>
                                handleCategorySelect("Denim Jackets")
                              }
                            >
                              <span className="text-white font-medium">
                                Denim Jackets
                              </span>
                              <ChevronRight className="h-4 w-4 text-white" />
                            </div>
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() => handleCategorySelect("Size Guide")}
                            >
                              <span className="text-white font-medium">
                                Size Guide
                              </span>
                              <ChevronRight className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Detailed Categories and Products View */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column - Categories */}
                      <div className="text-white">
                        <h2 className="text-sm font-bold mb-6 tracking-wider uppercase">
                          CATEGORIES
                        </h2>

                        {/* Men Section */}
                        <div className="mb-6">
                          <h3 className="text-white font-semibold mb-3">MEN</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors bg-gray-800">
                              <span className="text-white font-medium">
                                {">"} {selectedCategory}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Women Section */}
                        <div className="mb-6">
                          <h3 className="text-white font-semibold mb-3">
                            WOMEN
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors">
                              <span className="text-white font-medium">
                                {">"} {selectedCategory}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Kids Section */}
                        <div className="mb-6">
                          <h3 className="text-white font-semibold mb-3">
                            KIDS
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors">
                              <span className="text-gray-500 font-medium">
                                No results
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Search All Categories Link */}
                        <div className="pt-4 border-t border-gray-700">
                          <div
                            className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                            onClick={() => {
                              router.push("/shop");
                              setIsSearchOpen(false);
                              setSelectedCategory(null);
                              setSearchQuery("");
                            }}
                          >
                            <span className="text-white font-medium">
                              {">"} SEARCH IN ALL CATEGORIES
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Products */}
                      <div className="text-white">
                        <h2 className="text-sm font-bold mb-6 tracking-wider uppercase">
                          PRODUCTS
                        </h2>

                        {searchQuery &&
                          searchResults &&
                          searchResults.products &&
                          searchResults.products.length > 0 ? (
                          /* Dynamic Search Results */
                          <div className="space-y-4">
                            {searchResults.products.map((product: any) => (
                              <div
                                key={product.id}
                                className="flex items-center space-x-4 py-3 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                                onClick={() => {
                                  router.push(
                                    `/shop?category=${product.category
                                    }&product=${product.name
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}`
                                  );
                                  setIsSearchOpen(false);
                                  setSelectedCategory(null);
                                  setSearchQuery("");
                                }}
                              >
                                <div className="w-16 h-16 rounded flex-shrink-0 overflow-hidden">
                                  <Image
                                    src={
                                      product.image ||
                                      "/images/women-leather.webp"
                                    }
                                    alt={product.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.src = "/images/women-leather.webp";
                                    }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-white font-medium text-sm">
                                    {product.name}
                                  </p>
                                  <p className="text-gray-400 text-xs">
                                    {product.subcategory}
                                  </p>
                                  <p className="text-gray-500 text-xs">
                                    ${product.price}
                                  </p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-white" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* Default Products View */
                          <div className="space-y-4">
                            {/* Product 1 */}
                            <div
                              className="flex items-center space-x-4 py-3 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() => {
                                router.push(
                                  "/shop?category=biker-jackets&product=classic-biker-leather-jacket"
                                );
                                setIsSearchOpen(false);
                                setSelectedCategory(null);
                                setSearchQuery("");
                              }}
                            >
                              <div className="w-16 h-16 rounded flex-shrink-0 overflow-hidden">
                                <Image
                                  src="/images/women-biker.webp"
                                  alt="Classic Biker Leather Jacket"
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/images/women-leather.webp";
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-medium text-sm">
                                  CLASSIC BIKER LEATHER JACKET
                                </p>
                                <p className="text-gray-400 text-xs">
                                  Premium Leather
                                </p>
                              </div>
                            </div>

                            {/* Product 2 */}
                            <div
                              className="flex items-center space-x-4 py-3 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() => {
                                router.push(
                                  "/shop?category=bomber-jackets&product=vintage-bomber-jacket"
                                );
                                setIsSearchOpen(false);
                                setSelectedCategory(null);
                                setSearchQuery("");
                              }}
                            >
                              <div className="w-16 h-16 rounded flex-shrink-0 overflow-hidden">
                                <Image
                                  src="/images/women-puffer.webp"
                                  alt="Vintage Bomber Jacket"
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/images/women-leather.webp";
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-medium text-sm">
                                  VINTAGE BOMBER JACKET
                                </p>
                                <p className="text-gray-400 text-xs">
                                  Authentic Style
                                </p>
                              </div>
                            </div>

                            {/* Product 3 */}
                            <div
                              className="flex items-center space-x-4 py-3 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() => {
                                router.push(
                                  "/shop?category=racing-jackets&product=racing-motorcycle-jacket"
                                );
                                setIsSearchOpen(false);
                                setSelectedCategory(null);
                                setSearchQuery("");
                              }}
                            >
                              <div className="w-16 h-16 rounded flex-shrink-0 overflow-hidden">
                                <Image
                                  src="/images/women-leather.webp"
                                  alt="Racing Motorcycle Jacket"
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/images/women-leather.webp";
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-medium text-sm">
                                  RACING MOTORCYCLE JACKET
                                </p>
                                <p className="text-gray-400 text-xs">
                                  Performance Gear
                                </p>
                              </div>
                            </div>

                            {/* Product 4 */}
                            <div
                              className="flex items-center space-x-4 py-3 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                              onClick={() => {
                                router.push(
                                  "/shop?category=trench-coats&product=luxury-trench-coat"
                                );
                                setIsSearchOpen(false);
                                setSelectedCategory(null);
                                setSearchQuery("");
                              }}
                            >
                              <div className="w-16 h-16 rounded flex-shrink-0 overflow-hidden">
                                <Image
                                  src="/images/trench-coat.webp"
                                  alt="Luxury Trench Coat"
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/images/women-leather.webp";
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-medium text-sm">
                                  LUXURY TRENCH COAT
                                </p>
                                <p className="text-gray-400 text-xs">
                                  Elegant Design
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Show All Products Link */}
                        <div className="pt-4 border-t border-gray-700 mt-6">
                          <div
                            className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-800 px-3 rounded transition-colors"
                            onClick={() => {
                              router.push("/shop");
                              setIsSearchOpen(false);
                              setSelectedCategory(null);
                              setSearchQuery("");
                            }}
                          >
                            <span className="text-white font-medium">
                              {">"} SHOW ALL PRODUCTS
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ CapsuleNav: Show on all pages except excluded ones */}
      {isMounted &&
        !isMobileMenuOpen &&
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
