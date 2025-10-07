"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AnimatedBackgroundProps } from "./types"

export const AnimatedBackground = ({ 
  images, 
  currentIndex 
}: AnimatedBackgroundProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0 bg-left md:bg-center"
          style={{
            backgroundImage: `url('${images[currentIndex].src}')`,
            backgroundSize: "cover",
          }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ 
            duration: 1.5,
            ease: "easeInOut"
          }}
          role="img"
          aria-label={images[currentIndex].alt}
        />
      </AnimatePresence>
    </div>
  )
}
