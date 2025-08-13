
"use client"

import type { ReactNode } from "react"
import SizeGuideContextProvider from "./size-guide-context"

export default function SizeGuideProvider({ children }: { children: ReactNode }) {
  return <SizeGuideContextProvider>{children}</SizeGuideContextProvider>
}
