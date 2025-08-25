"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import type { Product, Category, Color, Size } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../../contexts/CartContext";
import useWishlist from "../../hooks/use-wishlist";
import getProducts from "../../actions/get-products";
import MobileAddToCartModal from "../../modals/MobileAddToCartModal";
import ShopCategories from "./ShopCategories";
import RecentlyViewed from "../../category/RecentlyViewed";
import WeThinkYouWillLove from "../../category/WeThinkYouWillLove";
import { ProductCard } from "./components/ProductCard";
import { FilterBar } from "../common/FilterBar";
import { PaginationControls } from "./components/PaginationControls";
import { FilterSidebar } from "./components/FilterSidebar";
import { CategorySlider } from "./components/CategorySlider";
import WhatsMySize from "@/src/components/WhatsMySize";
import { Loader2 } from "lucide-react";
import { avertaBlack } from "@/src/lib/fonts";

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return mounted ? matches : false;
};

const getMaterialsFromCategories = (categories?: Category[]) => {
  const materials = [
    "Leather",
    "Denim",
    "Cotton",
    "Polyester",
    "Wool",
    "Suede",
  ];
  return materials.map((name, index) => ({ id: `material-${index}`, name }));
};

const getStylesFromCategories = (categories?: Category[]) => {
  const styles = ["Bomber", "Biker", "Varsity", "Aviator", "Puffer", "Trench"];
  return styles.map((name, index) => ({ id: `style-${index}`, name }));
};

const getGendersFromCategories = (categories?: Category[]) => {
  const genders = ["Male", "Female", "Unisex"];
  return genders.map((name, index) => ({ id: `gender-${index}`, name }));
};

const getProductSlug = (product: Product): string => {
  if (product.slug) return product.slug;
  if (product.name) {
    const baseSlug = product.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    return product.id ? `${baseSlug}-${product.id.substring(0, 8)}` : baseSlug;
  }
  return product.id;
};

