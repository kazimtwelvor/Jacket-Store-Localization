"use client"

import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface ZipCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (zipCode: string, deliveryText: string) => void
}

const ZipCodeModal = ({ isOpen, onClose, onApply }: ZipCodeModalProps) => {
  const [zipCode, setZipCode] = useState("")

  const calculateDeliveryDates = () => {
    const today = new Date()

    // Calculate earliest delivery (5 business days)
    const earliestDate = new Date(today)
    let businessDaysToAdd = 5
    let daysAdded = 0

    while (daysAdded < businessDaysToAdd) {
      earliestDate.setDate(earliestDate.getDate() + 1)
      if (earliestDate.getDay() !== 0 && earliestDate.getDay() !== 6) {
        daysAdded++
      }
    }

    // Calculate latest delivery (10 business days)
    const latestDate = new Date(today)
    businessDaysToAdd = 10
    daysAdded = 0

    while (daysAdded < businessDaysToAdd) {
      latestDate.setDate(latestDate.getDate() + 1)
      if (latestDate.getDay() !== 0 && latestDate.getDay() !== 6) {
        daysAdded++
      }
    }

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: '2-digit' }
    return {
      earliest: earliestDate.toLocaleDateString('en-US', options),
      latest: latestDate.toLocaleDateString('en-US', options)
    }
  }

  const handleApply = () => {
    if (zipCode.trim()) {
      const dates = calculateDeliveryDates()
      const deliveryText = `Delivery to <strong>${zipCode}</strong> approx.<br><strong style="font-size: 14px;">${dates.earliest} - ${dates.latest}</strong>`

      // Save to localStorage
      localStorage.setItem('savedZipCode', zipCode)
      localStorage.setItem('savedDeliveryText', deliveryText)

      onApply(zipCode, deliveryText)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 w-52"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium">Enter a zip code</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Input Field */}
          <div className="relative w-full">
            <input
              type="text"
              value={zipCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 5)
                setZipCode(value)
              }}
              placeholder="ZIP code"
              className="w-full px-2 py-1.5 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleApply()}
              maxLength={5}
            />
            <button
              onClick={handleApply}
              className="absolute right-1 top-1 bottom-1 px-3 bg-black text-white text-xs font-medium rounded hover:bg-gray-800 transition-colors"
            >
              Apply
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ZipCodeModal