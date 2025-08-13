"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

type Unit = "in" | "cm"

interface SizeGuideContextType {
  unit: Unit
  setUnit: (unit: Unit) => void
}

const SizeGuideContext = createContext<SizeGuideContextType>({
  unit: "in",
  setUnit: () => { },
})

export const useSizeGuideContext = () => useContext(SizeGuideContext)

export default function SizeGuideContextProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<Unit>("in")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{children}</>
  }

  return (
    <SizeGuideContext.Provider
      value={{
        unit,
        setUnit: (newUnit: Unit) => {
          setUnit(newUnit)
        },
      }}
    >
      {children}
    </SizeGuideContext.Provider>
  )
}
