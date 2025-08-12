"use client"
import { useState, useEffect } from "react"

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

interface CurrencyProps {
  value?: string | number
}

const Currency = ({ value }: CurrencyProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <span className="inline-block">{formatter.format(Number(value))}</span>
  )
}

export default Currency
