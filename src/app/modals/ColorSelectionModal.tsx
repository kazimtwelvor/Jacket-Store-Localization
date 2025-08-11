"use client"

import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "../lib/utils"
import type { Color } from "@/types"

interface ColorSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  availableColors: Color[]
  selectedColorId: string
  setSelectedColorId: (id: string) => void
  colorLinks?: Record<string, string>
  triggerRef?: React.RefObject<HTMLElement>
}

const ColorSelectionModal = ({ 
  isOpen, 
  onClose, 
  availableColors, 
  selectedColorId, 
  setSelectedColorId,
  colorLinks = {},
  triggerRef
}: ColorSelectionModalProps) => {
  const [mounted, setMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    setMounted(true)
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 1280)
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  useEffect(() => {
    if (isOpen && isDesktop && triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      })
    }
  }, [isOpen, isDesktop, triggerRef])

  // Add click outside handler for desktop popup
  useEffect(() => {
    if (isOpen && isDesktop) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element
        if (!target.closest('[data-color-popup]') && !target.closest('[data-color-trigger]')) {
          onClose()
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, isDesktop, onClose])

  if (!mounted) return null


  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Desktop Popup */}
          {isDesktop ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed bg-white border-2 border-black rounded-lg shadow-2xl p-4 min-w-[280px]"
              style={{
                top: position.top,
                left: position.left,
                zIndex: 999999
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Color: {availableColors.find(c => c.id === selectedColorId)?.name}</h3>
              </div>

              {/* Colors Grid */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                {availableColors.map((color: Color) => {
                  const colorLink = colorLinks[color.name]
                  
                  if (colorLink && selectedColorId !== color.id) {
                    return (
                      <button
                        key={color.id}
                        onClick={() => {
                          setSelectedColorId(color.id)
                          onClose()
                        }}
                        className="flex flex-col items-center gap-1 p-1 hover:bg-gray-50 rounded transition-colors"
                      >
                        <div 
                          className="w-8 h-8 rounded-full border border-gray-300 hover:ring-2 hover:ring-gray-400 transition-all cursor-pointer"
                          style={{ backgroundColor: color.value }}
                        />
                      </button>
                    )
                  }
                  
                  return (
                    <button
                      key={color.id}
                      onClick={() => {
                        setSelectedColorId(color.id)
                        onClose()
                      }}
                      className="flex flex-col items-center gap-1 p-1 hover:bg-gray-50 rounded transition-colors"
                    >
                      <div 
                        className={cn(
                          "w-8 h-8 rounded-full border transition-all",
                          selectedColorId === color.id 
                            ? "border-black ring-2 ring-black ring-offset-1" 
                            : "border-gray-300 hover:ring-2 hover:ring-gray-400"
                        )}
                        style={{ backgroundColor: color.value }}
                      />
                    </button>
                  )
                })}
              </div>

              {/* Hide colors button */}
              <button
                onClick={onClose}
                className="w-full text-xs text-center py-2 bg-black text-white hover:bg-gray-800 transition-colors font-medium"
              >
                Hide colors
              </button>
            </motion.div>
          ) : (
            /* Mobile Modal */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center"
              style={{ zIndex: 999999 }}
              onClick={onClose}
            >
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                className="bg-white rounded-t-lg w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold">Select Color</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Colors Grid */}
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-4">
                    {availableColors.map((color: Color) => {
                      const colorLink = colorLinks[color.name]
                      
                      if (colorLink && selectedColorId !== color.id) {
                        return (
                          <button
                            key={color.id}
                            onClick={() => {
                              setSelectedColorId(color.id)
                              onClose()
                            }}
                            className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div 
                              className="w-10 h-10 rounded-full border-2 border-gray-200 hover:ring-2 hover:ring-gray-300 transition-all cursor-pointer"
                              style={{ backgroundColor: color.value }}
                            />
                            <span className="text-xs text-center font-medium">{color.name}</span>
                          </button>
                        )
                      }
                      
                      return (
                        <button
                          key={color.id}
                          onClick={() => {
                            setSelectedColorId(color.id)
                            onClose()
                          }}
                          className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div 
                            className={cn(
                              "w-12 h-12 rounded-full border-2 transition-all",
                              selectedColorId === color.id 
                                ? "border-white ring-2 ring-black ring-offset-1" 
                                : "border-gray-300 hover:ring-2 hover:ring-gray-400"
                            )}
                            style={{ backgroundColor: color.value }}
                          />
                          <span className="text-xs text-center font-medium">{color.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(
    <div data-color-popup>
      {modalContent}
    </div>, 
    document.body
  )
}

export default ColorSelectionModal