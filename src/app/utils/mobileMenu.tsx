

"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Heart, 
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  Search,
  User
} from "lucide-react"
import useAuth from "../hooks/use-auth"
import { useCart } from "../contexts/CartContext"
import useWishlist from "../hooks/use-wishlist"
import MegaMenuCarousel from "../components/navbar/MegaMenuCarousal"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (href: string) => void
  onSearchOpen?: () => void
}

const discoverData: Record<string, { title: string; items: string[]; links: string[] }[]> = {
  "Women's Jackets": [
    {
      title: "LEATHER JACKETS",
      items: ["Leather Jackets", "Fashion Leather Jackets", "Leather Bomber Jackets", "Leather Biker Jackets", "Suede Leather Jackets", "Leather Blazers", "Leather Vests"],
      links: ["/collections/womens-leather-bomber-jackets", "/collections/womens-fashion-leather-jackets", "/collections/womens-leather-bomber-jackets", "/collections/womens-leather-biker-jackets", "/collections/womens-suede-leather-jackets", "/collections/womens-leather-blazers", "/collections/womens-leather-vests"]
    },
    {
      title: "COATS",
      items: ["Shearling Coats", "Trench Coats", "Winter Coats", "Rain Coats", "Puffer Jackets", "Quilted Jackets"],
      links: ["/collections/womens-shearling-coats", "/collections/womens-trench-coats", "/collections/womens-winter-coats", "/collections/womens-rain-coats", "/collections/womens-puffer-jackets", "/collections/womens-quilted-jackets"]
    },
    {
      title: "STYLES",
      items: ["Cropped Jackets", "Pilot & Aviator Jackets", "Varsity Jackets", "Letterman Jackets", "Denim Jackets", "Anorak & Ski Jackets"],
      links: ["/collections/womens-cropped-jackets", "/collections/womens-pilot-aviator-jackets", "/collections/womens-varsity-jackets", "/collections/womens-letterman-jackets", "/collections/womens-denim-jackets", "/collections/womens-anorak-ski-jackets"]
    },
    {
      title: "SPECIAL COLLECTIONS",
      items: ["Puffer Vests", "Vintage Style", "Elegant Style", "Luxury Collection"],
      links: ["/collections/womens-puffer-vests", "/shop?genders=women&style=vintage", "/shop?genders=women&style=elegant", "/shop?genders=women&price=luxury"]
    }
  ],
  "Men's Jackets": [
    {
      title: "LEATHER JACKETS",
      items: ["Leather Jackets", "Leather Bomber Jackets", "Biker & Moto Jackets", "Aviator & Flight Jackets", "Hooded Leather Jackets", "Suede Jackets", "Leather Vests"],
      links: ["/collections/leather-bomber-jacket-mens", "collections/leather-bomber-jacket-mens", "/collections/mens-biker-moto-jackets", "/collections/mens-aviator-jackets", "/collections/mens-hooded-leather-jackets", "/collections/mens-suede-jackets", "/collections/mens-leather-vests"]
    },
    {
      title: "COATS",
      items: ["Leather Dusters", "Long Leather Coats", "Shearling Coats", "Winter Coats", "Puffer Jackets", "Fur & Shearling Jackets"],
      links: ["/collections/mens-leather-dusters", "/collections/mens-long-leather-coats", "/collections/mens-shearling-coats", "/collections/mens-winter-coats", "/collections/mens-puffer-jackets", "/collections/mens-fur-shearling-jackets"]
    },
    {
      title: "STYLES",
      items: ["Varsity Jackets", "Letterman Jackets", "Denim Jackets", "Leather Blazers", "Lightweight Jackets", "Soft Shell Jackets"],
      links: ["/collections/mens-varsity-jackets", "/collections/mens-letterman-jackets", "/collections/mens-denim-jackets", "/collections/mens-leather-blazers", "/collections/mens-lightweight-jackets", "/collections/mens-soft-shell-jackets"]
    },
    {
      title: "SPECIAL COLLECTIONS",
      items: ["Plus Size Leather Jackets", "Puffer Vests", "Vintage Style", "Luxury Collection"],
      links: ["/collections/plus-size-leather-jackets", "/collections/mens-puffer-vests", "/shop?genders=men&style=vintage", "/shop?genders=men&price=luxury"]
    }
  ],
  "Coats": [
    {
      title: "LEATHER JACKETS",
      items: ["Biker Jackets", "Bomber Jackets", "Moto Jackets", "Racing Jackets", "Vintage Leather"],
      links: ["/shop?category=biker-jackets", "/shop?category=bomber-jackets", "/shop?category=moto-jackets", "/shop?category=racing-jackets", "/shop?category=vintage-leather"]
    },
    {
      title: "COATS & OUTERWEAR",
      items: ["Trench Coats", "Wool Coats", "Puffer Jackets", "Peacoats", "Parkas"],
      links: ["/shop?category=trench-coats", "/shop?category=wool-coats", "/shop?category=puffer-jackets", "/shop?category=peacoats", "/shop?category=parkas"]
    },
    {
      title: "SPECIALTY",
      items: ["Varsity Jackets", "Denim Jackets", "Blazers", "Windbreakers", "Hooded Jackets"],
      links: ["/shop?category=varsity-jackets", "/shop?category=denim-jackets", "/shop?category=blazers", "/shop?category=windbreakers", "/shop?category=hooded-jackets"]
    },
    {
      title: "COLLECTIONS",
      items: ["Men's Collection", "Women's Collection", "Unisex Styles", "Luxury Collection", "Size Guide"],
      links: ["/shop?gender=mens", "/shop?gender=womens", "/shop?category=unisex", "/shop?price=luxury", "/size-guide"]
    }
  ],
  "BRANDS": [
    {
      title: "COMPANY",
      items: ["Blogs", "About Us"],
      links: ["/blogs", "/about-us"]
    },
    {
      title: "SUPPORT",
      items: ["FAQs", "Reviews", "Contact Us", "Size Guide"],
      links: ["/faqs", "/reviews", "/contact-us", "/size-guide"]
    },
    {
      title: "HELP",
      items: ["Privacy Policy", "Terms & Conditions", "Shipping & Delivery"],
      links: ["/privacy-policy", "/terms-conditions", "/shipping-and-delivery-policy"]
    }
  ]
};

const mainNavLinks = [
  
  { name: "Women's Jackets" },
  { name: "Men's Jackets" },
  { name: "Coats" },
  { name: "BRANDS" },
];

const panelVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const SubCategoryAccordion = ({ title, items, links, onNavigate }: { title: string; items: string[]; links: string[]; onNavigate: (href: string) => void }) => {
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

    return (
        <div className="border-b border-white/20">
            <button
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                className="flex items-center justify-between w-full px-12 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-colors text-left"
            >
                <span>{title}</span>
                <motion.div animate={{ rotate: isAccordionOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight size={18} className="text-gray-300" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isAccordionOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden bg-white/5"
                    >
                        <div className="pl-12 py-2">
                            <ul className="pl-4 pr-12 space-y-3">
                                {items.map((item, index) => (
                                    <li key={item}>
                                        <button onClick={() => onNavigate(links[index])} className="text-gray-200 hover:text-white transition-all duration-300 text-sm font-medium block text-left w-full hover:translate-x-1">
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavigate, onSearchOpen }) => {
  const { user, isAuthenticated, logout } = useAuth()
  const { items } = useCart()
  const wishlist = useWishlist()
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);

  const handleSetCategory = (name: string) => {
    setDirection(1);
    setActiveCategory(name);
  }

  const handleBack = () => {
    setDirection(-1);
    setActiveCategory(null);
  }
  
  useEffect(() => {
    if (!isOpen) {
        setTimeout(() => {
            setActiveCategory(null);
        }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const updateDimensions = () => {
        setDimensions({ height: window.innerHeight, width: window.innerWidth });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout()
    onClose()
  }

  const sidebarVariants = {
    open: ({ height = 1000, width = 1000 }) => ({
      clipPath: `circle(${Math.hypot(height, width) * 1.1}px at 36px 60px)`,
      transition: {
        stiffness: 400,
        damping: 35,
      },
    }),
    closed: {
      clipPath: "circle(24px at 36px 60px)",
      transition: {
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const backdropVariants = {
    closed: { opacity: 0, transition: { duration: 0.2 } },
    open: { opacity: 1, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* @ts-ignore */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/60"
            style={{ zIndex: 9990 }}
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* @ts-ignore */}
          <motion.div
            className="fixed inset-0 flex flex-col shadow-2xl bg-[#2b2b2b]"
            style={{ zIndex: 9991 }}
            variants={sidebarVariants}
            custom={dimensions}
            initial="closed"
            animate="open"
            exit="closed"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
             <div className="absolute inset-0 flex flex-col">
                {/* <div className="flex items-center bg-black px-12 py-1 text-white overflow-hidden max-w-full flex-shrink-0">
                    <div className="m-auto">
                    <p className="font-medium text-sm">
                        OVER 150 NEW ARRIVALS |
                        <button onClick={() => onNavigate('/')} className="underline ml-1 hover:opacity-80">
                        SHOP NOW
                        </button>
                    </p>
                    </div>
                </div> */}
                
                <div className="bg-[#2b2b2b] text-white -mr-5.9 px-12 flex items-center justify-center flex-shrink-0 h-16 relative">
                    <button onClick={() => onNavigate('/')} className="flex items-center justify-center" aria-label="Go to homepage">
                        <Image src="/images/logo.webp" alt="Leather Jacket Logo" width={160} height={35} className="object-contain" priority />
                    </button>
                </div>

                <div className="flex-1 flex flex-col relative overflow-hidden">
                    <AnimatePresence custom={direction} initial={false}>
                        <motion.div
                          key={activeCategory || "main"}
                          custom={direction}
                          variants={panelVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            x: { type: "spring", stiffness: 350, damping: 35 },
                            opacity: { duration: 0.2 }
                          }}
                          className="absolute w-full h-full bg-[#2b2b2b]"
                        >
                            {activeCategory === null ? (
                                <div className="flex-1 flex flex-col overflow-y-auto">
                                    {isAuthenticated && (
                                        <div className="p-12 border-b border-white/20">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                <p className="font-semibold text-lg text-white">Welcome,</p>
                                                <p className="text-gray-200">{user?.username || 'User'}</p>
                                                </div>
                                                <button onClick={handleLogout} className="bg-white/10 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-white/20 transition-colors">
                                                Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="px-12 pt-6 pb-2 flex items-center justify-between">
                                        <h2 className="font-bold text-white uppercase tracking-widest text-base">
                                            MOBILE MENU
                                        </h2>
                                        <div className="flex items-center space-x-6 text-white">
                                            <button onClick={() => {
                                                onClose();
                                                onSearchOpen?.();
                                            }} className="hover:opacity-80 transition-opacity">
                                                <Search size={22} />
                                                <span className="sr-only">Search</span>
                                            </button>
                                            <button onClick={() => onNavigate('/account')} className="hover:opacity-80 transition-opacity">
                                                <User size={22} />
                                                <span className="sr-only">Account</span>
                                            </button>
                                            <button onClick={() => onNavigate('/wishlist')} className="relative hover:opacity-80 transition-opacity">
                                                <Heart size={22} />
                                                <span className="sr-only">Wishlist</span>
                                                {wishlist.items.length > 0 && (
                                                    <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-white text-[#2b2b2b] flex items-center justify-center text-[10px] font-bold">
                                                        {wishlist.items.length}
                                                    </span>
                                                )}
                                            </button>
                                            <button onClick={() => onNavigate('/cart')} className="relative hover:opacity-80 transition-opacity">
                                                <ShoppingBag size={22} />
                                                <span className="sr-only">Cart</span>
                                                {items.length > 0 && (
                                                    <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-white text-[#2b2b2b] flex items-center justify-center text-[10px] font-bold">
                                                        {items.length}
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <nav className="py-2" aria-label="Main navigation">
                                        {mainNavLinks.map((link) => (
                                           <button
                                                key={link.name}
                                                onClick={() => handleSetCategory(link.name)}
                                                className="w-full px-12 text-left text-white transition-colors hover:bg-white/10"
                                            >
                                                <div className="flex items-center justify-between w-full py-4 border-b border-white/20">
                                                    <span className="text-base font-medium">{link.name}</span>
                                                    <ChevronRight size={20} className="text-gray-300" />
                                                </div>
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            ) : (
                                <div className="flex flex-col h-full">
                                    <div className="flex-shrink-0 flex items-center px-12 py-2.5 border-b border-white/20">
                                        <button onClick={handleBack} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                                          <ChevronLeft size={24} />
                                          <span className="sr-only">Back</span>
                                        </button>
                                        <h3 className="ml-2 font-semibold text-white uppercase tracking-wider">{activeCategory}</h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        {(discoverData[activeCategory] || []).map((section) => (
                                            <SubCategoryAccordion
                                                key={section.title}
                                                title={section.title}
                                                items={section.items}
                                                links={section.links}
                                                onNavigate={onNavigate}
                                            />
                                        ))}

                                        {/* {(activeCategory === 'Coats' || activeCategory === "Women's Jackets") && (
                                          <div className="px-12 pt-12 pb-16 text-white">
                                              <h3 className="font-bold mb-8 text-3xl uppercase tracking-widest">
                                                  Collection
                                              </h3>
                                              <MegaMenuCarousel />
                                          </div>
                                        )} */}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
                
                {isAuthenticated && (
                <div className="px-12 py-4 border-t border-white/20 bg-[#2b2b2b] flex-shrink-0">
                    <button onClick={() => onNavigate('/account')} className="flex items-center w-full text-left">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {(user?.username?.[0] || 'N').toUpperCase()}
                        </div>
                        <span className="ml-3 font-semibold text-white">My Account</span>
                    </button>
                </div>
                )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu
 