interface PaginatedProductsData {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    productsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface KeywordCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

type ProductsPageClientProps = {
  initialProductsData: PaginatedProductsData;
  categories?: Category[];
  colors?: Color[];
  sizes?: Size[];
  keywordCategories?: KeywordCategory[];
};

const ProductsPageClient: React.FC<ProductsPageClientProps> = ({
  initialProductsData,
  categories,
  colors,
  sizes,
  keywordCategories = [],
}) => {
  const [productsData, setProductsData] =
    useState<PaginatedProductsData>(initialProductsData);
  const [loading, setLoading] = useState(false);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [categorySliderOpen, setCategorySliderOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("t-shirts");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState({
    materials: [] as string[],
    style: [] as string[],
    gender: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
  });
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {}
  );
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(
    initialProductsData.pagination.currentPage
  );
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(
    new Set()
  );
  const [mobileCartModal, setMobileCartModal] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({ isOpen: false, product: null });
  const [currentProducts, setCurrentProducts] = useState<Product[]>(
    initialProductsData.products
  );
  const [mounted, setMounted] = useState(false);
  const [layoutMetrics, setLayoutMetrics] = useState({
    startStickyPoint: 0,
    endStickyPoint: 0,
    filterBarHeight: 0,
  });

  const filterBarWrapperRef = useRef<HTMLDivElement>(null);
  const paginationSectionRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const wasDraggedRef = useRef(false);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  const requestIdRef = useRef(0);
  const latestHandledRequestRef = useRef(0);
  const inflightCountRef = useRef(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { addToCart } = useCart();
  const wishlist = useWishlist();

  const materials = getMaterialsFromCategories(categories);
  const styles = getStylesFromCategories(categories);
  const genders = getGendersFromCategories(categories);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasActiveFilters =
    selectedFilters.materials.length > 0 ||
    selectedFilters.style.length > 0 ||
    selectedFilters.gender.length > 0 ||
    selectedFilters.colors.length > 0 ||
    selectedFilters.sizes.length > 0;
  const totalActiveFilters =
    selectedFilters.materials.length +
    selectedFilters.style.length +
    selectedFilters.gender.length +
    selectedFilters.colors.length +
    selectedFilters.sizes.length;

  const sortProductsClient = useCallback(
    (list: Product[], sortKey: string): Product[] => {
      if (!Array.isArray(list)) return [];
      const normalized = sortKey.replace("_", "-").toLowerCase();
      const parsePriceValue = (raw: any): number => {
        if (raw === undefined || raw === null) return 0;
        if (typeof raw === "number") return raw;
        const cleaned = String(raw).replace(/[^0-9.]/g, "");
        const num = Number.parseFloat(cleaned);
        return Number.isFinite(num) ? num : 0;
      };
      const priceOf = (p: Product) => {
        const sale = parsePriceValue((p as any).salePrice);
        const base = parsePriceValue((p as any).price);
        return sale > 0 ? sale : base;
      };
      if (normalized === "newest") {
        return [...list].sort((a, b) => {
          const aTime = new Date((a as any).createdAt || 0).getTime();
          const bTime = new Date((b as any).createdAt || 0).getTime();
          return bTime - aTime;
        });
      }
      if (normalized === "price-desc" || normalized === "price-high") {
        return [...list].sort((a, b) => priceOf(b) - priceOf(a));
      }
      if (normalized === "price-asc" || normalized === "price-low") {
        return [...list].sort((a, b) => priceOf(a) - priceOf(b));
      }
      return list;
    },
    []
  );

  const updateURL = useCallback(
    (newParams: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (
          value &&
          value !== "" &&
          value !== "1" &&
          !(key === "categoryId" && value === "t-shirts")
        ) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });
      const newUrl = params.toString() ? `/shop?${params.toString()}` : "/shop";
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("route-loading:start"));
      }
      router.push(newUrl, { scroll: false });
    },
    [router, searchParams]
  );

  const fetchProducts = useCallback(
    async (
      page: number,
      resetFilters = false,
      sortOverride?: string,
      skipURLUpdate = false,
      explicitQuery?: {
        materials?: string;
        styles?: string;
        genders?: string;
        colors?: string;
        sizes?: string;
      }
    ) => {
      inflightCountRef.current += 1;
      // Only show in-page loading when we are NOT updating the URL.
      // For URL updates, the global route overlay will handle loading UX
      if (skipURLUpdate) {
        setLoading(true);
      }
      const requestId = ++requestIdRef.current;
      try {
        const hasFilters =
          selectedFilters.materials.length > 0 ||
          selectedFilters.style.length > 0 ||
          selectedFilters.gender.length > 0 ||
          selectedFilters.colors.length > 0 ||
          selectedFilters.sizes.length > 0;

        const genderToParam = (g: string) => {
          const v = g.trim().toLowerCase();
          if (v === "male" || v === "men") return "men";
          if (v === "female" || v === "women") return "women";
          if (v === "unisex") return "unisex";
          return v;
        };

        const queryParams = {
          page,
          limit: 28,
          categoryId:
            activeCategory !== "t-shirts" ? activeCategory : undefined,
          materials:
            explicitQuery?.materials ??
            (selectedFilters.materials.length > 0
              ? selectedFilters.materials.join(",")
              : undefined),
          styles:
            explicitQuery?.styles ??
            (selectedFilters.style.length > 0
              ? selectedFilters.style.join(",")
              : undefined),
          genders:
            explicitQuery?.genders ??
            (selectedFilters.gender.length > 0
              ? Array.from(
                  new Set(selectedFilters.gender.map(genderToParam))
                ).join(",")
              : undefined),
          colors:
            explicitQuery?.colors ??
            (selectedFilters.colors.length > 0
              ? selectedFilters.colors.join(",")
              : undefined),
          sizes:
            explicitQuery?.sizes ??
            (selectedFilters.sizes.length > 0
              ? selectedFilters.sizes.join(",")
              : undefined),
          sort: hasFilters ? sortOverride ?? activeSort : undefined,
        };

        const newProductsData = await getProducts(queryParams);

        // Only apply if this is the latest request
        if (requestId > latestHandledRequestRef.current) {
          latestHandledRequestRef.current = requestId;
          setProductsData(newProductsData);
          setCurrentProducts(
            sortProductsClient(
              newProductsData.products,
              sortOverride ?? activeSort
            )
          );
          setCurrentPage(page);
        }

        if (!skipURLUpdate) {
          const normalizedGender = Array.from(
            new Set(selectedFilters.gender.map(genderToParam))
          ).join(",");
          updateURL({
            page: page > 1 ? page : "",
            categoryId: activeCategory !== "t-shirts" ? activeCategory : "",
            materials:
              selectedFilters.materials.length > 0
                ? selectedFilters.materials.join(",")
                : "",
            styles:
              selectedFilters.style.length > 0
                ? selectedFilters.style.join(",")
                : "",
            genders: normalizedGender || "",
            colors:
              selectedFilters.colors.length > 0
                ? selectedFilters.colors.join(",")
                : "",
            sizes:
              selectedFilters.sizes.length > 0
                ? selectedFilters.sizes.join(",")
                : "",
            sort: (sortOverride ?? activeSort) || "",
          });
        }
      } catch (error) {
        setProductsData({
          products: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalProducts: 0,
            productsPerPage: 28,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        });
      } finally {
        inflightCountRef.current = Math.max(0, inflightCountRef.current - 1);
        if (skipURLUpdate) {
          if (inflightCountRef.current === 0) {
            setLoading(false);
          }
        }
      }
    },
    [activeCategory, selectedFilters, updateURL, activeSort]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      fetchProducts(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [fetchProducts]
  );

  const handleFilterChange = useCallback(() => {
    fetchProducts(1, true);
  }, [fetchProducts]);

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId);
      fetchProducts(1, true);
    },
    [fetchProducts]
  );

  const handleSortChange = (sortValue: string) => {
    setActiveSort(sortValue);
    setSortDropdownOpen(false);
    fetchProducts(1, true, sortValue);
  };

  const handleClick = (product: Product) => {
    const slug = getProductSlug(product);
    // We no longer trigger the global route overlay for same-path navigations
    router.push(`/product/${slug}`);
  };

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 8);
      localStorage.setItem("recentlyViewedProducts", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSizeSelect = (productId: string, size: string) => {
    const product =
      currentProducts.find((p) => p.id === productId) ||
      recentlyViewed.find((p) => p.id === productId);
    if (product) {
      addToCart(product, "M");
    }
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const toggleMaterialFilter = (material: string) => {
    setSelectedFilters((prev) => {
      const newMaterials = prev.materials.includes(material)
        ? prev.materials.filter((m) => m !== material)
        : [...prev.materials, material];
      return { ...prev, materials: newMaterials };
    });
  };

  const toggleStyleFilter = (style: string) => {
    setSelectedFilters((prev) => {
      const newStyles = prev.style.includes(style)
        ? prev.style.filter((s) => s !== style)
        : [...prev.style, style];
      return { ...prev, style: newStyles };
    });
  };

  const toggleGenderFilter = (gender: string) => {
    setSelectedFilters((prev) => {
      const newGenders = prev.gender.includes(gender)
        ? prev.gender.filter((g) => g !== gender)
        : [...prev.gender, gender];
      return { ...prev, gender: newGenders };
    });
  };

  const toggleSizeFilter = (size: string) => {
    setSelectedFilters((prev) => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const toggleColorFilter = (color: string) => {
    setSelectedFilters((prev) => {
      const newColors = prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: newColors };
    });
  };

  const clearFilters = () => {
    // reset local state
    setSelectedFilters({
      materials: [],
      style: [],
      gender: [],
      colors: [],
      sizes: [],
    });
    setActiveCategory("t-shirts");
    setActiveSort("");
    setCurrentPage(1);

    // reset URL back to base /shop
    updateURL({
      page: "",
      categoryId: "",
      materials: "",
      styles: "",
      genders: "",
      colors: "",
      sizes: "",
      sort: "",
    });

    // refetch products after state flush without updating URL again
    setTimeout(() => {
      fetchProducts(1, true, "", true);
    }, 0);
  };

  useEffect(() => {
    setMounted(true);
    const sortedInitial = sortProductsClient(
      initialProductsData.products,
      activeSort
    );
    setCurrentProducts(sortedInitial);
    setVisibleProducts(sortedInitial.map((p) => p.id));
  }, [initialProductsData.products]);

  useEffect(() => {
    const urlPage = Number.parseInt(searchParams.get("page") || "1");
    const urlCategoryId = searchParams.get("categoryId") || "t-shirts";
    const urlMaterials = searchParams.get("materials");
    const urlStyle = searchParams.get("styles");
    const urlGender = searchParams.get("genders");
    const urlColor = searchParams.get("colors");
    const urlSize = searchParams.get("sizes");
    const urlSort = searchParams.get("sort");
    setActiveCategory(urlCategoryId);
    setCurrentPage(urlPage);
    setActiveSort(urlSort || "");

    const mapGenderToTitle = (g: string) => {
      const v = g.trim().toLowerCase();
      if (v === "men" || v === "male") return "Male";
      if (v === "women" || v === "female") return "Female";
      if (v === "unisex") return "Unisex";
      return g;
    };

    if (urlMaterials || urlStyle || urlGender || urlColor || urlSize) {
      setSelectedFilters({
        materials: urlMaterials ? urlMaterials.split(",") : [],
        style: urlStyle ? urlStyle.split(",") : [],
        gender: urlGender ? urlGender.split(",").map(mapGenderToTitle) : [],
        colors: urlColor ? urlColor.split(",") : [],
        sizes: urlSize ? urlSize.split(",") : [],
      });
    }

    if (
      urlMaterials ||
      urlStyle ||
      urlGender ||
      urlColor ||
      urlSize ||
      urlPage > 1 ||
      urlCategoryId !== "t-shirts"
    ) {
      const explicit = {
        materials: urlMaterials || undefined,
        styles: urlStyle || undefined,
        genders: urlGender || undefined,
        colors: urlColor || undefined,
        sizes: urlSize || undefined,
      };
      setTimeout(
        () => fetchProducts(urlPage, false, undefined, true, explicit),
        0
      );
    }
  }, []);

  useEffect(() => {
    const urlPage = Number.parseInt(searchParams.get("page") || "1");
    const urlMaterials = searchParams.get("materials") || "";
    const urlStyle = searchParams.get("styles") || "";
    const urlGender = searchParams.get("genders") || "";
    const urlColor = searchParams.get("colors") || "";
    const urlSize = searchParams.get("sizes") || "";

    const currentMaterials = selectedFilters.materials.join(",");
    const currentStyles = selectedFilters.style.join(",");
    const currentGenders = selectedFilters.gender
      .map((g) => g.trim().toLowerCase())
      .join(",");
    const currentColors = selectedFilters.colors.join(",");
    const currentSizes = selectedFilters.sizes.join(",");

    const filtersChanged =
      urlMaterials !== currentMaterials ||
      urlStyle !== currentStyles ||
      urlGender !== currentGenders ||
      urlColor !== currentColors ||
      urlSize !== currentSizes;

    if (filtersChanged) {
      // Sync local state from URL
      const mapGenderToTitle = (g: string) => {
        const v = g.trim().toLowerCase();
        if (v === "men" || v === "male") return "Male";
        if (v === "women" || v === "female") return "Female";
        if (v === "unisex") return "Unisex";
        return g;
      };
      setSelectedFilters({
        materials: urlMaterials ? urlMaterials.split(",") : [],
        style: urlStyle ? urlStyle.split(",") : [],
        gender: urlGender ? urlGender.split(",").map(mapGenderToTitle) : [],
        colors: urlColor ? urlColor.split(",") : [],
        sizes: urlSize ? urlSize.split(",") : [],
      });
      const explicit = {
        materials: urlMaterials || undefined,
        styles: urlStyle || undefined,
        genders: urlGender || undefined,
        colors: urlColor || undefined,
        sizes: urlSize || undefined,
      };
      fetchProducts(urlPage, true, undefined, true, explicit);
      return;
    }

    if (urlPage !== currentPage) {
      fetchProducts(urlPage);
    }
  }, [searchParams]);

  // Disabled automatic filter effect to prevent conflicts with URL-based filtering
  // useEffect(() => {
  //   if (selectedFilters.materials.length > 0 || selectedFilters.style.length > 0 || selectedFilters.gender.length > 0 || selectedFilters.colors.length > 0 || selectedFilters.sizes.length > 0) {
  //     handleFilterChange()
  //   }
  // }, [selectedFilters])

  useEffect(() => {
    setCurrentProducts((prev) => sortProductsClient(prev, activeSort));
  }, [activeSort]);

  useEffect(() => {
    const stoblackRecentlyViewed = localStorage.getItem(
      "recentlyViewedProducts"
    );
    if (stoblackRecentlyViewed) {
      try {
        const parsedData = JSON.parse(stoblackRecentlyViewed);
        const productObjects = parsedData
          .map((p: Product) => p)
          .filter(Boolean);
        setRecentlyViewed(productObjects);
      } catch (error) {
        console.error("Error parsing recently viewed products:", error);
      }
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productId = entry.target.id.replace("product-", "");
            setVisibleProducts((prev) =>
              prev.includes(productId) ? prev : [...prev, productId]
            );
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: window.innerWidth < 768 ? "200px" : "100px",
      }
    );

    productRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      productRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [productsData.products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownOpen &&
        filterBarRef.current &&
        !filterBarRef.current.contains(event.target as Node)
      ) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortDropdownOpen]);

  useLayoutEffect(() => {
    const updateLayout = () => {
      const filterBarWrapper = filterBarWrapperRef.current;
      const paginationSection = paginationSectionRef.current;
      if (
        filterBarWrapper &&
        paginationSection &&
        filterBarWrapper.firstElementChild
      ) {
        const filterBarElement =
          filterBarWrapper.firstElementChild as HTMLElement;
        const style = window.getComputedStyle(filterBarElement);
        const marginBottom = parseFloat(style.marginBottom);
        const height = filterBarElement.offsetHeight + marginBottom;
        const stickyBarTopPosition = window.matchMedia("(min-width: 768px)")
          .matches
          ? 112
          : 128;
        setLayoutMetrics({
          startStickyPoint: filterBarWrapper.offsetTop,
          endStickyPoint:
            paginationSection.offsetTop - stickyBarTopPosition - height,
          filterBarHeight: height,
        });
      }
    };

    const timeoutId = setTimeout(updateLayout, 100);
    return () => clearTimeout(timeoutId);
  }, [productsData.products, loading]);

  useEffect(() => {
    if (layoutMetrics.startStickyPoint === 0) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const { startStickyPoint, endStickyPoint } = layoutMetrics;
      const shouldBeSticky =
        scrollY >= startStickyPoint && scrollY < endStickyPoint;
      setIsFilterSticky((current) =>
        current !== shouldBeSticky ? shouldBeSticky : current
      );
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [layoutMetrics]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("filterBarSticky", {
          detail: { isSticky: isFilterSticky },
        })
      );
    }
  }, [isFilterSticky]);

  return (
    <section className="bg-white">
      <ShopCategories keywordCategories={keywordCategories} />

      {/* Shop Heading */}
      <div className="container mx-auto text-center -mt-2 sm:mt-8 -mb-2 sm:mb-0">
        <h1
          className={`text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 ${avertaBlack.className}`}
        >
          {(() => {
            const material = searchParams.get("materials");
            const style = searchParams.get("styles");

            // Collect all selected categories
            const categories: string[] = [];

            // Handle comma-separated materials
            if (material) {
              const materials = material.split(",").map((m) => m.trim());
              materials.forEach((m) => {
                if (m.toLowerCase() === "leather") categories.push("LEATHER");
                if (m.toLowerCase() === "denim") categories.push("DENIM");
                if (m.toLowerCase() === "nylon") categories.push("NYLON");
                if (m.toLowerCase() === "polyester")
                  categories.push("POLYESTER");
                if (m.toLowerCase() === "cotton") categories.push("COTTON");
                if (m.toLowerCase() === "wool") categories.push("WOOL");
                if (m.toLowerCase() === "silk") categories.push("SILK");
                if (m.toLowerCase() === "cashmere") categories.push("CASHMERE");
                if (m.toLowerCase() === "linen") categories.push("LINEN");
              });
            }

            // Handle comma-separated styles
            if (style) {
              const styles = style.split(",").map((s) => s.trim());
              styles.forEach((s) => {
                if (s.toLowerCase() === "bomber") categories.push("BOMBER");
                if (s.toLowerCase() === "varsity") categories.push("VARSITY");
                if (s.toLowerCase() === "biker") categories.push("BIKER");
              });
            }

            // Handle multiple categories
            if (categories.length === 0) return "SHOP";
            if (categories.length === 1) return `SHOP ${categories[0]} JACKETS`;
            if (categories.length === 2)
              return `SHOP ${categories[0]} AND ${categories[1]} JACKETS`;
            if (categories.length > 2) return "SHOP JACKETS";
          })()}
        </h1>
      </div>

      <div className="mx-auto w-full px-0 sm:px-4 lg:px-6 py-6 sm:py-8 md:py-12">
        <div ref={filterBarWrapperRef}>
          <FilterBar
            isFilterSticky={isFilterSticky}
            layoutMetrics={layoutMetrics}
            hasActiveFilters={hasActiveFilters}
            totalActiveFilters={totalActiveFilters}
            currentSort={activeSort}
            sortDropdownOpen={sortDropdownOpen}
            setSortDropdownOpen={setSortDropdownOpen}
            setFilterSidebarOpen={setFilterSidebarOpen}
            setCategorySliderOpen={setCategorySliderOpen}
            setSizeModalOpen={setSizeModalOpen}
            clearFilters={clearFilters}
            handleSortChange={handleSortChange}
            isDesktop={isDesktop}
          />
        </div>

        <div className="w-full px-2 sm:px-4 md:px-8">
          {!loading && productsData.products.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-gray-600 text-center">
                Showing{" "}
                {(productsData.pagination.currentPage - 1) *
                  productsData.pagination.productsPerPage +
                  1}{" "}
                -{" "}
                {Math.min(
                  productsData.pagination.currentPage *
                    productsData.pagination.productsPerPage,
                  productsData.pagination.totalProducts
                )}{" "}
                of all products
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-4 lg:gap-5 xl:gap-6 gap-y-8 md:gap-y-4 lg:gap-y-5 xl:gap-y-6">
                {currentProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    isDesktop={isDesktop}
                    hoveredProduct={hoveredProduct}
                    setHoveredProduct={setHoveredProduct}
                    selectedSizes={selectedSizes}
                    handleSizeSelect={handleSizeSelect}
                    handleClick={handleClick}
                    addToRecentlyViewed={addToRecentlyViewed}
                    wishlist={wishlist}
                    setMobileCartModal={setMobileCartModal}
                    loadingProducts={loadingProducts}
                    visibleProducts={visibleProducts}
                    wasDraggedRef={wasDraggedRef}
                  />
                ))}
              </div>

              <div ref={paginationSectionRef}>
                <PaginationControls
                  currentPage={productsData.pagination.currentPage}
                  totalPages={productsData.pagination.totalPages}
                  hasNextPage={productsData.pagination.hasNextPage}
                  hasPreviousPage={productsData.pagination.hasPreviousPage}
                  loading={loading}
                  onPageChange={handlePageChange}
                  isDesktop={isDesktop}
                />
              </div>

              <div id="lower-content-div"></div>
            </>
          ) : !loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No products found. Try adjusting your filters.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-2 text-black-600 hover:text-black underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading products...</p>
            </div>
          )}
        </div>

        {currentProducts.length > 0 && (
          <WeThinkYouWillLove
            products={currentProducts}
            hoveredProduct={hoveredProduct}
            setHoveredProduct={setHoveredProduct}
            selectedSizes={selectedSizes}
            addToRecentlyViewed={addToRecentlyViewed}
            handleClick={handleClick}
            handleSizeSelect={handleSizeSelect}
            onAddToCartClick={(product) =>
              setMobileCartModal({ isOpen: true, product })
            }
          />
        )}

        {recentlyViewed.length > 0 && (
          <RecentlyViewed
            recentlyViewed={recentlyViewed}
            hoveredProduct={hoveredProduct}
            setHoveredProduct={setHoveredProduct}
            selectedSizes={selectedSizes}
            addToRecentlyViewed={addToRecentlyViewed}
            handleClick={handleClick}
            handleSizeSelect={handleSizeSelect}
            onAddToCartClick={(product) =>
              setMobileCartModal({ isOpen: true, product })
            }
          />
        )}

        <FilterSidebar
          isOpen={filterSidebarOpen}
          onClose={() => setFilterSidebarOpen(false)}
          hasActiveFilters={hasActiveFilters}
          totalActiveFilters={totalActiveFilters}
          selectedFilters={selectedFilters}
          materials={materials}
          styles={styles}
          genders={genders}
          colors={colors || []}
          sizes={sizes || []}
          onFilterChange={{
            toggleMaterial: toggleMaterialFilter,
            toggleStyle: toggleStyleFilter,
            toggleGender: toggleGenderFilter,
            toggleSize: toggleSizeFilter,
            toggleColor: toggleColorFilter,
          }}
          onClearFilters={clearFilters}
          onApplyFilters={() => {
            fetchProducts(1, true);
            setFilterSidebarOpen(false);
          }}
        />

        <CategorySlider
          isOpen={categorySliderOpen}
          onClose={() => setCategorySliderOpen(false)}
          keywordCategories={keywordCategories || []}
          onCategorySelect={(category) => {
            setCategorySliderOpen(false);
          }}
        />

        <WhatsMySize
          open={sizeModalOpen}
          onOpenChange={setSizeModalOpen}
          // onCategorySelect={(category) => {
          //   console.log("Selected category:", category);
          // }}
        />

        {mobileCartModal.product && (
          <MobileAddToCartModal
            isOpen={mobileCartModal.isOpen}
            onClose={() => setMobileCartModal({ isOpen: false, product: null })}
            product={mobileCartModal.product}
            availableSizes={mobileCartModal.product.sizeDetails || []}
            availableColors={mobileCartModal.product.colorDetails || []}
            selectedColorId={
              mobileCartModal.product.colorDetails?.[0]?.id || ""
            }
          />
        )}

        <style jsx>{`
          :global(body.header-hidden .sticky-filter-bar) {
            top: 0px;
          }
          :global(.custom-scrollbar::-webkit-scrollbar) { width: 6px; }
          :global(.custom-scrollbar::-webkit-scrollbar-track) { background: #f1f1f1; }
          :global(.custom-scrollbar::-webkit-scrollbar-thumb) { background: #d1d5db; border-radius: 3px; }
          :global(.custom-scrollbar::-webkit-scrollbar-thumb:hover) { background: #9ca3af; }
          :global(.hide-scrollbar::-webkit-scrollbar) { display: none; }
          @media (max-width: 768px) { :global(.hide-scrollbar) { scroll-snap-type: x mandatory; } }
          /* removed global red pulse animation */
               transition: all 0.3s ease-in-out;
               will-change: transform;
               transform: translateZ(0);
               -webkit-transform: translateZ(0);
               position: fixed !important;
               left: 0 !important;
               right: 0 !important;
               z-index: 50 !important;
             }
        `}</style>
      </div>
    </section>
  );
};

export default ProductsPageClient;
