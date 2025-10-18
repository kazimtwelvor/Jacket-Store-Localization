"use client"
import { useState, useEffect } from "react"
import { useCurrency } from "@/src/hooks/use-currency"

interface CurrencyProps {
  value?: string | number
  className?: string
}

const Currency = ({ value, className = "" }: CurrencyProps) => {
  const [mounted, setMounted] = useState(false)
  const { convertAndFormat } = useCurrency()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const priceUSD = Number(value) || 0
  const formattedPrice = convertAndFormat(priceUSD)

  return (
    <span className={`inline-block ${className}`}>{formattedPrice}</span>
  )
}

export default Currency
