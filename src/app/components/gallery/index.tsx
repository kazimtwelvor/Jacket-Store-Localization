"use client";

import * as React from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import type { ProductImage } from "@/types";

interface GalleryProps {
  images: ProductImage[];
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  isInWishlist?: boolean;
}

const Gallery: React.FC<GalleryProps> = ({
  images = [],
  onAddToCart,
  onAddToWishlist,
  isInWishlist = false,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const [viewerIndex, setViewerIndex] = React.useState(0);
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [imagePosition, setImagePosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = React.useState(0);
  const [hasMounted, setHasMounted] = React.useState(false);
  const imageRef = React.useRef<HTMLDivElement>(null);

  // Sort images by order and prioritize primary image
  const sortedImages = React.useMemo(() => {
    return [...images].sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      return a.order - b.order;
    });
  }, [images]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + sortedImages.length) % sortedImages.length
    );
  };

  // Handle touch events for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      nextSlide();
    }

    if (touchStart - touchEnd < -100) {
      // Swipe right
      prevSlide();
    }
  };

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setIsViewerOpen(true);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    // Prevent body scroll and make truly full screen
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.top = "0";
    document.body.style.left = "0";
    document.documentElement.style.overflow = "hidden";
    // Prevent zoom on iOS Safari
    document.addEventListener("touchmove", preventDefault, { passive: false });
  };

  const preventDefault = (e: TouchEvent) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    // Restore body scroll
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.height = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.documentElement.style.overflow = "";
    document.removeEventListener("touchmove", preventDefault);
  };

  const zoomIn = (clientX?: number, clientY?: number) => {
    const newZoom = Math.min(zoomLevel + 0.5, 3);
    if (clientX && clientY && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = (clientX - rect.left - rect.width / 2) / zoomLevel;
      const y = (clientY - rect.top - rect.height / 2) / zoomLevel;
      setImagePosition({
        x: imagePosition.x - x * (newZoom - zoomLevel),
        y: imagePosition.y - y * (newZoom - zoomLevel),
      });
    }
    setZoomLevel(newZoom);
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.5, 0.5);
    setZoomLevel(newZoom);
    if (newZoom <= 1) {
      setImagePosition({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (zoomLevel === 1) {
      zoomIn(e.clientX, e.clientY);
    } else {
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const nextViewerImage = () => {
    setViewerIndex((prev) => (prev + 1) % sortedImages.length);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const prevViewerImage = () => {
    setViewerIndex(
      (prev) => (prev - 1 + sortedImages.length) % sortedImages.length
    );
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // Set mounted state
  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  // Keyboard navigation and wheel zoom for viewer
  React.useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isViewerOpen) return;
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowLeft") prevViewerImage();
      if (e.key === "ArrowRight") nextViewerImage();
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isViewerOpen) return;
      e.preventDefault();

      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      const newZoom = Math.min(Math.max(zoomLevel + delta, 0.5), 3);

      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / zoomLevel;
        const y = (e.clientY - rect.top - rect.height / 2) / zoomLevel;

        setImagePosition({
          x: imagePosition.x - x * (newZoom - zoomLevel),
          y: imagePosition.y - y * (newZoom - zoomLevel),
        });
      }

      setZoomLevel(newZoom);
      if (newZoom <= 1) {
        setImagePosition({ x: 0, y: 0 });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [isViewerOpen, zoomLevel, imagePosition]);

  // Touch support for viewer
  const [viewerTouchStart, setViewerTouchStart] = React.useState(0);
  const [viewerTouchEnd, setViewerTouchEnd] = React.useState(0);
  const [touchDistance, setTouchDistance] = React.useState(0);
  const [touchCenter, setTouchCenter] = React.useState({ x: 0, y: 0 });

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length < 2)
      return { x: touches[0].clientX, y: touches[0].clientY };
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  const handleViewerTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      setViewerTouchStart(e.touches[0].clientX);
      setDragStart({
        x: e.touches[0].clientX - imagePosition.x,
        y: e.touches[0].clientY - imagePosition.y,
      });
      if (zoomLevel > 1) {
        setIsDragging(true);
      }
      // Double tap detection
      const now = Date.now();
      if (now - lastTap < 300) {
        if (zoomLevel === 1) {
          zoomIn(e.touches[0].clientX, e.touches[0].clientY);
        } else {
          setZoomLevel(1);
          setImagePosition({ x: 0, y: 0 });
        }
      }
      setLastTap(now);
    } else if (e.touches.length === 2) {
      e.stopPropagation();
      setTouchDistance(getTouchDistance(e.touches));
      setTouchCenter(getTouchCenter(e.touches));
    }
  };

  const handleViewerTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      setViewerTouchEnd(e.touches[0].clientX);
      // Pan when zoomed
      if (zoomLevel > 1 && isDragging) {
        setImagePosition({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y,
        });
      }
    } else if (e.touches.length === 2) {
      e.stopPropagation();
      // Pinch to zoom
      const newDistance = getTouchDistance(e.touches);
      const newCenter = getTouchCenter(e.touches);

      if (touchDistance > 0) {
        const scale = newDistance / touchDistance;
        const newZoom = Math.min(Math.max(zoomLevel * scale, 0.5), 3);

        if (imageRef.current) {
          const rect = imageRef.current.getBoundingClientRect();
          const x = (newCenter.x - rect.left - rect.width / 2) / zoomLevel;
          const y = (newCenter.y - rect.top - rect.height / 2) / zoomLevel;

          setImagePosition({
            x: imagePosition.x - x * (newZoom - zoomLevel),
            y: imagePosition.y - y * (newZoom - zoomLevel),
          });
        }

        setZoomLevel(newZoom);
      }
      setTouchDistance(newDistance);
      setTouchCenter(newCenter);
    }
  };

  const handleViewerTouchEnd = (e: React.TouchEvent) => {
    if (
      e.changedTouches.length === 1 &&
      zoomLevel <= 1 &&
      Math.abs(viewerTouchStart - viewerTouchEnd) > 100
    ) {
      if (viewerTouchStart - viewerTouchEnd > 100) {
        nextViewerImage();
      }
      if (viewerTouchStart - viewerTouchEnd < -100) {
        prevViewerImage();
      }
    }
    setIsDragging(false);
    setTouchDistance(0);
  };

  const imageViewerModal = (
    <AnimatePresence>
      {isViewerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white flex flex-col"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 2147483647,
            touchAction: "none",
          }}
          onClick={closeViewer}
        >
          <div className="relative flex-1 flex items-center justify-center pt-0 sm:pt-20 pb-12 sm:pb-16">
            {/* Brand Name - Hidden on mobile */}
            {/* <div className="absolute top-6 left-6 z-10 hidden sm:block">
              <h1
                className="text-red-600 text-2xl font-bold tracking-wide"
                style={{ fontFamily: "AvertaPE, sans-serif" }}
              >
                FINEYST
              </h1>
            </div> */}

            {/* Close Button */}
            <button
              onClick={closeViewer}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-all"
            >
              <X size={24} className="sm:w-7 sm:h-7" />
            </button>

            {viewerIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevViewerImage();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-all hidden sm:block"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {viewerIndex < sortedImages.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextViewerImage();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-all hidden sm:block"
              >
                <ChevronRight size={28} />
              </button>
            )}

            <div
              className="relative w-full h-full flex items-center justify-center px-0 sm:px-12 lg:px-20 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleViewerTouchStart}
              onTouchMove={handleViewerTouchMove}
              onTouchEnd={handleViewerTouchEnd}
              style={{ touchAction: "none" }}
            >
              <div
                ref={imageRef}
                className="relative transition-transform duration-200 ease-out"
                style={{
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  cursor:
                    zoomLevel > 1
                      ? isDragging
                        ? "grabbing"
                        : "grab"
                      : "default",
                }}
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  src={
                    sortedImages[viewerIndex]?.image.url || "/placeholder.svg"
                  }
                  alt={
                    sortedImages[viewerIndex]?.image.altText || "Product image"
                  }
                  className="block"
                  style={{
                    objectFit: "contain",
                    maxWidth: "90vw",
                    maxHeight: "70vh",
                    width: "auto",
                    height: "auto",
                  }}
                  draggable={false}
                />
              </div>

              {/* Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    zoomIn();
                  }}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-all disabled:opacity-50"
                  disabled={zoomLevel >= 3}
                  title="Zoom In"
                >
                  <ZoomIn size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    zoomOut();
                  }}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-all disabled:opacity-50"
                  disabled={zoomLevel <= 0.5}
                  title="Zoom Out"
                >
                  <ZoomOut size={20} />
                </button>
                {zoomLevel !== 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetZoom();
                    }}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-all"
                    title="Reset to Original Size"
                  >
                    <RotateCcw size={20} />
                  </button>
                )}
              </div>

              {/* Zoom Level Indicator */}
              {zoomLevel !== 1 && (
                <div className="absolute bottom-4 left-4 bg-gray-800 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  {Math.round(zoomLevel * 100)}%
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {sortedImages.length > 1 && (
            <div className="flex-shrink-0 flex justify-center items-center gap-2 p-3 bg-gray-100 border-t border-gray-200 min-h-[80px]">
              <div className="flex gap-2 justify-center flex-wrap max-w-full px-3">
                {sortedImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewerIndex(index);
                    }}
                    className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 overflow-hidden transition-all shadow-lg ${
                      index === viewerIndex
                        ? "border-red-600 opacity-100 scale-110"
                        : "border-white/30 opacity-70 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    <img
                      src={image.image.url || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="w-full">
      {/* Render image viewer via portal to prevent overlap */}
      {typeof window !== "undefined" &&
        createPortal(imageViewerModal, document.body)}

      <div
        className="hidden lg:grid grid-cols-2 gap-0"
        style={{ paddingTop: "26px" }}
      >
        {sortedImages.map((image, idx) => (
          <div
            key={image.id}
            className="relative group cursor-zoom-in overflow-hidden"
            style={{ height: "100vh" }}
            onClick={() => openViewer(idx)}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              const img = e.currentTarget.querySelector("img");
              if (img) {
                img.style.transformOrigin = `${x}% ${y}%`;
              }
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector("img");
              if (img) {
                img.style.transformOrigin = "center center";
              }
            }}
          >
            <Image
              src={image.image.url || "/placeholder.svg"}
              alt={image.image.altText || `Product image ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-[1.5]"
              sizes="30vw"
              priority={idx === 0}
            />

            {idx === 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToWishlist?.();
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md z-10 hover:bg-black-50 transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    isInWishlist ? "text-black fill-black" : "text-gray-600"
                  }`} 
                />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Mobile and tablet view - slider */}
      <div className="lg:hidden relative pt-0 pb-0 product-gallery ml-0 sm:ml-0">
        <div
          className="relative w-screen group cursor-zoom-in"
          style={{
            marginLeft: "calc(-50vw + 50%)",
            width: "100vw",
            aspectRatio: "4/6",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => openViewer(currentIndex)}
        >
          <Image
            src={sortedImages[currentIndex]?.image.url || "/placeholder.svg"}
            alt={sortedImages[currentIndex]?.image.altText || "Product image"}
            fill
            className="object-cover w-full h-full"
            sizes="100vw"
            priority
            draggable={false}
          />
          <div className="absolute inset-0 bg-transparent bg-opacity-0 group-active:bg-opacity-5 transition-all duration-200"></div>

          {/* Image Counter - Mobile Only */}
          <div className="absolute top-3 left-3 bg-white/60 text-black px-3 py-2  text-xs font-medium backdrop-blur-sm">
            {currentIndex + 1}/{sortedImages.length}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {sortedImages.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 shadow-lg ${
                hasMounted && idx === currentIndex
                  ? "bg-black scale-125 ring-2 ring-white ring-offset-1"
                  : "bg-white/70 hover:bg-white/90 backdrop-blur-sm"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>

        {/* Floating Action Buttons - Mobile Only */}
        <div
          className="absolute bottom-01 right-3 flex items-center gap-1 z-[9999]"
          style={{ transform: "translateY(-50%)" }}
        >
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist?.();
            }}
            className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
              isInWishlist
                ? "bg-white text-black"
                : "bg-white text-black"
            }`}
            style={{ aspectRatio: "1/1" }}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isInWishlist ? "fill-black" : "fill-none"
              }`}
            />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
            className="w-10 h-10 rounded-full bg-black text-white shadow-lg flex items-center justify-center transition-all duration-300 active:scale-95"
            style={{ aspectRatio: "1/1" }}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
