"use client"

import React, { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"

interface AddToCartSuccessProps {
  isVisible: boolean
  onComplete: () => void
}

const AddToCartSuccess: React.FC<AddToCartSuccessProps> = ({ isVisible, onComplete }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete()
      }, 1800) 
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 shadow-2xl flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.1, 
                duration: 0.4, 
                type: "spring", 
                stiffness: 200, 
                damping: 15 
              }}
              className="relative"
            >
              {/* Success circle background */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.2, 
                  duration: 0.5, 
                  type: "spring", 
                  stiffness: 150, 
                  damping: 12 
                }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              >
                {/* Checkmark icon */}
                <motion.div
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ 
                    delay: 0.4, 
                    duration: 0.6, 
                    ease: "easeInOut" 
                  }}
                >
                  <Check 
                    size={32} 
                    color="white" 
                    strokeWidth={3}
                    className="drop-shadow-sm"
                  />
                </motion.div>
              </motion.div>

              {/* Ripple effect */}
              <motion.div
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ 
                  delay: 0.3, 
                  duration: 0.8, 
                  ease: "easeOut" 
                }}
                className="absolute inset-0 bg-green-400 rounded-full"
              />
            </motion.div>

            {/* Success text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="text-center"
            >
              <p className="text-white font-semibold text-sm">Added to Cart!</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddToCartSuccess
